import { Request, Response, Router } from 'express';
import {
  StudyMaterialPOSTRequest,
  StudyMaterialPOSTResponse,
} from '../contract/POSTEndpoints';
import authenticate from '../services/authenticate';
import { createStudyMaterial, getStudyMaterial } from '../db/manager/studyMaterials';
import { StudyMaterialsGETResponse } from '../contract/GETEndpoints';

const router = Router();

export default router;

router.post('/', async (req: Request<{}, {}, StudyMaterialPOSTRequest, {}>, res: Response<StudyMaterialPOSTResponse>) => {
  const {
    idToken, name, description, price, type, categories,
  } = req.body;
  // TODO FILE Path + Link
  const email = await authenticate(idToken);

  if (email === undefined) {
    res.status(403).send();
    return;
  }
  const result = await createStudyMaterial(name, description, email, type, price, categories);
  if (result === undefined) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.get('/', async (req: Request<{}, {}, {}, {}>, res: Response<StudyMaterialsGETResponse>) => {
  const result = await getStudyMaterial();
  if (result === undefined) {
    res.status(500).send();
    return;
  }

  res.json(result);
});
