import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { SERVER_BASE_URL } from '../../extra';
import { UserGETRequest, UserGETResponse } from './contract/GETEndpoints';
import User from '../../models/User';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';

interface State {
  isLoading: boolean
  user: User | null
}

const initialState: State = {
  isLoading: false,
  user: null,
};

export const getUser = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'user/getUser',
  async (payload, { getState }) => {
    const params: UserGETRequest = { idToken: getState().authentication.idToken as string };
    const response = await axios.get<UserGETResponse>(`${SERVER_BASE_URL}/user`, { params });
    if (response.status !== 200) throw new Error('Status code not okay!');
    return response.data;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, onPending);
    builder.addCase(getUser.fulfilled, onUpdate);
    builder.addCase(getUser.rejected, (state, action) => onError(state, action, 'Error getting user!'));
  },
});

export default userSlice.reducer;
