import axios from 'axios';
import * as studyMaterialDB from '../db/manager/studyMaterial';
import * as userDB from '../db/manager/user';

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

  try {
    await sendPushNotification({
      to: registrationToken,
      title: 'Alexandria\'s Library',
      body: `New Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      data: { code: 'EXCHANGE' },
    });
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

  try {
    await sendPushNotification({
      to: registrationToken,
      title: 'Alexandria\'s Library',
      body: `${status} Study Material Exchange Request: ${studyMTer} For ${studyMTee}`,
      data: { code: 'SETTLE_EXCHANGE' },
    });
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

  try {
    await sendPushNotification({
      to: registrationToken,
      title: 'Alexandria\'s Library',
      body: `New Enrollment on Tutoring Session: ${sessionName}`,
      data: { code: 'ENROLL' },
    });
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

  try {
    await sendPushNotification({
      to: registrationToken,
      title: 'Alexandria\'s Library',
      body: `${status} Enrollment on Tutoring Session: ${sessionName}`,
      data: { code: 'SETTLE_ENROLL' },
    });
  } catch (error) {
    console.log('Error sending Notification for a settlement of enrollment:', error);
  }
}

const sendPushNotification = (data: {
    to: string
    title: string
    body: string
    data: { code: string }
}) => axios.post('https://exp.host/--/api/v2/push/send', data, {
  headers: {
    Accept: 'application/json',
    'Accept-encoding': 'gzip, deflate',
    'Content-Type': 'application/json',
  },
});
