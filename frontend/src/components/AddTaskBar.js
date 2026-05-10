import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const PRIORITIES = [
  { key: 'low', label: 'low', color: '#22c55e' },
  { key: 'medium', label: 'med', color: '#f59e0b' },
  { key: 'high', label: 'high', color: '#ef4444' },
];

export default function AddTaskBar({ value, onChange, onSubmit }) {
  const [priority, setPriority] = useState('medium');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(priority);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          maxLength={200}
        />
        <View style={styles.btnWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              !value.trim() && styles.addBtnDisabled,
              pressed && !value.trim() && styles.addBtnDisabled,
            ]}
            onPress={handleSubmit}
          >
            <Text style={[styles.addBtnText, !value.trim() && styles.addBtnTextDisabled]}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.priorityRow}>
        {PRIORITIES.map(p => (
          <Pressable
            key={p.key}
            style={({ pressed }) => [
              styles.pill,
              { borderColor: priority === p.key ? p.color : 'rgba(255,255,255,0.15)' },
              priority === p.key && { backgroundColor: p.color },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setPriority(p.key)}
          >
            <Text
              style={[
                styles.pillText,
                { color: priority === p.key ? '#fff' : p.color },
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingLeft: 18,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#f1f1f7',
    paddingVertical: 16,
  },
  btnWrap: {
    margin: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  addBtnText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 24,
  },
  addBtnTextDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
