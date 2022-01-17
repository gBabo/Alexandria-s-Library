import StudyMaterial, { StudyMaterialExchange } from '../models/StudyMaterial';
import TutoringSession, { Enrollment } from '../models/TutoringSession';
import User from '../models/User';

// StudyMaterials GET
export interface StudyMaterialsGETRequest {
    idToken: string | undefined
}

export interface StudyMaterialsGETResponse {
    studyMaterials: Record<string, StudyMaterial>
    studyMaterialsCategories: Record<string, string[]>
    uploaded: string[],
    acquired: string[]
}

// TutoringSessions GET
export interface TutoringSessionsGetRequest {
    idToken: string | undefined
}

export interface TutoringSessionsGETResponse {
    tutoringSessions: Record<string, TutoringSession>
    tutoringSessionsCategories: Record<string, string[]>
    created: string[],
}

// StudyMaterialsPendingExchanges GET
export interface StudyMaterialsPendingExchangesGETRequest {
    idToken: string
}

export interface StudyMaterialsPendingExchangesGETResponse {
    studyMaterialsExchanges: StudyMaterialExchange[]
}

// My Enrollments GET
export interface MyEnrollmentsGETRequest {
    idToken: string
}

export interface MyEnrollmentsGETResponse {
    enrollments: Enrollment[]
}

// User GET
export interface UserGETRequest {
    idToken: string
}

export interface UserGETResponse {
    user: User
}
