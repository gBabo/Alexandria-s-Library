import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';

import moment from 'moment';
import { Enrollment, EnrollmentStatus } from '../models/TutoringSession';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

export type EnrollmentExtended = Enrollment & {
  tutoringSessionName: string
  tutoringSessionLocation: string
};

interface EnrollmentItemProps {
  enrollment: EnrollmentExtended
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function EnrollmentItem({
  enrollment,
  onPress,
  containerStyle,
  style,
}: EnrollmentItemProps) {
  const color = enrollment.status === EnrollmentStatus.PENDING ? '#E65100'
    : enrollment.status === EnrollmentStatus.CONFIRMED ? '#1B5E20'
      : '#B71C1C';

  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.line}>
          <SemiBoldText numberOfLines={1} style={styles.text}>
            {enrollment.tutoringSessionName}
          </SemiBoldText>
        </View>
        <View style={styles.line}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Date: </SemiBoldText>
            {moment(enrollment.date)
              .format('lll')}
          </RegularText>
        </View>
        <View style={styles.line}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Tutor: </SemiBoldText>
            {enrollment.requester}
          </RegularText>
        </View>
        <View style={styles.line}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Enrollment Status: </SemiBoldText>
            <SemiBoldText style={{ color }}>{enrollment.status}</SemiBoldText>
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
