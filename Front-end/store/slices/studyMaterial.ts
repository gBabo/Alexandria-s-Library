import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

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
import alert from '../../utils/alert';

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
  async ({ studyMaterialId }, { getState }) => {
    const studyMaterials = { ...getState().studyMaterial.studyMaterials };
    const studyMaterial = { ...studyMaterials[studyMaterialId] };
    studyMaterial.likes += studyMaterial.hasLiked ? -1 : 1;
    studyMaterial.hasLiked = !studyMaterial.hasLiked;
    studyMaterials[studyMaterialId] = studyMaterial;
    return { studyMaterials };
  },
);

export const buyStudyMaterial = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/buyStudyMaterial',
  // TODO
  async ({ studyMaterialId }, { getState }) => {
    const { price } = getState().studyMaterial.studyMaterials[studyMaterialId];
    const { credits } = getState().user.user!;
    if (credits < price) throw new Error('You don\'t have enough tokens!');
    const acquiredStudyMaterials = [...getState().studyMaterial.acquiredStudyMaterials];
    acquiredStudyMaterials.push(studyMaterialId);
    alert('Study Material Purchase', 'Study material successfully acquired.');
    return { acquiredStudyMaterials };
  },
);

export const exchangeStudyMaterial = createAsyncThunk<Partial<State>, {
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/exchangeStudyMaterial',
  // TODO
  async () => {
    alert('Study Material Exchange', 'Exchange has been successfully proposed.');
    return {};
  },
);

export const getStudyMaterialLink = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/getStudyMaterialLink',
  // TODO
  async () => {
    alert('Obtaining Study Material', 'Link copied to clipboard.');
    return {};
  },
);

export const toggleLikeStudyMaterialReview = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  reviewId: string
}, ThunkApiConfig>(
  'studyMaterial/toggleLikeStudyMaterialReview',
  // TODO
  async ({
    studyMaterialId,
    reviewId,
  }, { getState }) => {
    const studyMaterials = { ...getState().studyMaterial.studyMaterials };
    const studyMaterial = { ...studyMaterials[studyMaterialId] };
    const reviewIndex = studyMaterial.reviews.findIndex((review) => review.id === reviewId);
    const reviews = [...studyMaterial.reviews];
    const review = { ...reviews[reviewIndex] };
    review.likes += review.hasLiked ? -1 : 1;
    review.hasLiked = !review.hasLiked;
    reviews[reviewIndex] = review;
    studyMaterial.reviews = reviews;
    studyMaterials[studyMaterialId] = studyMaterial;
    return { studyMaterials };
  },
);

export const newStudyMaterialReview = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  review: string
}, ThunkApiConfig>(
  'studyMaterial/newStudyMaterialReview',
  // TODO
  async ({
    studyMaterialId,
    review,
  }, { getState }) => {
    const studyMaterials = { ...getState().studyMaterial.studyMaterials };
    const studyMaterial = { ...studyMaterials[studyMaterialId] };
    const reviews = [...studyMaterial.reviews];
    reviews.push({
      id: Math.random()
        .toString(),
      review,
      date: moment()
        .valueOf(),
      comments: [],
      hasLiked: false,
      likes: 0,
      author: getState().user.user!.name,
    });
    studyMaterial.reviews = reviews;
    studyMaterials[studyMaterialId] = studyMaterial;
    return { studyMaterials };
  },
);

export const newStudyMaterialReviewComment = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  reviewId: string
  comment: string
}, ThunkApiConfig>(
  'studyMaterial/newStudyMaterialReviewComment',
  // TODO
  async ({
    studyMaterialId,
    reviewId,
    comment,
  }, { getState }) => {
    const studyMaterials = { ...getState().studyMaterial.studyMaterials };
    const studyMaterial = { ...studyMaterials[studyMaterialId] };
    const reviewIndex = studyMaterial.reviews.findIndex((review) => review.id === reviewId);
    const reviews = [...studyMaterial.reviews];
    const review = { ...reviews[reviewIndex] };
    const comments = [...review.comments];
    comments.push({
      id: Math.random()
        .toString(),
      comment,
      date: moment()
        .valueOf(),
      author: getState().user.user!.name,
    });
    review.comments = comments;
    reviews[reviewIndex] = review;
    studyMaterial.reviews = reviews;
    studyMaterials[studyMaterialId] = studyMaterial;
    return { studyMaterials };
  },
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
    builder.addCase(toggleLikeStudyMaterial.rejected, (state, action) => onError(state, action, 'Error liking a study material!'));
    builder.addCase(buyStudyMaterial.pending, onPending);
    builder.addCase(buyStudyMaterial.fulfilled, onUpdate);
    builder.addCase(buyStudyMaterial.rejected, (state, action) => onError(state, action, 'Error buying a study material!'));
    builder.addCase(exchangeStudyMaterial.pending, onPending);
    builder.addCase(exchangeStudyMaterial.fulfilled, onUpdate);
    builder.addCase(exchangeStudyMaterial.rejected, (state, action) => onError(state, action, 'Error trying to exchange study materials!'));
    builder.addCase(getStudyMaterialLink.pending, onPending);
    builder.addCase(getStudyMaterialLink.fulfilled, onUpdate);
    builder.addCase(getStudyMaterialLink.rejected, (state, action) => onError(state, action, 'Error getting a study material link!'));
    builder.addCase(toggleLikeStudyMaterialReview.pending, onPending);
    builder.addCase(toggleLikeStudyMaterialReview.fulfilled, onUpdate);
    builder.addCase(toggleLikeStudyMaterialReview.rejected, (state, action) => onError(state, action, 'Error liking a study material review!'));
    builder.addCase(newStudyMaterialReview.pending, onPending);
    builder.addCase(newStudyMaterialReview.fulfilled, onUpdate);
    builder.addCase(newStudyMaterialReview.rejected, (state, action) => onError(state, action, 'Error reviewing a study material!'));
    builder.addCase(newStudyMaterialReviewComment.pending, onPending);
    builder.addCase(newStudyMaterialReviewComment.fulfilled, onUpdate);
    builder.addCase(newStudyMaterialReviewComment.rejected, (state, action) => onError(state, action, 'Error responding to a study material review!'));
  },
});

export default studyMaterialSlice.reducer;
