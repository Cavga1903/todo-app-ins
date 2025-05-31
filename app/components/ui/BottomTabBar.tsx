import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (target: string) => {
    if (pathname === target) {
      router.replace(target as any); // aynı sayfa ise yenile
    } else {
      router.push(target as any); // farklı sayfa ise geçiş yap
    }
  };

  const renderIcon = (name: any, target: string, size: number = 25) => {
    const isActive = pathname === target;
    return (
      <Ionicons name={name} size={size} color={isActive ? "#C1FBA4" : "#fff"} />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleTabPress("/")}>
        {renderIcon("home", "/", 28)}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("/calendar")}>
        {renderIcon("calendar", "/calendar", 28)}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("/add")}>
        {renderIcon("add-circle", "/add", 60)}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("/tasks")}>
        {renderIcon("reader", "/tasks", 28)}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("/login")}>
        {renderIcon("person-circle", "/login", 28)}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0E1B2C",
    height: 70,
    borderRadius: 24,
    paddingHorizontal: 24,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 28,
    textAlign: "center",
    lineHeight: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});