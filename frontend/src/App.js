import React, { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle("");
    fetch('/api/todos').then(res => res.json()).then(setTodos);
  };

  const toggleTodo = async (id, done) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done })
    });
    fetch('/api/todos').then(res => res.json()).then(setTodos);
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetch('/api/todos').then(res => res.json()).then(setTodos);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>To-Do List</h2>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add new todo..." />
        <button type="submit">Add</button>
      </form>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
            <input type="checkbox" checked={!!todo.done} onChange={() => toggleTodo(todo.id, todo.done)} />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 'auto' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
