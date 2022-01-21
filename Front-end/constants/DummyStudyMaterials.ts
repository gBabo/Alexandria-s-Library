import moment from 'moment';

import StudyMaterial, { StudyMaterialExchange } from '../models/StudyMaterial';

export const dummyStudyMaterials: Record<string, StudyMaterial> = {
  id1: {
    id: 'id1',
    authorEmail: 'ricardo.grade@tecnico.ulisboa.pt',
    author: 'Ricardo Grade',
    authorInstitution: 'FCT',
    authorRating: 3,
    likes: 5,
    hasLiked: true,
    name: 'Algebra Exam Exercises',
    description: 'These are the solutions of the Algebra Exam Exercises that I corrected with the help of the Professor.',
    price: 1,
    type: 'Exercises',
    reviews: [{
      id: 'id1',
      author: 'Rafael Figueiredo',
      review: 'This note is very well written!',
      likes: 5,
      hasLiked: false,
      date: moment()
        .subtract('2', 'month')
        .valueOf(),
      comments: [],
    }, {
      id: 'id2',
      author: 'Sara Machado',
      review: 'I didn\'t quite understand the algorithm explained in the last section of this note, could someone enlighten me?',
      likes: 5,
      hasLiked: false,
      date: moment()
        .subtract('1', 'day')
        .valueOf(),
      comments: [{
        id: 'id1',
        author: 'Ricardo Grade',
        comment: 'It is similar to operations performed in Simplex!',
        date: moment()
          .subtract('2', 'day')
          .valueOf(),
      }],
    }],
    date: moment()
      .subtract('3', 'day')
      .valueOf(),
  },
  id2: {
    id: 'id2',
    authorEmail: 'sara.f.machado@tecnico.ulisboa.pt',
    author: 'Sara Machado',
    authorInstitution: 'IST',
    authorRating: 4,
    likes: 10,
    hasLiked: false,
    name: 'Discrete Mathematics Exam Exercises',
    description: 'These are the solutions of the Discrete Mathematics Exam Exercises that I corrected with the help of the Professor.',
    price: 2,
    type: 'Exercises',
    reviews: [],
    date: moment()
      .subtract('2', 'day')
      .valueOf(),
  },
  id3: {
    id: 'id3',
    authorEmail: 'sara.f.machado@tecnico.ulisboa.pt',
    author: 'Sara Machado',
    authorInstitution: 'IST',
    authorRating: 4,
    likes: 15,
    hasLiked: false,
    name: 'Calculus Exam Exercises',
    description: 'These are the solutions of the Calculus Exam Exercises that I corrected with the help of the Professor.',
    price: 3,
    type: 'Exercises',
    reviews: [],
    date: moment()
      .subtract('1', 'day')
      .valueOf(),
  },
};

export const dummyStudyMaterialsCategories: Record<string, string[]> = {
  Mathematics: ['id1', 'id2', 'id3'],
  Physics: ['id1', 'id2', 'id3'],
  Chemistry: ['id1', 'id2', 'id3'],
  'Distributed Systems': ['id1', 'id2', 'id3'],
  'Cyber-Security': ['id1', 'id2', 'id3'],
};

export const dummyStudyMaterialsExchanges: StudyMaterialExchange[] = [{
  id: 'id1',
  requesterName: 'Sara Machado',
  requesterInstitution: 'IST',
  requesterRating: 5,
  requesterStudyMaterialId: 'id1',
  requesteeStudyMaterialId: 'id2',
  date: moment()
    .subtract('1', 'day')
    .valueOf(),
}, {
  id: 'id2',
  requesterName: 'Ricardo Grade',
  requesterInstitution: 'IST',
  requesterRating: 4,
  requesterStudyMaterialId: 'id2',
  requesteeStudyMaterialId: 'id3',
  date: moment()
    .subtract('2', 'day')
    .valueOf(),
}];

export const dummyUploadedStudyMaterials: string[] = ['id1'];

export const dummyAcquiredStudyMaterials: string[] = ['id1'];
