import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import StudyMaterial, { StudyMaterialExchange } from '../../models/StudyMaterial';
import {
  dummyStudyMaterials,
  dummyStudyMaterialsCategories,
  dummyStudyMaterialsExchanges,
  dummyUploadedStudyMaterials,
  dummyAcquiredStudyMaterials,
} from '../../constants/DummyStudyMaterials';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';

interface State {
  studyMaterials: Record<string, StudyMaterial>
  studyMaterialsCategories: Record<string, string[]>
  studyMaterialsExchanges: StudyMaterialExchange[]
  uploadedStudyMaterials: string[]
  acquiredStudyMaterials: string[]
  isLoading: boolean
}

const initialState: State = {
  studyMaterials: dummyStudyMaterials,
  studyMaterialsCategories: dummyStudyMaterialsCategories,
  studyMaterialsExchanges: dummyStudyMaterialsExchanges,
  uploadedStudyMaterials: dummyUploadedStudyMaterials,
  acquiredStudyMaterials: dummyAcquiredStudyMaterials,
  isLoading: false,
};

export const getStudyMaterials = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'studyMaterial/getStudyMaterials',
  // TODO
  async () => ({}),
);

export const toggleLikeStudyMaterial = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/toggleLikeStudyMaterial',
  // TODO
  async (payload, { getState }) => {
    const studyMaterials = { ...getState().studyMaterial.studyMaterials };
    const studyMaterial = { ...studyMaterials[payload.studyMaterialId] };
    studyMaterial.likes += studyMaterial.hasLiked ? -1 : 1;
    studyMaterial.hasLiked = !studyMaterial.hasLiked;
    studyMaterials[payload.studyMaterialId] = studyMaterial;
    return { studyMaterials };
  },
);

export const buyStudyMaterial = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/buyStudyMaterial',
  // TODO
  async (payload, { getState }) => {
    const { price } = getState().studyMaterial.studyMaterials[payload.studyMaterialId];
    const { credits } = getState().user.user!;
    if (credits < price) throw new Error('You don\'t have enough tokens!');
    const { acquiredStudyMaterials } = getState().studyMaterial;
    acquiredStudyMaterials.push(payload.studyMaterialId);
    return { acquiredStudyMaterials };
  },
);

export const exchangeStudyMaterial = createAsyncThunk<Partial<State>, {
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/exchangeStudyMaterial',
  // TODO
  async () => ({}),
);

export const getStudyMaterialLink = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/getStudyMaterialLink',
  // TODO
  async () => ({}),
);

const studyMaterialSlice = createSlice({
  name: 'studyMaterial',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStudyMaterials.pending, onPending);
    builder.addCase(getStudyMaterials.fulfilled, onUpdate);
    builder.addCase(getStudyMaterials.rejected, (state, action) => onError(state, action, 'Error getting study materials!'));
    builder.addCase(toggleLikeStudyMaterial.pending, onPending);
    builder.addCase(toggleLikeStudyMaterial.fulfilled, onUpdate);
    builder.addCase(toggleLikeStudyMaterial.rejected, (state, action) => onError(state, action, 'Error liking study material!'));
    builder.addCase(buyStudyMaterial.pending, onPending);
    builder.addCase(buyStudyMaterial.fulfilled, onUpdate);
    builder.addCase(buyStudyMaterial.rejected, (state, action) => onError(state, action, 'Error buying study material!'));
    builder.addCase(exchangeStudyMaterial.pending, onPending);
    builder.addCase(exchangeStudyMaterial.fulfilled, onUpdate);
    builder.addCase(exchangeStudyMaterial.rejected, (state, action) => onError(state, action, 'Error trying to exchange study materials!'));
    builder.addCase(getStudyMaterialLink.pending, onPending);
    builder.addCase(getStudyMaterialLink.fulfilled, onUpdate);
    builder.addCase(getStudyMaterialLink.rejected, (state, action) => onError(state, action, 'Error getting study material link!'));
  },
});

export default studyMaterialSlice.reducer;
