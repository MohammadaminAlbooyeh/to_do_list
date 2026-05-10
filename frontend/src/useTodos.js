import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 8000 });

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/todos');
      setTodos(data);
      setError(null);
    } catch {
      setError('Cannot reach server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = useCallback(async (title, priority = 'medium') => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const { data } = await api.post('/todos', { title: trimmed, priority });
      setTodos(prev => [...prev, data]);
      setError(null);
    } catch {
      setError('Failed to add task');
    }
  }, []);

  const toggle = useCallback(async (id, done) => {
    const prev = [...todos];
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done } : t));
    try {
      await api.put(`/todos/${id}`, { done });
      setError(null);
    } catch {
      setTodos(prev);
      setError('Failed to update');
    }
  }, [todos]);

  const remove = useCallback(async (id) => {
    const prev = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.delete(`/todos/${id}`);
      setError(null);
    } catch {
      setTodos(prev);
      setError('Failed to delete');
    }
  }, [todos]);

  const incomplete = todos.filter(t => !t.done);
  const completed = todos.filter(t => t.done);

  return { todos, incomplete, completed, loading, error, fetch, add, toggle, remove };
}
