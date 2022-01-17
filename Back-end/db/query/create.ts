const createUserTable = `
    CREATE TABLE IF NOT EXISTS "users" (
        "email" VARCHAR(100),
        "name" VARCHAR(100) NOT NULL,
        "institution" VARCHAR(100) NOT NULL,
        "credits" INT NOT NULL,
        "rating" INT NOT NULL,
        "push_notification_token" VARCHAR,
        PRIMARY KEY ("email")
    );`;

const createStudyMTable = `
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

const createStudyMCategoryTable = `
    CREATE TABLE IF NOT EXISTS "study_material_category" (
        "category" VARCHAR(100) NOT NULL,
        "study_id" INTEGER NOT NULL,
        PRIMARY KEY ("category", "study_id"),
        FOREIGN KEY("study_id") REFERENCES study_material("study_id")
        );`;

const createStudyMLikesTable = `
    CREATE TABLE IF NOT EXISTS "study_material_likes" (
      "user" VARCHAR(100) NOT NULL,
      "study_id" INTEGER NOT NULL,
      PRIMARY KEY ("user", study_id),
      FOREIGN KEY("user") REFERENCES users("email"),
      FOREIGN KEY("study_id") REFERENCES study_material("study_id")
    );`;

const createStudyMAcquiredTable = `
    CREATE TABLE IF NOT EXISTS "study_material_acquired" (
        "study_id" INTEGER NOT NULL,
        "user" VARCHAR(100) NOT NULL,
        PRIMARY KEY ("study_id", "user"),
        FOREIGN KEY("study_id") REFERENCES study_material("study_id"),
        FOREIGN KEY("user") REFERENCES users("email")
        );`;

const createStudyMReviewTable = `
    CREATE TABLE IF NOT EXISTS "study_material_review" (
        "review_id" SERIAL,
        "study_id" SERIAL,
        "author" VARCHAR(100) NOT NULL,
        "review" VARCHAR(100) NOT NULL,
        "likes" INT NOT NULL,
        "date" TIMESTAMP,
        PRIMARY KEY ("review_id"),
        FOREIGN KEY("author") REFERENCES users("email")
        );`;

const createStudyMReviewLikesTable = `
    CREATE TABLE IF NOT EXISTS "study_material_review_likes" (
      "user" VARCHAR(100) NOT NULL,
      "review_id" INTEGER NOT NULL,
      PRIMARY KEY ("user", review_id),
      FOREIGN KEY("user") REFERENCES users("email"),
      FOREIGN KEY("review_id") REFERENCES study_material_review("review_id")
    );`;

const createStudyMaterialReviewCommentTable = `
    CREATE TABLE IF NOT EXISTS "study_material_review_comment" (
        "comment_id" SERIAL,
        "review_id" INTEGER NOT NULL,
        "author" VARCHAR(100) NOT NULL,
        "comment" VARCHAR(100) NOT NULL,
        "date" TIMESTAMP,
        PRIMARY KEY ("comment_id"),
        FOREIGN KEY("review_id") REFERENCES study_material_review("review_id"),
        FOREIGN KEY("author") REFERENCES users("email")
        );`;

const createStudyMExchangesRequestTable = `
    CREATE TABLE IF NOT EXISTS "study_material_exchange_requests" (
        "exchange_id" SERIAL,
        "requester" VARCHAR(100) NOT NULL,
        "requestee" VARCHAR(100) NOT NULL,
        "study_id_requester" INTEGER NOT NULL,
        "study_id_requestee" INTEGER NOT NULL,
        "date" TIMESTAMP,
        PRIMARY KEY ("exchange_id"),
        FOREIGN KEY("requester") REFERENCES users("email"),
        FOREIGN KEY("requestee") REFERENCES users("email"),
        FOREIGN KEY("study_id_requester") REFERENCES study_material("study_id"),
        FOREIGN KEY("study_id_requestee") REFERENCES study_material("study_id") 
        );`;

const createTutoringSessionTable = `
    CREATE TABLE IF NOT EXISTS "tutoring_session" (
        "session_id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "tutor" VARCHAR(100) NOT NULL,
        "description" VARCHAR NOT NULL,
        "latitude" INTEGER NOT NULL,
        "longitude" INTEGER NOT NULL,
        "price" INT NOT NULL,
        "date" TIMESTAMP,
        "duration" INTEGER  NOT NULL,
        PRIMARY KEY ("session_id"),
        FOREIGN KEY("tutor") REFERENCES users("email")
        );`;

const createTutoringSessionCategoryTable = `
CREATE TABLE IF NOT EXISTS "tutoring_session_category" (
    "category" VARCHAR(100) NOT NULL,
    "session_id" INTEGER NOT NULL,
    PRIMARY KEY ("category", "session_id"),
    FOREIGN KEY("session_id") REFERENCES tutoring_session("session_id")
);`;

const createTutoringSessionEnrollmentTable = `
    CREATE TABLE IF NOT EXISTS "tutoring_session_enrollment" (
        "enrollment_id" SERIAL,
        "session_id" INTEGER NOT NULL,
        "requester" VARCHAR(100) NOT NULL,
        "status" VARCHAR(100) NOT NULL,
        "date" TIMESTAMP,   
        PRIMARY KEY ("enrollment_id"),
        FOREIGN KEY("session_id") REFERENCES tutoring_session("session_id"),
        FOREIGN KEY("requester") REFERENCES users("email")
        );`;

const create = {
  createUserTable,
  createStudyMTable,
  createStudyMLikesTable,
  createStudyMCategoryTable,
  createStudyMAcquiredTable,
  createStudyMReviewTable,
  createStudyMReviewLikesTable,
  createStudyMaterialReviewCommentTable,
  createStudyMExchangesRequestTable,
  createTutoringSessionTable,
  createTutoringSessionCategoryTable,
  createTutoringSessionEnrollmentTable,
};

export default create;
