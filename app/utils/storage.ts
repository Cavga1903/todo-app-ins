import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@tasks';

const normalizeDate = (inputDate: any) => {
  if (!inputDate) return null;
  if (typeof inputDate === 'string') return inputDate.split("T")[0];
  if (inputDate instanceof Date) return inputDate.toISOString().split("T")[0];
  return new Date(inputDate).toISOString().split("T")[0];
};

export const saveTask = async (task: any) => {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];

  // Normalize date
  task.date = normalizeDate(task.date);

  tasks.push(task);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getTasks = async () => {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];

  // Normalize and sort
  return tasks
    .map((task: any) => ({
      ...task,
      date: normalizeDate(task.date),
    }))
    .sort((a: any, b: any) => a.date.localeCompare(b.date));
};

export const deleteTask = async (indexToDelete: number) => {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];
  tasks.splice(indexToDelete, 1);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const toggleTaskCompleted = async (index: number) => {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];
  tasks[index].completed = !tasks[index].completed;
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const updateTask = async (index: number, updatedTask: any) => {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];

  updatedTask.date = normalizeDate(updatedTask.date);
  tasks[index] = { ...tasks[index], ...updatedTask };

  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const clearTasks = async () => {
  await AsyncStorage.removeItem(TASKS_KEY);
};