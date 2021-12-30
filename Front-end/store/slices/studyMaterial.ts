import { createSlice } from '@reduxjs/toolkit';

interface State {
}

const initialState: State = {};

const studyMaterialSlice = createSlice({
  name: 'studyMaterial',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default studyMaterialSlice.reducer;
