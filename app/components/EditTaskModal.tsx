import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedTask: any) => void;
  task: any;
}

export default function EditTaskModal({ visible, onClose, onSave, task }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(new Date(task.date));
    }
  }, [task]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.label}>Edit Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task title"
            value={title}
            onChangeText={setTitle}
          />

          <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowPicker(Platform.OS === 'ios');
                setDate(currentDate);
              }}
            />
          )}

          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSave({ title, date: date.toISOString() })}
              style={styles.saveBtn}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#0E1B2C',
    padding: 20,
    borderRadius: 16,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#555',
    color: 'white',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E2A3A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    color: '#aaa',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#C1FBA4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveText: {
    fontWeight: 'bold',
    color: '#000',
  },
});