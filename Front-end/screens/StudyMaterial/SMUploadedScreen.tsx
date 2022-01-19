import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { SMUploadedStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterial from '../../models/StudyMaterial';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import UploadedStudyMaterialItem from '../../components/UploadedStudyMaterialItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMUploadedScreen({ navigation }: SMUploadedStackScreenProps<'Uploaded'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const uploadedStudyMaterials = useAppSelector((s) => s.studyMaterial.uploadedStudyMaterials)
    .map((studyMaterialId) => studyMaterials[studyMaterialId]);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Uploaded Materials' });
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterial>) => (
    <UploadedStudyMaterialItem
      studyMaterial={dataInfo.item}
      onPress={() => {
        navigation.navigate('StudyMaterial', { id: dataInfo.item.id });
      }}
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
  ) : uploadedStudyMaterials.length === 0 ? (
    <Fallback message="You have not yet uploaded study materials." />
  ) : (
    <ItemList
      items={uploadedStudyMaterials}
      keys={['name', 'author', 'authorEmail', 'authorInstitution', 'type']}
      searchPlaceholder="Search Uploaded Study Materials"
      defaultSortingMethod={{
        value: 'date',
        order: 'Ascending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(getStudyMaterials())}
    />
  );
}
