import StudyMaterialReview from './StudyMaterialReview';

export default interface StudyMaterial {
    id: string
    authorEmail: string
    author: string
    authorRating: number
    authorInstitution: string
    name: string
    description: string
    price: number
    type: string
    likes: number
    hasLiked: boolean
    reviews: StudyMaterialReview[]
    date: string
}

export interface StudyMaterialExchange {
    id: string
    requesterName: string
    requesterRating: number
    requesterInstitution: string
    requesterStudyMaterialId: string
    requesteeStudyMaterialId: string
    date: string
}
