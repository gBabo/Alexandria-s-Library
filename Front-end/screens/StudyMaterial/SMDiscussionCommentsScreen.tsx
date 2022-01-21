import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { StudyMaterialReviewComment } from '../../models/StudyMaterialReview';
import { RenderItemProps } from '../../components/ItemList';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import HorizontalDivider from '../../components/UI/HorizontalDivider';
import StudyMaterialReviewItem from '../../components/StudyMaterialReviewItem';
import StudyMaterialReviewCommentItem from '../../components/StudyMaterialReviewCommentItem';
import DiscussionList, { RenderListHeaderComponentProps } from '../../components/DiscussionList';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchStudyMaterials, addReviewComment } from '../../store/slices/studyMaterial';

export default function SMDiscussionCommentsScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'DiscussionComments'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.studyMaterialId];
  const review = studyMaterial.reviews.find(({ id }) => id === route.params.reviewId)!;

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `Discussion: ${studyMaterial.name}` });
  }, [navigation, isFocused]);

  const renderListHeaderComponent = ({
    marginHorizontal,
    marginVertical,
  }: RenderListHeaderComponentProps) => (
    <View>
      <StudyMaterialReviewItem
        studyMaterial={studyMaterial}
        review={review}
        containerStyle={{
          marginHorizontal,
          marginVertical,
        }}
        style={{
          backgroundColor: '#E0F7FA',
          borderColor: Colors.primary,
        }}
        disabled
      />
      <HorizontalDivider />
    </View>
  );

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterialReviewComment>) => (
    <StudyMaterialReviewCommentItem
      comment={dataInfo.item}
      containerStyle={{
        marginHorizontal,
        marginVertical,
      }}
      style={{
        backgroundColor: '#ECEFF1',
        borderColor: Colors.primary,
      }}
      disabled
    />
  );

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <DiscussionList
        renderListHeaderComponent={renderListHeaderComponent}
        items={[...review.comments].sort((a, b) => (b.date < a.date ? -1 : 1))}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchStudyMaterials())}
        placeholder="Write your answer here"
        onSend={(message) => dispatch(addReviewComment({
          studyMaterialId: route.params.studyMaterialId,
          reviewId: route.params.reviewId,
          comment: message,
        }))}
        fallbackMessage="This review has no answers yet."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
