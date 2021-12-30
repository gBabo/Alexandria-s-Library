import * as React from 'react';
import { RefObject, useCallback, useRef } from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { mapValues, pick } from 'lodash';

import { LoginStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { View } from '../../components/UI/Themed';
import { RegularText } from '../../components/UI/StyledText';
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
  const onLogin = useCallback(async (action: LoginAction) => {
    if (isValid) {
      const payload: LoginPayload = mapValues(pick(values, ['email', 'password']), (o) => o.value);
      const { meta } = await dispatch(action(payload));
      if (meta.requestStatus === 'fulfilled') navigation.getParent()!.navigate('SM_Store');
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
          initialValue={values.email.value}
          onChangeValue={(value, validity) => onInputUpdate('email', value, validity)}
          isRequired
          isEmail
          autoCapitalize="none"
        />
        <Input
          ownRef={refs.password}
          label="Password"
          initialValue={values.password.value}
          onChangeValue={(value, validity) => onInputUpdate('password', value, validity)}
          isRequired
          minLength={5}
          secureTextEntry
        />
        <View style={styles.actions}>
          <CustomButton onPress={() => onLogin(signup)}>
            <MaterialCommunityIcons
              name="account-plus"
              size={30}
              color={Colors.accent}
            />
            <RegularText style={{ color: Colors.background }}>
              Sign up
            </RegularText>
          </CustomButton>
          <CustomButton onPress={() => onLogin(signin)}>
            <FontAwesome5
              name="sign-in-alt"
              size={30}
              color={Colors.accent}
            />
            <RegularText style={{ color: Colors.background }}>
              Sign in
            </RegularText>
          </CustomButton>
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: '#0000',
  },
});
