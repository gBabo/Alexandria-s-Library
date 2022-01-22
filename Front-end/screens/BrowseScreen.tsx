import * as React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackProps } from '../navigation/types';
import Colors from '../constants/Colors';
import { SemiBoldText } from '../components/UI/StyledText';
import { View } from '../components/UI/Themed';
import CustomButton from '../components/UI/CustomButton';

export default function BrowseScreen({ navigation }: RootStackProps<'Browse'>) {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.line}>
          <SemiBoldText style={styles.title}>Alexandria's Library</SemiBoldText>
        </View>
        <View style={styles.line}>
          <Image
            source={require('../assets/images/icon.png')}
            style={{
              width: '80%',
              aspectRatio: 1,
            }}
          />
        </View>
        <View style={styles.line}>
          <CustomButton
            onPress={() => navigation.navigate('Drawer')}
            style={styles.action}
            row
          >
            <Ionicons name="rocket-outline" size={24} color={Colors.white} />
            <SemiBoldText style={styles.actionText}>Browse</SemiBoldText>
          </CustomButton>
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
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.primary,
  },
  action: {
    minWidth: '47.5%',
    backgroundColor: Colors.blue,
    borderColor: Colors.transparent,
    marginHorizontal: 2.5,
  },
  actionText: {
    fontSize: 20,
    color: Colors.white,
  },
});
