import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  StyleSheet, View, Modal, Pressable, ViewProps, TextProps,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from './StyledText';
import CustomButton from './CustomButton';

export interface ConfirmationAlertValues {
  title: string
  message: string
  onConfirm: () => void
}

export interface ConfirmationAlertProps {
  values: ConfirmationAlertValues
  visibilityState: [boolean, Dispatch<SetStateAction<boolean>>]
}

export default function ConfirmationAlert({
  values,
  visibilityState,
}: ConfirmationAlertProps) {
  const ButtonBox = () => {
    const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(1);
    const buttonProps: {
      text: string,
      entypoName: 'cross' | 'check'
      onPress: (() => void) | null
      containerStyle: ViewProps['style']
      textStyle: TextProps['style']
    }[] = [{
      text: 'Cancel',
      entypoName: 'cross',
      onPress: null,
      textStyle: styles.textStyleCancelButton,
      containerStyle: styles.containerStyleCancelButton,
    }, {
      text: 'Yes',
      entypoName: 'check',
      onPress: values.onConfirm,
      textStyle: styles.textStyleYesButton,
      containerStyle: styles.containerStyleYesButton,
    }];

    return (
      <View
        onLayout={(e) => {
          if (e.nativeEvent.layout.height > 60) setButtonLayoutHorizontal(0);
        }}
        style={[styles.buttonGroup, {
          flexDirection: buttonLayoutHorizontal === 1 ? 'row' : 'column',
        }]}
      >
        {buttonProps.map((item, index) => (
          <CustomButton
            key={index.toString()}
            onPress={() => {
              visibilityState[1](false);
              if (item.onPress) item.onPress();
            }}
            style={item.containerStyle}
            row
          >
            <Entypo name={item.entypoName} size={26} color={Colors.white} />
            <SemiBoldText style={item.textStyle}>{item.text}</SemiBoldText>
          </CustomButton>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visibilityState[0]}
      animationType="fade"
      transparent
      onRequestClose={() => {
        visibilityState[1](false);
      }}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          visibilityState[1](false);
        }}
      />
      <View style={styles.alertBox}>
        <View style={styles.alertBoxInner}>
          <SemiBoldText style={styles.title}>
            {values.title}
          </SemiBoldText>
          <RegularText style={styles.message}>
            {values.message}
          </RegularText>
          <ButtonBox />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: Colors.black,
    opacity: 0.4,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  alertBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBoxInner: {
    backgroundColor: Colors.white,
    maxWidth: '90%',
    elevation: 24,
  },
  title: {
    margin: 24,
    fontSize: 20,
    textAlign: 'center',
  },
  message: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  containerStyleYesButton: {
    minWidth: '40%',
    backgroundColor: Colors.success,
    borderColor: Colors.transparent,
  },
  containerStyleCancelButton: {
    minWidth: '40%',
    backgroundColor: Colors.error,
    borderColor: Colors.transparent,
  },
  textStyleYesButton: {
    marginLeft: 5,
    fontSize: 20,
    color: Colors.white,
  },
  textStyleCancelButton: {
    marginLeft: 5,
    fontSize: 20,
    color: Colors.white,
  },
});
