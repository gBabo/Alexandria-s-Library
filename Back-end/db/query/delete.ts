const removeLikeStudyM = [
  'DELETE FROM study_material_likes WHERE study_id=$1;',
  'UPDATE study_material SET likes=likes-1 WHERE study_id=$1;'];

const removeLikeStudyMReview = [
  'DELETE FROM study_material_review_likes WHERE review_id=$1;',
  'UPDATE study_material_review SET likes=(likes+1) WHERE review_id=$1;'];

const removeAcquiredStudyM = 'DELETE FROM study_material_acquired WHERE study_id=$1 AND "user"=$2;';

const removeAllStudyMExchangeR = `DELETE FROM study_material_exchange_requests
    WHERE requester=$1 AND study_id_requester=$2;`;

const removeStudyMExchangeRs = `DELETE FROM study_material_exchange_requests
                                WHERE exchange_id=$1`;

const remove = {
  removeLikeStudyM,
  removeLikeStudyMReview,
  removeAcquiredStudyM,
  removeStudyMExchangeRs,
  removeAllStudyMExchangeR,
};

export default remove;
