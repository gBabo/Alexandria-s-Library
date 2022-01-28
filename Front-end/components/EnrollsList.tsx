import React, { useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { View } from './UI/Themed';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';
import ConfirmationAlert, { ConfirmationAlertValues } from './UI/ConfirmationAlert';
import Colors from '../constants/Colors';
import { UserEnroll } from '../models/TutoringSession';

interface EnrollsListProps {
  title: string
  enrolls: UserEnroll[]
  pending?: boolean
  onSettleEnrollmentStatus?: (enrollmentId: string, accept: boolean) => void
  onSettleAllEnrollmentStatus?: (accept: boolean) => void
}

export default function EnrollsList({
  title,
  enrolls,
  pending = false,
  onSettleEnrollmentStatus,
  onSettleAllEnrollmentStatus,
}: EnrollsListProps) {
  const [confirmationModalValues, setConfirmationModalValues] = useState<ConfirmationAlertValues>();
  const confirmationModalVisibilityState = useState(false);

  const onOpenConfirmationModal = (values: ConfirmationAlertValues) => {
    setConfirmationModalValues(values);
    confirmationModalVisibilityState[1](true);
  };

  const ListHeaderComponent = (
    <View style={styles.enrollHeader}>
      <SemiBoldText style={styles.text}>{title}</SemiBoldText>
    </View>
  );

  const ListFooterComponent = (
    <View style={styles.enrollContainer}>
      <CustomButton
        onPress={() => {
          onOpenConfirmationModal({
            title: 'All Enrollments Acceptance',
            message: 'Are you sure you want to accept all enrollments?',
            onConfirm: () => {
              if (onSettleAllEnrollmentStatus) onSettleAllEnrollmentStatus(true);
            },
          });
        }}
        style={styles.acceptButton}
        row
      >
        <Entypo
          name="check"
          size={24}
          color={Colors.white}
        />
        <SemiBoldText style={styles.actionText}>Accept all</SemiBoldText>
      </CustomButton>
      <CustomButton
        onPress={() => {
          onOpenConfirmationModal({
            title: 'All Enrollments Rejection',
            message: 'Are you sure you want to reject all enrollments?',
            onConfirm: () => {
              if (onSettleAllEnrollmentStatus) onSettleAllEnrollmentStatus(false);
            },
          });
        }}
        style={styles.rejectButton}
        row
      >
        <Entypo
          name="cross"
          size={24}
          color={Colors.white}
        />
        <SemiBoldText style={styles.actionText}>Reject all</SemiBoldText>
      </CustomButton>
    </View>
  );

  const renderItem: ListRenderItem<UserEnroll> = ({ item }) => (
    <View style={styles.enrollContainer}>
      <RegularText style={styles.subtext}>
        {item.name}
      </RegularText>
      {pending && (
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={() => {
              onOpenConfirmationModal({
                title: 'Enrollment Acceptance',
                message: `Are you sure you want to accept ${item.name.split(' ')[0]}'s enrollment?`,
                onConfirm: () => {
                  if (onSettleEnrollmentStatus) onSettleEnrollmentStatus(item.id, true);
                },
              });
            }}
            style={styles.acceptButton}
            small
          >
            <Entypo
              name="check"
              size={24}
              color={Colors.white}
            />
          </CustomButton>
          <CustomButton
            onPress={() => {
              onOpenConfirmationModal({
                title: 'Enrollment Rejection',
                message: `Are you sure you want to reject ${item.name.split(' ')[0]}'s enrollment?`,
                onConfirm: () => {
                  if (onSettleEnrollmentStatus) onSettleEnrollmentStatus(item.id, false);
                },
              });
            }}
            style={styles.rejectButton}
            small
          >
            <Entypo
              name="cross"
              size={24}
              color={Colors.white}
            />
          </CustomButton>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={enrolls}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={pending ? ListFooterComponent : undefined}
        renderItem={renderItem}
      />
      {confirmationModalValues && (
        <ConfirmationAlert
          values={confirmationModalValues}
          visibilityState={confirmationModalVisibilityState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  enrollHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  enrollContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    borderLeftWidth: 1,
    borderLeftColor: Colors.primary,
    borderRightWidth: 1,
    borderRightColor: Colors.primary,
  },
  text: {
    fontSize: 20,
  },
  subtext: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 20,
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  acceptButton: {
    borderRadius: 100,
    backgroundColor: Colors.success,
    borderColor: Colors.transparent,
    marginRight: 5,
  },
  rejectButton: {
    borderRadius: 100,
    backgroundColor: Colors.error,
    borderColor: Colors.transparent,
  },
});
