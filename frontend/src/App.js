// src/App.js
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* This div creates the red bar on the left */}
      <div className="left-red-bar">
        {/* Navigation Buttons */}
        <button className="nav-button">Dashboard</button>
        <button className="nav-button">My Tasks</button>
        <button className="nav-button">Task Categories</button>
      </div>

      {/* This div will contain all your main application content */}
      <div className="main-content">
        <h1>My To-Do List</h1>
        <p>This is where your To-Do list content will appear.</p>
        <input type="text" placeholder="Add a new task..." />
        <button>Add Task</button>

        {/* New: Container for the content boxes */}
        <div className="content-boxes-container">
          {/* Box 1: To-Do */}
          <div className="content-box">
            <h2>To-Do</h2>
            {/* Placeholder for actual To-Do items */}
            <p>You have pending tasks here.</p>
          </div>

          {/* Box 2: Task Status */}
          <div className="content-box">
            <h2>Task Status</h2>
            {/* Placeholder for status overview */}
            <p>See your task progress.</p>
          </div>

          {/* Box 3: Completed Tasks */}
          <div className="content-box">
            <h2>Completed Tasks</h2>
            {/* Placeholder for completed tasks list */}
            <p>Review your finished tasks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;