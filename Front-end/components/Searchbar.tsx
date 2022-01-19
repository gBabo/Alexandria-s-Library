import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
      <Feather
        name="search"
        color={Colors.primary}
        size={20}
      />
      <TextInput
        placeholder={placeholder}
        value={valueState[0]}
        onChangeText={valueState[1]}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
});
