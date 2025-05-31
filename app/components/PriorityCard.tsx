// components/PriorityCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  count: number;
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export default function PriorityCard({ title, count, color, iconName, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color="#000" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count} task</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    width: '100%',
    aspectRatio: 1.2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  count: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});