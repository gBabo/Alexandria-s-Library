import React, { ReactElement, useState } from 'react';
import {
  StyleSheet, FlatList, useWindowDimensions, ListRenderItemInfo,
} from 'react-native';

import { View } from './UI/Themed';
import HorizontalDivider from './UI/HorizontalDivider';
import Topbar, { SortingMethod } from './Topbar';

export interface RenderItemProps<T> {
  dataInfo: ListRenderItemInfo<T>
  marginHorizontal: number
  marginVertical: number
}

interface ItemListProps<T> {
  items: T[]
  keys: (keyof T)[]
  searchPlaceholder: string
  sortingOptions: { label: string, value: keyof T }[]
  defaultSortingMethod: SortingMethod<T>
  renderItem: (info: RenderItemProps<T>) => ReactElement
  refreshing: boolean
  onRefresh: () => void
}

export default function ItemList<T>({
  items,
  keys,
  searchPlaceholder,
  sortingOptions,
  defaultSortingMethod,
  renderItem,
  refreshing,
  onRefresh,
}: ItemListProps<T>) {
  const windowDimensions = useWindowDimensions();
  const marginHorizontal = windowDimensions.height / 150;
  const marginVertical = windowDimensions.height / 150;

  const searchState = useState('');
  const sortingMethodState = useState<SortingMethod<T>>(defaultSortingMethod);

  const data = items
    .filter((item) => keys.some((key) => `${item[key]}`
      .toLowerCase()
      .includes(searchState[0].toLowerCase())))
    .sort((a, b) => {
      const key = sortingMethodState[0].value as keyof T;
      const value = sortingMethodState[0].order === 'Ascending' ? 1 : -1;
      if (a[key] < b[key]) return -value;
      if (a[key] > b[key]) return value;
      return 0;
    });

  return (
    <View style={styles.container}>
      <Topbar
        searchPlaceholder={searchPlaceholder}
        searchState={searchState}
        sortingMethodState={sortingMethodState}
        sortingOptions={sortingOptions}
      />
      <HorizontalDivider />
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(dataInfo) => renderItem({
          dataInfo,
          marginHorizontal,
          marginVertical,
        })}
        numColumns={1}
        style={styles.list}
        contentContainerStyle={styles.container}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
