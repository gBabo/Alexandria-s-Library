import { Router, Request, Response } from 'express';
import authenticate from '../services/authenticate';
import { UserGETRequest, UserGETResponse } from '../contract/GETEndpoints';
import { getUser, registerPushNotification, registerUser } from '../db/manager/user';
import { RegisterPOSTRequest, RegisterPushNotificationPOSTRequest } from '../contract/POSTEndpoints';

const router = Router();

router.get('/', async (
  req: Request<{}, {}, {}, UserGETRequest>,
  res: Response<UserGETResponse>,
) => {
  const email = await authenticate(req.query.idToken);
  if (email === undefined) {
    res.status(403).send();
    return;
  }
  const user = await getUser(email);

  if (user === undefined) {
    res.status(403).send();
    return;
  }
  res.json({ user });
});

router.post('/register', async (
  req: Request<{}, {}, RegisterPOSTRequest, {}>,
  res: Response,
) => {
  const { idToken, name, institution } = req.body;
  const email = await authenticate(idToken);
  if (email === undefined) {
    res.status(403).send();
    return;
  }

  await registerUser(email, name, institution);
  res.status(200).send();
});

router.post('/registerPushNotificationToken', async (
  req: Request<{}, {}, RegisterPushNotificationPOSTRequest, {}>,
  res: Response,
) => {
  const { idToken, pushNotificationToken } = req.body;
  const email = await authenticate(idToken);

  if (email === undefined) {
    res.status(403).send();
    return;
  }

  await registerPushNotification(email, pushNotificationToken);
  res.status(200).send();
});

export default router;
