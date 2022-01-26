import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';
import axios from 'axios';

import User from '../../models/User';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import { SignupUserPayload } from './ThunkPayload';
import { UserGETRequest, UserGETResponse } from './contract/GETEndpoints';
import { RegisterPOSTRequest, RegisterPushNotificationPOSTRequest } from './contract/POSTEndpoints';
import { SERVER_BASE_URL } from '../../extra';
import alert from '../../utils/alert';

interface State {
  isLoading: boolean
  user: User | null
}

const initialState: State = {
  isLoading: false,
  user: null,
};

let pushNotificationToken: string;
const registerForPushNotificationsAsync = async () => {
  const { granted } = await requestPermissionsAsync();
  if (granted) {
    const { data } = await getExpoPushTokenAsync();
    pushNotificationToken = data;
  } else {
    alert('Insufficient permissions!', 'You must give permissions to be able to receive notifications.');
  }
};

export const registerForPushNotificationToken = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'user/registerForPushNotificationToken',
  async (_, { getState }) => {
    if (!pushNotificationToken) await registerForPushNotificationsAsync();
    const params: RegisterPushNotificationPOSTRequest = {
      idToken: getState().authentication.idToken!,
      pushNotificationToken,
    };
    const response = await axios.post(`${SERVER_BASE_URL}/user/registerPushNotificationToken`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    return response.data;
  },
);

export const fetchUser = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'user/fetchUser',
  async (_, { getState }) => {
    const params: UserGETRequest = { idToken: getState().authentication.idToken! };
    const response = await axios.get<UserGETResponse>(`${SERVER_BASE_URL}/user`, { params });
    if (response.status !== 200) throw new Error('Status code not okay!');
    return response.data;
  },
);

export const signupUser = createAsyncThunk<void,
SignupUserPayload, ThunkApiConfig>(
  'user/signupUser',
  async (p) => {
    const params: RegisterPOSTRequest = p;
    const response = await axios.post(`${SERVER_BASE_URL}/user/register`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, onPending);
    builder.addCase(fetchUser.fulfilled, onUpdate);
    builder.addCase(fetchUser.rejected, (state, action) => onError(state, action, 'Error getting user!'));
    builder.addCase(signupUser.pending, onPending);
    builder.addCase(signupUser.rejected, (state, action) => onError(state, action, 'Error signing up user!'));
  },
});

export default userSlice.reducer;
