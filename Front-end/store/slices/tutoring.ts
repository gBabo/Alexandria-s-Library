import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import TutoringSession, { Enrollment } from '../../models/TutoringSession';
import {
  tutoringSessions,
  tutoringSessionsCategories,
  enrollments,
} from '../../constants/DummyTutoringSessions';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';

interface State {
  tutoringSessions: Record<string, TutoringSession>
  tutoringSessionsCategories: Record<string, string[]>
  enrollments: Enrollment[]
  isLoading: boolean
}

const initialState: State = {
  tutoringSessions,
  tutoringSessionsCategories,
  enrollments,
  isLoading: false,
};

export const getTutoringSessions = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'tutoring/getTutoringSessions',
  // TODO
  async () => ({}),
);

const tutoringSlice = createSlice({
  name: 'tutoring',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTutoringSessions.pending, onPending);
    builder.addCase(getTutoringSessions.fulfilled, onUpdate);
    builder.addCase(getTutoringSessions.rejected, (state, action) => onError(state, action, 'Error getting tutoring sessions!'));
  },
});

export default tutoringSlice.reducer;
