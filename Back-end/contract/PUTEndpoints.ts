// StudyMaterialLike PUT
export interface StudyMaterialLikePUTRequest {
    idToken: string
    studyMaterialId: string
}

// StudyMaterialLike PUT
export interface StudyMaterialReviewLikePUTRequest {
    idToken: string
    studyMaterialReviewId: string
}

// StudyMaterialLike PUT
export interface EnrollmentStatusSettlePUTRequest {
    idToken: string
    enrollmentId: string
    accept: boolean
}

// StudyMaterialLike PUT
export interface StudyMaterialExchangeSettlePUTRequest {
    idToken: string
    studyMaterialExchangeId: string
    accept: boolean
}
