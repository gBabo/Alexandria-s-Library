import moment from 'moment';

import TutoringSession, { Enrollment } from '../models/TutoringSession';

export const dummyTutoringSessions: Record<string, TutoringSession> = {
  id1: {
    id: 'id1',
    tutorEmail: 'ricardo.grade@tecnico.ulisboa.pt',
    tutor: 'Ricardo Grade',
    tutorInstitution: 'FCT',
    tutorRating: 3,
    name: 'Algebra Exam',
    description: 'In this session I will prepare you for the Algebra Exam.',
    price: 1,
    location: [30, 30],
    duration: 15,
    date: moment()
      .diff('3', 'day')
      .toLocaleString(),
  },
  id2: {
    id: 'id2',
    tutorEmail: 'sara.f.machado@tecnico.ulisboa.pt',
    tutor: 'Sara Machado',
    tutorInstitution: 'IST',
    tutorRating: 4,
    name: 'Discrete Mathematics Exam',
    description: 'In this session I will prepare you for the Discrete Mathematics Exam.',
    price: 2,
    location: [30, 30],
    duration: 30,
    date: moment()
      .diff('2', 'day')
      .toLocaleString(),
  },
  id3: {
    id: 'id3',
    tutorEmail: 'sara.f.machado@tecnico.ulisboa.pt',
    tutor: 'Sara Machado',
    tutorInstitution: 'IST',
    tutorRating: 4,
    name: 'Calculus Exam',
    description: 'In this session I will prepare you for the Calculus Exam.',
    price: 3,
    location: [30, 30],
    duration: 60,
    date: moment()
      .diff('1', 'day')
      .toLocaleString(),
  },
};

export const dummyTutoringSessionsCategories: Record<string, string[]> = {
  Mathematics: ['id1', 'id2', 'id3'],
  Physics: ['id1', 'id2', 'id3'],
  Chemistry: ['id1', 'id2', 'id3'],
  'Distributed Systems': ['id1', 'id2', 'id3'],
  'Cyber-Security': ['id1', 'id2', 'id3'],
};

export const dummyEnrollments: Enrollment[] = [];
