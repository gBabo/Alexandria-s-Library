import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import TutoringSession, { Enrollment } from '../../models/TutoringSession';
import {
  dummyTutoringSessions,
  dummyTutoringSessionsCategories,
  dummyEnrollments,
} from '../../constants/DummyTutoringSessions';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import alert from '../../utils/alert';

interface State {
  tutoringSessions: Record<string, TutoringSession>
  tutoringSessionsCategories: Record<string, string[]>
  enrollments: Enrollment[]
  isLoading: boolean
}

const initialState: State = {
  tutoringSessions: dummyTutoringSessions,
  tutoringSessionsCategories: dummyTutoringSessionsCategories,
  enrollments: dummyEnrollments,
  isLoading: false,
};

export const getTutoringSessions = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'tutoring/getTutoringSessions',
  // TODO
  async () => ({}),
);

export const scheduleTutoringSession = createAsyncThunk<Partial<State>, {
  name: string,
  categories: string[],
  description: string,
  location: string,
  duration: number,
  price: number,
  date: number,
}, ThunkApiConfig>(
  'tutoring/scheduleTutoringSession',
  // TODO
  async ({
    name,
    categories,
    description,
    location,
    duration,
    price,
    date,
  }, { getState }) => {
    const id = Math.random()
      .toString();
    const {
      tutoringSessions,
      tutoringSessionsCategories,
    }: State = JSON.parse(JSON.stringify(getState().tutoring));
    tutoringSessions[id] = {
      id,
      tutorEmail: getState().user.user!.email,
      tutor: getState().user.user!.name,
      tutorInstitution: getState().user.user!.institution,
      tutorRating: getState().user.user!.rating,
      name,
      description,
      price,
      location,
      pendingEnrolls: [],
      enrolled: [],
      date,
      duration,
    };
    categories.forEach((category) => {
      if (tutoringSessionsCategories[category]) {
        tutoringSessionsCategories[category].push(id);
      } else {
        tutoringSessionsCategories[category] = [id];
      }
    });
    alert('Tutoring Session Schedule', `The tutoring session '${name}' has been scheduled.`);
    return {
      tutoringSessions,
      tutoringSessionsCategories,
    };
  },
);

const tutoringSlice = createSlice({
  name: 'tutoring',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTutoringSessions.pending, onPending);
    builder.addCase(getTutoringSessions.fulfilled, onUpdate);
    builder.addCase(getTutoringSessions.rejected, (state, action) => onError(state, action, 'Error getting tutoring sessions!'));
    builder.addCase(scheduleTutoringSession.pending, onPending);
    builder.addCase(scheduleTutoringSession.fulfilled, onUpdate);
    builder.addCase(scheduleTutoringSession.rejected, (state, action) => onError(state, action, 'Error scheduling a tutoring session!'));
  },
});

export default tutoringSlice.reducer;
