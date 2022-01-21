import moment from 'moment';

import TutoringSession, { Enrollment, EnrollmentStatus } from '../models/TutoringSession';

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
    location: 'IST da Alameda, Civil Pavilion, Room 5',
    duration: 15,
    date: moment()
      .subtract('3', 'day')
      .valueOf(),
    pendingEnrolls: [],
    enrolled: [],
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
    location: 'IST da Alameda, Civil Pavilion, Room 5',
    duration: 30,
    date: moment()
      .subtract('2', 'day')
      .valueOf(),
    pendingEnrolls: [],
    enrolled: [],
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
    location: 'IST da Alameda, Civil Pavilion, Room 5',
    duration: 60,
    date: moment()
      .subtract('1', 'day')
      .valueOf(),
    pendingEnrolls: [],
    enrolled: [],
  },
};

export const dummyTutoringSessionsCategories: Record<string, string[]> = {
  Mathematics: ['id1', 'id2', 'id3'],
  Physics: ['id1', 'id2', 'id3'],
  Chemistry: ['id1', 'id2', 'id3'],
  'Distributed Systems': ['id1', 'id2', 'id3'],
  'Cyber-Security': ['id1', 'id2', 'id3'],
};

export const dummyEnrollments: Enrollment[] = [{
  id: 'id1',
  tutoringSessionId: 'id1',
  requester: 'Sara Machado',
  status: EnrollmentStatus.PENDING,
  date: moment()
    .add('1', 'day')
    .valueOf(),
}, {
  id: 'id2',
  tutoringSessionId: 'id2',
  requester: 'Ricardo Grade',
  status: EnrollmentStatus.CONFIRMED,
  date: moment()
    .add('2', 'day')
    .valueOf(),
}, {
  id: 'id3',
  tutoringSessionId: 'id2',
  requester: 'Sara Machado',
  status: EnrollmentStatus.REJECTED,
  date: moment()
    .add('3', 'day')
    .valueOf(),
}];
