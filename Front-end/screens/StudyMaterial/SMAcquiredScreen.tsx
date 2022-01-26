import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { SMAcquiredStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterial from '../../models/StudyMaterial';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import AcquiredStudyMaterialItem from '../../components/AcquiredStudyMaterialItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMAcquiredScreen({ navigation }: SMAcquiredStackScreenProps<'Acquired'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const acquiredStudyMaterials = useAppSelector((s) => s.studyMaterial.acquired)
    .map((studyMaterialId) => studyMaterials[studyMaterialId]);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()!.setOptions({ headerTitle: 'Acquired Materials' });
      dispatch(fetchStudyMaterials());
    }
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterial>) => (
    <AcquiredStudyMaterialItem
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
  ) : acquiredStudyMaterials.length === 0 ? (
    <Fallback message="You have not yet acquired study materials." />
  ) : (
    <ItemList
      items={acquiredStudyMaterials}
      keys={['name', 'author', 'authorEmail', 'authorInstitution', 'type']}
      searchPlaceholder="Search Acquired Study Materials"
      defaultSortingMethod={{
        value: 'date',
        order: 'Descending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchStudyMaterials())}
    />
  );
}
