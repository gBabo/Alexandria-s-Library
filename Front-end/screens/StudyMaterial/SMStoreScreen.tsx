import * as React from 'react';
import {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import { SMStoreStackScreenProps } from '../../navigation/types';
import MaterialIconsHeaderButtons from '../../components/UI/MaterialIconsHeaderButtons';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import HorizontalDivider from '../../components/UI/HorizontalDivider';
import Grid, { RenderTileProps } from '../../components/UI/Grid';
import Topbar from '../../components/Topbar';
import CategoryTile from '../../components/CategoryTile';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getStudyMaterials } from '../../store/slices/studyMaterial';

export default function SMStoreScreen({ navigation }: SMStoreStackScreenProps<'Store'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterialsCategories = useAppSelector((s) => s.studyMaterial.studyMaterialsCategories);
  const searchState = useState('');

  useEffect(() => {
    dispatch(getStudyMaterials());
  }, []);

  const onPressHelp = useCallback(() => Alert.alert(
    'Help', `
    Here you can search, purchase and exchange study materials.
    It is possible to acquire materials using tokens or by trading materials already owned.
    `, [{
      text: 'Got it!',
      style: 'default',
    }], {
      cancelable: true,
    },
  ), []);

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
    }
  }, [navigation, onPressHelp, isFocused]);

  const renderTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
    height,
  }: RenderTileProps<string>) => (
    <CategoryTile
      category={dataInfo.item}
      onPress={() => {
        navigation.navigate('CategoryStore', { category: dataInfo.item });
      }}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        height,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: '#E0F7FA',
      }}
    />
  );

  const data = Object.keys(studyMaterialsCategories)
    .filter((c) => c.toLocaleLowerCase()
      .includes(searchState[0].toLowerCase()));

  return isLoading && data.length === 0 ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Topbar searchState={searchState} />
      <HorizontalDivider />
      <Grid
        data={data}
        renderTile={renderTile}
        numColumns={2}
        numRows={5}
        refreshing={isLoading}
        onRefresh={() => dispatch(getStudyMaterials())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
