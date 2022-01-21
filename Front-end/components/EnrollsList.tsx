import React, { useCallback } from 'react';
import {
  StyleSheet, FlatList, Alert, ListRenderItem,
} from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { View } from './UI/Themed';
import { RegularText, SemiBoldText } from './UI/StyledText';
import CustomButton from './UI/CustomButton';
import Colors from '../constants/Colors';
import { UserEnroll } from '../models/TutoringSession';

interface EnrollsListProps {
  title: string
  enrolls: UserEnroll[]
  pending?: boolean
  onSettleEnrollmentStatus?: (enrollIndex: number, accept: boolean) => void
  onSettleAllEnrollmentStatus?: (accept: boolean) => void
}

export default function EnrollsList({
  title,
  enrolls,
  pending = false,
  onSettleEnrollmentStatus,
  onSettleAllEnrollmentStatus,
}: EnrollsListProps) {
  const confirmEnrollment = useCallback(
    (enroll: UserEnroll, enrollIndex: number, accept: boolean) => Alert.alert('Enrollment Acceptance', accept ? `
    Are you sure you want to accept ${enroll.name.split(' ')[0]}'s enrollment?
    ` : `
    Are you sure you want to reject ${enroll.name.split(' ')[0]}'s enrollment?
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => onSettleEnrollmentStatus && onSettleEnrollmentStatus(enrollIndex, accept),
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [onSettleEnrollmentStatus],
  );
  const confirmAllEnrollment = useCallback(
    (accept: boolean) => Alert.alert('All Enrollments Acceptance', accept ? `
    Are you sure you want to accept all enrollments?
    ` : `
    Are you sure you want to reject all enrollments?
    `, [{
      text: 'Yes',
      style: 'default',
      onPress: () => onSettleAllEnrollmentStatus && onSettleAllEnrollmentStatus(accept),
    }, {
      text: 'Cancel',
      style: 'cancel',
    }], {
      cancelable: true,
    }), [onSettleAllEnrollmentStatus],
  );

  const ListHeaderComponent = (
    <View style={styles.enrollHeader}>
      <SemiBoldText style={styles.text}>{title}</SemiBoldText>
    </View>
  );

  const ListFooterComponent = (
    <View style={styles.enrollContainer}>
      <CustomButton
        onPress={() => confirmAllEnrollment(true)}
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
        onPress={() => confirmAllEnrollment(false)}
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

  const renderItem: ListRenderItem<UserEnroll> = ({
    item,
    index,
  }) => (
    <View style={styles.enrollContainer}>
      <RegularText style={styles.subtext}>
        {item.name}
      </RegularText>
      {pending && (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={() => confirmEnrollment(item, index, true)}
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
          onPress={() => confirmEnrollment(item, index, false)}
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
    <FlatList
      data={enrolls}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={pending ? ListFooterComponent : undefined}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
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
