import { PoolClient } from 'pg';
import pool from '../index';
import insert from '../query/insert';
import select from '../query/select';
import remove from '../query/delete';
import { StudyMaterialExchange } from '../../models/StudyMaterial';
import { getStudyMaterialReviews } from './studyMaterialReview';

export async function createStudyMaterial(
  name:string,
  description:string,
  author: string,
  type: string,
  price: number,
  categories: string[],
) {
  const con = await pool.connect();
  const date = new Date(Date.now());
  try {
    await con.query('BEGIN');

    const values = [name, description, author, type, price, date.toISOString()];
    const studyMaterialId = (await con.query(insert.insertStudyM, values)).rows.pop().study_id;

    await con.query(insert.insertPathToStudyM, [`path${studyMaterialId}`, studyMaterialId]);

    const promiseCatg = [];
    for (let i = 0; i < categories.length; i++) {
      promiseCatg[i] = con.query(insert.insertStudyMCategory, [categories[i], studyMaterialId]);
    }
    await Promise.all(promiseCatg);

    await con.query('COMMIT');
    return { studyMaterialId, date };
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:createStudyMaterial');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

async function getIdsList(con: PoolClient, email: string | undefined, query: string) {
  const ids: string[] = [];
  if (email === undefined) return ids;
  const { rows } = await con.query(query, [email]);
  rows.forEach((r) => { ids.push(r[Object.keys(r)[0]]); });
  return ids;
}

async function getIdsSet(con: PoolClient, email: string | undefined, query: string) {
  const ids: Set<string> = new Set();
  if (email === undefined) return ids;
  const { rows } = await con.query(query, [email]);
  rows.forEach((r) => { ids.add(r[Object.keys(r)[0]]); });
  return ids;
}

export async function getStudyMaterials(email: string | undefined) {
  const con = await pool.connect();
  try {
    const { rows } = await con.query(select.selectStudyMs);
    const likedStudyMaterials = await getIdsSet(con, email, select.selectLikedStudyMs);
    const likedReviews = await getIdsSet(con, email, select.selectLikedReviews);
    const studyMaterials: Record<any, any> = {};
    const acquired = await getIdsList(con, email, select.selectStudyMsAcquired);
    const uploaded = [];
    const studyMaterialsCategories: Record<string, string[]> = {};
    const promiseReviews = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!(row.study_id in studyMaterials)) {
        if (row.author === email) uploaded.push(row.study_id);
        studyMaterials[row.study_id] = {
          id: row.study_id,
          authorEmail: row.author,
          author: row.author_name,
          name: row.name,
          description: row.description,
          price: row.price,
          type: row.type,
          date: row.date,
          likes: row.likes,
          hasLiked: likedStudyMaterials.has(row.study_id),
          reviews: [],
        };
        promiseReviews.push(getStudyMaterialReviews(con, row.study_id, likedReviews).then(
          (r) => {
            studyMaterials[row.study_id].reviews = r;
          },
        ));
      }
      if (row.category in studyMaterialsCategories) {
        studyMaterialsCategories[row.category].push(row.study_id);
      } else { studyMaterialsCategories[row.category] = [row.study_id]; }
    }
    await Promise.all(promiseReviews);
    return {
      studyMaterials, studyMaterialsCategories, acquired, uploaded,
    };
  } catch (error: any) {
    console.error('ERROR:getStudyMaterials');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function purchaseStudyMaterial(email: string, studyMaterialId: string) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');

    const { credits } = (await con.query(select.selectUserCredit, [email])).rows.pop();
    const { price } = (await con.query(select.SelectStudyMPrice, [studyMaterialId])).rows.pop();
    if (credits < price) {
      await con.query('ROLLBACK');
      console.error('ERROR:purchaseStudyMaterial: No Sufficient Credits');
      return -1;
    }

    await con.query(insert.insertUserCredit, [-(credits - price), email]);
    await con.query(insert.insertAcquireStudyM, [studyMaterialId, email]);
    await con.query('COMMIT');
    return 1;
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:purchaseStudyMaterial');
    console.error(error.stack);
    return -2;
  } finally {
    await con.release();
  }
}

export async function like(email: string, id: string, queries: any[]) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');
    const cnt = (await con.query(queries[0], [email, id])).rowCount;
    if (cnt) {
      await con.query(queries[1][0], [id]);
      await con.query(queries[1][1], [id]);
    } else {
      await con.query(queries[2][0], [email, id]);
      await con.query(queries[2][1], [id]);
    }
    await con.query('COMMIT');
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:like:');
    console.error(error.stack);
  } finally {
    await con.release();
  }
}
export async function likeStudyMaterial(email: string, studyMaterialId: string) {
  await like(email, studyMaterialId, [select.selectLikedStudyM,
    remove.removeLikeStudyM, insert.insertLikeStudyM]);
}

export async function createStudyMaterialExchangeRequest(
  requester: string,
  requestee: string,
  studyMaterialIdTer: string,
  studyMaterialIdTee: string,
) {
  const con = await pool.connect();
  const date = new Date(Date.now());
  try {
    await con.query('BEGIN');
    let r = await con.query(select.selectStudyMRightsSQL, [studyMaterialIdTer, requester]);
    const accessRequester = r.rowCount;
    r = await con.query(select.selectStudyMRightsSQL, [studyMaterialIdTee, requestee]);
    const accessRequestee = r.rowCount;

    if (accessRequestee === 0 || accessRequester === 0) {
      await con.query('ROLLBACK');
      console.error('ERROR:createStudyMaterialExchangeRequest:InvalidRights');
      return -1;
    }
    const v = [requester, requestee, studyMaterialIdTer, studyMaterialIdTee, date.toISOString()];
    r = await con.query(insert.insertStudyMExchangeR, v);
    const studyMaterialExchangeId = r.rows.pop().exchange_id;

    await con.query('COMMIT');
    return { studyMaterialExchangeId, date };
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:createStudyMaterialExchangeRequest');
    console.error(error.stack);
    return -2;
  } finally {
    await con.release();
  }
}

export async function getStudyMaterialExchangeRequests(email:string) {
  const con = await pool.connect();
  const studyMaterialsExchanges: StudyMaterialExchange[] = [];
  try {
    const result = (await con.query(select.selectStudyMExchangeRs, [email])).rows;
    result.forEach((r) => {
      studyMaterialsExchanges.push({
        id: r.exchange_id,
        requesterName: r.name,
        requesterRating: r.rating,
        requesterInstitution: r.institution,
        requesterStudyMaterialId: r.study_id_requester,
        requesteeStudyMaterialId: r.study_id_requestee,
        date: r.date,
      });
    });
    return { studyMaterialsExchanges };
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:getStudyMaterialExchangeRequests');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function rejectStudyMaterialExchangeRequest(exchangeId: string, email: string) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');
    const result = (await con.query(select.selectStudyMExchangeR, [exchangeId])).rows.pop();
    if (result.requestee !== email) {
      await con.query('ROLLBACK');
      console.error('ERROR:rejectStudyMaterialExchangeRequest:InvalidRights');
      return -1;
    }
    await con.query(remove.removeStudyMExchangeRs, [exchangeId]);
    await con.query('COMMIT');
    return 1;
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:rejectStudyMaterialExchangeRequest');
    console.error(error.stack);
    return -2;
  } finally {
    await con.release();
  }
}

export async function acceptStudyMaterialExchangeRequest(exchangeId: string, email: string) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');
    const result = (await con.query(select.selectStudyMExchangeR, [exchangeId])).rows.pop();
    if (result.requestee !== email) {
      await con.query('ROLLBACK');
      console.error('ERROR:acceptStudyMaterialExchangeRequest:InvalidRights');
      return -1;
    }
    await con.query(insert.insertAcquireStudyM, [result.study_id_requestee]);
    await con.query(remove.removeAcquiredStudyM, [result.study_id_requester]);
    await con.query('COMMIT');
    return 1;
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:acceptStudyMaterialExchangeRequest');
    console.error(error.stack);
    return -2;
  } finally {
    await con.release();
  }
}
