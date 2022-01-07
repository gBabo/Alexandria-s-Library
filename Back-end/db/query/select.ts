const selectUserSQL = 'SELECT * FROM users WHERE email=$1;';
const selectStudyMaterialSQL = `SELECT * FROM study_material
    NATURAL JOIN study_material_category
    NATURAL JOIN (SELECT name AS author_name, email AS author FROM users) u`;

const select = {
  selectUserSQL,
  selectStudyMaterialSQL,
};

export default select;
