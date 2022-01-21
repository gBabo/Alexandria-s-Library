import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import TutoringSession, { Enrollment, EnrollmentStatus } from '../../models/TutoringSession';
import {
  dummyEnrollments,
  dummyTutoringSessions,
  dummyTutoringSessionsCategories,
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

export const fetchTutoringSessions = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'tutoring/fetchTutoringSessions',
  // TODO
  async () => ({}),
);

export const scheduleTutoringSession = createAsyncThunk<Partial<State>, {
  name: string
  categories: string[]
  description: string
  location: string
  duration: number
  price: number
  date: number
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

export const enrollTutoringSession = createAsyncThunk<Partial<State>, {
  tutoringSessionId: string
}, ThunkApiConfig>(
  'tutoring/enrollTutoringSession',
  // TODO
  async ({ tutoringSessionId }, { getState }) => {
    const id = Math.random()
      .toString();
    const {
      tutoringSessions,
      enrollments,
    }: State = JSON.parse(JSON.stringify(getState().tutoring));
    enrollments.push({
      id,
      tutoringSessionId,
      status: EnrollmentStatus.PENDING,
      requester: getState().user.user!.name,
      date: tutoringSessions[tutoringSessionId].date,
    });
    tutoringSessions[tutoringSessionId].pendingEnrolls.push(getState().user.user!);
    alert('Tutoring Session Enroll', `You have successfully signed up for the tutoring session '${tutoringSessions[tutoringSessionId].name}'.`);
    return {
      tutoringSessions,
      enrollments,
    };
  },
);

export const cancelTutoringSession = createAsyncThunk<Partial<State>, {
  tutoringSessionId: string
}, ThunkApiConfig>(
  'tutoring/cancelTutoringSession',
  // TODO
  async ({ tutoringSessionId }, { getState }) => {
    const {
      tutoringSessions,
      tutoringSessionsCategories,
    }: State = JSON.parse(JSON.stringify(getState().tutoring));
    delete tutoringSessions[tutoringSessionId];
    Object.keys(tutoringSessionsCategories)
      .forEach((category) => {
        tutoringSessionsCategories[category] = Object.values(tutoringSessionsCategories[category])
          .filter((id) => id !== tutoringSessionId);
      });
    alert('Tutoring Session Cancel', 'You have successfully canceled the tutoring session.');
    return {
      tutoringSessions,
      tutoringSessionsCategories,
    };
  },
);

export const onSettleEnrollmentStatus = createAsyncThunk<Partial<State>, {
  tutoringSessionId: string
  enrollIndex: number
  accept: boolean
}, ThunkApiConfig>(
  'tutoring/onSettleEnrollmentStatus',
  // TODO
  async ({
    tutoringSessionId,
    enrollIndex,
    accept,
  }, { getState }) => {
    const {
      tutoringSessions,
      enrollments,
    }: State = JSON.parse(JSON.stringify(getState().tutoring));
    if (accept) {
      tutoringSessions[tutoringSessionId].enrolled
        .push(tutoringSessions[tutoringSessionId].pendingEnrolls[enrollIndex]);
    }
    tutoringSessions[tutoringSessionId].pendingEnrolls.splice(enrollIndex, 1);
    enrollments.forEach((enrollment) => {
      if (enrollment.tutoringSessionId) {
        enrollment.status = accept ? EnrollmentStatus.CONFIRMED : EnrollmentStatus.REJECTED;
      }
    });
    return {
      tutoringSessions,
      enrollments,
    };
  },
);

export const onSettleAllEnrollmentStatus = createAsyncThunk<Partial<State>, {
  tutoringSessionId: string
  accept: boolean
}, ThunkApiConfig>(
  'tutoring/onSettleAllEnrollmentStatus',
  // TODO
  async ({
    tutoringSessionId,
    accept,
  }, { getState }) => {
    const {
      tutoringSessions,
      enrollments,
    }: State = JSON.parse(JSON.stringify(getState().tutoring));
    if (accept) {
      tutoringSessions[tutoringSessionId].enrolled
        .push(...tutoringSessions[tutoringSessionId].pendingEnrolls);
    }
    tutoringSessions[tutoringSessionId].pendingEnrolls = [];
    enrollments.forEach((enrollment) => {
      if (enrollment.tutoringSessionId) {
        enrollment.status = accept ? EnrollmentStatus.CONFIRMED : EnrollmentStatus.REJECTED;
      }
    });
    return {
      tutoringSessions,
      enrollments,
    };
  },
);

const tutoringSlice = createSlice({
  name: 'tutoring',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTutoringSessions.pending, onPending);
    builder.addCase(fetchTutoringSessions.fulfilled, onUpdate);
    builder.addCase(fetchTutoringSessions.rejected, (state, action) => onError(state, action, 'Error getting tutoring sessions!'));
    builder.addCase(scheduleTutoringSession.pending, onPending);
    builder.addCase(scheduleTutoringSession.fulfilled, onUpdate);
    builder.addCase(scheduleTutoringSession.rejected, (state, action) => onError(state, action, 'Error scheduling a tutoring session!'));
    builder.addCase(enrollTutoringSession.pending, onPending);
    builder.addCase(enrollTutoringSession.fulfilled, onUpdate);
    builder.addCase(enrollTutoringSession.rejected, (state, action) => onError(state, action, 'Error signing up for the tutoring session!'));
    builder.addCase(cancelTutoringSession.pending, onPending);
    builder.addCase(cancelTutoringSession.fulfilled, onUpdate);
    builder.addCase(cancelTutoringSession.rejected, (state, action) => onError(state, action, 'Error canceling your tutoring session!'));
    builder.addCase(onSettleEnrollmentStatus.pending, onPending);
    builder.addCase(onSettleEnrollmentStatus.fulfilled, onUpdate);
    builder.addCase(onSettleEnrollmentStatus.rejected, (state, action) => onError(state, action, 'Error settling enrollment status in your tutoring session!'));
    builder.addCase(onSettleAllEnrollmentStatus.pending, onPending);
    builder.addCase(onSettleAllEnrollmentStatus.fulfilled, onUpdate);
    builder.addCase(onSettleAllEnrollmentStatus.rejected, (state, action) => onError(state, action, 'Error settling status of all enrollments in your tutoring session!'));
  },
});

export default tutoringSlice.reducer;
