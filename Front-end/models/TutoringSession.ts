export default interface TutoringSession {
  id: string
  tutorEmail: string
  tutor: string
  name: string
  description: string
  price: number
  categories: string[]
  location: number[]
  date: Date
  duration: number
}

export interface Enrollment {
  id: string
  requester: string
  tutoringSessionId: string
  status: string
  date: Date
}
