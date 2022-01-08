import pool from '../index';
import User from '../../models/User';
import select from '../query/select';
import insert from '../query/insert';

export async function getUser(email:string) : Promise<undefined|User> {
  const con = await pool.connect();
  try {
    const result = await con.query(select.selectUser, [email]);
    if (result.rowCount !== 1) {
      return undefined;
    }
    delete result.rows[0].pushNotificationToken;
    return result.rows[0];
  } catch (error: any) {
    console.error(error.stack);
    return undefined;
  } finally {
    await con.release();
  }
}

export async function registerUser(email:string, name:string, institution: string) {
  const con = await pool.connect();
  try {
    await con.query(insert.insertUser, [email, name, institution]);
    return true;
  } catch (error: any) {
    console.error(error.stack);
    return false;
  } finally {
    await con.release();
  }
}

export async function registerPushNotification(email:string, pushNotificationToken: string) {
  const con = await pool.connect();
  try {
    await con.query(insert.insertPushNotificationSQL, [pushNotificationToken, email]);
    return true;
  } catch (error: any) {
    console.error(error.stack);
    return false;
  } finally {
    await con.release();
  }
}
