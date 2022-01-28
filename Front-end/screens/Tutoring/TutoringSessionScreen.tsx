import * as React from 'react';
import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import { TStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from '../../components/UI/StyledText';
import { View } from '../../components/UI/Themed';
import Loading from '../../components/UI/Loading';
import CustomButton from '../../components/UI/CustomButton';
import ConfirmationAlert, { ConfirmationAlertValues } from '../../components/UI/ConfirmationAlert';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  enrollTutoringSession,
  onSettleEnrollmentStatus,
  onSettleAllEnrollmentStatus,
} from '../../store/slices/tutoring';
import EnrollsList from '../../components/EnrollsList';

export default function TutoringSessionScreen({
  navigation,
  route,
}: TStoreStackScreenProps<'TutoringSession'>) {
  const dispatch = useAppDispatch();
  const localId = useAppSelector((s) => s.authentication.localId);
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const email = useAppSelector((s) => s.user.user!.email);
  const tutoringSessions = useAppSelector((s) => s.tutoring.tutoringSessions);
  const tutoringSession = tutoringSessions[route.params.id];

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: tutoringSession.name });
  }, [navigation, isFocused]);

  const [confirmationModalValues, setConfirmationModalValues] = useState<ConfirmationAlertValues>();
  const confirmationModalVisibilityState = useState(false);

  const onOpenConfirmationModal = (values: ConfirmationAlertValues) => {
    setConfirmationModalValues(values);
    confirmationModalVisibilityState[1](true);
  };

  const isEnrolled = [
    ...tutoringSession.pendingEnrolls,
    ...tutoringSession.enrolled,
  ].some((enroll) => enroll.email === email);

  return isLoading ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <SemiBoldText style={styles.text}>
            {tutoringSession.name}
          </SemiBoldText>
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
              {tutoringSession.tutorRating}
            </SemiBoldText>
          </View>
          <View style={styles.textContainer}>
            <RegularText style={styles.text}>
              <SemiBoldText>Tutor: </SemiBoldText>
              {tutoringSession.tutor}
            </RegularText>
          </View>
        </View>
        <View style={styles.line}>
          <View style={styles.iconLContainer}>
            <MaterialIcons
              name="location-pin"
              size={50}
              color={Colors.error}
            />
          </View>
          <View style={styles.textContainer}>
            <RegularText style={styles.text}>
              {tutoringSession.location}
            </RegularText>
          </View>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.text}>
            <SemiBoldText>Date: </SemiBoldText>
            {moment(tutoringSession.date)
              .format('lll')}
            {'\n'}
            <SemiBoldText style={styles.text}>Duration: </SemiBoldText>
            {`${tutoringSession.duration} minutes`}
          </RegularText>
        </View>
        <View style={styles.line}>
          <RegularText style={styles.subtext}>
            <SemiBoldText style={styles.text}>Description: </SemiBoldText>
            {tutoringSession.description}
          </RegularText>
        </View>
        {tutoringSession.tutorEmail === email ? (
          <View style={styles.lineContainer}>
            {tutoringSession.pendingEnrolls.length > 0 && (
            <View style={styles.line}>
              <EnrollsList
                title="Pending Enrollments"
                enrolls={tutoringSession.pendingEnrolls}
                pending
                onSettleEnrollmentStatus={(enrollmentId, accept) => dispatch(
                  onSettleEnrollmentStatus({
                    enrollmentId,
                    accept,
                  }),
                )}
                onSettleAllEnrollmentStatus={(accept) => dispatch(
                  onSettleAllEnrollmentStatus({
                    tutoringSessionId: tutoringSession.id,
                    accept,
                  }),
                )}
              />
            </View>
            )}
            {tutoringSession.enrolled.length > 0 && (
            <View style={styles.line}>
              <EnrollsList
                title="Accepted Enrollments"
                enrolls={tutoringSession.enrolled}
              />
            </View>
            )}
            {tutoringSession.enrolled.length === 0 && (
            <View style={styles.line}>
              <SemiBoldText style={styles.alertText}>
                You don't have confirmed registrations yet!
              </SemiBoldText>
            </View>
            )}
          </View>
        ) : (
          <View style={styles.line}>
            <CustomButton
              onPress={() => {
                if (localId) {
                  onOpenConfirmationModal({
                    title: 'Tutoring Session Enroll',
                    message: `Are you sure you want to sign up for tutoring session '${tutoringSession.name}'?`,
                    onConfirm: () => {
                      dispatch(enrollTutoringSession({ tutoringSessionId: tutoringSession.id }));
                    },
                  });
                } else {
                  navigation.navigate('A_Login');
                }
              }}
              disabled={isEnrolled}
              style={[styles.action, {
                backgroundColor: isEnrolled ? Colors.secondary : Colors.blue,
              }]}
            >
              <View style={styles.actionSeparation}>
                <FontAwesome5
                  name={isEnrolled ? 'user-check' : 'user-plus'}
                  size={24}
                  color={Colors.white}
                  style={styles.iconL}
                />
                <SemiBoldText style={styles.actionText}>Enroll</SemiBoldText>
              </View>
              <View style={styles.actionSeparation}>
                <RegularText style={styles.actionSubtext}>
                  {tutoringSession.price}
                </RegularText>
                <FontAwesome5
                  name="ticket-alt"
                  size={24}
                  color={Colors.white}
                  style={styles.iconR}
                />
              </View>
            </CustomButton>
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
    maxWidth: '75%',
    flexDirection: 'row',
    marginLeft: 15,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    textAlign: 'center',
  },
  iconLContainer: {
    minWidth: '15%',
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
  lineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontSize: 20,
    color: Colors.error,
    textAlign: 'center',
  },
});
