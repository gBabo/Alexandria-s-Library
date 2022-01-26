import { Request, Response, Router } from 'express';
import authenticate from '../services/authenticate';
import * as postEndpoints from '../contract/POSTEndpoints';
import * as db from '../db/manager/studyMaterial';
import * as getEndpoints from '../contract/GETEndpoints';
import * as putEndpoints from '../contract/PUTEndpoints';
import { getLink, uploadFile } from '../services/file';

const router = Router();
export default router;

router.post('/', async (
  req: Request<{}, {}, postEndpoints.StudyMaterialPOSTRequest, {}>,
  res: Response<postEndpoints.StudyMaterialPOSTResponse>,
) => {
  const {
    idToken, name, description, price, type, categories, file,
  } = req.body;

  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.createStudyMaterial(
    name,
    description,
    email,
    type,
    price,
    categories,
  );

  if (result == null) {
    res.status(500).send();
    return;
  }
  uploadFile(result.path, file).then();
  res.json(result);
});

router.get('/', async (
  req: Request<{}, {}, {}, getEndpoints.StudyMaterialsGETRequest>,
  res: Response<getEndpoints.StudyMaterialsGETResponse>,
) => {
  const email = req.query.idToken == null ? null : await authenticate(req.query.idToken);

  const result = await db.getStudyMaterials(email);
  if (result == null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.post('/purchase', async (
  req: Request<{}, {}, postEndpoints.StudyMaterialPurchasePOSTRequest, {}>,
  res: Response,
) => {
  const { idToken, studyMaterialId } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  const result = await db.purchaseStudyMaterial(email, studyMaterialId);
  if (result === -1) res.status(402).send();
  else if (result === -2) res.status(500).send();
  else res.status(200).send();
});

router.put('/like', async (
  req: Request<{}, {}, putEndpoints.StudyMaterialLikePUTRequest, {}>,
  res: Response,
) => {
  const { idToken, studyMaterialId } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  await db.likeStudyMaterial(email, studyMaterialId);
  res.status(200).send();
});

router.get('/pending-exchanges', async (
  req: Request<{}, {}, {}, getEndpoints.StudyMaterialsPendingExchangesGETRequest>,
  res: Response<getEndpoints.StudyMaterialsPendingExchangesGETResponse>,
) => {
  const { idToken } = req.query;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  const result = await db.getStudyMaterialExchangeRequests(email);
  if (result == null) {
    res.status(500).send();
    return;
  }

  res.json(result);
});

router.get('/get-link', async (
  req: Request<{}, {}, {}, getEndpoints.StudyMaterialLinkGETRequest>,
  res: Response<getEndpoints.StudyMaterialLinkGETResponse>,
) => {
  const { idToken, studyMaterialId } = req.query;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  const path = await db.getStudyMaterialPath(email, studyMaterialId);
  const link = await getLink(path);
  if (path == null || link == null) {
    res.status(500).send();
    return;
  }

  res.json({ link });
});

router.post('/exchange-request', async (
  req: Request<{}, {}, postEndpoints.StudyMaterialExchangePOSTRequest, {}>,
  res: Response<postEndpoints.StudyMaterialExchangePOSTResponse>,
) => {
  const {
    idToken, requesterStudyMaterialId, requesteeStudyMaterialId, requesteeStudyMaterialAuthor,
  } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  const result = await db.createStudyMaterialExchangeRequest(
    email,
    requesteeStudyMaterialAuthor,
    requesterStudyMaterialId,
    requesteeStudyMaterialId,
  );
  if (result === -1) res.status(402).send();
  else if (result === -2) res.status(500).send();
  else res.json(result);
});

router.put('/exchange-request-settle', async (
  req: Request<{}, {}, putEndpoints.StudyMaterialExchangeSettlePUTRequest, {}>,
  res: Response,
) => {
  const {
    idToken, studyMaterialExchangeId, accept,
  } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  let result;
  if (accept) result = await db.acceptStudyMaterialExchangeRequest(studyMaterialExchangeId, email);
  else result = await db.rejectStudyMaterialExchangeRequest(studyMaterialExchangeId, email);

  if (result === -1) res.status(402).send();
  else if (result === -2) res.status(500).send();
  else res.status(200).send();
});
