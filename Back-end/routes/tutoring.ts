import { Request, Response, Router } from 'express';
import * as postEndpoints from '../contract/POSTEndpoints';
import authenticate from '../services/authenticate';
import * as db from '../db/manager/tutoring';
import * as putEndpoints from '../contract/PUTEndpoints';
import * as getEndpoints from '../contract/GETEndpoints';

const router = Router();

export default router;

router.post('/', async (
  req: Request<{}, {}, postEndpoints.TutoringSessionPOSTRequest, {}>,
  res: Response<postEndpoints.TutoringSessionPOSTResponse>,
) => {
  const {
    idToken, name, description, price, location, categories, date, duration,
  } = req.body;

  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.createTutoringSession(
    name,
    description,
    email,
    price,
    categories,
    location,
    date,
    duration,
  );
  if (result == null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.post('/enroll', async (
  req: Request<{}, {}, postEndpoints.TutoringSessionEnrollmentPOSTRequest, {}>,
  res: Response<postEndpoints.TutoringSessionEnrollmentPOSTResponse>,
) => {
  const { idToken, tutoringSessionId } = req.body;

  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.enroll(email, tutoringSessionId);
  if (result == null || result === -1) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.put('/enroll-settle', async (
  req: Request<{}, {}, putEndpoints.EnrollmentStatusSettlePUTRequest, {}>,
  res: Response,
) => {
  const { idToken, enrollmentId, accept } = req.body;
  const email = await authenticate(idToken);
  if (email == null) {
    res.status(403).send();
    return;
  }
  const result = await db.settleEnrollment(enrollmentId, email, accept);

  if (result === -1) res.status(402).send();
  else if (result === -2) res.status(500).send();
  else res.status(200).send();
});

router.get('/', async (
  req: Request<{}, {}, {}, getEndpoints.TutoringSessionsGetRequest>,
  res: Response<getEndpoints.TutoringSessionsGETResponse>,
) => {
  const email = req.query.idToken == null ? null : await authenticate(req.query.idToken);

  const result = await db.getTutoringSessions(email);
  if (result === null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});

router.get('/myEnrollments', async (
  req: Request<{}, {}, {}, getEndpoints.MyEnrollmentsGETRequest>,
  res: Response<getEndpoints.MyEnrollmentsGETResponse>,
) => {
  const { idToken } = req.query;
  const email = await authenticate(idToken);

  if (email == null) {
    res.status(403).send();
    return;
  }

  const result = await db.getMyEnrollments(email);
  if (result == null) {
    res.status(500).send();
    return;
  }
  res.json(result);
});
