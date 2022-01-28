import axios from 'axios';
import { Expo } from 'expo-server-sdk';
import * as studyMaterialDB from '../db/manager/studyMaterial';
import * as userDB from '../db/manager/user';

const expo = new Expo();

export async function newStudyMaterialExchange(
  requestee: string,
  studyMIdTer: string,
  studyMIdTee: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(requestee);
  if (!Expo.isExpoPushToken(registrationToken)) {
    console.error(`No Registration Token for user: ${requestee}`);
    return;
  }
  const studyMTer = await studyMaterialDB.getStudyMaterialName(studyMIdTer);
  const studyMTee = await studyMaterialDB.getStudyMaterialName(studyMIdTee);

  try {
    const chunk = (expo.chunkPushNotifications([{
      to: registrationToken,
      sound: 'default',
      body: `New Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      data: { code: 'EXCHANGE' },
    }]))[0];
    const ticket = (await expo.sendPushNotificationsAsync(chunk))[0];
    if (ticket.status !== 'ok') console.error(ticket.message);
  } catch (error) {
    console.log('Error sending Notification of Study Material Exchange:', error);
  }
}

export async function settleStudyMaterialExchange(
  requester: string,
  studyMIdTer: string,
  studyMIdTee: string,
  status: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(requester);
  if (!Expo.isExpoPushToken(registrationToken)) {
    console.error(`No Registration Token for user: ${requester}`);
    return;
  }
  const studyMTer = await studyMaterialDB.getStudyMaterialName(studyMIdTer);
  const studyMTee = await studyMaterialDB.getStudyMaterialName(studyMIdTee);

  try {
    const chunk = (expo.chunkPushNotifications([{
      to: registrationToken,
      sound: 'default',
      body: `${status} Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      data: { code: 'SETTLE_EXCHANGE' },
    }]))[0];
    const ticket = (await expo.sendPushNotificationsAsync(chunk))[0];
    if (ticket.status !== 'ok') console.error(ticket.message);
  } catch (error) {
    console.error('Error sending Notification of Settlement of Study Material Exchange:', error);
  }
}

export async function newEnrollment(
  tutor: string,
  sessionName: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(tutor);
  if (!Expo.isExpoPushToken(registrationToken)) {
    console.error(`No Registration Token for user: ${tutor}`);
    return;
  }

  try {
    const chunk = (expo.chunkPushNotifications([{
      to: registrationToken,
      sound: 'default',
      body: `New Enrollment on Tutoring Session: ${sessionName}`,
      data: { code: 'ENROLL' },
    }]))[0];
    const ticket = (await expo.sendPushNotificationsAsync(chunk))[0];
    if (ticket.status !== 'ok') console.error(ticket.message);
  } catch (error) {
    console.error('Error sending Notification of enrollment:', error);
  }
}

export async function settleEnrollment(
  requester: string,
  sessionName: string,
  status: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(requester);
  if (!Expo.isExpoPushToken(registrationToken)) {
    console.error(`No Registration Token for user: ${requester}`);
    return;
  }

  try {
    const chunk = (expo.chunkPushNotifications([{
      to: registrationToken,
      sound: 'default',
      body: `${status} Enrollment on Tutoring Session: ${sessionName}`,
      data: { code: 'SETTLE_ENROLL' },
    }]))[0];
    const ticket = (await expo.sendPushNotificationsAsync(chunk))[0];
    if (ticket.status !== 'ok') console.error(ticket.message);
  } catch (error) {
    console.error('Error sending Notification for a settlement of enrollment:', error);
  }
}
