import * as React from 'react';
import {
  RefObject, useCallback, useLayoutEffect, useRef, useState,
} from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { FontAwesome5 } from '@expo/vector-icons';
import { mapValues, pick } from 'lodash';

import { SMUploadedStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { View } from '../../components/UI/Themed';
import { SemiBoldText } from '../../components/UI/StyledText';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import Input from '../../components/UI/Input';
import NumberPicker from '../../components/NumberPicker';
import FilePicker from '../../components/PdfFilePicker';
import useFormReducer, { FormActionType } from '../../hooks/useFormReducer';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { publishStudyMaterial } from '../../store/slices/studyMaterial';
import alert from '../../utils/alert';

type TextInputLabel = 'name' | 'type' | 'categories' | 'description';

export default function SMUploadScreen({ navigation }: SMUploadedStackScreenProps<'Upload'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const refs: Record<TextInputLabel, RefObject<TextInput>> = {
    name: useRef<TextInput>(null),
    categories: useRef<TextInput>(null),
    description: useRef<TextInput>(null),
    type: useRef<TextInput>(null),
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
      type: {
        value: '',
        validity: false,
      },
    },
    isValid: false,
  });
  const priceState = useState(3);
  const fileUriState = useState('');

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Upload Study Material' });
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
    if (isValid && fileUriState[0]) {
      const payload = {
        ...mapValues(pick(values, ['name', 'type', 'description']), (o) => o.value.trim()),
        categories: values.categories.value.split(';')
          .map((v) => v.trim()),
        price: priceState[0],
        fileUri: fileUriState[0],
      };
      dispatch(publishStudyMaterial(payload))
        .then(() => navigation.goBack());
    } else {
      alert('The form is invalid!', 'Please fix them.');
    }
  }, [navigation, dispatch, publishStudyMaterial, isValid, priceState[0], fileUriState[0], values]);
  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Input
          ownRef={refs.name}
          nextRef={refs.type}
          label="Name:"
          placeholder="Enter the name of the study material"
          initialValue={values.name.value}
          onChangeValue={(value, validity) => onInputUpdate('name', value, validity)}
          multiline
          textContentType="name"
          isRequired
          minLength={10}
          maxLength={50}
        />
        <Input
          ownRef={refs.type}
          nextRef={refs.categories}
          label="Type:"
          placeholder="Enter the type of study material"
          initialValue={values.type.value}
          onChangeValue={(value, validity) => onInputUpdate('type', value, validity)}
          multiline
          textContentType="name"
          isRequired
          minLength={5}
          maxLength={20}
        />
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
        <Input
          ownRef={refs.description}
          label="Description:"
          placeholder="Enter a brief description"
          initialValue={values.description.value}
          onChangeValue={(value, validity) => onInputUpdate('description', value, validity)}
          multiline
          isRequired
          minLength={20}
          maxLength={200}
        />
        <NumberPicker
          label="Price:"
          iconName="ticket-alt"
          min={1}
          max={50}
          valueState={priceState}
        />
        <FilePicker fileUriState={fileUriState} />
        <View style={styles.actionsBar}>
          <CustomButton onPress={onPublish} style={styles.action} row>
            <FontAwesome5 name="file-upload" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Publish</SemiBoldText>
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
  actionsBar: {
    flexDirection: 'row',
    margin: 5,
  },
  action: {
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 20,
    color: Colors.white,
  },
});
