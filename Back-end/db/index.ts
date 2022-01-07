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
  const connection = await pool.connect();
  try {
    await connection.query(create.createUserTableSQL);
    await connection.query(create.createStudyMaterialTableSQL);
    await connection.query(create.createStudyMaterialCategoryTableSQL);
    await connection.query(create.createStudyMaterialAcquiredTableSQL);
    await connection.query(create.createStudyMaterialReviewTableSQL);
    await connection.query(create.createStudyMaterialAnswerReviewSQL);
    await connection.query(create.createStudyMaterialExchangesRequestTableSQL);
    await connection.query(create.createSessionTableSQL);
    await connection.query(create.createSessionCategoryTableSQL);
    await connection.query(create.createSessionEnrollmentTableSQL);
  } catch (error: any) {
    console.error(error.stack);
  } finally {
    await connection.release();
  }
}
