import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async (method: string) => {
    const mockUser = {
      name: 'John',
      surname: 'Doe',
      email: `${method.toLowerCase()}@example.com`,
    };

    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    router.replace('/profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleLogin('Google')}>
          <FontAwesome name="google" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleLogin('Apple')}>
          <FontAwesome name="apple" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleLogin('Email')}>
          <MaterialIcons name="email" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleLogin('Phone')}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.guestBtn} onPress={() => handleLogin('Guest')}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1B2C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  circleButton: {
    backgroundColor: '#1E2A3A',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBtn: {
    backgroundColor: '#C1FBA4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  guestText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});