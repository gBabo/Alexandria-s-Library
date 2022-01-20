import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';
import moment from 'moment';

import { StudyMaterialReviewComment } from '../models/StudyMaterialReview';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface StudyMaterialReviewCommentItemProps {
  comment: StudyMaterialReviewComment
  containerStyle: ViewProps['style']
  style: ViewProps['style']
  onPress?: (event: GestureResponderEvent) => void
  disabled?: boolean
}

export default function StudyMaterialReviewCommentItem({
  comment,
  containerStyle,
  style,
  onPress = () => {
  },
  disabled = false,
}: StudyMaterialReviewCommentItemProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style} disabled={disabled}>
        <View style={styles.line}>
          <SemiBoldText style={styles.text}>{comment.author}</SemiBoldText>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.text}>{comment.comment}</RegularText>
        </View>
        <View style={[styles.line, styles.lineReverse]}>
          <RegularText style={styles.subtext}>
            {moment(comment.date)
              .fromNow()}
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
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  lineReverse: {
    flexDirection: 'row-reverse',
  },
  text: {
    fontSize: 16,
  },
  subtext: {
    fontSize: 14,
  },
});
