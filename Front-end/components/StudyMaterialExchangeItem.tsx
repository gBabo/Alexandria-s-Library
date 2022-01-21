import React, { useCallback } from 'react';
import {
  Alert,
  GestureResponderEvent, StyleSheet, View, ViewProps,
} from 'react-native';
import {
  AntDesign, Entypo, FontAwesome, MaterialIcons,
} from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { StudyMaterialExchange } from '../models/StudyMaterial';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';

export type StudyMaterialExchangeExtended = StudyMaterialExchange & {
  requesterSMName: string
  requesteeSMName: string
  requesterSMLikes: number
  requesteeSMLikes: number
};

interface StudyMaterialExchangeItemProps {
  studyMaterialExchange: StudyMaterialExchangeExtended
  onPress: (event: GestureResponderEvent) => void
  onSettleExchange: (accept: boolean) => void
  containerStyle: ViewProps['style']
  style: ViewProps['style']
}

export default function StudyMaterialExchangeItem({
  studyMaterialExchange,
  onPress,
  onSettleExchange,
  containerStyle,
  style,
}: StudyMaterialExchangeItemProps) {
  const confirmExchange = useCallback(
    (accept: boolean) => Alert.alert('Study Materials Exchange', accept ? `
    Are you sure you want to exchange the study material '${studyMaterialExchange.requesteeSMName}' for '${studyMaterialExchange.requesterSMName}'?
    ` : `
    Are you sure you want to reject the proposal to exchange the study material '${studyMaterialExchange.requesteeSMName}' for '${studyMaterialExchange.requesterSMName}'? 
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => onSettleExchange(accept),
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [studyMaterialExchange, onSettleExchange],
  );

  return (
    <View style={containerStyle}>
      <CustomButton onPress={onPress} style={style}>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="thumb-up"
              size={24}
              color={Colors.blue}
              style={styles.icon}
            />
            <SemiBoldText style={styles.text}>
              {studyMaterialExchange.requesteeSMLikes}
            </SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <RegularText numberOfLines={2} style={styles.text}>
              <SemiBoldText>Acquired: </SemiBoldText>
              {` ${studyMaterialExchange.requesteeSMName}`}
            </RegularText>
          </View>
        </View>
        <View style={[styles.line, styles.textAlone]}>
          <FontAwesome
            name="exchange"
            size={24}
            color={Colors.primary}
          />
        </View>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="thumb-up"
              size={24}
              color={Colors.blue}
              style={styles.icon}
            />
            <SemiBoldText style={styles.text}>
              {studyMaterialExchange.requesterSMLikes}
            </SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <RegularText numberOfLines={2} style={styles.text}>
              <SemiBoldText>Proposed: </SemiBoldText>
              {` ${studyMaterialExchange.requesterSMName}`}
            </RegularText>
          </View>
        </View>
        <View style={styles.line}>
          <View style={styles.iconContainer}>
            <AntDesign name="star" size={24} color={Colors.yellow} style={styles.icon} />
            <SemiBoldText style={styles.text}>
              {studyMaterialExchange.requesterRating}
            </SemiBoldText>
          </View>
          <View style={styles.textBetweenIcons}>
            <RegularText numberOfLines={1} style={styles.text}>
              <SemiBoldText>Proposer: </SemiBoldText>
              {studyMaterialExchange.requesterName}
            </RegularText>
          </View>
        </View>
        <View style={[styles.line, styles.buttonsAlone]}>
          <CustomButton
            onPress={() => confirmExchange(true)}
            style={styles.acceptButton}
            small
          >
            <Entypo name="check" size={30} color={Colors.white} />
          </CustomButton>
          <CustomButton
            onPress={() => confirmExchange(false)}
            style={styles.rejectButton}
            small
          >
            <Entypo name="cross" size={30} color={Colors.white} />
          </CustomButton>
        </View>
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
  },
  textAlone: {
    justifyContent: 'center',
  },
  textBetweenIcons: {
    width: '80%',
    paddingLeft: 10,
  },
  iconContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonsAlone: {
    justifyContent: 'space-evenly',
  },
  acceptButton: {
    borderRadius: 100,
    backgroundColor: Colors.success,
    borderColor: Colors.transparent,
  },
  rejectButton: {
    borderRadius: 100,
    backgroundColor: Colors.error,
    borderColor: Colors.transparent,
  },
});
