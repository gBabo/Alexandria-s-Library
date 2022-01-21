import * as React from 'react';
import { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';

import { TScheduledStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import TutoringSession from '../../models/TutoringSession';
import { View } from '../../components/UI/Themed';
import CustomButton from '../../components/UI/CustomButton';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import ScheduledTutoringSessionItem from '../../components/ScheduledTutoringSessionItem';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { fetchTutoringSessions } from '../../store/slices/tutoring';

export default function TScheduledScreen({ navigation }: TScheduledStackScreenProps<'Scheduled'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const email = useAppSelector((s) => s.user.user!.email);
  const tutoringSessions = Object.values(useAppSelector((s) => s.tutoring.tutoringSessions))
    .filter((tutoringSession) => tutoringSession.tutorEmail === email);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Scheduled Sessions' });
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<TutoringSession>) => (
    <ScheduledTutoringSessionItem
      tutoringSession={dataInfo.item}
      onPress={() => {
        navigation.navigate('TutoringSession', { id: dataInfo.item.id });
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : tutoringSessions.length === 0 ? (
        <Fallback message="You have not yet scheduled any tutoring sessions." />
      ) : (
        <ItemList
          items={tutoringSessions}
          keys={['name', 'location']}
          searchPlaceholder="Search Scheduled Tutoring Sessions"
          defaultSortingMethod={{
            value: 'date',
            order: 'Ascending',
          }}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchTutoringSessions())}
        />
      )}
      <CustomButton
        onPress={() => navigation.navigate('Schedule')}
        style={styles.plusButton}
        small
      >
        <Ionicons name="add" size={40} color={Colors.white} />
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  plusButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: 20,
    right: 20,
    borderRadius: 100,
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
  },
});
