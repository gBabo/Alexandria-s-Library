const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS "users" (
        "email" VARCHAR(100),
        "name" VARCHAR(100) NOT NULL,
        "institution" VARCHAR(100) NOT NULL,
        "credits" INT NOT NULL,
        "rating" INT NOT NULL,
        "push_notification_token" VARCHAR,
        PRIMARY KEY ("email")
    );`;

const createStudyMaterialTableSQL = `
    CREATE TABLE IF NOT EXISTS "study_material" (
        "study_id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "description" VARCHAR NOT NULL,
        "author" VARCHAR(100) NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "price" INT NOT NULL,
        "likes" INT NOT NULL,
        "path" VARCHAR,
        "date" TIMESTAMP,
        PRIMARY KEY ("study_id"),
        FOREIGN KEY("author") REFERENCES users("email")
        );`;

const createStudyMaterialCategoryTableSQL = `
    CREATE TABLE IF NOT EXISTS "study_material_category" (
        "category" VARCHAR(100) NOT NULL,
        "study_id" INTEGER NOT NULL,
        PRIMARY KEY ("category"),
        FOREIGN KEY("study_id") REFERENCES study_material("study_id")
        );`;

const createStudyMaterialAcquiredTableSQL = `
    CREATE TABLE IF NOT EXISTS "study_material_acquired" (
        "study_id" SERIAL,
        "user" VARCHAR(100) NOT NULL,
        PRIMARY KEY ("study_id", "user"),
        FOREIGN KEY("study_id") REFERENCES study_material("study_id"),
        FOREIGN KEY("user") REFERENCES users("email")
        );`;

const createStudyMaterialReviewTableSQL = `
    CREATE TABLE IF NOT EXISTS "study_material_review" (
        "review_id" SERIAL,
        "study_id" SERIAL,
        "author" VARCHAR(100) NOT NULL,
        "comment" VARCHAR(100) NOT NULL,
        "likes" INT NOT NULL,
        "date" TIMESTAMP,
        PRIMARY KEY ("review_id"),
        FOREIGN KEY("author") REFERENCES users("email")
        );`;

const createStudyMaterialAnswerReviewSQL = `
    CREATE TABLE IF NOT EXISTS "study_material_answer_review" (
        "answer_id" SERIAL,
        "review_id" INTEGER NOT NULL,
        "author" VARCHAR(100) NOT NULL,
        "comment" VARCHAR(100) NOT NULL,
        "date" TIMESTAMP,
        PRIMARY KEY ("answer_id"),
        FOREIGN KEY("review_id") REFERENCES study_material_review("review_id"),
        FOREIGN KEY("author") REFERENCES users("email")
        );`;

const createStudyMaterialExchangesRequestTableSQL = `
    CREATE TABLE IF NOT EXISTS "study_material_exchange_request" (
        "exchange_id" SERIAL,
        "requester" VARCHAR(100) NOT NULL,
        "requestee" VARCHAR(100) NOT NULL,
        "study_id_requester" INTEGER NOT NULL,
        "study_id_requestee" INTEGER NOT NULL,
        PRIMARY KEY ("exchange_id"),
        FOREIGN KEY("requester") REFERENCES users("email"),
        FOREIGN KEY("requestee") REFERENCES users("email"),
        FOREIGN KEY("study_id_requester") REFERENCES study_material("study_id"),
        FOREIGN KEY("study_id_requestee") REFERENCES study_material("study_id") 
        );`;
const createSessionTableSQL = `
    CREATE TABLE IF NOT EXISTS "session" (
        "session_id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "tutor" VARCHAR(100) NOT NULL,
        "description" VARCHAR NOT NULL,
        "location" VARCHAR(100) NOT NULL,
        "category" VARCHAR(100) NOT NULL,
        "price" INT NOT NULL,
        "date" TIMESTAMP,   
        PRIMARY KEY ("session_id"),
        FOREIGN KEY("tutor") REFERENCES users("email")
        );`;

const createSessionCategoryTableSQL = `
CREATE TABLE IF NOT EXISTS "session_category" (
    "category" VARCHAR(100) NOT NULL,
    "session_id" INTEGER NOT NULL,
    PRIMARY KEY ("category"),
    FOREIGN KEY("session_id") REFERENCES session("session_id")
);`;

const createSessionEnrollmentTableSQL = `
    CREATE TABLE IF NOT EXISTS "session_enrollment" (
        "enrollment_id" SERIAL,
        "session_id" INTEGER NOT NULL,
        "requester" VARCHAR(100) NOT NULL,
        "status" VARCHAR(100) NOT NULL,
        "date" TIMESTAMP,   
        PRIMARY KEY ("enrollment_id"),
        FOREIGN KEY("session_id") REFERENCES session("session_id"),
        FOREIGN KEY("requester") REFERENCES users("email")
        );`;

const create = {
  createUserTableSQL,
  createStudyMaterialTableSQL,
  createStudyMaterialCategoryTableSQL,
  createStudyMaterialAcquiredTableSQL,
  createStudyMaterialReviewTableSQL,
  createStudyMaterialAnswerReviewSQL,
  createStudyMaterialExchangesRequestTableSQL,
  createSessionTableSQL,
  createSessionCategoryTableSQL,
  createSessionEnrollmentTableSQL,
};

export default create;
