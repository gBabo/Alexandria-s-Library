import React, { ReactElement } from 'react';
import {
  ListRenderItemInfo, StyleSheet, FlatList, useWindowDimensions,
} from 'react-native';

export interface RenderTileProps<T> {
  dataInfo: ListRenderItemInfo<T>
  marginHorizontal: number
  marginVertical: number
  width: number
  height: number
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
  const numRowsDynamic = inLandscape ? numColumns : numRows;

  const marginHorizontal = windowDimensions.height / 150;
  const marginVertical = windowDimensions.height / 150;
  const width = windowDimensions.width / numColumnsDynamic - 2 * marginHorizontal;
  const height = windowDimensions.height / numRowsDynamic - 2 * marginVertical;

  return (
    <FlatList
      key={numColumnsDynamic}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={(dataInfo) => renderTile({
        dataInfo,
        marginHorizontal,
        marginVertical,
        width,
        height,
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
    flexGrow: 1,
  },
  list: {
    width: '100%',
  },
});
