import React, { RefObject, useCallback, useState } from 'react';
import {
  StyleSheet, TextInputProps, TextInput, KeyboardAvoidingView,
} from 'react-native';
import validator from 'validator';

import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from './StyledText';
import Card from './Card';
import useInputReducer, { InputActionType } from '../../hooks/useInputReducer';

interface InputProps extends TextInputProps {
  ownRef?: RefObject<TextInput>
  nextRef?: RefObject<TextInput>
  label: string
  placeholder: string
  initialValue: string
  onChangeValue: (value: string, validity: boolean) => void
  isRequired?: boolean
  isURL?: boolean
  isEmail?: boolean
  isList?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export default function Input({
  ownRef,
  nextRef,
  label,
  placeholder,
  initialValue,
  onChangeValue,
  isRequired = false,
  isURL = false,
  isEmail = false,
  isList = false,
  minLength,
  maxLength,
  min,
  max,
  ...otherProps
}: InputProps) {
  const [{
    value,
    warning,
    wasTouched,
  }, inputDispatch] = useInputReducer({
    value: initialValue,
    warning: '',
    wasTouched: false,
  });

  const [borderColor, setBorderColor] = useState(Colors.primary);
  const onInputUpdate = useCallback((newValue: string) => {
    const payload = {
      value: newValue,
      warning: '',
    };
    const validate = (elementValue: string, warningPrefix: string) => {
      if (isRequired && elementValue.length === 0) {
        payload.warning = `${warningPrefix} is required!`;
      } else if (isURL && !validator.isURL(elementValue)) {
        payload.warning = `${warningPrefix} is not a valid URL!`;
      } else if (isEmail && !validator.isEmail(elementValue)) {
        payload.warning = `${warningPrefix} is not a valid email!`;
      } else if (minLength && elementValue.length < minLength) {
        payload.warning = `${warningPrefix} cannot be less than ${minLength} characters!`;
      } else if (maxLength && elementValue.length > maxLength) {
        payload.warning = `${warningPrefix} cannot be longer than ${maxLength} characters!`;
      } else if (min && +elementValue < min) {
        payload.warning = `${warningPrefix} cannot be less than ${min}!`;
      } else if (max && +elementValue > max) {
        payload.warning = `${warningPrefix} cannot be greater than ${max}!`;
      } else {
        return true;
      }
      return false;
    };
    if (isList) {
      newValue.split(';')
        .some((listElement, index) => !validate(listElement.trim(), `List element ${index + 1}`));
    } else {
      validate(newValue.trim(), 'This field');
    }
    inputDispatch({
      type: InputActionType.InputUpdate,
      payload,
    });
    onChangeValue(newValue, !payload.warning);
    setBorderColor(payload.warning ? Colors.primary : Colors.accent);
  }, [inputDispatch, onChangeValue, isRequired, isURL, isEmail, minLength, maxLength, min, max]);

  return (
    <KeyboardAvoidingView behavior="padding">
      <Card style={[styles.container, { borderColor }]}>
        <SemiBoldText style={styles.label}>
          {label}
        </SemiBoldText>
        <TextInput
          ref={ownRef}
          placeholder={placeholder}
          value={value}
          onChangeText={onInputUpdate}
          onSubmitEditing={nextRef && (() => nextRef.current?.focus())}
          returnKeyType={nextRef && 'next'}
          blurOnSubmit={!nextRef}
          onBlur={() => inputDispatch({ type: InputActionType.InputTouched })}
          style={styles.input}
          {...otherProps}
        />
        {wasTouched && !!warning && (
        <RegularText style={styles.warning}>{warning}</RegularText>
        )}
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    minWidth: '100%',
    marginTop: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  warning: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.error,
  },
});
