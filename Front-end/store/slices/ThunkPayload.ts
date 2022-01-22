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
  studyMaterialId: string
  reviewId: string
}

export interface AddReviewPayload {
  studyMaterialId: string
  review: string
}

export interface AddReviewCommentPayload {
  studyMaterialId: string
  reviewId: string
  comment: string
}

export interface PublishStudyMaterialPayload {
  name: string
  type: string
  categories: string[]
  description: string
  price: number
  fileUri: string
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
  date: number
}

export interface EnrollTutoringSessionPayload {
  tutoringSessionId: string
}

export interface CancelTutoringSessionPayload {
  tutoringSessionId: string
}

export interface OnSettleEnrollmentStatusPayload {
  tutoringSessionId: string
  enrollIndex: number
  accept: boolean
}

export interface OnSettleAllEnrollmentStatusPayload {
  tutoringSessionId: string
  accept: boolean
}
