import * as React from 'react';
import { ReactElement } from 'react';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';

import { RenderItemProps } from './ItemList';
import { View } from './UI/Themed';
import HorizontalDivider from './UI/HorizontalDivider';
import Writingbar from './Writingbar';
import Fallback from './UI/Fallback';

export interface RenderListHeaderComponentProps {
  marginHorizontal: number
  marginVertical: number
}

interface DiscussionListProps<T> {
  renderListHeaderComponent?: (props: RenderListHeaderComponentProps) =>
  React.ComponentType<any> | React.ReactElement | null
  items: T[]
  renderItem: (info: RenderItemProps<T>) => ReactElement
  refreshing: boolean
  onRefresh: () => void
  placeholder: string
  onSend: (message: string) => void
  fallbackMessage: string
}

export default function DiscussionList<T>({
  renderListHeaderComponent,
  items,
  renderItem,
  refreshing,
  onRefresh,
  placeholder,
  onSend,
  fallbackMessage,
}: DiscussionListProps<T>) {
  const windowDimensions = useWindowDimensions();
  const marginHorizontal = windowDimensions.height / 150;
  const marginVertical = windowDimensions.height / 150;

  const ListHeaderComponent = renderListHeaderComponent && renderListHeaderComponent({
    marginHorizontal,
    marginVertical,
  });

  return (
    <View style={styles.container}>
      <View>
        <HorizontalDivider />
        <Writingbar placeholder={placeholder} onSend={onSend} />
      </View>
      {items.length > 0 && (
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(dataInfo) => renderItem({
            dataInfo,
            marginHorizontal,
            marginVertical,
          })}
          numColumns={1}
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      {items.length === 0 && <Fallback message={fallbackMessage} />}
      {items.length === 0 && ListHeaderComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column-reverse',
  },
  contentContainer: {
    flexGrow: 1,
  },
  list: {
    flex: 1,
    width: '100%',
  },
});
