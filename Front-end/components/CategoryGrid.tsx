import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import { View } from './UI/Themed';
import HorizontalDivider from './UI/HorizontalDivider';
import Grid, { RenderTileProps } from './UI/Grid';
import Topbar from './Topbar';
import CategoryTile from './CategoryTile';

interface CategoryGridProps {
  categories: string[]
  searchPlaceholder: string
  onPress: (category: string) => void
  refreshing: boolean
  onRefresh: () => void
}

export default function CategoryGrid({
  categories,
  searchPlaceholder,
  onPress,
  refreshing,
  onRefresh,
}: CategoryGridProps) {
  const searchState = useState('');

  const data = categories.filter((category) => category.toLocaleLowerCase()
    .includes(searchState[0].toLowerCase()));

  const renderTile = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
    width,
    height,
  }: RenderTileProps<string>) => (
    <CategoryTile
      category={dataInfo.item}
      onPress={() => onPress(dataInfo.item)}
      containerStyle={{
        marginHorizontal,
        marginVertical,
        width,
        height,
      }}
      style={{
        flexGrow: 1,
        backgroundColor: '#E0F7FA',
        borderColor: Colors.primary,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Topbar searchPlaceholder={searchPlaceholder} searchState={searchState} />
      <HorizontalDivider />
      <Grid
        data={data}
        renderTile={renderTile}
        numColumns={2}
        numRows={5}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
