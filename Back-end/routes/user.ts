import { Router, Request, Response } from 'express';
import authenticate from '../services/authenticate';
import { UserGETRequest, UserGETResponse } from '../contract/GETEndpoints';

const router = Router();

router.get('/', async (req: Request<{}, {}, {}, UserGETRequest>, res: Response<UserGETResponse>) => {
  const email = await authenticate(req.query.idToken);
  if (email === undefined) {
    res.status(403).send();
    return;
  }
  res.json({
    user: {
      email,
      name: 'Ricardo Grade',
      credits: 50,
      rating: 5,
      institution: 'IST',
    },
  });
});

export default router;
