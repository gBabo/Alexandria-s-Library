import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import User from '../../models/User';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import { dummyUser } from '../../constants/DummyUser';

interface State {
  isLoading: boolean
  user: User | null
}

const initialState: State = {
  isLoading: false,
  user: dummyUser,
};

export const fetchUser = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'user/fetchUser',
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
    builder.addCase(fetchUser.pending, onPending);
    builder.addCase(fetchUser.fulfilled, onUpdate);
    builder.addCase(fetchUser.rejected, (state, action) => onError(state, action, 'Error getting user!'));
  },
});

export default userSlice.reducer;
