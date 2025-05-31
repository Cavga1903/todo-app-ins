import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { getTasks } from '../utils/storage';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    first: 0,
    second: 0,
    third: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const tasks = await getTasks();
      const completedTasks = tasks.filter((t: any) => t.completed).length;
      const first = tasks.filter((t: any) => t.priority === 'first').length;
      const second = tasks.filter((t: any) => t.priority === 'second').length;
      const third = tasks.filter((t: any) => t.priority === 'third').length;
      const total = tasks.length;
      const pending = total - completedTasks;
      const percentage = total === 0 ? 0 : completedTasks / total;

      setStats({ total, completed: completedTasks, pending, first, second, third, percentage });
      setTimeout(() => setLoading(false), 300);
    };

    loadStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Task Statistics" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C1FBA4" />
        </View>
      ) : (
        <ScrollView style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View style={styles.gridContainer}>
            <View style={styles.gridCard}>
              <Text style={styles.label}>Total Tasks</Text>
              <Text style={styles.value}>{stats.total}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.label}>Completed Tasks</Text>
              <Text style={styles.value}>{stats.completed}</Text>
            </View>

            <View style={styles.gridCard}>
              <Text style={styles.label}>Pending Tasks</Text>
              <Text style={styles.value}>{stats.pending}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.label}>First Priority</Text>
              <Text style={styles.value}>{stats.first}</Text>
            </View>

            <View style={styles.gridCard}>
              <Text style={styles.label}>Second Priority</Text>
              <Text style={styles.value}>{stats.second}</Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={styles.label}>Third Priority</Text>
              <Text style={styles.value}>{stats.third}</Text>
            </View>

            <View style={[styles.gridCard, styles.fullWidth]}>
              <Text style={styles.label}>Success Rate</Text>
              <Progress.Bar
                progress={stats.percentage}
                width={null}
                height={14}
                color="#C1FBA4"
                unfilledColor="#1E2A3A"
                borderWidth={0}
                borderRadius={8}
              />
              <Text style={styles.percentText}>{Math.round(stats.percentage * 100)}%</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1B2C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#1B2B40',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  percentText: {
    color: '#C1FBA4',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
});
