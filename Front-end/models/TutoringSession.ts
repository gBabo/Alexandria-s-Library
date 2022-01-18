export default interface TutoringSession {
  id: string
  tutorEmail: string
  tutor: string
  tutorInstitution: string
  tutorRating: number
  name: string
  description: string
  price: number
  location: number[]
  duration: number
  date: string
}

export interface Enrollment {
  id: string
  requester: string
  tutoringSessionId: string
  status: string
  date: string
}
