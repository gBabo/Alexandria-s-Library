import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';

import StudyMaterial from '../models/StudyMaterial';
import { SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface UploadedStudyMaterialItemProps {
  studyMaterial: StudyMaterial
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function UploadedStudyMaterialItem({
  studyMaterial,
  onPress,
  containerStyle,
  style,
}: UploadedStudyMaterialItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.textContainer}>
          <SemiBoldText numberOfLines={2} style={styles.text}>
            {studyMaterial.name}
          </SemiBoldText>
        </View>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    width: '100%',
    paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 10,
  },
});
