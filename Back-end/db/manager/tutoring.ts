import { PoolClient } from 'pg';
import pool from '../index';
import insert from '../query/insert';
import select from '../query/select';
import { Enrollment, UserEnroll } from '../../models/TutoringSession';
import * as notification from '../../services/notification';

export async function createTutoringSession(
  name:string,
  description:string,
  tutor: string,
  price: number,
  categories: string[],
  location: number[],
  date: Date,
  duration: number,
) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');

    const values = [name, tutor, description,
      location[0], location[1], price, date.toISOString(), duration];
    let query = insert.insertTutoringSession;
    const tutoringSessionId = (await con.query(query, values)).rows.pop().session_id;

    const promiseCatg = [];
    query = insert.insertTutoringSessionCategory;
    for (let i = 0; i < categories.length; i++) {
      promiseCatg[i] = con.query(query, [categories[i], tutoringSessionId]);
    }
    await Promise.all(promiseCatg);

    await con.query('COMMIT');
    return { tutoringSessionId };
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:createTutoringSession');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function enroll(
  email:string,
  sessionId:string,
) {
  const con = await pool.connect();
  const date = new Date(Date.now());
  try {
    await con.query('BEGIN');

    const { credits } = (await con.query(select.selectUserCredit, [email])).rows.pop();
    let result = (await con.query(select.selectTutoringSession, [sessionId]));
    const { price, name, tutor } = result.rows.pop();
    if (credits < price) {
      await con.query('ROLLBACK');
      console.error('ERROR:enroll: No Sufficient Credits');
      return -1;
    }
    await con.query(insert.insertUserCredit, [-price, email]);
    result = await con.query(insert.insertEnrollment, [sessionId, email, date.toISOString()]);
    const enrollmentId = result.rows.pop().enrollment_id;
    await con.query('COMMIT');
    notification.newEnrollment(tutor, name).then();
    return { enrollmentId, date };
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:enroll');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function settleEnrollment(enrollmentId: string, email: string, accept:boolean) {
  const con = await pool.connect();
  try {
    await con.query('BEGIN');
    const result = (await con.query(select.selectEnrollment, [enrollmentId])).rows.pop();
    if (result === undefined || result.tutor !== email) {
      await con.query('ROLLBACK');
      console.error('ERROR:settleEnrollment:InvalidRights');
      return -1;
    }
    if (accept) await con.query(insert.insertUserCredit, [result.price, email]);
    const status = accept ? 'Accepted' : 'Rejected';
    await con.query(insert.insertStatusEnrollment, [status, enrollmentId]);
    await con.query('COMMIT');
    notification.settleEnrollment(email, result.name, status);
    return 1;
  } catch (error: any) {
    await con.query('ROLLBACK');
    console.error('ERROR:settleEnrollment');
    console.error(error.stack);
    return -2;
  } finally {
    await con.release();
  }
}

export async function getMyEnrollments(email: string) {
  const con = await pool.connect();
  try {
    const { rows } = await con.query(select.selectMyEnrollments, [email]);

    const enrollments: Enrollment[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      enrollments.push({
        id: row.enrollment_id,
        requester: row.requester,
        tutoringSessionId: row.tutoringSessionId,
        status: row.status,
        date: row.date,
      });
    }
    return { enrollments };
  } catch (error: any) {
    console.error('ERROR:getMyEnrollments');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

async function getSessionEnrollments(con: PoolClient, sessionId: string) {
  const { rows } = await con.query(select.selectEnrollments, [sessionId]);

  const enrolled: UserEnroll[] = [];
  const pendingEnrolls: UserEnroll[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const user = {
      email: row.requester,
      name: row.requester_name,
    };
    if (row.status === 'Pending') pendingEnrolls.push(user);
    else if (row.status === 'Accepted') { enrolled.push(user); }
  }
  return { enrolled, pendingEnrolls };
}
export async function getTutoringSessions(email: string | undefined) {
  const con = await pool.connect();
  try {
    const { rows } = await con.query(select.selectTutoringSessions);
    const tutoringSessions: Record<any, any> = {};
    const created = [];
    const tutoringSessionsCategories: Record<string, string[]> = {};
    const promiseEnrollments = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!(row.session_id in tutoringSessions)) {
        if (row.tutor === email) created.push(row.session_id);
        tutoringSessions[row.session_id] = {
          id: row.session_id,
          tutorEmail: row.tutor,
          tutor: row.tutor_name,
          tutorRating: row.rating,
          tutorInstitution: row.institution,
          name: row.name,
          description: row.description,
          price: row.price,
          location: [row.latitude, row.longitude],
          date: row.date,
          duration: row.duration,
          enrolled: [],
          pendingEnrolls: [],
        };
        promiseEnrollments.push(getSessionEnrollments(con, row.session_id).then(
          (r) => {
            tutoringSessions[row.session_id].enrolled = r.enrolled;
            tutoringSessions[row.session_id].pendingEnrolls = r.pendingEnrolls;
          },
        ));
      }
      if (row.category in tutoringSessionsCategories) {
        tutoringSessionsCategories[row.category].push(row.session_id);
      } else { tutoringSessionsCategories[row.category] = [row.session_id]; }
    }
    await Promise.all(promiseEnrollments);
    return { tutoringSessions, tutoringSessionsCategories, created };
  } catch (error: any) {
    console.error('ERROR:getTutoringSessions');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function getTutoringSessionName(sessionId: string) {
  const con = await pool.connect();
  try {
    return (await con.query(select.selectStudyMName, [sessionId])).rows.pop().name;
  } catch (error: any) {
    console.error('ERROR:getStudyMaterialName');
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}
