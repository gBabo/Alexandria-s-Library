import { Request, Response, Router } from 'express';
import authenticate from '../services/authenticate';
import * as postEndpoints from '../contract/POSTEndpoints';
import * as db from '../db/manager/studyMaterialReview';
import * as putEndpoints from '../contract/PUTEndpoints';

const router = Router();
export default router;

router.post('/review', async (
  req: Request<{}, {}, postEndpoints.StudyMaterialReviewPOSTRequest, {}>,
  res: Response<postEndpoints.StudyMaterialReviewPOSTResponse>,
) => {
  const { idToken, studyMaterialId, review } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.createReview(email, studyMaterialId, review);
  if (result == null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.put('/review-like', async (
  req: Request<{}, {}, putEndpoints.StudyMaterialReviewLikePUTRequest, {}>,
  res: Response,
) => {
  const { idToken, studyMaterialReviewId } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  await db.likeStudyMaterialReview(email, studyMaterialReviewId);
});

router.post('/review-comment', async (
  req: Request<{}, {}, postEndpoints.StudyMaterialReviewCommentPOSTRequest, {}>,
  res: Response<postEndpoints.StudyMaterialReviewCommentPOSTResponse>,
) => {
  const { idToken, reviewId, comment } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.createReviewComment(email, reviewId, comment);
  if (result == null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});
