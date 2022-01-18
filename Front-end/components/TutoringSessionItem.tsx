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

import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import TutoringSession from '../models/TutoringSession';

interface TutoringSessionItemProps {
  tutoringSession: TutoringSession
  onPress: (event: GestureResponderEvent) => void
  containerStyle: StyleProp<ViewStyle>
}

export default function TutoringSessionItem({
  tutoringSession,
  onPress,
  containerStyle,
}: TutoringSessionItemProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <Card style={containerStyle}>
      <TouchableComponent onPress={onPress}>
        <View style={styles.innerContainer}>
          <View style={styles.lineReverse}>
            <View style={styles.iconContainer}>
              <SemiBoldText style={styles.text}>{tutoringSession.price}</SemiBoldText>
              <FontAwesome5
                name="ticket-alt"
                size={24}
                color="#3949AB"
                style={styles.icon}
              />
            </View>
            <View style={styles.textBetweenIcons}>
              <SemiBoldText numberOfLines={2} style={styles.text}>
                {tutoringSession.name}
              </SemiBoldText>
            </View>
          </View>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Institution</SemiBoldText>
            {`: ${tutoringSession.tutorInstitution}`}
          </RegularText>
          <View style={styles.line}>
            <View style={styles.iconContainer}>
              <AntDesign name="star" size={24} color="#FBC02D" style={styles.icon} />
              <SemiBoldText style={styles.text}>
                {tutoringSession.tutorRating}
              </SemiBoldText>
            </View>
            <View style={styles.textBetweenIcons}>
              <RegularText numberOfLines={1} style={styles.text}>
                <SemiBoldText>Author</SemiBoldText>
                {`: ${tutoringSession.tutor}`}
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
  lineReverse: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 10,
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
