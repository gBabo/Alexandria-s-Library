export default interface TutoringSession {
  id: string
  tutorEmail: string
  tutor: string
  tutorRating: number,
  tutorInstitution: string,
  name: string
  description: string
  price: number
  location: number[]
  date: number
  duration: number
  enrolled: UserEnroll[],
  pendingEnrolls: UserEnroll[],
}

export interface UserEnroll {
  email: string,
  name: string,
}

export interface Enrollment {
  id: string
  requester: string
  tutoringSessionId: string
  status: string
  date: number
}
