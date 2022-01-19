import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewStyle,
} from 'react-native';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import StudyMaterial from '../models/StudyMaterial';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface StudyMaterialItemProps {
  studyMaterial: StudyMaterial
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewStyle
  style: ViewStyle
}

export default function StudyMaterialItem({
  studyMaterial,
  onPress,
  containerStyle,
  style,
}: StudyMaterialItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="thumb-up"
              size={24}
              color="#1E88E5"
              style={styles.icon}
            />
            <SemiBoldText style={styles.text}>{studyMaterial.likes}</SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <SemiBoldText numberOfLines={2} style={styles.text}>
              {studyMaterial.name}
            </SemiBoldText>
          </View>
          <View style={styles.iconContainer}>
            <SemiBoldText style={styles.text}>{studyMaterial.price}</SemiBoldText>
            <FontAwesome5
              name="ticket-alt"
              size={24}
              color="#3949AB"
              style={styles.icon}
            />
          </View>
        </View>
        <View style={[styles.line, styles.textAlone]}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Institution</SemiBoldText>
            {`: ${studyMaterial.authorInstitution}`}
          </RegularText>
        </View>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <AntDesign name="star" size={24} color="#FBC02D" style={styles.icon} />
            <SemiBoldText style={styles.text}>
              {studyMaterial.authorRating}
            </SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <RegularText numberOfLines={1} style={styles.text}>
              <SemiBoldText>Author</SemiBoldText>
              {`: ${studyMaterial.author}`}
            </RegularText>
          </View>
        </View>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  textAlone: {
    justifyContent: 'center',
  },
  textBetweenIcons: {
    width: '60%',
  },
  iconContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
});
