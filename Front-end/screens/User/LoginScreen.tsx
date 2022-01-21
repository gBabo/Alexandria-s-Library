import * as React from 'react';
import {
  RefObject, useCallback, useLayoutEffect, useRef,
} from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { mapValues, pick } from 'lodash';

import { LoginStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { View } from '../../components/UI/Themed';
import { SemiBoldText } from '../../components/UI/StyledText';
import CustomButton from '../../components/UI/CustomButton';
import Input from '../../components/UI/Input';
import Loading from '../../components/UI/Loading';
import useFormReducer, { FormActionType } from '../../hooks/useFormReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  LoginAction, LoginPayload, signin, signup,
} from '../../store/slices/authentication';
import alert from '../../utils/alert';

type Label = 'email' | 'password';

export default function LoginScreen({ navigation }: LoginStackScreenProps<'Login'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(({ authentication }) => authentication.isLoading);
  const refs: Record<Label, RefObject<TextInput>> = {
    email: useRef<TextInput>(null),
    password: useRef<TextInput>(null),
  };
  const [{
    values,
    isValid,
  }, formDispatch] = useFormReducer<Label>({
    values: {
      email: {
        value: '',
        validity: false,
      },
      password: {
        value: '',
        validity: false,
      },
    },
    isValid: false,
  });

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Login' });
  }, [navigation, isFocused]);

  const onInputUpdate = useCallback((label: Label, value: string, validity: boolean) => {
    formDispatch({
      type: FormActionType.InputUpdate,
      payload: {
        label,
        value: {
          value,
          validity,
        },
      },
    });
  }, [formDispatch]);
  const onLogin = useCallback((action: LoginAction) => {
    if (isValid) {
      const payload: LoginPayload = mapValues(pick(values, ['email', 'password']), (o) => o.value.trim());
      dispatch(action(payload));
    } else {
      alert('The form is invalid!', 'Please fix them with the help of the error messages.');
    }
  }, [dispatch, isValid, values]);
  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Input
          ownRef={refs.email}
          nextRef={refs.password}
          label="Email"
          placeholder="Enter your email"
          initialValue={values.email.value}
          onChangeValue={(value, validity) => onInputUpdate('email', value, validity)}
          isRequired
          isEmail
          autoCapitalize="none"
        />
        <Input
          ownRef={refs.password}
          label="Password"
          placeholder="Enter your password"
          initialValue={values.password.value}
          onChangeValue={(value, validity) => onInputUpdate('password', value, validity)}
          isRequired
          minLength={5}
          secureTextEntry
        />
        <View style={styles.actionsBar}>
          <View style={styles.actionContainer}>
            <CustomButton onPress={() => onLogin(signup)} style={styles.action} row>
              <MaterialCommunityIcons
                name="account-plus"
                size={30}
                color={Colors.white}
              />
              <SemiBoldText style={styles.actionText}>Sign up</SemiBoldText>
            </CustomButton>
          </View>
          <View style={styles.actionContainer}>
            <CustomButton onPress={() => onLogin(signin)} style={styles.action} row>
              <FontAwesome5
                name="sign-in-alt"
                size={30}
                color={Colors.white}
              />
              <SemiBoldText style={styles.actionText}>Sign in</SemiBoldText>
            </CustomButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  actionContainer: {
    width: '45%',
  },
  action: {
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
  },
  actionText: {
    fontSize: 20,
    color: Colors.white,
  },
});
