import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { TStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import TutoringSessionItem from '../../components/TutoringSessionItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import TutoringSession from '../../models/TutoringSession';
import { fetchTutoringSessions } from '../../store/slices/tutoring';

export default function TCategoryStoreScreen({
  navigation,
  route,
}: TStoreStackScreenProps<'CategoryStore'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const email = useAppSelector((s) => s.user.user?.email);
  const myTutoringSessionIds = [
    ...useAppSelector((s) => s.tutoring.created),
    ...Object.values(useAppSelector((s) => s.tutoring.tutoringSessions))
      .filter(({
        pendingEnrolls,
        enrolled,
      }) => [...pendingEnrolls, ...enrolled]
        .some((e) => e.email === email))
      .map(({ id }) => id),
  ];
  const tutoringSessionsCategories = useAppSelector((s) => s.tutoring.tutoringSessionsCategories);
  const tutoringSessions = useAppSelector((s) => s.tutoring.tutoringSessions);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `${route.params.category}: Store` });
  }, [navigation, isFocused]);

  const items = tutoringSessionsCategories[route.params.category]
    .filter((tutoringSessionId) => !myTutoringSessionIds.includes(tutoringSessionId))
    .map((tutoringSessionId) => tutoringSessions[tutoringSessionId]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<TutoringSession>) => (
    <TutoringSessionItem
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

  if (items.length === 0) navigation.goBack();
  return isLoading ? (
    <Loading />
  ) : (
    <ItemList
      items={items}
      keys={['name', 'tutor', 'tutorEmail', 'tutorInstitution']}
      searchPlaceholder="Search Tutoring Sessions"
      sortingOptions={[
        {
          label: 'Tutor Rating',
          value: 'tutorRating',
        },
        {
          label: 'Session Date',
          value: 'date',
        },
        {
          label: 'Price',
          value: 'price',
        },
      ]}
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
