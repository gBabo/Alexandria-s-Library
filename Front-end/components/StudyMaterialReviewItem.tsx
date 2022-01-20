import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import StudyMaterial from '../models/StudyMaterial';
import StudyMaterialReview from '../models/StudyMaterialReview';
import Colors from '../constants/Colors';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';
import useAppDispatch from '../hooks/useAppDispatch';
import { toggleLikeStudyMaterialReview } from '../store/slices/studyMaterial';

interface StudyMaterialReviewItemProps {
  studyMaterial: StudyMaterial
  review: StudyMaterialReview
  containerStyle: ViewProps['style']
  style: ViewProps['style']
  onPress?: (event: GestureResponderEvent) => void
  disabled?: boolean
}

export default function StudyMaterialReviewItem({
  studyMaterial,
  review,
  containerStyle,
  style,
  onPress = () => {
  },
  disabled = false,
}: StudyMaterialReviewItemProps) {
  const dispatch = useAppDispatch();

  return (
    <View style={[styles.container, containerStyle]}>
      <CustomButton
        onPress={() => {
          dispatch(toggleLikeStudyMaterialReview({
            studyMaterialId: studyMaterial.id,
            reviewId: review.id,
          }));
        }}
        style={[styles.button, { backgroundColor: review.hasLiked ? Colors.yellow : Colors.blue }]}
        row
        small
      >
        <MaterialIcons
          name="thumb-up"
          size={20}
          color={review.hasLiked ? Colors.primary : Colors.white}
        />
        <SemiBoldText style={[styles.subtext, {
          marginLeft: 5,
          color: review.hasLiked ? Colors.primary : Colors.white,
        }]}
        >
          {review.likes}
        </SemiBoldText>
      </CustomButton>
      <CustomButton onPress={onPress} style={style} disabled={disabled}>
        <View style={styles.line}>
          <SemiBoldText style={styles.text}>{review.author}</SemiBoldText>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.text}>{review.review}</RegularText>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.subtext}>
            {`${review.comments.length} Answers`}
          </RegularText>
          <RegularText style={styles.subtext}>
            {moment(review.date)
              .fromNow()}
          </RegularText>
        </View>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingRight: 10,
  },
  line: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  button: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
    borderColor: Colors.transparent,
  },
  text: {
    fontSize: 16,
  },
  subtext: {
    fontSize: 14,
  },
});
