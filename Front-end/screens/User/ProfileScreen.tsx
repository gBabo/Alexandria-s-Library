import * as React from 'react';
import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { ProfileScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchUser } from '../../store/slices/user';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.user.isLoading);
  const user = useAppSelector((s) => s.user.user);

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
        <View style={styles.line}>
          <RegularText style={styles.text}>
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
          <RegularText style={styles.text}>
            <SemiBoldText>Rating: </SemiBoldText>
            {user.rating}
          </RegularText>
          <AntDesign name="star" size={24} color={Colors.yellow} style={styles.iconR} />
        </View>
        <View style={styles.line}>
          <SemiBoldText style={styles.text}>
            Pay with:
            {'\n\n'}
            <QRCode
              value="https://ccu2122group03.wordpress.com/"
              color={Colors.primary}
              size={250}
            />
          </SemiBoldText>
        </View>
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
});
