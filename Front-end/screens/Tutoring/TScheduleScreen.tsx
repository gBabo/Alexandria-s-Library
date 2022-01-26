import * as React from 'react';
import {
  RefObject, useCallback, useLayoutEffect, useRef, useState,
} from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { FontAwesome5 } from '@expo/vector-icons';
import { mapValues, pick } from 'lodash';
import moment from 'moment';

import { TScheduledStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { View } from '../../components/UI/Themed';
import { SemiBoldText } from '../../components/UI/StyledText';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import Input from '../../components/UI/Input';
import NumberPicker from '../../components/NumberPicker';
import DateAndTimePicker from '../../components/DateAndTimePicker';
import useFormReducer, { FormActionType } from '../../hooks/useFormReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import alert from '../../utils/alert';
import { scheduleTutoringSession } from '../../store/slices/tutoring';

type TextInputLabel = 'name' | 'categories' | 'description' | 'location' | 'duration';

export default function TScheduleScreen({ navigation }: TScheduledStackScreenProps<'Schedule'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const refs: Record<TextInputLabel, RefObject<TextInput>> = {
    name: useRef<TextInput>(null),
    categories: useRef<TextInput>(null),
    description: useRef<TextInput>(null),
    location: useRef<TextInput>(null),
    duration: useRef<TextInput>(null),
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
      categories: {
        value: '',
        validity: false,
      },
      description: {
        value: '',
        validity: false,
      },
      location: {
        value: '',
        validity: false,
      },
      duration: {
        value: '60',
        validity: true,
      },
    },
    isValid: false,
  });
  const priceState = useState(3);
  const dateState = useState(moment()
    .toDate());

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Schedule Tutoring Session' });
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
  const onPublish = useCallback(() => {
    if (isValid) {
      const payload = {
        ...mapValues(pick(values, ['name', 'description', 'location', 'duration']), (o) => o.value.trim()),
        categories: values.categories.value.split(';')
          .map((v) => v.trim()),
        duration: +values.duration.value,
        price: priceState[0],
        date: dateState[0].toISOString(),
      };
      dispatch(scheduleTutoringSession(payload))
        .then(() => navigation.goBack());
    } else {
      alert('The form is invalid!', 'Please fix them.');
    }
  }, [navigation, dispatch, isValid, priceState[0], dateState[0], values]);

  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <Input
            ownRef={refs.name}
            nextRef={refs.categories}
            label="Name:"
            placeholder="Enter the name of the session"
            initialValue={values.name.value}
            onChangeValue={(value, validity) => onInputUpdate('name', value, validity)}
            multiline
            textContentType="name"
            isRequired
            minLength={10}
            maxLength={50}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.categories}
            nextRef={refs.description}
            label="Categories:"
            placeholder="Enter semicolon-separated categories"
            initialValue={values.categories.value}
            onChangeValue={(value, validity) => onInputUpdate('categories', value, validity)}
            multiline
            isRequired
            isList
            minLength={5}
            maxLength={20}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.description}
            nextRef={refs.location}
            label="Description:"
            placeholder="Enter a brief description"
            initialValue={values.description.value}
            onChangeValue={(value, validity) => onInputUpdate('description', value, validity)}
            multiline
            isRequired
            minLength={20}
            maxLength={200}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.location}
            nextRef={refs.duration}
            label="Location:"
            placeholder="Enter the session location"
            initialValue={values.location.value}
            onChangeValue={(value, validity) => onInputUpdate('location', value, validity)}
            multiline
            isRequired
            minLength={5}
            maxLength={50}
          />
        </View>
        <View style={styles.line}>
          <Input
            ownRef={refs.duration}
            label="Duration in minutes:"
            placeholder="Enter the estimated duration of the session"
            initialValue={values.duration.value}
            onChangeValue={(value, validity) => onInputUpdate('duration', value, validity)}
            keyboardType="number-pad"
            isRequired
            min={15}
            max={720}
          />
        </View>
        <View style={styles.line}>
          <NumberPicker
            label="Price:"
            iconName="ticket-alt"
            min={1}
            max={50}
            valueState={priceState}
          />
        </View>
        <View style={styles.line}>
          <DateAndTimePicker dateState={dateState} />
        </View>
        <View style={styles.line}>
          <CustomButton onPress={onPublish} style={styles.action} row>
            <FontAwesome5 name="calendar-plus" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Schedule</SemiBoldText>
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
    marginVertical: 5,
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
