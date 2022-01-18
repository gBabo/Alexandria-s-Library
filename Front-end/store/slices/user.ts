import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import User from '../../models/User';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import { user } from '../../constants/DummyUser';

interface State {
  isLoading: boolean
  user: User | null
}

const initialState: State = {
  isLoading: false,
  user,
};

export const getUser = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'user/getUser',
  // TODO
  async () => ({}),
  /*
    const params: UserGETRequest = { idToken: getState().authentication.idToken as string };
    const response = await axios.get<UserGETResponse>(`${SERVER_BASE_URL}/user`, { params });
    if (response.status !== 200) throw new Error('Status code not okay!');
    return response.data;
    */
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
