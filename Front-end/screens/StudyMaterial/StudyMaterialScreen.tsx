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
  buyStudyMaterial,
  exchangeStudyMaterial,
  toggleLikeStudyMaterial,
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
        dispatch(buyStudyMaterial({ studyMaterialId: studyMaterial.id }));
      },
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [navigation, dispatch, exchangeStudyMaterial, studyMaterial],
  );

  const confirmStudyMaterialExchange = useCallback(
    (requesterStudyMaterial: StudyMaterial) => Alert.alert('Study Material Exchange', `
    Are you sure you want to exchange the study material '${requesterStudyMaterial.name}' for '${studyMaterial.name}'?
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => {
        dispatch(exchangeStudyMaterial({
          requesterStudyMaterialId: requesterStudyMaterial.id,
          requesteeStudyMaterialId: studyMaterial.id,
        }));
      },
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [pickerRef, navigation, dispatch, exchangeStudyMaterial, studyMaterial],
  );

  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <CustomButton
            onPress={() => {
              dispatch(toggleLikeStudyMaterial({ studyMaterialId: studyMaterial.id }));
            }}
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
        <View style={styles.line}>
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
        <View style={styles.line}>
          <RegularText numberOfLines={5} style={styles.subtext}>
            <SemiBoldText>Description</SemiBoldText>
            {`: ${studyMaterial.description}`}
          </RegularText>
        </View>
        {acquiredStudyMaterials.some(({ id }) => id === studyMaterial.id) ? (
          <View style={[styles.line, styles.actionContainer]}>
            <CustomButton
              onPress={() => {
              }}
              style={styles.action}
            >
              <FontAwesome5
                name="link"
                size={24}
                color={Colors.white}
                style={styles.icon}
              />
              <SemiBoldText style={[styles.text, { color: Colors.white }]}>
                Get link
              </SemiBoldText>
            </CustomButton>
          </View>
        ) : (
          <View style={styles.line}>
            <View style={styles.actionContainer}>
              <CustomButton
                onPress={confirmStudyMaterialPurchase}
                style={styles.action}
              >
                <FontAwesome5
                  name="link"
                  size={24}
                  color={Colors.white}
                  style={styles.icon}
                />
                <SemiBoldText style={[styles.text, { color: Colors.white }]}>
                  Purchase
                </SemiBoldText>
              </CustomButton>
            </View>
            <View style={styles.actionContainer}>
              <CustomButton
                onPress={() => (pickerRef.current as any)?.focus()}
                style={styles.action}
              >
                <FontAwesome
                  name="exchange"
                  size={24}
                  color={Colors.white}
                  style={styles.icon}
                />
                <SemiBoldText style={[styles.text, { color: Colors.white }]}>
                  Exchange
                </SemiBoldText>
              </CustomButton>
            </View>
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
    flexDirection: 'row',
    width: '95%',
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
  icon: {
    marginRight: 5,
  },
  hspace: {
    width: 10,
  },
  actionContainer: {
    width: '45%',
  },
  action: {
    flexDirection: 'row',
    backgroundColor: '#1E88E5',
    borderColor: Colors.white,
  },
});
