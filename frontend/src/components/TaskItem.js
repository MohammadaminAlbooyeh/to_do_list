import React, { useState } from 'react';
import './TaskItem.css';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

export default function TaskItem({ item, onToggle, onDelete }) {
  const [isHovering, setIsHovering] = useState(false);
  const priorityColor = PRIORITY_COLORS[item.priority] || '#f59e0b';

  return (
    <div
      className={`task-item ${item.done ? 'task-done' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={item.done ? { opacity: 0.4 } : {}}
    >
      <button
        className="task-content"
        onClick={() => onToggle(item.id, !item.done)}
      >
        <div
          className="check"
          style={item.done ? { backgroundColor: priorityColor, borderColor: priorityColor } : {}}
        >
          {item.done && <span className="check-mark">✓</span>}
        </div>
        <div className="text-details">
          <div className={`title ${item.done ? 'title-done' : ''}`}>
            {item.title}
          </div>
          <div className="meta">
            <div className="priority-tag" style={{ backgroundColor: priorityColor + '15' }}>
              <div className="priority-dot" style={{ backgroundColor: priorityColor }} />
              <span className="priority-text" style={{ color: priorityColor }}>
                {item.priority}
              </span>
            </div>
            {item.category && (
              <div className="category-tag">
                <span className="category-text">{item.category}</span>
              </div>
            )}
          </div>
        </div>
      </button>

      <button
        className="delete-btn"
        onClick={() => onDelete(item.id)}
        style={{ opacity: isHovering ? 0.8 : 0.15 }}
      >
        ✕
      </button>
    </div>
  );
}
