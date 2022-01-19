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
    reviews: [],
    date: moment()
      .diff('3', 'day')
      .toLocaleString(),
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
      .diff('2', 'day')
      .toLocaleString(),
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
      .diff('1', 'day')
      .toLocaleString(),
  },
};

export const dummyStudyMaterialsCategories: Record<string, string[]> = {
  Mathematics: ['id1', 'id2', 'id3'],
  Physics: ['id1', 'id2', 'id3'],
  Chemistry: ['id1', 'id2', 'id3'],
  'Distributed Systems': ['id1', 'id2', 'id3'],
  'Cyber-Security': ['id1', 'id2', 'id3'],
};

export const dummyStudyMaterialsExchanges: StudyMaterialExchange[] = [];

export const dummyUploadedStudyMaterials: string[] = ['id1'];

export const dummyAcquiredStudyMaterials: string[] = ['id1'];
