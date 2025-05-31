import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { saveTask } from "../utils/storage";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [priority, setPriority] = useState<"first" | "second" | "third">("first");
  const [reminder, setReminder] = useState(false);
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const scheduleLocalNotification = async (title: string, triggerDate: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Task",
        body: `Don't forget: "${title}" is due soon!`,
        sound: true,
      },
      trigger: triggerDate,
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);

    const localDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD

    await saveTask({
      title,
      date: localDate,
      priority,
      reminder,
      reminderDaysBefore,
    });

    // Bildirim zamanlaması
    if (reminder && reminderDaysBefore) {
      const triggerDate = new Date(date);
      triggerDate.setDate(triggerDate.getDate() - reminderDaysBefore);
      triggerDate.setHours(9);
      triggerDate.setMinutes(0);

      if (triggerDate > new Date()) {
        await scheduleLocalNotification(title, triggerDate);
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      router.push("/");
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Task" />
      <View style={{ padding: 16 }}>
        {isSaving ? (
          <View style={styles.spinnerWrapper}>
            <ActivityIndicator size="large" color="#C1FBA4" />
          </View>
        ) : (
          <>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your task..."
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setShowPicker(Platform.OS === "ios");
                  setDate(currentDate);
                }}
              />
            )}

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {["first", "second", "third"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p as any)}
                  style={[
                    styles.priorityBtn,
                    priority === p && styles.priorityBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === p && styles.priorityTextActive,
                    ]}
                  >
                    {p === "first" ? "First" : p === "second" ? "Second" : "Third"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.reminderRow}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                value={reminder}
                onValueChange={(value) => {
                  setReminder(value);
                  if (!value) setReminderDaysBefore(null);
                }}
                trackColor={{ false: "#888", true: "#C1FBA4" }}
                thumbColor={reminder ? "#0E1B2C" : "#ccc"}
              />
            </View>

            {reminder && (
              <View style={styles.reminderOptions}>
                <Text style={[styles.label, { marginTop: 0 }]}>Remind me:</Text>
                <View style={styles.reminderOptionsRow}>
                  {[1, 2, 3].map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setReminderDaysBefore(day)}
                      style={[
                        styles.reminderBtn,
                        reminderDaysBefore === day && styles.reminderBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          reminderDaysBefore === day && styles.priorityTextActive,
                        ]}
                      >
                        {day} day{day > 1 ? "s" : ""} before
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Task</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1B2C",
  },
  spinnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#555",
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E2A3A",
    padding: 12,
    borderRadius: 12,
  },
  dateText: {
    color: "white",
    fontSize: 14,
  },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  priorityBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#1E2A3A",
    padding: 12,
    borderRadius: 12,
  },
  priorityBtnActive: {
    backgroundColor: "#C1FBA4",
  },
  priorityText: {
    color: "#fff",
    textAlign: "center",
  },
  priorityTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  reminderOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  reminderOptions: {
    marginTop: 12,
  },
  reminderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1E2A3A",
    marginBottom: 8,
  },
  reminderBtnActive: {
    backgroundColor: "#C1FBA4",
  },
  saveBtn: {
    marginTop: 40,
    backgroundColor: "#C1FBA4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});