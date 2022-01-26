import { FileInfo } from '../../components/PdfFilePicker';

/* Authentication */

export interface SigninPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
  name: string
  institution: string
}

/* Study Material */

export interface ToggleStudyMaterialLikePayload {
  studyMaterialId: string
}

export interface PurchaseStudyMaterialPayload {
  studyMaterialId: string
}

export interface ProposeExchangePayload {
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
}

export interface FetchStudyMaterialLinkPayload {
  studyMaterialId: string
}

export interface ToggleReviewLikePayload {
  studyMaterialReviewId: string
}

export interface AddReviewPayload {
  studyMaterialId: string
  review: string
}

export interface AddReviewCommentPayload {
  reviewId: string
  comment: string
}

export interface PublishStudyMaterialPayload {
  name: string
  type: string
  categories: string[]
  description: string
  price: number
  fileInfo: FileInfo
}

export interface SettleExchangePayload {
  studyMaterialExchangeId: string
  accept: boolean
}

/* Tutoring */

export interface ScheduleTutoringSessionPayload {
  name: string
  categories: string[]
  description: string
  location: string
  duration: number
  price: number
  date: string
}

export interface EnrollTutoringSessionPayload {
  tutoringSessionId: string
}

export interface OnSettleEnrollmentStatusPayload {
  enrollmentId: string
  accept: boolean
}

export interface OnSettleAllEnrollmentStatusPayload {
  tutoringSessionId: string
  accept: boolean
}

/* User */

export interface SignupUserPayload {
  idToken: string
  email: string
  name: string
  institution: string
}
