import * as express from 'express';
import studyMaterials from './routes/studyMaterial';
import tutoring from './routes/tutoring';
import user from './routes/user';
import { init } from './db';
import studyMaterialReview from './routes/studyMaterialReview';

const app = express();

const port = 3000;
app.use(express.json());

app.use('/study-material', studyMaterials);
app.use('/study-material/review', studyMaterialReview);
app.use('/tutoring', tutoring);
app.use('/user', user);

init().then(async () => {
  console.log('Database initialized');
});

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
