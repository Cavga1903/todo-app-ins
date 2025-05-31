import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { getTasks } from '../utils/storage';

export default function ProfileScreen() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        router.replace('/login');
      } else {
        const parsedUser = JSON.parse(user);
        setName(parsedUser.name);
        setSurname(parsedUser.surname);
        setEmail(parsedUser.email);
      }
    };

    const loadStats = async () => {
      const tasks = await getTasks();
      const completed = tasks.filter((t: any) => t.completed).length;
      setCompletedTasks(completed);
      setTotalTasks(tasks.length);
      setCompletionRate(tasks.length === 0 ? 0 : completed / tasks.length);
    };

    checkLogin();
    loadStats();
  }, []);

  const getLevel = () => {
    if (completionRate >= 0.9) return 'Master';
    if (completionRate >= 0.7) return 'Advanced';
    if (completionRate >= 0.4) return 'Intermediate';
    return 'Beginner';
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <View style={styles.fullContainer}>
      <Header title="Profile" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.subtitle}>Name</Text>
          <Text style={styles.level}>{name} {surname}</Text>

          <Text style={styles.subtitle}>Email</Text>
          <Text style={styles.level}>{email}</Text>
        </View>

        <Text style={styles.title}>Your Progress</Text>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Level</Text>
          <Text style={styles.level}>{getLevel()}</Text>

          <Text style={styles.subtitle}>Completion Rate</Text>
          <Progress.Bar
            progress={completionRate}
            width={null}
            height={14}
            color="#C1FBA4"
            unfilledColor="#1E2A3A"
            borderWidth={0}
            borderRadius={8}
          />
          <Text style={styles.percentText}>{Math.round(completionRate * 100)}%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Goals</Text>
          {[
            'Complete all First Priority tasks this week',
            'Add 5 new tasks by the weekend',
            'Achieve 100% task completion for 3 days straight',
            'Complete at least one task per day',
            'Avoid leaving any task uncompleted for more than 3 days',
          ].map((goal, index) => (
            <Text key={index} style={styles.goalItem}>✅ {goal}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Achievements</Text>
          <Text style={styles.achievement}>🎯 Consistency Badge</Text>
          <Text style={styles.achievement}>🔥 Streak 7 Days</Text>
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={18} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.settingsText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#0E1B2C',
    paddingTop: 62,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    marginBottom: 60
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  level: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  percentText: {
    color: '#C1FBA4',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#1B2B40',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  goalItem: {
    color: '#fff',
    marginBottom: 6,
  },
  achievement: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  settingsBtn: {
    backgroundColor: '#C1FBA4',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoutBtn: {
    backgroundColor: '#C1FBA4',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  settingsText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});