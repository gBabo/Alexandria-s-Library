import pool from '../index';
import User from '../../models/User';
import select from '../query/select';
import insert from '../query/insert';

export async function getUser(email:string) : Promise<undefined|User> {
  const connection = await pool.connect();
  try {
    const result = await connection.query(select.selectUserSQL, [email]);
    if (result.rowCount !== 1) {
      return undefined;
    }
    delete result.rows[0].pushNotificationToken;
    return result.rows[0];
  } catch (error: any) {
    console.error(error.stack);
    return undefined;
  } finally {
    await connection.release();
  }
}

export async function registerUser(email:string, name:string, institution: string) {
  const connection = await pool.connect();
  try {
    await connection.query(insert.insertUserSQL, [email, name, institution]);
    return true;
  } catch (error: any) {
    console.error(error.stack);
    return false;
  } finally {
    await connection.release();
  }
}

export async function registerPushNotification(email:string, pushNotificationToken: string) {
  const connection = await pool.connect();
  try {
    await connection.query(insert.insertPushNotificationSQL, [pushNotificationToken, email]);
    return true;
  } catch (error: any) {
    console.error(error.stack);
    return false;
  } finally {
    await connection.release();
  }
}
