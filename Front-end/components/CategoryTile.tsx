import React, { ComponentType } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';

import { SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';

interface CategoryTileProps {
  category: string
  onPress: (event: GestureResponderEvent) => void
  containerStyle: StyleProp<ViewStyle>
}

export default function CategoryTile({
  category,
  onPress,
  containerStyle,
}: CategoryTileProps) {
  const TouchableComponent: ComponentType<TouchableOpacityProps | TouchableNativeFeedbackProps> = Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

  return (
    <Card style={containerStyle}>
      <TouchableComponent onPress={onPress}>
        <View style={styles.innerContainer}>
          <SemiBoldText style={styles.title}>{category}</SemiBoldText>
        </View>
      </TouchableComponent>
    </Card>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
});
