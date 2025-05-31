// components/header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getTasks } from '../utils/storage';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; text: string }[]>([]);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTasks = async () => {
    const tasks = await getTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders: { id: number; text: string }[] = [];
    tasks.forEach((task: any, index: number) => {
      if (!task.reminder || !task.reminderDaysBefore) return;

      const due = new Date(task.date);
      due.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === task.reminderDaysBefore) {
        reminders.push({
          id: index,
          text:
            task.reminderDaysBefore === 1
              ? `Task "${task.title}" is due tomorrow.`
              : `Task "${task.title}" is due in ${task.reminderDaysBefore} days.`,
        });
      }
    });

    setNotifications(reminders);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        setShowNotifications(false);
      }
    });
    return () => subscription.remove();
  }, []);

  const handleToggleNotifications = () => {
    if (showNotifications) {
      setShowNotifications(false);
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    } else {
      loadTasks();
      setShowNotifications(true);
      dropdownTimeout.current = setTimeout(() => {
        setShowNotifications(false);
      }, 30000);
    }
  };

  const handleOutsidePress = () => {
    if (showNotifications) {
      setShowNotifications(false);
    }
    Keyboard.dismiss();
  };

  return (
    <View style={{ zIndex: 100 }}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => console.log('Hamburger Menüsü')}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>{title || ''}</Text>

          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={handleToggleNotifications}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              {notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifications.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {showNotifications && (
        <View style={styles.dropdownWrapper}>
          <View style={styles.dropdown}>
            {notifications.length === 0 ? (
              <Text style={styles.notificationText}>No notifications</Text>
            ) : (
              notifications.map((notif) => (
                <Text key={notif.id} style={styles.notificationText}>
                  {notif.text}
                </Text>
              ))
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#0E1B2C',
    zIndex: 101,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  dropdownWrapper: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: Dimensions.get('window').width - 40,
    alignItems: 'flex-end',
    zIndex: 200,
  },
  dropdown: {
    backgroundColor: '#1B2B40',
    padding: 12,
    borderRadius: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
