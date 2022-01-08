const selectUser = 'SELECT * FROM users WHERE email=$1;';

const selectStudyMs = `SELECT *FROM study_material
    NATURAL JOIN study_material_category
    NATURAL JOIN (SELECT name AS author_name, email AS author FROM users) u`;

const selectStudyMRightsSQL = `SELECT study_id FROM study_material WHERE study_id=$1 AND author=$2
                               UNION SELECT study_id FROM study_material_acquired WHERE study_id=$1 AND "user"=$2`;

const selectStudyMsAcquired = 'SELECT study_id FROM study_material_acquired WHERE "user"=$1';

const selectStudyMReview = `
    SELECT * FROM (
      SELECT review_id, study_id, author AS author_review_email, review,
             likes AS likes_review, date AS date_review, name AS author_review_name 
        FROM study_material_review, users WHERE author=users.email AND study_id=$1) r
      LEFT JOIN (
          SELECT * FROM (
              SELECT comment_id, review_id AS comment_review_id, author AS author_comment_email,
                     comment, date AS date_comment, name as author_comment_name 
                FROM study_material_review_comment, users WHERE author=users.email) c) rc 
      on review_id = comment_review_id;`;

const selectLikedStudyMs = 'SELECT study_id FROM study_material_likes WHERE "user"=$1;';

const selectLikedStudyM = 'SELECT study_id FROM study_material_likes WHERE "user"=$1 AND study_id=$2;';

const selectLikedReviews = 'SELECT review_id FROM study_material_review_likes WHERE "user"=$1;';

const selectLikedStudyMReview = 'SELECT review_id FROM study_material_review_likes WHERE "user"=$1 AND review_id=$2;';

const selectStudyMIdOfReview = 'SELECT study_id FROM study_material_review WHERE review_id=$1;';

const selectUserCredit = 'SELECT credits FROM users WHERE email=$1;';

const SelectStudyMPrice = 'SELECT price FROM study_material WHERE study_id=$1;';

const selectStudyMExchangeR = 'SELECT * FROM study_material_exchange_request WHERE exchange_id=$1 ';

const selectStudyMExchangeRs = `SELECT * FROM
    (SELECT * FROM study_material_exchange_request WHERE requestee=$1) e
    JOIN (SELECT * FROM users) u ON requester=email`;

const select = {
  selectUser,
  selectStudyMs,
  selectStudyMRightsSQL,
  selectStudyMReview,
  selectStudyMIdOfReview,
  selectUserCredit,
  SelectStudyMPrice,
  selectLikedStudyMs,
  selectLikedStudyM,
  selectLikedReviews,
  selectLikedStudyMReview,
  selectStudyMsAcquired,
  selectStudyMExchangeR,
  selectStudyMExchangeRs,
};

export default select;
