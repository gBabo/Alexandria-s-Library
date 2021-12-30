import { createSlice } from '@reduxjs/toolkit';

interface State {
}

const initialState: State = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default userSlice.reducer;
