/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
    }
  }
}

export type RootStackParamList = {
  Drawer: NavigatorScreenParams<DrawerParamList>
};

export type DrawerParamList = {
  Profile: undefined;
  SM_Store: NavigatorScreenParams<SMStoreStackParamList>;
  SM_Exchanges: NavigatorScreenParams<SMExchangesStackParamList>;
  SM_Acquired: NavigatorScreenParams<SMAcquiredStackParamList>;
  SM_Uploaded: NavigatorScreenParams<SMUploadedStackParamList>;
  T_Store: NavigatorScreenParams<TStoreStackParamList>;
  T_Enrolled: NavigatorScreenParams<TEnrolledStackParamList>;
  T_Scheduled: NavigatorScreenParams<TScheduledStackParamList>;
  A_Login: NavigatorScreenParams<LoginStackParamList>;
  A_Logout: undefined;
};

export type SMStoreStackParamList = {
  Store: undefined;
};

export type SMExchangesStackParamList = {
  Exchanges: undefined;
};

export type SMAcquiredStackParamList = {
  Acquired: undefined;
};

export type SMUploadedStackParamList = {
  Uploaded: undefined;
};

export type TStoreStackParamList = {
  Store: undefined;
};

export type TEnrolledStackParamList = {
  Enrolled: undefined;
};

export type TScheduledStackParamList = {
  Scheduled: undefined;
};

export type LoginStackParamList = {
  Login: undefined
  Register: undefined
};

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
