import moment from 'moment';
import pool from '../index';
import insert from '../query/insert';
import select from '../query/select';
import StudyMaterial from '../../models/StudyMaterial';

export async function createStudyMaterial(
  name:string,
  description:string,
  author: string,
  type: string,
  price: number,
  categories: string[],
) {
  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    const datePG = new Date(Date.now()).toISOString();
    const result = await connection.query(
      insert.insertStudyMaterialSQL,
      [name, description, author, type, price, datePG],
    );
    const studyMaterialId: string = result.rows.pop().study_id;

    await connection.query(insert.insertPathToStudyMaterialSQL, [`path${studyMaterialId}`, studyMaterialId]);

    const promiseArray = [];
    for (let i = 0; i < categories.length; i++) {
      promiseArray[i] = connection.query(
        insert.insertStudyMaterialCategorySQL,
        [categories[i], studyMaterialId],
      );
    }
    await Promise.all(promiseArray);
    await connection.query('COMMIT');
    const date = moment(datePG).toDate();
    return { studyMaterialId, date };
  } catch (error: any) {
    await connection.query('ROLLBACK');
    console.error(error.stack);
    return undefined;
  } finally {
    await connection.release();
  }
}

export async function getStudyMaterial() {
  const connection = await pool.connect();
  try {
    const result = await connection.query(select.selectStudyMaterialSQL);
    const studyMaterials: Record<string, StudyMaterial> = {};
    const studyMaterialsCategories: Record<string, string[]> = {};
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      const id = row.study_id;
      if (!(id in studyMaterials)) {
        studyMaterials[id] = {
          id,
          authorEmail: row.author,
          author: row.author_name,
          name: row.name,
          description: row.description,
          price: row.price,
          type: row.type,
          date: row.date,
          reviews: [],
        };
        // TODO ADD REVIEWS
        studyMaterialsCategories[id] = [];
      }
      studyMaterialsCategories[id].push(row.category);
    }
    return { studyMaterials, studyMaterialsCategories };
  } catch (error: any) {
    console.error(error.stack);
    return undefined;
  } finally {
    await connection.release();
  }
}
