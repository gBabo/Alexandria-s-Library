/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
    }
  }
}

export type RootStackParamList = {
  Drawer: undefined;
  Browse: undefined;
};

export type DrawerParamList = {
  Profile: undefined;
  SM_Store: undefined;
  SM_Exchanges: undefined;
  SM_Acquired: undefined;
  SM_Uploaded: undefined;
  T_Store: undefined;
  T_Enrolled: undefined;
  T_Scheduled: undefined;
  A_Login: undefined;
  A_Logout: undefined;
};

export type SMStoreStackParamList = {
  Store: undefined;
  CategoryStore: { category: string };
  StudyMaterial: { id: string };
  Discussion: { studyMaterialId: string };
  DiscussionComments: { studyMaterialId: string, reviewId: string };
};

export type SMExchangesStackParamList = {
  Exchanges: undefined;
  StudyMaterial: { id: string };
};

export type SMAcquiredStackParamList = {
  Acquired: undefined;
  StudyMaterial: { id: string };
  Discussion: { studyMaterialId: string };
  DiscussionComments: { studyMaterialId: string, reviewId: string };
};

export type SMUploadedStackParamList = {
  Uploaded: undefined;
  StudyMaterial: { id: string };
  Discussion: { studyMaterialId: string };
  DiscussionComments: { studyMaterialId: string, reviewId: string };
  Upload: undefined;
};

export type TStoreStackParamList = {
  Store: undefined;
  CategoryStore: { category: string };
  TutoringSession: { id: string };
};

export type TEnrolledStackParamList = {
  Enrolled: undefined;
  TutoringSession: { id: string };
};

export type TScheduledStackParamList = {
  Scheduled: undefined;
  Schedule: undefined;
  TutoringSession: { id: string };
};

export type LoginStackParamList = {
  Login: undefined
  Register: { email: string, password: string }
};

export type RootStackProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;

export type ProfileScreenProps = DrawerScreenProps<DrawerParamList, 'Profile'>;

export type SMStoreStackScreenProps<Screen extends keyof SMStoreStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<SMStoreStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'SM_Store'>>;

export type SMExchangesStackScreenProps<Screen extends keyof SMExchangesStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<SMExchangesStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'SM_Exchanges'>>;

export type SMAcquiredStackScreenProps<Screen extends keyof SMAcquiredStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<SMAcquiredStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'SM_Acquired'>>;

export type SMUploadedStackScreenProps<Screen extends keyof SMUploadedStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<SMUploadedStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'SM_Uploaded'>>;

export type TStoreStackScreenProps<Screen extends keyof TStoreStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<TStoreStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'T_Store'>>;

export type TEnrolledStackScreenProps<Screen extends keyof TEnrolledStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<TEnrolledStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'T_Enrolled'>>;

export type TScheduledStackScreenProps<Screen extends keyof TScheduledStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<TScheduledStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'T_Scheduled'>>;

export type LoginStackScreenProps<Screen extends keyof LoginStackParamList> =
    CompositeScreenProps<NativeStackScreenProps<LoginStackParamList, Screen>,
    DrawerScreenProps<DrawerParamList, 'A_Login'>>;

export type LogoutScreenProps = DrawerScreenProps<DrawerParamList, 'A_Logout'>;
