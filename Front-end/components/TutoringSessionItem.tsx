import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

import moment from 'moment';
import Colors from '../constants/Colors';
import TutoringSession from '../models/TutoringSession';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface TutoringSessionItemProps {
  tutoringSession: TutoringSession
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function TutoringSessionItem({
  tutoringSession,
  onPress,
  containerStyle,
  style,
}: TutoringSessionItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={[styles.line, styles.lineReverse]}>
          <View style={styles.iconContainer}>
            <SemiBoldText style={styles.text}>{tutoringSession.price}</SemiBoldText>
            <FontAwesome5
              name="ticket-alt"
              size={24}
              color={Colors.purple}
              style={styles.icon}
            />
          </View>
          <View style={styles.textBetweenIcons}>
            <SemiBoldText numberOfLines={2} style={styles.text}>
              {tutoringSession.name}
            </SemiBoldText>
          </View>
        </View>
        <View style={[styles.line, styles.textAlone]}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Date: </SemiBoldText>
            {moment(tutoringSession.date)
              .format('lll')}
          </RegularText>
        </View>
        <View style={[styles.line, styles.textAlone]}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Institution: </SemiBoldText>
            {tutoringSession.tutorInstitution}
          </RegularText>
        </View>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <AntDesign name="star" size={24} color={Colors.yellow} style={styles.icon} />
            <SemiBoldText style={styles.text}>
              {tutoringSession.tutorRating}
            </SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <RegularText numberOfLines={1} style={styles.text}>
              <SemiBoldText>Tutor: </SemiBoldText>
              {tutoringSession.tutor}
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
  lineReverse: {
    flexDirection: 'row-reverse',
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
