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
import clone from '../../utils/clone';
import {
  AddReviewCommentPayload,
  AddReviewPayload,
  FetchStudyMaterialLinkPayload,
  ProposeExchangePayload, PublishStudyMaterialPayload,
  PurchaseStudyMaterialPayload, SettleExchangePayload, ToggleReviewLikePayload,
  ToggleStudyMaterialLikePayload,
} from './ThunkPayload';

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

export const fetchStudyMaterials = createAsyncThunk<Partial<State>,
void, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterials',
  // TODO
  async () => ({}),
);

export const toggleStudyMaterialLike = createAsyncThunk<Partial<State>,
ToggleStudyMaterialLikePayload, ThunkApiConfig>(
  'studyMaterial/toggleStudyMaterialLike',
  async (p, { getState }) => {
    // TODO
    const { studyMaterials } = clone(getState().studyMaterial);
    studyMaterials[p.studyMaterialId].likes += studyMaterials[p.studyMaterialId].hasLiked ? -1 : 1;
    studyMaterials[p.studyMaterialId].hasLiked = !studyMaterials[p.studyMaterialId].hasLiked;
    return { studyMaterials };
  },
);

export const purchaseStudyMaterial = createAsyncThunk<Partial<State>,
PurchaseStudyMaterialPayload, ThunkApiConfig>(
  'studyMaterial/purchaseStudyMaterial',
  async (p, { getState }) => {
    // TODO
    const {
      studyMaterials,
      acquiredStudyMaterials,
    } = clone(getState().studyMaterial);
    const { price } = studyMaterials[p.studyMaterialId];
    const { credits } = getState().user.user!;
    if (credits < price) throw new Error('You don\'t have enough tokens!');
    acquiredStudyMaterials.push(p.studyMaterialId);
    alert('Study Material Purchase', 'Study material successfully acquired.');
    return { acquiredStudyMaterials };
  },
);

export const proposeExchange = createAsyncThunk<Partial<State>,
ProposeExchangePayload, ThunkApiConfig>(
  'studyMaterial/proposeExchange',
  async () => {
    // TODO
    alert('Study Material Exchange', 'Exchange has been successfully proposed.');
    return {};
  },
);

export const fetchStudyMaterialLink = createAsyncThunk<Partial<State>,
FetchStudyMaterialLinkPayload, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterialLink',
  async () => {
    // TODO
    alert('Obtaining Study Material', 'Link copied to clipboard.');
    return {};
  },
);

export const toggleReviewLike = createAsyncThunk<Partial<State>,
ToggleReviewLikePayload, ThunkApiConfig>(
  'studyMaterial/toggleReviewLike',
  async (p, { getState }) => {
    // TODO
    const { studyMaterials } = clone(getState().studyMaterial);
    const review = studyMaterials[p.studyMaterialId].reviews
      .find(({ id }) => id === p.reviewId)!;
    review.likes += review.hasLiked ? -1 : 1;
    review.hasLiked = !review.hasLiked;
    return { studyMaterials };
  },
);

export const addReview = createAsyncThunk<Partial<State>,
AddReviewPayload, ThunkApiConfig>(
  'studyMaterial/addReview',
  async (p, { getState }) => {
    // TODO
    const { studyMaterials } = clone(getState().studyMaterial);
    studyMaterials[p.studyMaterialId].reviews
      .push({
        id: Math.random()
          .toString(),
        review: p.review,
        date: moment()
          .valueOf(),
        comments: [],
        hasLiked: false,
        likes: 0,
        author: getState().user.user!.name,
      });
    return { studyMaterials };
  },
);

export const addReviewComment = createAsyncThunk<Partial<State>,
AddReviewCommentPayload, ThunkApiConfig>(
  'studyMaterial/addReviewComment',
  async (p, { getState }) => {
    // TODO
    const { studyMaterials } = clone(getState().studyMaterial);
    studyMaterials[p.studyMaterialId].reviews
      .find((review) => review.id === p.reviewId)!.comments
      .push({
        id: Math.random()
          .toString(),
        comment: p.comment,
        date: moment()
          .valueOf(),
        author: getState().user.user!.name,
      });
    return { studyMaterials };
  },
);

export const publishStudyMaterial = createAsyncThunk<Partial<State>,
PublishStudyMaterialPayload, ThunkApiConfig>(
  'studyMaterial/publishStudyMaterial',
  async (p, { getState }) => {
    // TODO
    const {
      studyMaterials,
      studyMaterialsCategories,
      uploadedStudyMaterials,
      acquiredStudyMaterials,
    } = clone(getState().studyMaterial);
    const id = Math.random()
      .toString();
    studyMaterials[id] = {
      id,
      authorEmail: getState().user.user!.email,
      author: getState().user.user!.name,
      authorInstitution: getState().user.user!.institution,
      authorRating: getState().user.user!.rating,
      likes: 0,
      hasLiked: false,
      name: p.name,
      description: p.description,
      price: p.price,
      type: p.type,
      reviews: [],
      date: moment()
        .valueOf(),
    };
    p.categories.forEach((category) => {
      if (studyMaterialsCategories[category]) {
        studyMaterialsCategories[category].push(id);
      } else {
        studyMaterialsCategories[category] = [id];
      }
    });
    uploadedStudyMaterials.push(id);
    acquiredStudyMaterials.push(id);
    alert('Upload Study Material', `The study material '${p.name}' has been published.`);
    return {
      studyMaterials,
      studyMaterialsCategories,
      uploadedStudyMaterials,
      acquiredStudyMaterials,
    };
  },
);

export const settleExchange = createAsyncThunk<Partial<State>,
SettleExchangePayload, ThunkApiConfig>(
  'studyMaterial/settleExchange',
  async (p, { getState }) => {
    // TODO
    let {
      studyMaterialsExchanges,
      acquiredStudyMaterials,
    } = clone(getState().studyMaterial);
    const studyMaterialsExchange = studyMaterialsExchanges
      .find(({ id }) => id === p.studyMaterialExchangeId)!;
    studyMaterialsExchanges = studyMaterialsExchanges
      .filter(({ id }) => id !== p.studyMaterialExchangeId);
    if (p.accept) {
      acquiredStudyMaterials = acquiredStudyMaterials
        .filter((id) => id !== studyMaterialsExchange.requesteeStudyMaterialId);
      acquiredStudyMaterials.push(studyMaterialsExchange.requesterStudyMaterialId);
    }
    alert('Study Materials Exchange', `The exchange was successfully ${p.accept ? 'accepted' : 'rejected'}.`);
    return {
      studyMaterialsExchanges,
      acquiredStudyMaterials,
    };
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
    builder.addCase(toggleStudyMaterialLike.fulfilled, onUpdate);
    builder.addCase(toggleStudyMaterialLike.rejected, (state, action) => onError(state, action, 'Error liking a study material!'));
    builder.addCase(purchaseStudyMaterial.pending, onPending);
    builder.addCase(purchaseStudyMaterial.fulfilled, onUpdate);
    builder.addCase(purchaseStudyMaterial.rejected, (state, action) => onError(state, action, 'Error buying a study material!'));
    builder.addCase(proposeExchange.pending, onPending);
    builder.addCase(proposeExchange.fulfilled, onUpdate);
    builder.addCase(proposeExchange.rejected, (state, action) => onError(state, action, 'Error trying to exchange study materials!'));
    builder.addCase(fetchStudyMaterialLink.pending, onPending);
    builder.addCase(fetchStudyMaterialLink.fulfilled, onUpdate);
    builder.addCase(fetchStudyMaterialLink.rejected, (state, action) => onError(state, action, 'Error getting a study material link!'));
    builder.addCase(toggleReviewLike.pending, onPending);
    builder.addCase(toggleReviewLike.fulfilled, onUpdate);
    builder.addCase(toggleReviewLike.rejected, (state, action) => onError(state, action, 'Error liking a study material review!'));
    builder.addCase(addReview.pending, onPending);
    builder.addCase(addReview.fulfilled, onUpdate);
    builder.addCase(addReview.rejected, (state, action) => onError(state, action, 'Error reviewing a study material!'));
    builder.addCase(addReviewComment.pending, onPending);
    builder.addCase(addReviewComment.fulfilled, onUpdate);
    builder.addCase(addReviewComment.rejected, (state, action) => onError(state, action, 'Error responding to a study material review!'));
    builder.addCase(publishStudyMaterial.pending, onPending);
    builder.addCase(publishStudyMaterial.fulfilled, onUpdate);
    builder.addCase(publishStudyMaterial.rejected, (state, action) => onError(state, action, 'Error publishing a study material!'));
    builder.addCase(settleExchange.pending, onPending);
    builder.addCase(settleExchange.fulfilled, onUpdate);
    builder.addCase(settleExchange.rejected, (state, action) => onError(state, action, 'Error settling exchange of study materials!'));
  },
});

export default studyMaterialSlice.reducer;
