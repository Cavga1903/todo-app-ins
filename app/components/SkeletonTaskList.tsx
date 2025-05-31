import React from "react";
import { ScrollView, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function SkeletonTaskList({ count = 4 }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {[...Array(count)].map((_, i) => (
        <SkeletonPlaceholder
          key={i}
          backgroundColor="#1E2A3A"
          highlightColor="#2F3E52"
          // LinearGradientComponent kaldırıldı çünkü Expo'da `react-native-linear-gradient` çalışmaz
        >
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <View style={{ width: "70%", height: 16, marginBottom: 6 }} />
              <View style={{ width: "40%", height: 14 }} />
            </View>
          </View>
        </SkeletonPlaceholder>
      ))}
    </ScrollView>
  );
}