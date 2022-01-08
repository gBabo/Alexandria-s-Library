import { PoolClient } from 'pg';
import select from '../query/select';
import pool from '../index';
import insert from '../query/insert';
import remove from '../query/delete';
import { like } from './studyMaterial';

export async function getStudyMaterialReviews(
  con: PoolClient,
  id: string,
  likedReviews: Set<string>,
) {
  const { rows } = await con.query(select.selectStudyMReview, [id]);
  const studyMaterialReviews: Record<any, any> = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!(row.review_id in studyMaterialReviews)) {
      studyMaterialReviews[row.review_id] = {
        id: row.review_id,
        author: row.author_review_name,
        review: row.review,
        likes: row.likes_review,
        hasLiked: likedReviews.has(row.review_id),
        comments: [],
        date: row.date_review,
      };
    }
    if (row.comment_id) {
      const comment = {
        id: row.comment_id,
        author: row.author_comment_name,
        comment: row.comment,
        date: row.date_comment,
      };
      studyMaterialReviews[row.review_id].comments.push(comment);
    }
  }
  return Object.values(studyMaterialReviews);
}

export async function createReview(email: string, studyMaterialId: string, review: string) {
  const con = await pool.connect();
  const date = new Date(Date.now());
  try {
    const r = await con.query(select.selectStudyMRightsSQL, [studyMaterialId, email]);
    const access = r.rowCount;
    if (access === 0) {
      console.error('ERROR:createReview:InvalidRights');
      return undefined;
    }

    const reviewId = (await con.query(
      insert.insertStudyMReview,
      [email, studyMaterialId, review, date.toISOString()],
    )).rows.pop().study_id;
    return { reviewId, date };
  } catch (error: any) {
    console.error('ERROR:createReview');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function createReviewComment(email: string, reviewId: string, comment: string) {
  const con = await pool.connect();
  const date = new Date(Date.now());
  try {
    let r = await con.query(select.selectStudyMIdOfReview, [reviewId]);
    const studyMaterialId = r.rows.pop().study_id;

    r = await con.query(select.selectStudyMRightsSQL, [studyMaterialId, email]);
    const access = r.rowCount;
    if (access === 0) {
      console.error('ERROR:createReviewComment:InvalidRights');
      return undefined;
    }

    const reviewCommentId = (await con.query(
      insert.insertStudyMReviewComment,
      [reviewId, email, comment, date.toISOString()],
    )).rows.pop().comment_id;

    return { reviewCommentId, date };
  } catch (error: any) {
    console.error('ERROR:createReviewComment');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function likeStudyMaterialReview(email: string, reviewId: string) {
  await like(email, reviewId, [select.selectLikedStudyMReview,
    remove.removeLikeStudyMReview, insert.insertLikeStudyMReview]);
}
