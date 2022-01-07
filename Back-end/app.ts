import * as express from 'express';
import studyMaterials from './routes/studyMaterials';
import tutoring from './routes/tutoring';
import user from './routes/user';
import { init } from './db';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/study-materials', studyMaterials);
app.use('/tutoring', tutoring);
app.use('/user', user);

init().then(() => {
  console.log('Database initialized');
});

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
