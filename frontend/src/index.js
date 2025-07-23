import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import './index.css'; // You can keep this or create it later for global styles
import App from './App'; // Import your main App component

// Get the root element from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);