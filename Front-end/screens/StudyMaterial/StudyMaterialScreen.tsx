import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

import { SMStoreStackScreenProps } from '../../navigation/types';
import { RegularText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import useAppSelector from '../../hooks/useAppSelector';

export default function StudyMaterialScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'StudyMaterial'>) {
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.id];

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: studyMaterial.name });
  }, [navigation, isFocused]);

  return (
    <View style={styles.container}>
      <RegularText>
        StudyMaterialScreen
      </RegularText>
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
