// app/_layout.tsx

import BottomTabBar from '@components/ui/BottomTabBar';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Layout() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert("Notifications are disabled. You won't get reminders.");
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabBar />
    </View>
  );
}