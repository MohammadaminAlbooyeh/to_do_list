import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  RefreshControl,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import useTodos from './src/useTodos';
import AddTaskBar from './src/components/AddTaskBar';
import TaskItem from './src/components/TaskItem';

function dismissKeyboard() {
  Keyboard.dismiss();
}

function App() {
  const { incomplete, completed, loading, error, fetch, add, toggle, remove } = useTodos();
  const [newTitle, setNewTitle] = useState('');
  const listRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const total = incomplete.length + completed.length;
  const progress = total > 0 ? completed.length / total : 0;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: false,
      friction: 6,
    }).start();
  }, [progress]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleAdd = (priority) => {
    if (!newTitle.trim()) return;
    add(newTitle, priority);
    setNewTitle('');
  };

  const handleDelete = (id) => {
    Alert.alert('Delete task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const sections = [
    {
      title: 'To Do',
      icon: '○',
      data: incomplete,
      empty: 'Nothing to do! Add a task above.',
      badge: incomplete.length,
      accent: '#7c3aed',
    },
    {
      title: 'Completed',
      icon: '✓',
      data: completed,
      empty: 'No completed tasks yet.',
      badge: completed.length,
      accent: '#22c55e',
    },
  ].filter(s => s.title !== 'Completed' || completed.length > 0 || incomplete.length > 0);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        <SafeAreaView style={styles.safe}>
          <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerGlow} />
              <View style={styles.brandRow}>
                <View style={styles.brandIcon}>
                  <Text style={styles.brandIconText}>◆</Text>
                </View>
                <View>
                  <Text style={styles.brandName}>doflow</Text>
                  <Text style={styles.sub}>
                    {incomplete.length} pending · {completed.length} done
                  </Text>
                </View>
              </View>

              {/* Progress */}
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                </View>
                <Text style={styles.progressText}>
                  {total > 0 ? Math.round(progress * 100) : 0}%
                </Text>
              </View>
            </View>

            {/* Add task */}
            <View style={styles.body}>
              <AddTaskBar
                value={newTitle}
                onChange={setNewTitle}
                onSubmit={handleAdd}
              />

              {/* Error */}
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorIcon}>!</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* List */}
              <SectionList
                ref={listRef}
                sections={sections}
                keyExtractor={item => String(item.id)}
                stickySectionHeadersEnabled={false}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetch}
                    tintColor="#7c3aed"
                    colors={['#7c3aed']}
                    progressBackgroundColor="#1c1c24"
                  />
                }
                renderSectionHeader={({ section }) => (
                  <View style={styles.sectionHead}>
                    <View style={styles.sectionTitleRow}>
                      <Text style={styles.sectionIcon}>{section.icon}</Text>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <View style={[styles.sectionBadge, { backgroundColor: section.accent + '20' }]}>
                      <Text style={[styles.sectionBadgeText, { color: section.accent }]}>
                        {section.badge}
                      </Text>
                    </View>
                  </View>
                )}
                renderItem={({ item }) => (
                  <TaskItem item={item} onToggle={toggle} onDelete={handleDelete} />
                )}
                renderSectionFooter={({ section }) =>
                  section.data.length === 0 ? (
                    <View style={styles.emptyWrap}>
                      <Text style={styles.emptyIcon}>{section.icon}</Text>
                      <Text style={styles.emptyText}>{section.empty}</Text>
                    </View>
                  ) : null
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 40 }} />}
              />
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default App;

if (typeof document !== 'undefined') {
  import('react-dom/client').then(({ createRoot }) => {
    const container = document.getElementById('root');
    if (container && !container._reactRootContainer) {
      const root = createRoot(container);
      root.render(<App />);
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070d',
  },
  safe: {
    flex: 1,
    backgroundColor: '#07070d',
  },
  inner: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0d0d16',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
  },
  brandIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f1f7',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    width: 36,
    textAlign: 'right',
  },
  body: {
    flex: 1,
    paddingTop: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    gap: 10,
  },
  errorIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239,68,68,0.2)',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
    overflow: 'hidden',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.2)',
    fontWeight: '500',
  },
});
