import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { TEnrolledStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import EnrollmentItem, { EnrollmentExtended } from '../../components/EnrollmentItem';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchTutoringSessions } from '../../store/slices/tutoring';

export default function TEnrolledScreen({ navigation }: TEnrolledStackScreenProps<'Enrolled'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const tutoringSessions = useAppSelector((s) => s.tutoring.tutoringSessions);
  const enrollments = useAppSelector((s) => s.tutoring.enrollments)
    .map((enrollment) => ({
      ...enrollment,
      tutoringSessionName: tutoringSessions[enrollment.tutoringSessionId].name,
      tutoringSessionLocation: tutoringSessions[enrollment.tutoringSessionId].location,
      tutor: tutoringSessions[enrollment.tutoringSessionId].tutor,
    }));

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()!.setOptions({ headerTitle: 'Sessions Enrollments' });
      dispatch(fetchTutoringSessions());
    }
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<EnrollmentExtended>) => (
    <EnrollmentItem
      enrollment={dataInfo.item}
      onPress={() => {
        navigation.navigate('TutoringSession', { id: dataInfo.item.tutoringSessionId });
      }}
      containerStyle={{
        marginHorizontal,
        marginVertical,
      }}
      style={{
        backgroundColor: '#E0F7FA',
        borderColor: Colors.primary,
      }}
    />
  );

  return isLoading ? (
    <Loading />
  ) : enrollments.length === 0 ? (
    <Fallback message="You do not have enrollments to any tutoring sessions." />
  ) : (
    <ItemList
      items={enrollments}
      keys={['requester', 'status', 'tutoringSessionName', 'tutoringSessionLocation']}
      searchPlaceholder="Search Enrollment"
      defaultSortingMethod={{
        value: 'date',
        order: 'Descending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchTutoringSessions())}
    />
  );
}
