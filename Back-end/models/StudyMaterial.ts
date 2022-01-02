export default interface StudyMaterial {
  id: string
  authorEmail: string
  author: string
  name: string
  description: string
  price: number
  categories: string[]
  type: string
  reviews: StudyMaterialReview[]
  date: Date
}

export interface StudyMaterialReview {
  id: string
  author: string
  likes: string
  comments: StudyMaterialReviewComment[]
  date: Date
}

export interface StudyMaterialReviewComment {
  id: string
  author: string
  comment: string
  date: Date
}

export interface StudyMaterialExchange {
  id: string
  requesterName: string
  requesterRating: string
  requesterInstitution: string
  requesterStudyMaterialId: string
  requesteeStudyMaterialId: string
  date: Date
}
