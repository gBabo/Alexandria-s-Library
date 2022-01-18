const selectUser = 'SELECT * FROM users WHERE email=$1;';

const selectStudyMs = `SELECT * FROM study_material
    NATURAL JOIN study_material_category
    NATURAL JOIN (SELECT name AS author_name, email AS author, institution, rating FROM users) u`;

const selectStudyMAuthor = 'SELECT author FROM study_material WHERE study_id=$1';

const selectStudyMReviewAuthor = 'SELECT author FROM study_material_review WHERE review_id=$1';

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

const SelectStudyMPrice = 'SELECT price, author FROM study_material WHERE study_id=$1;';

const selectStudyMExchangeR = 'SELECT * FROM study_material_exchange_requests WHERE exchange_id=$1 ';

const selectStudyMExchangeRs = `SELECT * FROM
    (SELECT * FROM study_material_exchange_requests WHERE requestee=$1) e
    JOIN (SELECT * FROM users) u ON requester=email`;

const selectTutoringSessions = `SELECT * FROM tutoring_session
    NATURAL JOIN tutoring_session_category
    NATURAL JOIN (SELECT name AS tutor_name, email AS tutor, rating, institution FROM users) u`;

const selectTutoringSession = 'SELECT * FROM tutoring_session WHERE session_id=$1';

const selectEnrollments = `SELECT * FROM (SELECT * FROM tutoring_session_enrollment WHERE session_id=$1) as e
    NATURAL JOIN (SELECT name AS requester_name, email AS requester FROM users) u`;

const selectEnrollment = `SELECT * FROM (SELECT * FROM tutoring_session_enrollment WHERE enrollment_id=$1) as t
    JOIN tutoring_session ON t.session_id=tutoring_session.session_id;`;

const selectTutoringSessionEnrollments = `SELECT * FROM (
    SELECT * FROM tutoring_session_enrollment WHERE session_id=$1) as t
    NATURAL JOIN (SELECT name AS requester_name, email AS requester FROM users) u;`;

const selectMyEnrollments = 'SELECT * FROM tutoring_session_enrollment WHERE requester=$1;';

const select = {
  selectUser,
  selectStudyMs,
  selectStudyMAuthor,
  selectStudyMReviewAuthor,
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
  selectTutoringSessions,
  selectTutoringSession,
  selectTutoringSessionEnrollments,
  selectMyEnrollments,
  selectEnrollments,
  selectEnrollment,
};

export default select;
