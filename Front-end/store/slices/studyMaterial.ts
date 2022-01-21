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

export const fetchStudyMaterials = createAsyncThunk<Partial<State>, void, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterials',
  // TODO
  async () => ({}),
);

export const toggleStudyMaterialLike = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/toggleStudyMaterialLike',
  // TODO
  async ({ studyMaterialId }, { getState }) => {
    const {
      studyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    studyMaterials[studyMaterialId].likes += studyMaterials[studyMaterialId].hasLiked ? -1 : 1;
    studyMaterials[studyMaterialId].hasLiked = !studyMaterials[studyMaterialId].hasLiked;
    return { studyMaterials };
  },
);

export const purchaseStudyMaterial = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/purchaseStudyMaterial',
  // TODO
  async ({ studyMaterialId }, { getState }) => {
    const {
      studyMaterials,
      acquiredStudyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    const { price } = studyMaterials[studyMaterialId];
    const { credits } = getState().user.user!;
    if (credits < price) throw new Error('You don\'t have enough tokens!');
    acquiredStudyMaterials.push(studyMaterialId);
    alert('Study Material Purchase', 'Study material successfully acquired.');
    return { acquiredStudyMaterials };
  },
);

export const proposeExchange = createAsyncThunk<Partial<State>, {
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/proposeExchange',
  // TODO
  async () => {
    alert('Study Material Exchange', 'Exchange has been successfully proposed.');
    return {};
  },
);

export const fetchStudyMaterialLink = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
}, ThunkApiConfig>(
  'studyMaterial/fetchStudyMaterialLink',
  // TODO
  async () => {
    alert('Obtaining Study Material', 'Link copied to clipboard.');
    return {};
  },
);

export const toggleReviewLike = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  reviewId: string
}, ThunkApiConfig>(
  'studyMaterial/toggleReviewLike',
  // TODO
  async ({
    studyMaterialId,
    reviewId,
  }, { getState }) => {
    const {
      studyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    const review = studyMaterials[studyMaterialId].reviews
      .find(({ id }) => id === reviewId)!;
    review.likes += review.hasLiked ? -1 : 1;
    review.hasLiked = !review.hasLiked;
    return { studyMaterials };
  },
);

export const addReview = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  review: string
}, ThunkApiConfig>(
  'studyMaterial/addReview',
  // TODO
  async ({
    studyMaterialId,
    review,
  }, { getState }) => {
    const {
      studyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    studyMaterials[studyMaterialId].reviews
      .push({
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
    return { studyMaterials };
  },
);

export const addReviewComment = createAsyncThunk<Partial<State>, {
  studyMaterialId: string
  reviewId: string
  comment: string
}, ThunkApiConfig>(
  'studyMaterial/addReviewComment',
  // TODO
  async ({
    studyMaterialId,
    reviewId,
    comment,
  }, { getState }) => {
    const {
      studyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    studyMaterials[studyMaterialId].reviews
      .find((review) => review.id === reviewId)!.comments
      .push({
        id: Math.random()
          .toString(),
        comment,
        date: moment()
          .valueOf(),
        author: getState().user.user!.name,
      });
    return { studyMaterials };
  },
);

export const publishStudyMaterial = createAsyncThunk<Partial<State>, {
  name: string
  type: string
  categories: string[]
  description: string
  price: number
  fileUri: string
}, ThunkApiConfig>(
  'studyMaterial/publishStudyMaterial',
  // TODO
  async ({
    name,
    type,
    categories,
    description,
    price,
    fileUri,
  }, { getState }) => {
    // eslint-disable-next-line no-console
    console.log(fileUri);
    const id = Math.random()
      .toString();
    const {
      studyMaterials,
      studyMaterialsCategories,
      uploadedStudyMaterials,
      acquiredStudyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    studyMaterials[id] = {
      id,
      authorEmail: getState().user.user!.email,
      author: getState().user.user!.name,
      authorInstitution: getState().user.user!.institution,
      authorRating: getState().user.user!.rating,
      likes: 0,
      hasLiked: false,
      name,
      description,
      price,
      type,
      reviews: [],
      date: moment()
        .valueOf(),
    };
    categories.forEach((category) => {
      if (studyMaterialsCategories[category]) {
        studyMaterialsCategories[category].push(id);
      } else {
        studyMaterialsCategories[category] = [id];
      }
    });
    uploadedStudyMaterials.push(id);
    acquiredStudyMaterials.push(id);
    alert('Upload Study Material', `The study material '${name}' has been published.`);
    return {
      studyMaterials,
      studyMaterialsCategories,
      uploadedStudyMaterials,
      acquiredStudyMaterials,
    };
  },
);

export const settleExchange = createAsyncThunk<Partial<State>, {
  studyMaterialExchangeId: string
  accept: boolean
}, ThunkApiConfig>(
  'studyMaterial/settleExchange',
  // TODO
  async ({
    studyMaterialExchangeId,
    accept,
  }, { getState }) => {
    let {
      studyMaterialsExchanges,
      acquiredStudyMaterials,
    }: State = JSON.parse(JSON.stringify(getState().studyMaterial));
    const studyMaterialsExchange = studyMaterialsExchanges
      .find(({ id }) => id === studyMaterialExchangeId)!;
    studyMaterialsExchanges = studyMaterialsExchanges
      .filter(({ id }) => id !== studyMaterialExchangeId);
    if (accept) {
      acquiredStudyMaterials = acquiredStudyMaterials
        .filter((id) => id !== studyMaterialsExchange.requesteeStudyMaterialId);
      acquiredStudyMaterials.push(studyMaterialsExchange.requesterStudyMaterialId);
    }
    alert('Study Materials Exchange', `The exchange was successfully ${accept ? 'accepted' : 'rejected'}.`);
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
