import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewStyle,
} from 'react-native';

import StudyMaterial from '../models/StudyMaterial';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface AcquiredStudyMaterialItemProps {
  studyMaterial: StudyMaterial
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewStyle
  style: ViewStyle
}

export default function AcquiredStudyMaterialItem({
  studyMaterial,
  onPress,
  containerStyle,
  style,
}: AcquiredStudyMaterialItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.textContainer}>
          <SemiBoldText numberOfLines={2} style={styles.text}>
            {studyMaterial.name}
          </SemiBoldText>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Institution</SemiBoldText>
            {`: ${studyMaterial.authorInstitution}`}
          </RegularText>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Author</SemiBoldText>
            {`: ${studyMaterial.author}`}
          </RegularText>
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
