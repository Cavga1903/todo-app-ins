import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

interface Props {
  title: string;
  subtitle: string;
  progress: number;
  iconName: keyof typeof Ionicons.glyphMap;
  priority?: 'first' | 'second' | 'third';
}

export default function TaskCard({ title, subtitle, progress, iconName, priority }: Props) {
  const getPriorityLabel = () => {
    switch (priority) {
      case 'first':
        return 'First Priority';
      case 'second':
        return 'Second Priority';
      case 'third':
        return 'Third Priority';
      default:
        return '';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'first':
        return '#C1FBA4';
      case 'second':
        return '#76DDFB';
      case 'third':
        return '#D8B4F8';
      default:
        return '#aaa';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {priority && (
            <Text style={[styles.priority, { color: getPriorityColor() }]}> {getPriorityLabel()} </Text>
          )}
        </View>
      </View>

      <Progress.Bar
        progress={progress}
        width={null}
        height={8}
        color="#61DDFB"
        unfilledColor="#1B2B40"
        borderWidth={0}
        borderRadius={10}
        style={styles.progressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2A3A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 12,
  },
  priority: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  progressBar: {
    marginTop: 8,
  },
});