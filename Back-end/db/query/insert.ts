const insertUserSQL = 'INSERT INTO users (email, name, institution, credits, rating) VALUES ($1, $2, $3, 0, 0);';
const insertPushNotificationSQL = 'UPDATE users SET push_notification_token=$1 WHERE email=$2';
const insertStudyMaterialSQL = `INSERT INTO study_material(name, description, author, type, price, likes, date)
        VALUES ($1, $2, $3, $4, $5, 0, $6) RETURNING *;`;
const insertPathToStudyMaterialSQL = 'UPDATE study_material SET path=$1 WHERE study_id=$2';
const insertStudyMaterialCategorySQL = 'INSERT INTO study_material_category (category, study_id) VALUES ($1, $2);';

const insert = {
  insertUserSQL,
  insertPushNotificationSQL,
  insertStudyMaterialSQL,
  insertPathToStudyMaterialSQL,
  insertStudyMaterialCategorySQL,
};

export default insert;
