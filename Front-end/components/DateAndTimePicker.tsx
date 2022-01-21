import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import Colors from '../constants/Colors';
import { RegularText, SemiBoldText } from './UI/StyledText';
import Card from './UI/Card';
import CustomButton from './UI/CustomButton';

interface DateAndTimePickerProps {
  dateState: [Date, Dispatch<SetStateAction<Date>>]
}

export default function DateAndTimePicker({ dateState }: DateAndTimePickerProps) {
  const windowDimensions = useWindowDimensions();

  const [borderColor, setBorderColor] = useState(Colors.primary);
  const [selected, setSelected] = useState({
    date: false,
    time: false,
  });
  const [mode, setMode] = useState<'date' | 'time'>();
  const [show, setShow] = useState(false);

  const showPicker = (m: 'date' | 'time') => {
    setMode(m);
    setShow(true);
    if (!selected.date && !selected.time) {
      setSelected((currentSelected) => ({
        ...currentSelected,
        [m]: true,
      }));
    } else {
      setBorderColor(Colors.success);
    }
  };

  return (
    <Card style={[styles.container, {
      borderColor,
      width: windowDimensions.width - 10,
    }]}
    >
      <RegularText style={styles.label}>
        <SemiBoldText>Selected Date & Time: </SemiBoldText>
        {moment(dateState[0])
          .format('lll')}
      </RegularText>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={() => showPicker('date')}
          style={styles.button}
          row
        >
          <Ionicons name="calendar" size={24} color={Colors.white} />
          <SemiBoldText style={styles.buttonText}>
            Select Date
          </SemiBoldText>
        </CustomButton>
        <CustomButton
          onPress={() => showPicker('time')}
          style={styles.button}
          row
        >
          <Ionicons name="time" size={24} color={Colors.white} />
          <SemiBoldText style={styles.buttonText}>
            Select Time
          </SemiBoldText>
        </CustomButton>
      </View>
      {show && (
        <DateTimePicker
          value={dateState[0]}
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) dateState[1](selectedDate);
          }}
          minimumDate={moment()
            .toDate()}
          mode={mode}
          is24Hour
        />
      )}
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
