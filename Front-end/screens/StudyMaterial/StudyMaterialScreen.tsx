import * as React from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/core';
import {
  AntDesign, FontAwesome, FontAwesome5, MaterialIcons,
} from '@expo/vector-icons';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import StudyMaterial from '../../models/StudyMaterial';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  purchaseStudyMaterial,
  proposeExchange,
  fetchStudyMaterialLink,
  toggleStudyMaterialLike,
} from '../../store/slices/studyMaterial';

export default function StudyMaterialScreen({
  navigation,
  route,
}: SMStoreStackScreenProps<'StudyMaterial'>) {
  const dispatch = useAppDispatch();
  const pickerRef = useRef<Picker<string>>(null);
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.id];
  const acquiredStudyMaterials = useAppSelector((s) => s.studyMaterial.acquiredStudyMaterials)
    .map((studyMaterialId) => studyMaterials[studyMaterialId]);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: studyMaterial.name });
  }, [navigation, isFocused]);

  const confirmStudyMaterialPurchase = useCallback(
    () => Alert.alert('Study Material Purchase', `
    Are you sure you want to purchase the study material '${studyMaterial.name}'?
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => {
        dispatch(purchaseStudyMaterial({ studyMaterialId: studyMaterial.id }));
      },
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [navigation, dispatch, proposeExchange, studyMaterial],
  );

  const confirmStudyMaterialExchange = useCallback(
    (requesterStudyMaterial: StudyMaterial) => Alert.alert('Study Material Exchange', `
    Are you sure you want to exchange the study material '${requesterStudyMaterial.name}' for '${studyMaterial.name}'?
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => {
        dispatch(proposeExchange({
          requesterStudyMaterialId: requesterStudyMaterial.id,
          requesteeStudyMaterialId: studyMaterial.id,
        }));
      },
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [pickerRef, navigation, dispatch, proposeExchange, studyMaterial],
  );

  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <CustomButton
            onPress={() => {
              dispatch(toggleStudyMaterialLike({ studyMaterialId: studyMaterial.id }));
            }}
            style={{
              backgroundColor: studyMaterial.hasLiked ? Colors.yellow : Colors.blue,
              borderColor: Colors.transparent,
            }}
            row
          >
            <MaterialIcons
              name="thumb-up"
              size={30}
              color={studyMaterial.hasLiked ? Colors.primary : Colors.white}
              style={styles.iconL}
            />
            <SemiBoldText style={[styles.text, {
              color: studyMaterial.hasLiked ? Colors.primary : Colors.white,
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
        <View style={styles.line}>
          <View style={styles.iconStar}>
            <AntDesign
              name="star"
              size={24}
              color={Colors.yellow}
              style={styles.iconL}
            />
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
        <View style={styles.line}>
          <RegularText numberOfLines={5} style={styles.subtext}>
            <SemiBoldText>Description</SemiBoldText>
            {`: ${studyMaterial.description}`}
          </RegularText>
        </View>
        <View style={styles.line}>
          <CustomButton
            onPress={() => navigation.navigate('Discussion', { studyMaterialId: route.params.id })}
            style={styles.action}
          >
            <View style={styles.actionSeparation}>
              <FontAwesome
                name="comments"
                size={24}
                color={Colors.white}
                style={styles.iconL}
              />
              <SemiBoldText style={styles.actionText}>Discussion</SemiBoldText>
            </View>
            <View style={{
              flexDirection: 'row-reverse',
              backgroundColor: Colors.transparent,
            }}
            >
              <RegularText style={styles.actionSubtext}>
                {`${studyMaterial.reviews.length} Reviews`}
              </RegularText>
            </View>
          </CustomButton>
        </View>
        {acquiredStudyMaterials.some(({ id }) => id === studyMaterial.id) ? (
          <View style={styles.line}>
            <CustomButton
              onPress={() => {
                dispatch(fetchStudyMaterialLink({ studyMaterialId: studyMaterial.id }));
              }}
              style={styles.action}
              row
            >
              <FontAwesome5
                name="link"
                size={24}
                color={Colors.white}
                style={styles.iconL}
              />
              <SemiBoldText style={styles.actionText}>Get Link</SemiBoldText>
            </CustomButton>
          </View>
        ) : (
          <View style={styles.line}>
            <CustomButton onPress={confirmStudyMaterialPurchase} style={styles.action}>
              <View style={styles.actionSeparation}>
                <FontAwesome5
                  name="link"
                  size={24}
                  color={Colors.white}
                  style={styles.iconL}
                />
                <SemiBoldText style={styles.actionText}>Purchase</SemiBoldText>
              </View>
              <View style={styles.actionSeparation}>
                <RegularText style={styles.actionSubtext}>
                  {studyMaterial.price}
                </RegularText>
                <FontAwesome5
                  name="ticket-alt"
                  size={24}
                  color={Colors.white}
                  style={styles.iconR}
                />
              </View>
            </CustomButton>
            <CustomButton
              onPress={() => (pickerRef.current as any)?.focus()}
              style={styles.action}
              row
            >
              <FontAwesome
                name="exchange"
                size={24}
                color={Colors.white}
                style={styles.iconL}
              />
              <SemiBoldText style={styles.actionText}>Exchange</SemiBoldText>
            </CustomButton>
            <Picker
              ref={pickerRef}
              selectedValue="Unselected"
              onValueChange={(itemValue) => {
                (pickerRef.current as any)?.blur();
                confirmStudyMaterialExchange(studyMaterials[itemValue]);
              }}
              mode="dialog"
              dropdownIconColor={Colors.primary}
              style={{ display: 'none' }}
            >
              <Picker.Item
                label="Exchange this study material for:"
                value="Unselected"
                fontFamily="OpenSans-Regular"
                enabled={false}
                color={Colors.black}
              />
              {acquiredStudyMaterials.map((acquiredStudyMaterial) => (
                <Picker.Item
                  key={acquiredStudyMaterial.id}
                  label={`📚 ${acquiredStudyMaterial.name}`}
                  value={acquiredStudyMaterial.id}
                  fontFamily="OpenSans-Regular"
                  color={Colors.primary}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    marginVertical: 20,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textContainer: {
    width: '75%',
    padding: 5,
    marginLeft: 10,
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
  iconL: {
    marginRight: 10,
  },
  iconR: {
    marginLeft: 10,
  },
  hspace: {
    width: 10,
  },
  action: {
    width: '47.5%',
    marginHorizontal: 10,
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
  },
  actionSeparation: {
    flexDirection: 'row',
    backgroundColor: Colors.transparent,
  },
  actionText: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.white,
  },
  actionSubtext: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.white,
  },
});
