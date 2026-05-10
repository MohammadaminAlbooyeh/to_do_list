import React from 'react';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(rootElement);
      root.render(<App />);
    });
  }
}

export default App;
