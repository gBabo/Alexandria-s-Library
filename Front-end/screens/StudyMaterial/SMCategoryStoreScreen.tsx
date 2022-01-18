import * as React from 'react';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterial from '../../models/StudyMaterial';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import StudyMaterialTile from '../../components/StudyMaterialTile';
import HorizontalDivider from '../../components/UI/HorizontalDivider';
import Topbar, { SortingMethod } from '../../components/Topbar';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMCategoryStoreScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'CategoryStore'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterialsCategories = useAppSelector((s) => s.studyMaterial.studyMaterialsCategories);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);

  const windowDimensions = useWindowDimensions();
  const marginHorizontal = windowDimensions.height / 150;
  const marginVertical = windowDimensions.height / 150;

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `${route.params.category}: Store` });
  }, [navigation, isFocused]);

  const searchState = useState('');
  const sortingMethodState = useState<SortingMethod>({
    value: 'date',
    order: 'Ascending',
  });

  const data = studyMaterialsCategories[route.params.category]
    .map((studyMaterialId) => studyMaterials[studyMaterialId])
    .filter((studyMaterial: StudyMaterial) => studyMaterial.name.toLowerCase()
      .includes(searchState[0].toLowerCase())
            || studyMaterial.author.toLowerCase()
              .includes(searchState[0].toLowerCase())
            || studyMaterial.authorEmail.toLowerCase()
              .includes(searchState[0].toLowerCase())
            || studyMaterial.type.toLowerCase()
              .includes(searchState[0].toLowerCase()))
    .sort((a, b) => {
      const key = sortingMethodState[0].value as keyof StudyMaterial;
      const value = sortingMethodState[0].order === 'Ascending' ? 1 : -1;
      if (a[key] < b[key]) return -value;
      if (a[key] > b[key]) return value;
      return 0;
    });

  return isLoading && data.length === 0 ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Topbar searchState={searchState} sortingMethodState={sortingMethodState} />
      <HorizontalDivider />
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(dataInfo) => (
          <StudyMaterialTile
            studyMaterial={dataInfo.item}
            onPress={() => {
              navigation.navigate('StudyMaterial', { id: dataInfo.item.id });
            }}
            containerStyle={{
              marginHorizontal,
              marginVertical,
              borderWidth: 1,
              borderColor: Colors.primary,
              backgroundColor: '#E0F7FA',
            }}
          />
        )}
        numColumns={1}
        style={styles.list}
        contentContainerStyle={styles.container}
        refreshing={isLoading}
        onRefresh={() => dispatch(getStudyMaterials())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  list: {
    width: '100%',
  },
});
