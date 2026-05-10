import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const PRIORITY_LABELS = {
  high: '!!',
  medium: '!',
  low: '·',
};

export default function TaskItem({ item, onToggle, onDelete }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const priorityColor = PRIORITY_COLORS[item.priority] || '#f59e0b';
  const priorityLabel = PRIORITY_LABELS[item.priority] || '·';

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
      }),
    ]).start();
    onToggle(item.id, !item.done);
  };

  return (
    <Animated.View
      style={[
        styles.wrap,
        item.done && styles.wrapDone,
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
      <TouchableOpacity
        style={styles.check}
        onPress={handlePress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={[styles.checkCircle, item.done && styles.checkCircleDone]}>
          {item.done && <Text style={styles.checkMark}>&#10003;</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text
          style={[styles.title, item.done && styles.titleDone]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityDotText}>{priorityLabel}</Text>
          </View>
          {item.done && <Text style={styles.doneLabel}>done</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.del}
        onPress={() => onDelete(item.id)}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.delInner}>
          <Text style={styles.delIcon}>&#10005;</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  wrapDone: {
    opacity: 0.5,
  },
  priorityBar: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  check: {
    paddingLeft: 14,
    paddingVertical: 14,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkMark: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 14,
  },
  title: {
    fontSize: 15,
    color: '#f1f1f7',
    fontWeight: '500',
    lineHeight: 20,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '400',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  priorityDot: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityDotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  doneLabel: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  del: {
    paddingRight: 14,
    paddingVertical: 14,
  },
  delInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delIcon: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
  },
});
