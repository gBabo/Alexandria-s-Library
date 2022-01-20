import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

interface SearchBarProps {
  placeholder: string,
  valueState: [string, Dispatch<SetStateAction<string>>]
}

export default function Searchbar({
  placeholder,
  valueState,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={24}
        color={Colors.primary}
      />
      <TextInput
        placeholder={placeholder}
        value={valueState[0]}
        onChangeText={valueState[1]}
        style={styles.input}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
  },
});
