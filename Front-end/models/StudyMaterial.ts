export default interface StudyMaterial {
  id: string
  authorEmail: string
  author: string
  authorInstitution: string
  authorRating: number
  likes: number
  name: string
  description: string
  price: number
  type: string
  reviews: StudyMaterialReview[]
  date: string
}

export interface StudyMaterialReview {
  id: string
  author: string
  likes: string
  comments: StudyMaterialReviewComment[]
  date: string
}

export interface StudyMaterialReviewComment {
  id: string
  author: string
  comment: string
  date: string
}

export interface StudyMaterialExchange {
  id: string
  requesterName: string
  requesterRating: string
  requesterInstitution: string
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
  date: string
}
