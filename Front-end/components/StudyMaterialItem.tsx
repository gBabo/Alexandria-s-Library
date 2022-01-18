import React, { ComponentType } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';

import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import StudyMaterial from '../models/StudyMaterial';

interface StudyMaterialItemProps {
  studyMaterial: StudyMaterial
  onPress: (event: GestureResponderEvent) => void
  containerStyle: StyleProp<ViewStyle>
}

export default function StudyMaterialItem({
  studyMaterial,
  onPress,
  containerStyle,
}: StudyMaterialItemProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <Card style={containerStyle}>
      <TouchableComponent onPress={onPress}>
        <View style={styles.innerContainer}>
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
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Institution</SemiBoldText>
            {`: ${studyMaterial.authorInstitution}`}
          </RegularText>
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
        </View>
      </TouchableComponent>
    </Card>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  line: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  textBetweenIcons: {
    width: '60%',
  },
  iconContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
});
