import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditTaskModal from '../components/EditTaskModal';
import Header from '../components/Header';
import PriorityCard from '../components/PriorityCard';
import TaskCard from '../components/TaskCard';
import { deleteTask, getTasks, toggleTaskCompleted, updateTask } from '../utils/storage';

// Define the Task type with optional priority field
type Task = {
  title: string;
  date: string;
  completed: boolean;
  priority?: 'first' | 'second' | 'third';
};

export default function IndexScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'completed'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'first' | 'second' | 'third' | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  // const router = useRouter();
  // const pathname = usePathname();

  const loadTasks = async () => {
    const stored = await getTasks();
    setTasks(stored);
    setTimeout(() => setIsRefreshing(false), 180);
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshing(true);
      loadTasks();
    }, [])
  );

  const handleDelete = async (index: number) => {
    await deleteTask(index);
    await loadTasks();
  };

  const handleToggleCompleted = async (index: number) => {
    await toggleTaskCompleted(index);
    await loadTasks();
  };

  const handleEdit = (task: any, index: number) => {
    setTaskToEdit(task);
    setEditIndex(index);
    setEditVisible(true);
  };

  const handleSaveEdit = async (updatedTask: any) => {
    if (editIndex !== null) {
      await updateTask(editIndex, updatedTask);
      await loadTasks();
      setEditVisible(false);
      setTaskToEdit(null);
      setEditIndex(null);
    }
  };

  const getFilteredTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter((task) => {
      const matchFilter =
        filter === 'today'
          ? new Date(task.date).toDateString() === today
          : filter === 'completed'
          ? task.completed
          : true;
      const matchPriority = selectedPriority ? task.priority === selectedPriority : true;
      return matchFilter && matchPriority;
    });
  };

  const firstPriorityTasks = tasks.filter((t) => t.priority === 'first');
  const secondPriorityTasks = tasks.filter((t) => t.priority === 'second');
  const thirdPriorityTasks = tasks.filter((t) => t.priority === 'third');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0E1B2C' }}>
      <Header title="Task Management" />
      {isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#C1FBA4" />
        </View>
      ) : (
        <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Text style={styles.header}>Every Day Your{"\n"}Task Plan</Text>

          <View style={styles.cardRow}>
            <View style={styles.largeCard}>
              <PriorityCard
                title="All Tasks"
                count={tasks.length}
                color="#C1FBA4"
                iconName="list"
                onPress={() => setSelectedPriority(null)}
              />
            </View>
            <View style={styles.largeCard}>
              <PriorityCard
                title="First Priority"
                count={firstPriorityTasks.length}
                color="#C1FBA4"
                iconName="checkmark"
                onPress={() => setSelectedPriority('first')}
              />
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.largeCard}>
              <PriorityCard
                title="Second Priority"
                count={secondPriorityTasks.length}
                color="#76DDFB"
                iconName="stats-chart"
                onPress={() => setSelectedPriority('second')}
              />
            </View>
            <View style={styles.largeCard}>
              <PriorityCard
                title="Third Priority"
                count={thirdPriorityTasks.length}
                color="#D8B4F8"
                iconName="bar-chart"
                onPress={() => setSelectedPriority('third')}
              />
            </View>
          </View>

          <Text style={[styles.header, { marginTop: 36, marginBottom: 12 }]}>On Going Task</Text>

          <View style={styles.filters}>
            <TouchableOpacity onPress={() => setFilter('all')}>
              <Text style={[styles.filterBtn, filter === 'all' && styles.activeFilter]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter('today')}>
              <Text style={[styles.filterBtn, filter === 'today' && styles.activeFilter]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter('completed')}>
              <Text style={[styles.filterBtn, filter === 'completed' && styles.activeFilter]}>Completed</Text>
              
            </TouchableOpacity>
          </View>

          <View style={styles.taskList}>
            {getFilteredTasks().map((task, index) => (
              <View key={index} style={[{ position: 'relative' }, task.completed && { opacity: 0.4 }]}>
                <TouchableOpacity
                  onPress={() => handleToggleCompleted(index)}
                  style={{ position: 'absolute', left: 0, top: 12, padding: 6, zIndex: 1 }}
                >
                  <Ionicons
                    name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={task.completed ? '#4ade80' : '#555'}
                  />
                </TouchableOpacity>

                <View style={{ paddingLeft: 36 }}>
                  <TaskCard
                    title={task.title}
                    subtitle={new Date(task.date).toDateString()}
                    progress={task.completed ? 1.0 : 0.0}
                    iconName="checkmark-circle-outline"
                    priority={task.priority}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleEdit(task, index)}
                  style={{ position: 'absolute', top: 12, right: 42, padding: 6 }}
                >
                  <Ionicons name="create-outline" size={20} color="#facc15" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(index)}
                  style={{ position: 'absolute', top: 12, right: 12, padding: 6 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#f87171" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <EditTaskModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveEdit}
        task={taskToEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1B2C',
    padding: 24,
    top: 0,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: 'Poppins_700Bold',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  largeCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  taskList: {
    marginTop: 8,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterBtn: {
    color: '#aaa',
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  activeFilter: {
    color: '#C1FBA4',
    textDecorationLine: 'underline',
  },
});