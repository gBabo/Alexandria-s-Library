import React from 'react';
import {
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';

import { SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

interface CategoryTileProps {
  category: string
  onPress: (event: GestureResponderEvent) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function CategoryTile({
  category,
  onPress,
  containerStyle,
  style,
}: CategoryTileProps) {
  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <SemiBoldText style={styles.title}>{category}</SemiBoldText>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
});
