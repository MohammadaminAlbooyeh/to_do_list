import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, LayoutAnimation, Platform } from 'react-native';

const PRIORITIES = [
  { key: 'low', label: 'low', color: '#22c55e' },
  { key: 'medium', label: 'med', color: '#f59e0b' },
  { key: 'high', label: 'high', color: '#ef4444' },
];

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Finance'];

export default function AddTaskBar({ value, onChange, onSubmit }) {
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!value || !value.trim()) return;
    onSubmit(priority, null, category);
  };

  const toggleFocus = (focused) => {
    if (Platform.OS !== 'web') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsFocused(focused);
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={value}
          onChangeText={onChange}
          onFocus={() => toggleFocus(true)}
          onBlur={() => toggleFocus(false)}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          maxLength={200}
        />
        <View style={styles.btnWrap}>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              (!value || !value.trim()) && styles.addBtnDisabled,
              pressed && styles.addBtnPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </View>

      {isFocused && (
        <View style={styles.options}>
          <View style={styles.optionSection}>
            <Text style={styles.optionLabel}>Priority</Text>
            <View style={styles.pillRow}>
              {PRIORITIES.map(p => (
                <Pressable
                  key={p.key}
                  style={[
                    styles.pill,
                    priority === p.key ? { backgroundColor: p.color, borderColor: p.color } : styles.pillInactive
                  ]}
                  onPress={() => setPriority(p.key)}
                >
                  <Text style={[styles.pillText, priority === p.key && styles.pillTextActive]}>{p.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.optionSection}>
            <Text style={styles.optionLabel}>Category</Text>
            <View style={styles.pillRow}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat}
                  style={[
                    styles.pill,
                    category === cat ? styles.pillCategoryActive : styles.pillInactive
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingLeft: 20,
    transition: 'all 0.3s ease',
  },
  inputRowFocused: {
    borderColor: 'rgba(124,58,237,0.4)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#f1f1f7',
    paddingVertical: 18,
  },
  btnWrap: {
    padding: 6,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnPressed: {
    transform: [{ scale: 0.95 }],
  },
  addBtnText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
  options: {
    marginTop: 16,
    gap: 16,
  },
  optionSection: {
    gap: 8,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  pillInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillCategoryActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  pillTextActive: {
    color: '#fff',
  },
});
