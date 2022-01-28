import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/core';
import {
  AntDesign, FontAwesome, FontAwesome5, MaterialIcons,
} from '@expo/vector-icons';

import { SMStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import ConfirmationAlert, { ConfirmationAlertValues } from '../../components/UI/ConfirmationAlert';
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
  const localId = useAppSelector((s) => s.authentication.localId);
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterial = studyMaterials[route.params.id];
  const myStudyMaterials = useAppSelector((s) => [
    ...s.studyMaterial.acquired,
    ...s.studyMaterial.uploaded,
  ])
    .map((studyMaterialId) => studyMaterials[studyMaterialId]);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: studyMaterial.name });
  }, [navigation, isFocused]);

  const [confirmationModalValues, setConfirmationModalValues] = useState<ConfirmationAlertValues>();
  const confirmationModalVisibilityState = useState(false);

  const onOpenConfirmationModal = (values: ConfirmationAlertValues) => {
    setConfirmationModalValues(values);
    confirmationModalVisibilityState[1](true);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <CustomButton
            onPress={() => {
              if (localId) {
                dispatch(toggleStudyMaterialLike({ studyMaterialId: studyMaterial.id }));
              } else {
                navigation.navigate('A_Login');
              }
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
          <View style={styles.iconLContainer}>
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
            <RegularText style={styles.text}>
              <SemiBoldText>Author: </SemiBoldText>
              {studyMaterial.author}
            </RegularText>
          </View>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.subtext}>
            <SemiBoldText>Description: </SemiBoldText>
            {studyMaterial.description}
          </RegularText>
        </View>
        <View style={styles.line}>
          <CustomButton
            onPress={() => {
              if (localId) {
                navigation.navigate('Discussion', { studyMaterialId: route.params.id });
              } else {
                navigation.navigate('A_Login');
              }
            }}
            style={[styles.action, { backgroundColor: Colors.cyan }]}
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
            <View style={{ backgroundColor: Colors.transparent }}>
              <RegularText style={styles.actionSubtext}>
                {`${studyMaterial.reviews.length} Reviews`}
              </RegularText>
            </View>
          </CustomButton>
        </View>
        {myStudyMaterials.some(({ id }) => id === studyMaterial.id) ? (
          <View style={styles.line}>
            <CustomButton
              onPress={() => {
                dispatch(fetchStudyMaterialLink({ studyMaterialId: studyMaterial.id }));
              }}
              style={styles.action}
              row
            >
              <FontAwesome5
                name="file-download"
                size={24}
                color={Colors.white}
                style={styles.iconL}
              />
              <SemiBoldText style={styles.actionText}>Get File</SemiBoldText>
            </CustomButton>
          </View>
        ) : (
          <View style={styles.line}>
            <CustomButton
              onPress={() => {
                if (localId) {
                  onOpenConfirmationModal({
                    title: 'Study Material Purchase',
                    message: `Are you sure you want to purchase the study material '${studyMaterial.name}'?`,
                    onConfirm: () => {
                      dispatch(purchaseStudyMaterial({ studyMaterialId: studyMaterial.id }));
                    },
                  });
                } else {
                  navigation.navigate('A_Login');
                }
              }}
              style={[styles.action, { backgroundColor: Colors.blue }]}
            >
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
              onPress={() => {
                if (localId) {
                  if (myStudyMaterials.length > 0) {
                    (pickerRef.current as any)?.focus();
                  } else {
                    Alert.alert('Exchange', 'You have not yet purchased or uploaded study materials.\nYou must first have study materials to propose exchanges.', [{
                      text: 'Got it!',
                      style: 'default',
                    }], {
                      cancelable: true,
                    });
                  }
                } else {
                  navigation.navigate('A_Login');
                }
              }}
              style={[styles.action, { backgroundColor: Colors.accent }]}
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
                onOpenConfirmationModal({
                  title: 'Study Material Exchange',
                  message: `Are you sure you want to exchange the study material '${studyMaterials[itemValue].name}' for '${studyMaterial.name}'?`,
                  onConfirm: () => {
                    dispatch(proposeExchange({
                      requesterStudyMaterialId: itemValue,
                      requesteeStudyMaterialId: studyMaterial.id,
                    }));
                  },
                });
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
              {myStudyMaterials.map((myStudyMaterial) => (
                <Picker.Item
                  key={myStudyMaterial.id}
                  label={`📚 ${myStudyMaterial.name}`}
                  value={myStudyMaterial.id}
                  fontFamily="OpenSans-Regular"
                  color={Colors.primary}
                />
              ))}
            </Picker>
            {confirmationModalValues && (
            <ConfirmationAlert
              values={confirmationModalValues}
              visibilityState={confirmationModalVisibilityState}
            />
            )}
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
    marginVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    width: '75%',
    flexDirection: 'row',
    marginLeft: 15,
  },
  text: {
    fontSize: 20,
  },
  subtext: {
    fontSize: 18,
  },
  iconLContainer: {
    width: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconL: {
    marginRight: 10,
  },
  iconR: {
    marginLeft: 10,
  },
  action: {
    minWidth: '47.5%',
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
    marginHorizontal: 2.5,
  },
  actionSeparation: {
    flexDirection: 'row',
    backgroundColor: Colors.transparent,
  },
  actionText: {
    fontSize: 20,
    color: Colors.white,
  },
  actionSubtext: {
    fontSize: 18,
    color: Colors.white,
  },
});
