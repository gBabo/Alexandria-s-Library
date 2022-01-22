import * as React from 'react';
import {
  RefObject, useCallback, useLayoutEffect, useRef,
} from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { FontAwesome5 } from '@expo/vector-icons';
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
import { LoginAction, signin, signup } from '../../store/slices/authentication';
import alert from '../../utils/alert';

type TextInputLabel = 'email' | 'password';

export default function LoginScreen({ navigation }: LoginStackScreenProps<'Login'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.authentication.isLoading);
  const refs: Record<TextInputLabel, RefObject<TextInput>> = {
    email: useRef<TextInput>(null),
    password: useRef<TextInput>(null),
  };
  const [{
    values,
    isValid,
  }, formDispatch] = useFormReducer<TextInputLabel>({
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

  const onInputUpdate = useCallback((label: TextInputLabel, value: string, validity: boolean) => {
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
      const payload = mapValues(pick(values, ['email', 'password']), (o) => o.value.trim());
      switch (action) {
        case signup:
          navigation.navigate('Register', payload);
          break;
        case signin:
          dispatch(signin(payload));
          break;
        default:
          break;
      }
    } else {
      alert('The form is invalid!', 'Please fix them.');
    }
  }, [dispatch, isValid, values]);
  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <Input
            ownRef={refs.email}
            nextRef={refs.password}
            label="Email:"
            placeholder="Enter your email"
            initialValue={values.email.value}
            onChangeValue={(value, validity) => onInputUpdate('email', value, validity)}
            autoCapitalize="none"
            isRequired
            isEmail
            minLength={5}
            maxLength={50}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.password}
            label="Password:"
            placeholder="Enter your password"
            initialValue={values.password.value}
            onChangeValue={(value, validity) => onInputUpdate('password', value, validity)}
            secureTextEntry
            isRequired
            minLength={5}
            maxLength={50}
          />
        </View>
        <View style={styles.line}>
          <CustomButton onPress={() => onLogin(signup)} style={styles.action} row>
            <FontAwesome5 name="user-plus" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Sign up</SemiBoldText>
          </CustomButton>
          <CustomButton onPress={() => onLogin(signin)} style={styles.action} row>
            <FontAwesome5 name="sign-in-alt" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Sign in</SemiBoldText>
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    minWidth: '47.5%',
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
    marginHorizontal: 2.5,
  },
  actionText: {
    fontSize: 20,
    color: Colors.white,
  },
});
