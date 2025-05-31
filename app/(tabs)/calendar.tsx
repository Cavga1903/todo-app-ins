import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import { getTasks } from "../utils/storage";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [days, setDays] = useState(generateDaysOfMonth(currentMonth));
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const stored = await getTasks();
        setTasks(stored);
      };
      load();
    }, [])
  );

  React.useEffect(() => {
    setDays(generateDaysOfMonth(currentMonth));
  }, [currentMonth]);

  React.useEffect(() => {
    const index = days.findIndex((item) => item.date === selectedDate);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [days, selectedDate]);

  const handleTodayPress = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split("T")[0];
    setCurrentMonth(today);
    setSelectedDate(todayString);
    const updatedDays = generateDaysOfMonth(today);
    setDays(updatedDays);
    setTimeout(() => {
      const index = updatedDays.findIndex((item) => item.date === todayString);
      if (flatListRef.current && index !== -1) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, 180);
  };

  function isSameDay(d1: Date | string, d2: Date | string) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    date1.setHours(0, 0, 0, 10);
    date2.setHours(0, 0, 0, 10);
    return date1.getTime() === date2.getTime();
  }

  const filteredTasks = tasks.filter((task) =>
    isSameDay(task.date, selectedDate)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Tasks" />

      <TouchableOpacity onPress={handleTodayPress}>
        <Text style={styles.todayButton}>Today</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
          <Text style={styles.navArrow}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{getMonthYearLabel(currentMonth)}</Text>

        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text style={styles.navArrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date}
        getItemLayout={(data, index) => ({ length: 66, offset: 66 * index, index })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.9,
            });
          }, 300);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedDate(item.date)}
            style={[styles.dayItem, item.date === selectedDate && styles.dayItemActive]}
          >
            <Text style={[styles.dayNumber, item.date === selectedDate && styles.activeText]}>
              {item.day}
            </Text>
            <Text style={[styles.weekday, item.date === selectedDate && styles.activeText]}>
              {item.weekday}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 28 }}
        style={{ paddingVertical: 8, marginBottom: 8 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filteredTasks.length === 0 ? (
          <Text style={styles.noTasks}>No tasks for this day</Text>
        ) : (
          filteredTasks.map((task, index) => (
            <TaskCard
              key={index}
              title={task.title}
              subtitle={new Date(task.date).toDateString()}
              progress={task.completed ? 1.0 : 0.0}
              iconName="calendar"
              priority={task.priority}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTodayString() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split("T")[0];
}

function generateDaysOfMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [...Array(daysInMonth)].map((_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
    };
  });
}

function getMonthYearLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function addMonths(date: Date, count: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + count);
  return newDate;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1B2C",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  todayButton: {
    backgroundColor: "#C1FBA4",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  navArrow: {
    color: "#C1FBA4",
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  dayItem: {
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#1B2B40",
    width: 50,
    height: 80,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  dayItemActive: {
    backgroundColor: "#C1FBA4",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    height: 24,
  },
  weekday: {
    fontSize: 15,
    color: "#ccc",
    fontWeight: "500",
    textTransform: "capitalize",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    height: 20,
    lineHeight: 20,
    width: "100%",
    paddingHorizontal: 4,
  },
  activeText: {
    color: "#000",
  },
  noTasks: {
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
});