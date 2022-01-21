import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';
import moment from 'moment';

import TutoringSession from '../models/TutoringSession';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface TutoringSessionItemProps {
  tutoringSession: TutoringSession
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function ScheduledTutoringSessionItem({
  tutoringSession,
  onPress,
  containerStyle,
  style,
}: TutoringSessionItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.line}>
          <SemiBoldText numberOfLines={2} style={styles.text}>
            {tutoringSession.name}
          </SemiBoldText>
        </View>
        <View style={styles.line}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Date: </SemiBoldText>
            {moment(tutoringSession.date)
              .format('lll')}
          </RegularText>
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
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
