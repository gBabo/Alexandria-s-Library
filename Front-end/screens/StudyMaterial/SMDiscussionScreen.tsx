import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterialReview from '../../models/StudyMaterialReview';
import { RenderItemProps } from '../../components/ItemList';
import Loading from '../../components/UI/Loading';
import StudyMaterialReviewItem from '../../components/StudyMaterialReviewItem';
import DiscussionList from '../../components/DiscussionList';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchStudyMaterials, addReview } from '../../store/slices/studyMaterial';

export default function SMDiscussionScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'Discussion'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.studyMaterialId];

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `Discussion: ${studyMaterial.name}` });
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterialReview>) => (
    <StudyMaterialReviewItem
      review={dataInfo.item}
      onPress={() => navigation.navigate('DiscussionComments', {
        studyMaterialId: route.params.studyMaterialId,
        reviewId: dataInfo.item.id,
      })}
      containerStyle={{
        marginHorizontal,
        marginVertical,
      }}
      style={{
        backgroundColor: '#E0F7FA',
        borderColor: Colors.primary,
      }}
    />
  );

  return isLoading ? (
    <Loading />
  ) : (
    <DiscussionList
      items={[...studyMaterial.reviews].sort((a, b) => (b.date < a.date ? -1 : 1))}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchStudyMaterials())}
      placeholder="Write your review here"
      onSend={(message) => dispatch(addReview({
        studyMaterialId: route.params.studyMaterialId,
        review: message,
      }))}
      fallbackMessage="This study material has no reviews yet."
    />
  );
}
