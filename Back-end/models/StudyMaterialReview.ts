export interface StudyMaterialReviewComment {
    id: string
    author: string
    comment: string
    date: Date
}
export interface StudyMaterialReview {
    id: string
    author: string
    likes: string
    review: string
    hasLiked: boolean
    comments: StudyMaterialReviewComment[]
    date: Date
}
