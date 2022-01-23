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
import clone from '../../utils/clone';
import {
  CancelTutoringSessionPayload, EnrollTutoringSessionPayload,
  OnSettleAllEnrollmentStatusPayload,
  OnSettleEnrollmentStatusPayload, ScheduleTutoringSessionPayload,
} from './ThunkPayload';

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

export const fetchTutoringSessions = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'tutoring/fetchTutoringSessions',
  // TODO
  async () => ({}),
);

export const scheduleTutoringSession = createAsyncThunk<Partial<State>,
ScheduleTutoringSessionPayload, ThunkApiConfig>(
  'tutoring/scheduleTutoringSession',
  async (p, { getState }) => {
    // TODO
    const {
      tutoringSessions,
      tutoringSessionsCategories,
    } = clone(getState().tutoring);
    const id = Math.random()
      .toString();
    tutoringSessions[id] = {
      id,
      tutorEmail: getState().user.user!.email,
      tutor: getState().user.user!.name,
      tutorInstitution: getState().user.user!.institution,
      tutorRating: getState().user.user!.rating,
      name: p.name,
      description: p.description,
      price: p.price,
      location: p.location,
      pendingEnrolls: [],
      enrolled: [],
      date: p.date,
      duration: p.duration,
    };
    p.categories.forEach((category) => {
      if (tutoringSessionsCategories[category]) {
        tutoringSessionsCategories[category].push(id);
      } else {
        tutoringSessionsCategories[category] = [id];
      }
    });
    alert('Tutoring Session Schedule', `The tutoring session '${p.name}' has been scheduled.`);
    return {
      tutoringSessions,
      tutoringSessionsCategories,
    };
  },
);

export const enrollTutoringSession = createAsyncThunk<Partial<State>,
EnrollTutoringSessionPayload, ThunkApiConfig>(
  'tutoring/enrollTutoringSession',
  async (p, { getState }) => {
    // TODO
    const {
      tutoringSessions,
      enrollments,
    } = clone(getState().tutoring);
    const id = Math.random()
      .toString();
    enrollments.push({
      id,
      tutoringSessionId: p.tutoringSessionId,
      status: EnrollmentStatus.PENDING,
      requester: getState().user.user!.name,
      date: tutoringSessions[p.tutoringSessionId].date,
    });
    tutoringSessions[p.tutoringSessionId].pendingEnrolls.push(getState().user.user!);
    alert('Tutoring Session Enroll',
      `You have successfully signed up for the tutoring session '${tutoringSessions[p.tutoringSessionId].name}'.`);
    return {
      tutoringSessions,
      enrollments,
    };
  },
);

export const cancelTutoringSession = createAsyncThunk<Partial<State>,
CancelTutoringSessionPayload, ThunkApiConfig>(
  'tutoring/cancelTutoringSession',
  async (p, { getState }) => {
    // TODO
    const {
      tutoringSessions,
      tutoringSessionsCategories,
    } = clone(getState().tutoring);
    delete tutoringSessions[p.tutoringSessionId];
    Object.keys(tutoringSessionsCategories)
      .forEach((category) => {
        tutoringSessionsCategories[category] = Object.values(tutoringSessionsCategories[category])
          .filter((id) => id !== p.tutoringSessionId);
      });
    alert('Tutoring Session Cancel', 'You have successfully canceled the tutoring session.');
    return {
      tutoringSessions,
      tutoringSessionsCategories,
    };
  },
);

export const onSettleEnrollmentStatus = createAsyncThunk<Partial<State>,
OnSettleEnrollmentStatusPayload, ThunkApiConfig>(
  'tutoring/onSettleEnrollmentStatus',
  async (p, { getState }) => {
    // TODO
    const {
      tutoringSessions,
      enrollments,
    } = clone(getState().tutoring);
    if (p.accept) {
      tutoringSessions[p.tutoringSessionId].enrolled
        .push(tutoringSessions[p.tutoringSessionId].pendingEnrolls[p.enrollIndex]);
    }
    tutoringSessions[p.tutoringSessionId].pendingEnrolls.splice(p.enrollIndex, 1);
    enrollments.forEach((enrollment) => {
      if (enrollment.tutoringSessionId) {
        enrollment.status = p.accept ? EnrollmentStatus.CONFIRMED : EnrollmentStatus.REJECTED;
      }
    });
    return {
      tutoringSessions,
      enrollments,
    };
  },
);

export const onSettleAllEnrollmentStatus = createAsyncThunk<Partial<State>,
OnSettleAllEnrollmentStatusPayload, ThunkApiConfig>(
  'tutoring/onSettleAllEnrollmentStatus',
  async (p, { getState }) => {
    // TODO
    const {
      tutoringSessions,
      enrollments,
    } = clone(getState().tutoring);
    if (p.accept) {
      tutoringSessions[p.tutoringSessionId].enrolled
        .push(...tutoringSessions[p.tutoringSessionId].pendingEnrolls);
    }
    tutoringSessions[p.tutoringSessionId].pendingEnrolls = [];
    enrollments.forEach((enrollment) => {
      if (enrollment.tutoringSessionId) {
        enrollment.status = p.accept ? EnrollmentStatus.CONFIRMED : EnrollmentStatus.REJECTED;
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
