import * as React from 'react';
import { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View as DefaultView,
  StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { ProfileScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchUser } from '../../store/slices/user';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const windowDimensions = useWindowDimensions();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.user.isLoading);
  const user = useAppSelector((s) => s.user.user);
  const [showQRCode, setShowQRCode] = useState(false);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()!.setOptions({ headerTitle: 'Profile' });
      dispatch(fetchUser());
    }
  }, [navigation, isFocused]);

  return isLoading || !user ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <RegularText style={styles.subtext}>
            <SemiBoldText style={styles.text}>{user.name}</SemiBoldText>
            {'\n'}
            {user.email}
          </RegularText>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.text}>
            <SemiBoldText>Institution: </SemiBoldText>
            {user.institution}
          </RegularText>
        </View>
        <View>
          <View style={styles.line}>
            <CustomButton
              onPress={() => Alert.alert('Credits', 'With the credits you have, you can buy study materials, sign up for tutoring sessions, and shop at partner education stores.\nYou can earn credits by selling study materials that you upload to the app or by offering tutoring sessions.', [{
                text: 'Got it!',
                style: 'default',
              }], {
                cancelable: true,
              })}
              style={styles.infoButton}
              small
            >
              <Entypo name="info" size={18} color={Colors.white} />
            </CustomButton>
            <RegularText style={styles.importantText}>
              <SemiBoldText>Credits: </SemiBoldText>
              {user.credits}
            </RegularText>
            <FontAwesome5
              name="ticket-alt"
              size={24}
              color={Colors.purple}
              style={styles.iconR}
            />
          </View>
          <View style={styles.line}>
            <CustomButton
              onPress={() => Alert.alert('Rating', 'The higher your rating, the more reputation you have on the app, you gain reputation from the likes that other users give you on the study materials you publish or the reviews you write.', [{
                text: 'Got it!',
                style: 'default',
              }], {
                cancelable: true,
              })}
              style={styles.infoButton}
              small
            >
              <Entypo name="info" size={18} color={Colors.white} />
            </CustomButton>
            <RegularText style={styles.importantText}>
              <SemiBoldText>Rating: </SemiBoldText>
              {user.rating}
            </RegularText>
            <AntDesign
              name="star"
              size={24}
              color={Colors.yellow}
              style={styles.iconR}
            />
          </View>
          <View style={styles.line}>
            <CustomButton
              onPress={() => Alert.alert('Pay with', 'You can pay with this QRCode at educational partner stores, by doing so, credits equivalent to the purchase amount will be deducted from your account.\nYou can press the QRCode to open it wide.', [{
                text: 'Got it!',
                style: 'default',
              }], {
                cancelable: true,
              })}
              style={styles.infoButton}
              small
            >
              <Entypo name="info" size={18} color={Colors.white} />
            </CustomButton>
            <SemiBoldText style={styles.importantText}>
              Pay with:
            </SemiBoldText>
          </View>
          <View style={styles.line}>
            <TouchableWithoutFeedback onPress={() => setShowQRCode(true)}>
              <View style={{ width: windowDimensions.width / 2 }}>
                <QRCode
                  value="https://ccu2122group03.wordpress.com/"
                  color={Colors.primary}
                  size={windowDimensions.width / 2}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <Modal
          visible={showQRCode}
          animationType="fade"
          transparent
          onRequestClose={() => {
            setShowQRCode(false);
          }}
        >
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowQRCode(false)}
          />
          <DefaultView style={styles.alertBox}>
            <View style={styles.alertBoxInner}>
              <QRCode
                value="https://ccu2122group03.wordpress.com/"
                color={Colors.primary}
                size={windowDimensions.width - 40}
              />
            </View>
          </DefaultView>
        </Modal>
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
  importantText: {
    fontSize: 25,
  },
  text: {
    fontSize: 20,
  },
  subtext: {
    fontSize: 18,
    textAlign: 'center',
  },
  iconR: {
    marginLeft: 10,
  },
  infoButton: {
    borderRadius: 100,
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
    marginRight: 10,
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
    padding: 10,
    elevation: 24,
  },
});
