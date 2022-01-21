import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterial from '../../models/StudyMaterial';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import StudyMaterialItem from '../../components/StudyMaterialItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMCategoryStoreScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'CategoryStore'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterialsCategories = useAppSelector((s) => s.studyMaterial.studyMaterialsCategories);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `${route.params.category}: Store` });
  }, [navigation, isFocused]);

  const items = studyMaterialsCategories[route.params.category]
    .map((studyMaterialId) => studyMaterials[studyMaterialId]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterial>) => (
    <StudyMaterialItem
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
  ) : items.length === 0 ? (
    <Fallback message="This category has no published study materials yet." />
  ) : (
    <ItemList
      items={items}
      keys={['name', 'author', 'authorEmail', 'authorInstitution', 'type']}
      searchPlaceholder="Search Study Materials"
      sortingOptions={[
        {
          label: 'Likes',
          value: 'likes',
        },
        {
          label: 'Author Rating',
          value: 'authorRating',
        },
        {
          label: 'Publication Date',
          value: 'date',
        },
        {
          label: 'Price',
          value: 'price',
        },
      ]}
      defaultSortingMethod={{
        value: 'date',
        order: 'Ascending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchStudyMaterials())}
    />
  );
}
