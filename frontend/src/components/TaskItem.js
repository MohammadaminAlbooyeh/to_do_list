import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

export default function TaskItem({ item, onToggle, onDelete }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const priorityColor = PRIORITY_COLORS[item.priority] || '#f59e0b';

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, friction: 8 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
    onToggle(item.id, !item.done);
  };

  return (
    <Animated.View style={[styles.wrap, item.done && styles.wrapDone, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.contentRow} onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.check, item.done && { backgroundColor: priorityColor, borderColor: priorityColor }]}>
          {item.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <View style={styles.textDetails}>
          <Text style={[styles.title, item.done && styles.titleDone]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.meta}>
            <View style={[styles.priorityTag, { backgroundColor: priorityColor + '15' }]}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={[styles.priorityText, { color: priorityColor }]}>{item.priority}</Text>
            </View>
            {item.category && (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
    padding: 14,
  },
  wrapDone: {
    opacity: 0.4,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#f1f1f7',
    fontWeight: '500',
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.3)',
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  categoryTag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 16,
  },
});
