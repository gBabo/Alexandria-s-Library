import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { setString } from 'expo-clipboard';
import axios from 'axios';

import StudyMaterial, { StudyMaterialExchange } from '../../models/StudyMaterial';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';
import alert from '../../utils/alert';
import {
  AddReviewCommentPayload,
  AddReviewPayload,
  FetchStudyMaterialLinkPayload,
  ProposeExchangePayload,
  PublishStudyMaterialPayload,
  PurchaseStudyMaterialPayload,
  SettleExchangePayload,
  ToggleReviewLikePayload,
  ToggleStudyMaterialLikePayload,
} from './ThunkPayload';
import {
  StudyMaterialLinkGETRequest,
  StudyMaterialLinkGETResponse,
  StudyMaterialsGETRequest,
  StudyMaterialsGETResponse,
  StudyMaterialsPendingExchangesGETRequest,
  StudyMaterialsPendingExchangesGETResponse,
} from './contract/GETEndpoints';
import {
  StudyMaterialExchangeSettlePUTRequest,
  StudyMaterialLikePUTRequest,
  StudyMaterialReviewLikePUTRequest,
} from './contract/PUTEndpoints';
import {
  StudyMaterialExchangePOSTRequest,
  StudyMaterialExchangePOSTResponse,
  StudyMaterialPOSTRequest,
  StudyMaterialPOSTResponse,
  StudyMaterialPurchasePOSTRequest,
  StudyMaterialReviewCommentPOSTRequest,
  StudyMaterialReviewCommentPOSTResponse,
  StudyMaterialReviewPOSTRequest,
  StudyMaterialReviewPOSTResponse,
} from './contract/POSTEndpoints';
import { SERVER_BASE_URL } from '../../extra';

interface State {
  studyMaterials: Record<string, StudyMaterial>
  studyMaterialsCategories: Record<string, string[]>
  uploaded: string[]
  acquired: string[]
  studyMaterialsExchanges: StudyMaterialExchange[]
  isLoading: boolean
}

const initialState: State = {
  studyMaterials: {},
  studyMaterialsCategories: {},
  uploaded: [],
  acquired: [],
  studyMaterialsExchanges: [],
  isLoading: false,
};

export const fetchStudyMaterials = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterials',
  async (_, { getState }) => {
    const { idToken } = getState().authentication;
    const paramsStudyMaterials: StudyMaterialsGETRequest = { idToken: idToken || undefined };
    const responseStudyMaterialsPromise = axios.get<StudyMaterialsGETResponse>(`${SERVER_BASE_URL}/study-material`, {
      params: paramsStudyMaterials,
    });
    let responseExchanges;
    if (idToken) {
      const paramsExchanges: StudyMaterialsPendingExchangesGETRequest = { idToken };
      const responseExchangesPromise = axios.get<StudyMaterialsPendingExchangesGETResponse>(`${SERVER_BASE_URL}/study-material/pending-exchanges`, {
        params: paramsExchanges,
      });
      responseExchanges = await responseExchangesPromise;
      if (responseExchanges.status !== 200) throw new Error('Status code not okay!');
    }
    const responseStudyMaterials = await responseStudyMaterialsPromise;
    if (responseStudyMaterials.status !== 200) throw new Error('Status code not okay!');
    return {
      ...responseStudyMaterials.data,
      ...responseExchanges?.data,
    };
  },
);

export const toggleStudyMaterialLike = createAsyncThunk<void,
ToggleStudyMaterialLikePayload, ThunkApiConfig>(
  'studyMaterial/toggleStudyMaterialLike',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialLikePUTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.put<StudyMaterialsGETResponse>(`${SERVER_BASE_URL}/study-material/like`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    dispatch(fetchStudyMaterials());
  },
);

export const purchaseStudyMaterial = createAsyncThunk<void,
PurchaseStudyMaterialPayload, ThunkApiConfig>(
  'studyMaterial/purchaseStudyMaterial',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialPurchasePOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    let response;
    try {
      response = await axios.post(`${SERVER_BASE_URL}/study-material/purchase`, params);
    } catch (err) {
      if (err.response.status === 402 || err.response.status === 500) throw new Error('You are out of credits!');
      throw err;
    }
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Study Material Purchase', 'Study material successfully acquired.');
    dispatch(fetchStudyMaterials());
  },
);

export const proposeExchange = createAsyncThunk<void,
ProposeExchangePayload, ThunkApiConfig>(
  'studyMaterial/proposeExchange',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialExchangePOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
      requesteeStudyMaterialAuthor: getState().studyMaterial
        .studyMaterials[p.requesteeStudyMaterialId].authorEmail,
    };
    const response = await axios.post<StudyMaterialExchangePOSTResponse>(`${SERVER_BASE_URL}/study-material/exchange-request`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Study Material Exchange', 'Exchange has been successfully proposed.');
    dispatch(fetchStudyMaterials());
  },
);

export const fetchStudyMaterialLink = createAsyncThunk<Partial<State>,
FetchStudyMaterialLinkPayload, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterialLink',
  async (p, { getState }) => {
    const params: StudyMaterialLinkGETRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.get<StudyMaterialLinkGETResponse>(`${SERVER_BASE_URL}/study-material/get-link`, { params });
    if (response.status !== 200) throw new Error('Status code not okay!');
    setString(response.data.link);
    alert('Obtaining Study Material', 'Link copied to clipboard.');
    return {};
  },
);

export const toggleReviewLike = createAsyncThunk<void,
ToggleReviewLikePayload, ThunkApiConfig>(
  'studyMaterial/toggleReviewLike',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialReviewLikePUTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.put(`${SERVER_BASE_URL}/study-material/review/like`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    dispatch(fetchStudyMaterials());
  },
);

export const addReview = createAsyncThunk<void,
AddReviewPayload, ThunkApiConfig>(
  'studyMaterial/addReview',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialReviewPOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.post<StudyMaterialReviewPOSTResponse>(`${SERVER_BASE_URL}/study-material/review`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    dispatch(fetchStudyMaterials());
  },
);

export const addReviewComment = createAsyncThunk<void,
AddReviewCommentPayload, ThunkApiConfig>(
  'studyMaterial/addReviewComment',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialReviewCommentPOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.post<StudyMaterialReviewCommentPOSTResponse>(`${SERVER_BASE_URL}/study-material/review/comment`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    dispatch(fetchStudyMaterials());
  },
);

export const publishStudyMaterial = createAsyncThunk<void,
PublishStudyMaterialPayload, ThunkApiConfig>(
  'studyMaterial/publishStudyMaterial',
  async (p, {
    getState,
    dispatch,
  }) => {
    const file = await readAsStringAsync(encodeURI(p.fileInfo.uri), {
      encoding: EncodingType.Base64,
    });
    const params: StudyMaterialPOSTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
      file,
    };
    const response = await axios.post<StudyMaterialPOSTResponse>(`${SERVER_BASE_URL}/study-material`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Upload Study Material', `The study material '${p.name}' has been published.`);
    dispatch(fetchStudyMaterials());
  },
);

export const settleExchange = createAsyncThunk<void,
SettleExchangePayload, ThunkApiConfig>(
  'studyMaterial/settleExchange',
  async (p, {
    getState,
    dispatch,
  }) => {
    const params: StudyMaterialExchangeSettlePUTRequest = {
      idToken: getState().authentication.idToken!,
      ...p,
    };
    const response = await axios.put(`${SERVER_BASE_URL}/study-material/exchange-request-settle`, params);
    if (response.status !== 200) throw new Error('Status code not okay!');
    alert('Study Materials Exchange', `The exchange was successfully ${p.accept ? 'accepted' : 'rejected'}.`);
    dispatch(fetchStudyMaterials());
  },
);

const studyMaterialSlice = createSlice({
  name: 'studyMaterial',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudyMaterials.pending, onPending);
    builder.addCase(fetchStudyMaterials.fulfilled, onUpdate);
    builder.addCase(fetchStudyMaterials.rejected, (state, action) => onError(state, action, 'Error getting study materials!'));
    builder.addCase(toggleStudyMaterialLike.pending, onPending);
    builder.addCase(toggleStudyMaterialLike.rejected, (state, action) => onError(state, action, 'Error liking a study material!'));
    builder.addCase(purchaseStudyMaterial.pending, onPending);
    builder.addCase(purchaseStudyMaterial.rejected, (state, action) => onError(state, action, 'Error buying a study material!'));
    builder.addCase(proposeExchange.pending, onPending);
    builder.addCase(proposeExchange.rejected, (state, action) => onError(state, action, 'Error trying to exchange study materials!'));
    builder.addCase(fetchStudyMaterialLink.pending, onPending);
    builder.addCase(fetchStudyMaterialLink.fulfilled, onUpdate);
    builder.addCase(fetchStudyMaterialLink.rejected, (state, action) => onError(state, action, 'Error getting a study material link!'));
    builder.addCase(toggleReviewLike.pending, onPending);
    builder.addCase(toggleReviewLike.rejected, (state, action) => onError(state, action, 'Error liking a study material review!'));
    builder.addCase(addReview.pending, onPending);
    builder.addCase(addReview.rejected, (state, action) => onError(state, action, 'Error reviewing a study material!'));
    builder.addCase(addReviewComment.pending, onPending);
    builder.addCase(addReviewComment.rejected, (state, action) => onError(state, action, 'Error responding to a study material review!'));
    builder.addCase(publishStudyMaterial.pending, onPending);
    builder.addCase(publishStudyMaterial.rejected, (state, action) => onError(state, action, 'Error publishing a study material!'));
    builder.addCase(settleExchange.pending, onPending);
    builder.addCase(settleExchange.rejected, (state, action) => onError(state, action, 'Error settling exchange of study materials!'));
  },
});

export default studyMaterialSlice.reducer;
