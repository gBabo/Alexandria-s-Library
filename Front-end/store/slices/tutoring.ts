import { createSlice } from '@reduxjs/toolkit';

interface State {
}

const initialState: State = {};

const tutoringSlice = createSlice({
  name: 'tutoring',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default tutoringSlice.reducer;
