import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import TutoringSession, { Enrollment, UserEnroll } from '../../models/TutoringSession';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import alert from '../../utils/alert';
import {
  EnrollTutoringSessionPayload,
  OnSettleAllEnrollmentStatusPayload,
  OnSettleEnrollmentStatusPayload,
  ScheduleTutoringSessionPayload,
} from './ThunkPayload';
import {
  TutoringSessionEnrollmentPOSTRequest,
  TutoringSessionEnrollmentPOSTResponse,
  TutoringSessionPOSTRequest,
  TutoringSessionPOSTResponse,
} from './contract/POSTEndpoints';
import { EnrollmentStatusSettlePUTRequest } from './contract/PUTEndpoints';
import {
  MyEnrollmentsGETRequest,
  MyEnrollmentsGETResponse,
  TutoringSessionsGetRequest,
  TutoringSessionsGETResponse,
} from './contract/GETEndpoints';
import { SERVER_BASE_URL } from '../../extra';

interface State {
  tutoringSessions: Record<string, TutoringSession>
  tutoringSessionsCategories: Record<string, string[]>
  created: string[]
  enrollments: Enrollment[]
  isLoading: boolean
}

const initialState: State = {
  tutoringSessions: {},
  tutoringSessionsCategories: {},
  created: [],
  enrollments: [],
  isLoading: false,
};

export const fetchTutoringSessions = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'tutoring/fetchTutoringSessions',
  async (_, { getState }) => {
    const { idToken } = getState().authentication;
    const paramsSessions: TutoringSessionsGetRequest = { idToken: idToken || undefined };
    const responseSessionsPromise = axios.get<TutoringSessionsGETResponse>(`${SERVER_BASE_URL}/tutoring`, {
      params: paramsSessions,
    });
    let responseEnrollments;
    if (idToken) {
      const paramsEnrollments: MyEnrollmentsGETRequest = { idToken };
      const responseEnrollmentsPromise = axios.get<MyEnrollmentsGETResponse>(`${SERVER_BASE_URL}/tutoring/myEnrollments`, {
        params: paramsEnrollments,
      });
      responseEnrollments = await responseEnrollmentsPromise;
      if (responseEnrollments.status !== 200) throw new Error('Status code not okay!');
    }
    const responseSessions = await responseSessionsPromise;
    if (responseSessions.status !== 200) throw new Error('Status code not okay!');
    return {
      ...responseSessions.data,
      ...responseEnrollments?.data,
    };
  },
);

export const scheduleTutoringSession = createAsyncThunk<void,
ScheduleTutoringSessionPayload, ThunkApiConfig>(
  'tutoring/scheduleTutoringSession',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: TutoringSessionPOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.post<TutoringSessionPOSTResponse>(`${SERVER_BASE_URL}/tutoring`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Tutoring Session Schedule', `The tutoring session '${p.name}' has been scheduled.`);
    dispatch(fetchTutoringSessions());
  },
);

export const enrollTutoringSession = createAsyncThunk<void,
EnrollTutoringSessionPayload, ThunkApiConfig>(
  'tutoring/enrollTutoringSession',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: TutoringSessionEnrollmentPOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    let response;
    try {
      response = await axios.post<TutoringSessionEnrollmentPOSTResponse>(`${SERVER_BASE_URL}/tutoring/enroll`, params);
    } catch (err) {
      if (err.response.status === 402 || err.response.status === 500) throw new Error('You are out of credits!');
      throw err;
    }
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Tutoring Session Enroll', 'You have successfully signed up for the tutoring session.');
    dispatch(fetchTutoringSessions());
  },
);

export const onSettleEnrollmentStatus = createAsyncThunk<void,
OnSettleEnrollmentStatusPayload, ThunkApiConfig>(
  'tutoring/onSettleEnrollmentStatus',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: EnrollmentStatusSettlePUTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.put(`${SERVER_BASE_URL}/tutoring/enroll-settle`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    dispatch(fetchTutoringSessions());
  },
);

export const onSettleAllEnrollmentStatus = createAsyncThunk<void,
OnSettleAllEnrollmentStatusPayload, ThunkApiConfig>(
  'tutoring/onSettleAllEnrollmentStatus',
  async (p, {
    getState,
    dispatch,
  }) => {
    const { pendingEnrolls } = getState().tutoring.tutoringSessions[p.tutoringSessionId];
    const responses = await Promise.all(pendingEnrolls.map((enroll: UserEnroll) => {
      const params: EnrollmentStatusSettlePUTRequest = {
        idToken: getState().authentication.idToken!,
        enrollmentId: enroll.id,
        accept: p.accept,
      };
      return axios.put(`${SERVER_BASE_URL}/tutoring/enroll-settle`, params);
    }));
    responses.forEach(({ status }) => {
      if (status !== 200) throw new Error('Status code not okay!');
    });
    dispatch(fetchTutoringSessions());
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
    builder.addCase(scheduleTutoringSession.rejected, (state, action) => onError(state, action, 'Error scheduling a tutoring session!'));
    builder.addCase(enrollTutoringSession.pending, onPending);
    builder.addCase(enrollTutoringSession.rejected, (state, action) => onError(state, action, 'Error signing up for the tutoring session!'));
    builder.addCase(onSettleEnrollmentStatus.pending, onPending);
    builder.addCase(onSettleEnrollmentStatus.rejected, (state, action) => onError(state, action, 'Error settling enrollment status in your tutoring session!'));
    builder.addCase(onSettleAllEnrollmentStatus.pending, onPending);
    builder.addCase(onSettleAllEnrollmentStatus.rejected, (state, action) => onError(state, action, 'Error settling status of all enrollments in your tutoring session!'));
  },
});

export default tutoringSlice.reducer;
