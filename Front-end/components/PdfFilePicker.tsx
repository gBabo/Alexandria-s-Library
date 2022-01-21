import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';

import Colors from '../constants/Colors';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import CustomButton from './UI/CustomButton';

interface PdfFilePickerProps {
  fileUriState: [string, Dispatch<SetStateAction<string>>]
}

export default function PdfFilePicker({ fileUriState }: PdfFilePickerProps) {
  const windowDimensions = useWindowDimensions();

  const [borderColor, setBorderColor] = useState(Colors.primary);
  const [filename, setFilename] = useState('No file selected');
  const onChooseDocument = async () => {
    const result = await getDocumentAsync({
      copyToCacheDirectory: false,
      type: 'application/pdf',
    });
    if (result.type === 'success') {
      setBorderColor(Colors.success);
      setFilename(result.name);
      fileUriState[1](result.uri);
    }
  };

  return (
    <Card style={[styles.container, {
      borderColor,
      width: windowDimensions.width - 10,
    }]}
    >
      <RegularText style={styles.label}>
        <SemiBoldText>Selected File: </SemiBoldText>
        {filename}
      </RegularText>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onChooseDocument}
          style={styles.button}
          row
        >
          <MaterialCommunityIcons name="file-pdf" size={24} color={Colors.white} />
          <SemiBoldText style={styles.buttonText}>
            Select File
          </SemiBoldText>
        </CustomButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: {
    borderColor: Colors.transparent,
    backgroundColor: Colors.blue,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.white,
  },
});
