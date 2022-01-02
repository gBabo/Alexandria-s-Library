import * as express from 'express';
import authentication from './routes/authentication';
import studyMaterials from './routes/studyMaterials';
import tutoring from './routes/tutoring';
import user from './routes/user';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/authentication', authentication);
app.use('/study-materials', studyMaterials);
app.use('/tutoring', tutoring);
app.use('/user', user);

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
