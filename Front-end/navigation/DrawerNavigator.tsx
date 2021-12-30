import * as React from 'react';
import {
  ComponentProps, Dispatch, SetStateAction, useState,
} from 'react';
import { View } from 'react-native';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/src/types';
import { FontAwesome5 } from '@expo/vector-icons';

import { DrawerParamList } from './types';
import Colors from '../constants/Colors';
import useAppSelector from '../hooks/useAppSelector';
import { SemiBoldText } from '../components/UI/StyledText';
import VerticalDivider from '../components/UI/VerticalDivider';
import {
  SMAcquiredNavigator,
  SMExchangesNavigator,
  SMStoreNavigator,
  SMUploadedNavigator,
} from './StudyMaterialNavigator';
import {
  TEnrolledNavigator,
  TScheduledNavigator,
  TStoreNavigator,
} from './TutoringNavigator';
import ProfileScreen from '../screens/User/ProfileScreen';
import LogoutScreen from '../screens/User/LogoutScreen';
import LoginNavigator from './LoginNavigator';

const expandables = {
  SM: {
    drawerLabel: 'Study Materials',
    iconName: 'book',
  },
  T: {
    drawerLabel: 'Tutoring',
    iconName: 'chalkboard-teacher',
  },
};

const screens = {
  SM_Store: {
    drawerLabel: 'Store',
    headerTitle: 'Study Materials Store',
    iconName: 'store',
    component: SMStoreNavigator,
  },
  SM_Exchanges: {
    drawerLabel: 'Exchanges',
    headerTitle: 'Study Materials Exchanges',
    iconName: 'exchange-alt',
    component: SMExchangesNavigator,
  },
  SM_Acquired: {
    drawerLabel: 'Acquired',
    headerTitle: 'Acquired Study Materials',
    iconName: 'bookmark',
    component: SMAcquiredNavigator,
  },
  SM_Uploaded: {
    drawerLabel: 'Uploaded',
    headerTitle: 'Uploaded Study Materials',
    iconName: 'file-upload',
    component: SMUploadedNavigator,
  },
  T_Store: {
    drawerLabel: 'Store',
    headerTitle: 'Tutoring Sessions Store',
    iconName: 'store',
    component: TStoreNavigator,
  },
  T_Enrolled: {
    drawerLabel: 'Enrolled',
    headerTitle: 'Tutoring Sessions Enrollments',
    iconName: 'handshake',
    component: TEnrolledNavigator,
  },
  T_Scheduled: {
    drawerLabel: 'Scheduled',
    headerTitle: 'Scheduled Tutoring Sessions',
    iconName: 'calendar-alt',
    component: TScheduledNavigator,
  },
  U_Profile: {
    drawerLabel: 'Profile',
    headerTitle: 'Profile',
    iconName: 'user-alt',
    component: ProfileScreen,
  },
  U_Logout: {
    drawerLabel: 'Logout',
    headerTitle: 'Logout',
    iconName: 'sign-out-alt',
    component: LogoutScreen,
  },
  U_Login: {
    drawerLabel: 'Login',
    headerTitle: 'Login',
    iconName: 'sign-in-alt',
    component: LoginNavigator,
  },
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: Colors.primary },
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { fontFamily: 'OpenSans-SemiBold' },
        headerTintColor: Colors.accent,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {Object.entries(screens)
        .map(([name, screen], index) => (
          <Drawer.Screen
            key={index.toString()}
            name={name as keyof DrawerParamList}
            component={screen.component}
            options={{ headerTitle: screen.headerTitle }}
          />
        ))}
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const localId = useAppSelector(({ authentication }) => authentication.localId);
  const focusedLabelState = useState('SM_Store');
  const isExpandedState = {
    SM: useState(false),
    T: useState(false),
  };

  return (
    <DrawerContentScrollView contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'space-between',
      marginVertical: 5,
    }}
    >
      <View>
        <View style={{
          alignItems: 'center',
          marginVertical: 20,
        }}
        >
          <SemiBoldText style={{
            fontSize: 24,
            color: Colors.accent,
          }}
          >
            Library of Alexandria
          </SemiBoldText>
        </View>
        <VerticalDivider />
        {localId && (
        <CustomDrawerItem
          name="U_Profile"
          focusedLabelState={focusedLabelState}
          navigation={navigation}
        />
        )}
        <VerticalDivider />
        <CustomExpandableDrawerItem name="SM" isExpandedState={isExpandedState.SM} />
        {isExpandedState.SM[0] && !localId && (
        <CustomDrawerItem
          name="SM_Store"
          focusedLabelState={focusedLabelState}
          navigation={navigation}
        />
        )}
        {isExpandedState.SM[0] && localId && Object.keys(screens)
          .filter((name) => name.startsWith('SM_'))
          .map((name) => (
            <CustomDrawerItem
              key={name}
              name={name as keyof DrawerParamList}
              focusedLabelState={focusedLabelState}
              navigation={navigation}
            />
          ))}
        <VerticalDivider />
        <CustomExpandableDrawerItem name="T" isExpandedState={isExpandedState.T} />
        {isExpandedState.T[0] && !localId && (
        <CustomDrawerItem
          name="T_Store"
          focusedLabelState={focusedLabelState}
          navigation={navigation}
        />
        )}
        {isExpandedState.T[0] && localId && Object.keys(screens)
          .filter((name) => name.startsWith('T_'))
          .map((name) => (
            <CustomDrawerItem
              key={name}
              name={name as keyof DrawerParamList}
              focusedLabelState={focusedLabelState}
              navigation={navigation}
            />
          ))}
        <VerticalDivider />
      </View>
      <View>
        <VerticalDivider />
        <CustomDrawerItem
          name={localId ? 'U_Logout' : 'U_Login'}
          focusedLabelState={focusedLabelState}
          navigation={navigation}
          inactiveBackgroundColor={localId ? Colors.error : Colors.info}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function CustomDrawerItem({
  name,
  focusedLabelState,
  navigation,
  inactiveBackgroundColor,
}: {
  name: keyof DrawerParamList,
  focusedLabelState: [string, Dispatch<SetStateAction<string>>]
  navigation: DrawerNavigationHelpers,
  inactiveBackgroundColor?: string
}) {
  const [focusedLabel, setFocusedLabel] = focusedLabelState;

  return (
    <DrawerItem
      label={screens[name].drawerLabel}
      icon={drawerIcon(screens[name].iconName)}
      onPress={() => {
        navigation.navigate(name);
        setFocusedLabel(name);
      }}
      activeBackgroundColor={Colors.accent}
      activeTintColor={Colors.primary}
      inactiveBackgroundColor={inactiveBackgroundColor || Colors.secondary}
      inactiveTintColor={Colors.background}
      labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      focused={name === focusedLabel}
    />
  );
}

const drawerIcon = (name: ComponentProps<typeof FontAwesome5>['name']) => (
  ({ color }: { color: string }) => (
    <FontAwesome5 name={name} color={color} size={24} />
  )
);

function CustomExpandableDrawerItem({
  name,
  isExpandedState,
}: {
  name: 'SM' | 'T',
  isExpandedState: [boolean, Dispatch<SetStateAction<boolean>>]
}) {
  const [isExpanded, setIsExpanded] = isExpandedState;

  return (
    <DrawerItem
      label={expandableLabel(expandables[name].drawerLabel, isExpanded)}
      icon={drawerIcon(expandables[name].iconName)}
      onPress={() => setIsExpanded((v) => !v)}
      activeBackgroundColor={Colors.info}
      activeTintColor={Colors.background}
      inactiveBackgroundColor={Colors.secondary}
      inactiveTintColor={Colors.background}
      labelStyle={{ fontFamily: 'OpenSans-SemiBold' }}
      focused={isExpanded}
    />
  );
}

const expandableLabel = (label: string, isExpanded: boolean) => (
  ({ color }: { color: string }) => (
    <View style={{
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    }}
    >
      <SemiBoldText style={{ color }}>{label}</SemiBoldText>
      <FontAwesome5
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        color={color}
        size={18}
      />
    </View>
  )
);
