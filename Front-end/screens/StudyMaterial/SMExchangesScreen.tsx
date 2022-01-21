import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';

import { SMExchangesStackScreenProps } from '../../navigation/types';
import Colors from '../../constants/Colors';
import Loading from '../../components/UI/Loading';
import Fallback from '../../components/UI/Fallback';
import ItemList, { RenderItemProps } from '../../components/ItemList';
import StudyMaterialExchangeItem, { StudyMaterialExchangeExtended } from '../../components/StudyMaterialExchangeItem';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { fetchStudyMaterials, settleExchange } from '../../store/slices/studyMaterial';

export default function SMExchangesScreen({ navigation }: SMExchangesStackScreenProps<'Exchanges'>) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.studyMaterial.isLoading);
  const studyMaterials = useAppSelector((s) => s.studyMaterial.studyMaterials);
  const studyMaterialsExchanges = useAppSelector((s) => s.studyMaterial.studyMaterialsExchanges)
    .map((studyMaterialsExchange) => ({
      ...studyMaterialsExchange,
      requesterSMName: studyMaterials[studyMaterialsExchange.requesterStudyMaterialId].name,
      requesteeSMName: studyMaterials[studyMaterialsExchange.requesteeStudyMaterialId].name,
      requesterSMLikes: studyMaterials[studyMaterialsExchange.requesterStudyMaterialId].likes,
      requesteeSMLikes: studyMaterials[studyMaterialsExchange.requesteeStudyMaterialId].likes,
    }));

  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) navigation.getParent()!.setOptions({ headerTitle: 'Study Materials Exchanges' });
  }, [navigation, isFocused]);

  const renderItem = ({
    dataInfo,
    marginHorizontal,
    marginVertical,
  }: RenderItemProps<StudyMaterialExchangeExtended>) => (
    <StudyMaterialExchangeItem
      studyMaterialExchange={dataInfo.item}
      onPress={() => {
        navigation.navigate('StudyMaterial', { id: dataInfo.item.requesterStudyMaterialId });
      }}
      onSettleExchange={(accept: boolean) => dispatch(settleExchange({
        studyMaterialExchangeId: dataInfo.item.id,
        accept,
      }))}
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
  ) : studyMaterialsExchanges.length === 0 ? (
    <Fallback message="You have no outstanding study material proposals." />
  ) : (
    <ItemList
      items={studyMaterialsExchanges}
      keys={['requesterSMName', 'requesteeSMName', 'requesterName', 'requesterInstitution']}
      searchPlaceholder="Search Materials Exchange"
      sortingOptions={[
        {
          label: 'Proposed Material Likes',
          value: 'requesterSMLikes',
        },
        {
          label: 'Proposer Rating',
          value: 'requesterRating',
        },
      ]}
      defaultSortingMethod={{
        value: 'date',
        order: 'Ascending',
      }}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchStudyMaterials())}
    />
  );
}
