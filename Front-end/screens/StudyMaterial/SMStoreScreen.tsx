import * as React from 'react';
import { useCallback, useLayoutEffect } from 'react';
import { Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import { SMStoreStackScreenProps } from '../../navigation/types';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import CategoryGrid from '../../components/CategoryGrid';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMStoreScreen({ navigation }: SMStoreStackScreenProps<'Store'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const myStudyMaterialIds = [
    ...useAppSelector((s) => s.studyMaterial.acquired),
    ...useAppSelector((s) => s.studyMaterial.uploaded),
  ];
  const studyMaterialsCategories = Object.entries(useAppSelector(
    (s) => s.studyMaterial.studyMaterialsCategories,
  ))
    .filter(([, v]) => v.some((id) => !myStudyMaterialIds.includes(id)))
    .map(([k]) => k);

  const onPressHelp = useCallback(() => Alert.alert('Help', 'Here you can search, purchase and exchange study materials.\nIt is possible to acquire materials using tokens or by trading materials already owned.', [{
    text: 'Got it!',
    style: 'default',
  }], {
    cancelable: true,
  }), []);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()!.setOptions({
        headerTitle: 'Study Materials Store',
        headerRight: () => (
          <MaterialIconsHeaderButtons>
            <Item
              title="help-outline"
              iconName="help-outline"
              color={Colors.white}
              onPress={onPressHelp}
            />
          </MaterialIconsHeaderButtons>
        ),
      });
      dispatch(fetchStudyMaterials());
    }
  }, [navigation, onPressHelp, isFocused]);

  return isLoading ? (
    <Loading />
  ) : studyMaterialsCategories.length === 0 ? (
    <Fallback message="There are no published study materials yet." />
  ) : (
    <CategoryGrid
      categories={studyMaterialsCategories}
      searchPlaceholder="Search Study Material Categories"
      onPress={(category) => navigation.navigate('CategoryStore', { category })}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchStudyMaterials())}
    />
  );
}
