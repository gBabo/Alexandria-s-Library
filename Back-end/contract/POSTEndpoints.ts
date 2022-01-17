// Register POST
export interface RegisterPOSTRequest {
  idToken: string
  email: string
  name: string
  institution: string
}

// RegisterPushNotification POST
export interface RegisterPushNotificationPOSTRequest {
  idToken: string
  pushNotificationToken: string
}

// StudyMaterial POST
export interface StudyMaterialPOSTRequest {
  idToken: string
  name: string
  description: string
  price: number
  categories: string[]
  type: string
  file: File
}

export interface StudyMaterialPOSTResponse {
  studyMaterialId: string
  date: Date
}

// TutoringSession POST
export interface TutoringSessionPOSTRequest {
  idToken: string
  name: string
  description: string
  price: number
  categories: string[]
  location: number[]
  date: Date
  duration: number
}

export interface TutoringSessionPOSTResponse {
  tutoringSessionId: string
}

// StudyMaterialReview POST
export interface StudyMaterialReviewPOSTRequest {
  idToken: string
  studyMaterialId: string
  review: string
}

export interface StudyMaterialReviewPOSTResponse {
  reviewId: string
  date: Date
}

// StudyMaterialReviewComment POST
export interface StudyMaterialReviewCommentPOSTRequest {
  idToken: string
  reviewId: string
  comment: string
}

export interface StudyMaterialReviewCommentPOSTResponse {
  reviewCommentId: string
  date: Date
}

// StudyMaterialPurchase POST
export interface StudyMaterialPurchasePOSTRequest {
  idToken: string
  studyMaterialId: string
}

// StudyMaterialExchange POST
export interface StudyMaterialExchangePOSTRequest {
  idToken: string
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
  requesteeStudyMaterialAuthor: string
}

export interface StudyMaterialExchangePOSTResponse {
  studyMaterialExchangeId: string
  date: Date
}

// TutoringSessionEnrollment POST
export interface TutoringSessionEnrollmentPOSTRequest {
  idToken: string
  tutoringSessionId: string
}

export interface TutoringSessionEnrollmentPOSTResponse {
  enrollmentId: string
  date: Date
}
