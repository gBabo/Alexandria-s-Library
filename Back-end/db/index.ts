import { Pool } from 'pg';
import create from './query/create';

const pool = new Pool({
  host: 'localhost',
  database: 'alexandriaDB',
  user: 'alexandria_user',
  password: 'alexandria_pwd',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

export async function init() {
  const con = await pool.connect();
  try {
    await con.query(create.createUserTable);
    await con.query(create.createStudyMTable);
    await con.query(create.createStudyMLikesTable);
    await con.query(create.createStudyMCategoryTable);
    await con.query(create.createStudyMAcquiredTable);
    await con.query(create.createStudyMReviewTable);
    await con.query(create.createStudyMReviewLikesTable);
    await con.query(create.createStudyMaterialReviewCommentTable);
    await con.query(create.createStudyMExchangesRequestTable);
    await con.query(create.createTutoringSessionTable);
    await con.query(create.createTutoringSessionCategoryTable);
    await con.query(create.createTutoringSessionEnrollmentTable);
  } catch (error: any) {
    console.error(error.stack);
  } finally {
    await con.release();
  }
}
