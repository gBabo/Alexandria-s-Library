import Constants from 'expo-constants';

import { Extra } from './app.config';

// eslint-disable-next-line import/prefer-default-export
export const {
  FIREBASE_WEB_API_KEY,
  SERVER_BASE_URL,
} = <Extra>Constants?.manifest?.extra;
