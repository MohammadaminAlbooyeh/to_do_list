// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5050';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/todos`, { title: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, done) => {
    try {
      await axios.put(`${API_BASE_URL}/todos/${id}`, { done });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="App">
      <div className="left-red-bar">
        <button className="nav-button">Dashboard</button>
        <button className="nav-button">My Tasks</button>
        <button className="nav-button">Task Categories</button>
      </div>
      <div className="main-content">
        <h1>My To-Do List</h1>
        <div>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo}>Add Task</button>
        </div>
        <div className="content-boxes-container">
          <div className="content-box">
            <h2>To-Do</h2>
            <ul>
              {todos.filter(todo => !todo.done).map(todo => (
                <li key={todo.id}>
                  {todo.title}
                  <button onClick={() => updateTodo(todo.id, true)}>Done</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="content-box">
            <h2>Completed Tasks</h2>
            <ul>
              {todos.filter(todo => todo.done).map(todo => (
                <li key={todo.id}>
                  {todo.title}
                  <button onClick={() => updateTodo(todo.id, false)}>Undo</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;