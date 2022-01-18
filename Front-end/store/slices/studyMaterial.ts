import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import StudyMaterial, { StudyMaterialExchange } from '../../models/StudyMaterial';
import {
  studyMaterials,
  studyMaterialsCategories,
  studyMaterialsExchanges,
} from '../../constants/DummyStudyMaterials';
import { ThunkApiConfig } from '../index';
import { onError, onPending, onUpdate } from '../../utils/ThunkActions';

interface State {
  studyMaterials: Record<string, StudyMaterial>
  studyMaterialsCategories: Record<string, string[]>
  studyMaterialsExchanges: StudyMaterialExchange[]
  isLoading: boolean
}

const initialState: State = {
  studyMaterials,
  studyMaterialsCategories,
  studyMaterialsExchanges,
  isLoading: false,
};

export const getStudyMaterials = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'studyMaterial/getStudyMaterials',
  // TODO
  async () => ({})
  ,
);

const studyMaterialSlice = createSlice({
  name: 'studyMaterial',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStudyMaterials.pending, onPending);
    builder.addCase(getStudyMaterials.fulfilled, onUpdate);
    builder.addCase(getStudyMaterials.rejected, (state, action) => onError(state, action, 'Error getting study materials!'));
  },
});

export default studyMaterialSlice.reducer;
