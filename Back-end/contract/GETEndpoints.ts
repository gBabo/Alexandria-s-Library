import StudyMaterial, { StudyMaterialExchange } from '../models/StudyMaterial';
import TutoringSession, { Enrollment } from '../models/TutoringSession';
import User from '../models/User';

// StudyMaterials GET
export interface StudyMaterialsGETResponse {
    studyMaterials: Record<string, StudyMaterial>
    studyMaterialsCategories: Record<string, string[]>
}

// TutoringSessions GET
export interface TutoringSessionsGETResponse {
    tutoringSessions: Record<string, TutoringSession>
    tutoringSessionsCategories: Record<string, string[]>
}

// StudyMaterialsPendingExchanges GET
export interface StudyMaterialsPendingExchangesGETRequest {
    idToken: string
}

export interface StudyMaterialsPendingExchangesGETResponse {
    studyMaterialsExchanges: StudyMaterialExchange[]
}

// AcquiredStudyMaterials GET
export interface AcquiredStudyMaterialsGETRequest {
    idToken: string
}

export interface AcquiredStudyMaterialsGETResponse {
    studyMaterialIds: string
}

// Enrollments GET
export interface EnrollmentsGETRequest {
    idToken: string
}

export interface EnrollmentsGETResponse {
    enrollments: Enrollment[]
}

// User GET
export interface UserGETRequest {
    idToken: string
}

export interface UserGETResponse {
    user: User
}
