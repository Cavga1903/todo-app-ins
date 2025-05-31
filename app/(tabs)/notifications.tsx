// app/(apps)/notifications.tsx
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

export default function NotificationListScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        setNotifications(scheduled);
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleCancel = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      setNotifications((prev) => prev.filter((n) => n.identifier !== identifier));
    } catch (e) {
      Alert.alert('Error', 'Failed to cancel notification');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Reminders" />
      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#C1FBA4" /></View>
      ) : notifications.length === 0 ? (
        <Text style={styles.emptyText}>No scheduled notifications.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {notifications.map((notif) => (
            <View key={notif.identifier} style={styles.card}>
              <Text style={styles.title}>{notif.content.title || 'Reminder'}</Text>
              <Text style={styles.body}>{notif.content.body}</Text>
              <Text style={styles.time}>Scheduled: {new Date(notif.trigger.value).toLocaleString()}</Text>
              <TouchableOpacity onPress={() => handleCancel(notif.identifier)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1B2C',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16
  },
  card: {
    backgroundColor: '#1B2B40',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: '#C1FBA4',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  body: {
    color: '#fff',
    marginBottom: 4,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8
  },
  cancel: {
    color: 'red',
    textAlign: 'right',
    fontWeight: 'bold',
  }
});
