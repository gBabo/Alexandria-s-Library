export interface UserEnroll {
  email: string,
  name: string,
}

export default interface TutoringSession {
  id: string
  tutorEmail: string
  tutor: string
  tutorRating: string,
  tutorInstitution: string,
  name: string
  description: string
  price: number
  location: string
  date: string
  duration: number
  enrolled: UserEnroll[],
  pendingEnrolls: UserEnroll[],
}

export interface Enrollment {
  id: string
  requester: string
  tutoringSessionId: string
  status: string
  date: string
}
