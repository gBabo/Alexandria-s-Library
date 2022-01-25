import { messaging } from 'firebase-admin';
import * as studyMaterialDB from '../db/manager/studyMaterial';
import * as userDB from '../db/manager/user';
import MessagingPayload = messaging.MessagingPayload;

export async function newStudyMaterialExchange(
  requestee: string,
  studyMIdTer: string,
  studyMIdTee: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(requestee);
  if (registrationToken == null) {
    console.error(`No Registration Token for user: ${requestee}`);
    return;
  }
  const studyMTer = await studyMaterialDB.getStudyMaterialName(studyMIdTer);
  const studyMTee = await studyMaterialDB.getStudyMaterialName(studyMIdTee);
  const payload: MessagingPayload = {
    data: {
      message: `New Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      code: 'EXCHANGE',
    },
  };

  try {
    await messaging().sendToDevice(registrationToken, payload);
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
  if (registrationToken == null) {
    console.error(`No Registration Token for user: ${requester}`);
    return;
  }
  const studyMTer = await studyMaterialDB.getStudyMaterialName(studyMIdTer);
  const studyMTee = await studyMaterialDB.getStudyMaterialName(studyMIdTee);

  const payload: MessagingPayload = {
    data: {
      message: `${status} Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      code: 'SETTLE_EXCHANGE',
    },
  };
  try {
    await messaging().sendToDevice(registrationToken, payload);
  } catch (error) {
    console.log('Error sending Notification of Settlement of Study Material Exchange:', error);
  }
}

export async function newEnrollment(
  tutor: string,
  sessionName: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(tutor);
  if (registrationToken == null) {
    console.error(`No Registration Token for user: ${tutor}`);
    return;
  }

  const payload: MessagingPayload = {
    data: {
      message: `New Enrollment on Tutoring Session: ${sessionName}`,
      code: 'ENROLL',
    },
  };
  try {
    await messaging().sendToDevice(registrationToken, payload);
  } catch (error) {
    console.log('Error sending Notification of enrollment:', error);
  }
}

export async function settleEnrollment(
  requester: string,
  sessionName: string,
  status: string,
) {
  const registrationToken = await userDB.getPushNotificationToken(requester);
  if (registrationToken == null) {
    console.error(`No Registration Token for user: ${requester}`);
    return;
  }

  const payload: MessagingPayload = {
    data: {
      message: `${status} Enrollment on Tutoring Session: ${sessionName}`,
      code: 'SETTLE_ENROLL',
    },
  };
  try {
    await messaging().sendToDevice(registrationToken, payload);
  } catch (error) {
    console.log('Error sending Notification for a settlement of enrollment:', error);
  }
}
