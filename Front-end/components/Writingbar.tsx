import React, { useState } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, TextInput, View,
} from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import CustomButton from './UI/CustomButton';

interface WritingbarProps {
  placeholder: string
  onSend: (message: string) => void
}

export default function Writingbar({
  placeholder,
  onSend,
}: WritingbarProps) {
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView behavior="height">
      <View style={styles.bar}>
        <View style={styles.messageBox}>
          <MaterialCommunityIcons
            name="comment-edit-outline"
            size={24}
            color={Colors.primary}
          />
          <TextInput
            placeholder={placeholder}
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            multiline
          />
        </View>
        <View style={styles.sendButton}>
          <CustomButton
            onPress={() => {
              onSend(message);
              setMessage('');
            }}
            disabled={message.length === 0}
            style={{
              flex: 1,
              backgroundColor: message.length > 0 ? Colors.primary : Colors.secondary,
              borderColor: Colors.transparent,
            }}
          >
            <FontAwesome
              name="send"
              size={24}
              color={Colors.white}
            />
          </CustomButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  sendButton: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBox: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
  },
});
