import React, { useState } from 'react';
import './AddTaskBar.css';

const PRIORITIES = [
  { key: 'low', label: 'Low', color: '#22c55e' },
  { key: 'medium', label: 'Med', color: '#f59e0b' },
  { key: 'high', label: 'High', color: '#ef4444' },
];

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Finance'];

export default function AddTaskBar({ value, onChange, onSubmit }) {
  const [priority, setPriority] = useState(null);
  const [category, setCategory] = useState('Personal');
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || !value.trim()) return;
    if (!priority) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    onSubmit(priority, null, category);
    setPriority(null);
    setCategory('Personal');
    setIsFocused(false);
  };

  return (
    <div className="add-task-wrap">
      <form onSubmit={handleSubmit} className={`input-row ${isFocused ? 'input-row-focused' : ''}`}>
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && value.trim() && priority) {
              handleSubmit(e);
            }
          }}
          maxLength={200}
        />
        <div className="priority-inline">
          {PRIORITIES.map(p => (
            <button
              key={p.key}
              type="button"
              className={`pill ${priority === p.key ? 'pill-active' : 'pill-inactive'}`}
              style={priority === p.key ? { backgroundColor: p.color, borderColor: p.color } : {}}
              onClick={() => setPriority(p.key)}
            >
              <span className={`pill-text ${priority === p.key ? 'pill-text-active' : ''}`}>{p.label}</span>
            </button>
          ))}
        </div>
        <button type="submit" className={`add-btn ${!value || !value.trim() || !priority ? 'add-btn-disabled' : ''}`}>
          +
        </button>
      </form>

      {showError && (
        <div className="error-notification">
          <span className="error-icon">⚠️</span>
          <span className="error-message">Please select a priority (Low, Medium, or High)</span>
        </div>
      )}

      {isFocused && (
        <div className="options">
          <div className="option-section">
            <label className="option-label">Category</label>
            <div className="pill-row">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`pill ${category === cat ? 'pill-category-active' : 'pill-inactive'}`}
                  onClick={() => setCategory(cat)}
                >
                  <span className={`pill-text ${category === cat ? 'pill-text-active' : ''}`}>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
