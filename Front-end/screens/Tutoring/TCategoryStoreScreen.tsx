import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { TStoreStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import Loading from '../../components/UI/Loading';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import TutoringSessionItem from '../../components/TutoringSessionItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import TutoringSession from '../../models/TutoringSession';
import { getTutoringSessions } from '../../store/slices/tutoring';

export default function TCategoryStoreScreen({
  navigation,
  route,
}: TStoreStackScreenProps<'CategoryStore'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.tutoring.isLoading);
  const tutoringSessionsCategories = useAppSelector((s) => s.tutoring.tutoringSessionsCategories);
  const tutoringSessions = useAppSelector((s) => s.tutoring.tutoringSessions);

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: `${route.params.category}: Store` });
  }, [navigation, isFocused]);

  const items = tutoringSessionsCategories[route.params.category]
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
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: '#E0F7FA',
      }}
    />
  );

  return isLoading && items.length === 0 ? (
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
        order: 'Ascending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(getTutoringSessions())}
    />
  );
}
