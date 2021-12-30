import React, { ReactElement } from 'react';
import {
  ListRenderItemInfo, StyleSheet, FlatList, useWindowDimensions,
} from 'react-native';

export interface RenderTileProps<T> {
  dataInfo: ListRenderItemInfo<T>
  marginHorizontal: number
  marginVertical: number
  width: number
}

interface GridProps<T = any> {
  data: T[]
  renderTile: (info: RenderTileProps<T>) => ReactElement
  numColumns: number
  numRows: number
  refreshing?: boolean | null
  onRefresh?: (() => void) | null
}

export default function Grid({
  data,
  renderTile,
  numColumns,
  numRows,
  refreshing = null,
  onRefresh = null,
}: GridProps) {
  const windowDimensions = useWindowDimensions();

  const inLandscape = windowDimensions.width > windowDimensions.height;
  const numColumnsDynamic = inLandscape ? numRows : numColumns;

  const marginHorizontal = windowDimensions.height / 100;
  const marginVertical = windowDimensions.height / 100;
  const width = windowDimensions.width / numColumnsDynamic - 2 * marginHorizontal;

  return (
    <FlatList
      key={numColumnsDynamic}
      data={data}
      renderItem={(dataInfo) => renderTile({
        dataInfo,
        marginHorizontal,
        marginVertical,
        width,
      })}
      numColumns={numColumnsDynamic}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={styles.list}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
});
