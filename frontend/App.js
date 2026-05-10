import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  RefreshControl,
  Alert,
  Keyboard,
  StyleSheet,
  Animated,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import useTodos from './src/useTodos';
import AddTaskBar from './src/components/AddTaskBar';
import TaskItem from './src/components/TaskItem';

const CATEGORIES = ['All', 'Personal', 'Work', 'Shopping', 'Health', 'Finance'];

const Pressable = ({ children, style, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>{children}</TouchableOpacity>
);

function App() {
  const { incomplete, completed, loading, error, stats, fetch, add, toggle, remove } = useTodos();
  const [newTitle, setNewTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const total = incomplete.length + completed.length;
  const progress = total > 0 ? completed.length / total : 0;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: false,
      friction: 4,
      tension: 40,
    }).start();
  }, [progress]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleAdd = (priority, dueDate, category) => {
    add(newTitle, priority, dueDate, category);
    setNewTitle('');
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this task?')) remove(id);
    } else {
      Alert.alert('Delete task', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
      ]);
    }
  };

  const filteredIncomplete = useMemo(() => {
    return incomplete.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'All' || t.category === selectedCategory)
    );
  }, [incomplete, searchQuery, selectedCategory]);

  const filteredCompleted = useMemo(() => {
    return completed.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'All' || t.category === selectedCategory)
    );
  }, [completed, searchQuery, selectedCategory]);

  const sections = [
    { title: 'Active', data: filteredIncomplete, accent: '#7c3aed' },
    { title: 'Done', data: filteredCompleted, accent: '#22c55e' },
  ].filter(s => s.data.length > 0);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>◆</Text>
              </View>
              <View>
                <Text style={styles.brandName}>doflow</Text>
                <Text style={styles.statsSubtitle}>
                  {stats ? (stats.completed + '/' + stats.total + ' tasks finished') : 'Loading...'}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
                  <View style={styles.progressGlow} />
                </Animated.View>
              </View>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>

          {/* Stats */}
          {stats && (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
                <View style={styles.statCard}>
                  <Text style={styles.statVal}>{stats.pending}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={[styles.statCard, { borderColor: '#22c55e30' }]}>
                  <Text style={[styles.statVal, { color: '#22c55e' }]}>{stats.completed}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                {Object.entries(stats.categories || {}).map(([cat, count]) => (
                  <View key={cat} style={styles.statCard}>
                    <Text style={styles.statVal}>{count}</Text>
                    <Text style={styles.statLabel}>{cat}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.body}>
            <AddTaskBar value={newTitle} onChange={setNewTitle} onSubmit={handleAdd} />

            {/* Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search tasks..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                {CATEGORIES.map(cat => (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
                  >
                    <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>{cat}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {error && <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View>}

            <SectionList
              sections={sections}
              keyExtractor={item => String(item.id)}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={({ section }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <View style={[styles.badge, { backgroundColor: section.accent + '20' }]}>
                    <Text style={[styles.badgeText, { color: section.accent }]}>{section.data.length}</Text>
                  </View>
                </View>
              )}
              renderItem={({ item }) => (
                <TaskItem item={item} onToggle={toggle} onDelete={handleDelete} />
              )}
              contentContainerStyle={styles.listContainer}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} tintColor="#7c3aed" />}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>{searchQuery ? 'No results found' : 'No tasks yet'}</Text>
                </View>
              }
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07070d' },
  safe: { flex: 1 },
  inner: { flex: 1 },
  header: { padding: 24, paddingBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  logo: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  brandName: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  statsSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#7c3aed', borderRadius: 4 },
  progressGlow: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 20, backgroundColor: 'rgba(255,255,255,0.3)' },
  progressPercent: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', width: 35 },
  statsScroll: { paddingLeft: 24, paddingBottom: 16, gap: 12 },
  statCard: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', minWidth: 100, marginRight: 12 },
  statVal: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' },
  body: { flex: 1 },
  filterSection: { marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchIcon: { fontSize: 14, marginRight: 10, opacity: 0.5 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 14 },
  catScroll: { paddingLeft: 20, paddingBottom: 8, gap: 8 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginRight: 8 },
  catPillActive: { backgroundColor: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)' },
  catPillText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  catPillTextActive: { color: '#7c3aed' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, marginTop: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: 'rgba(255,255,255,0.15)', fontSize: 14, fontWeight: '500' },
  error: { margin: 20, padding: 12, backgroundColor: '#ef444415', borderRadius: 12, borderWidth: 1, borderColor: '#ef444430' },
  errorText: { color: '#ef4444', fontSize: 13, textAlign: 'center' },
});

export default App;
