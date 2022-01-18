import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { toggleLikeStudyMaterial } from '../../store/slices/studyMaterial';

export default function StudyMaterialScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'StudyMaterial'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.id];

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: studyMaterial.name });
  }, [navigation, isFocused]);

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <View style={[styles.block, styles.line]}>
        <CustomButton
          onPress={() => dispatch(toggleLikeStudyMaterial({ studyMaterialId: studyMaterial.id }))}
          style={{
            flexDirection: 'row',
            backgroundColor: studyMaterial.hasLiked ? '#1E88E5' : Colors.white,
            borderColor: studyMaterial.hasLiked ? Colors.white : '#1E88E5',
          }}
        >
          <MaterialIcons
            name="thumb-up"
            size={30}
            color={studyMaterial.hasLiked ? Colors.white : '#1E88E5'}
            style={styles.icon}
          />
          <SemiBoldText style={[styles.text, {
            color: studyMaterial.hasLiked ? Colors.white : '#1E88E5',
          }]}
          >
            {studyMaterial.likes}
          </SemiBoldText>
        </CustomButton>
        <View style={styles.textContainer}>
          <SemiBoldText style={styles.text}>
            {`${studyMaterial.name} - ${studyMaterial.type}`}
          </SemiBoldText>
        </View>
      </View>
      <View style={[styles.block, styles.line]}>
        <View style={styles.iconStar}>
          <AntDesign name="star" size={24} color="#FBC02D" style={styles.icon} />
          <SemiBoldText style={styles.text}>
            {studyMaterial.authorRating}
          </SemiBoldText>
        </View>
        <View style={styles.textContainer}>
          <RegularText numberOfLines={1} style={styles.text}>
            <SemiBoldText>Author</SemiBoldText>
            {`: ${studyMaterial.author}`}
          </RegularText>
        </View>
      </View>
      <View style={[styles.block, styles.line]}>
        <RegularText numberOfLines={5} style={styles.subtext}>
          <SemiBoldText>Description</SemiBoldText>
          {`: ${studyMaterial.description}`}
        </RegularText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: '15%',
    aspectRatio: 1,
    marginHorizontal: 5,
  },
  textContainer: {
    width: '75%',
    padding: 5,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    textAlign: 'left',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconStar: {
    width: '15%',
    aspectRatio: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 5,
  },
});
