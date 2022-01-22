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
import { signup } from '../../store/slices/authentication';
import alert from '../../utils/alert';

type TextInputLabel = 'name' | 'institution';

export default function RegisterScreen({
  navigation,
  route,
}: LoginStackScreenProps<'Register'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.authentication.isLoading);
  const refs: Record<TextInputLabel, RefObject<TextInput>> = {
    name: useRef<TextInput>(null),
    institution: useRef<TextInput>(null),
  };
  const [{
    values,
    isValid,
  }, formDispatch] = useFormReducer<TextInputLabel>({
    values: {
      name: {
        value: '',
        validity: false,
      },
      institution: {
        value: '',
        validity: false,
      },
    },
    isValid: false,
  });

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Register' });
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
  const onRegister = useCallback(() => {
    if (isValid) {
      const payload = {
        ...route.params,
        ...mapValues(pick(values, ['name', 'institution']), (o) => o.value.trim()),
      };
      dispatch(signup(payload))
        .then(({ meta }) => {
          if (meta.requestStatus !== 'fulfilled') navigation.goBack();
        });
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
            ownRef={refs.name}
            nextRef={refs.institution}
            label="Name:"
            placeholder="Enter your username"
            initialValue={values.name.value}
            onChangeValue={(value, validity) => onInputUpdate('name', value, validity)}
            textContentType="name"
            autoCapitalize="words"
            isRequired
            minLength={3}
            maxLength={30}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.institution}
            label="Institution:"
            placeholder="Enter your educational institution"
            initialValue={values.institution.value}
            onChangeValue={(value, validity) => onInputUpdate('institution', value, validity)}
            textContentType="name"
            autoCapitalize="words"
            isRequired
            minLength={5}
            maxLength={50}
          />
        </View>
        <View style={styles.line}>
          <CustomButton onPress={() => onRegister()} style={styles.action} row>
            <FontAwesome5 name="user-plus" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Register</SemiBoldText>
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
