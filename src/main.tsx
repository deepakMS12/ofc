import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const rootElement = document.querySelector<HTMLDivElement>('#app');

if (!rootElement) {
  throw new Error('Root element #app not found');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Error rendering app:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : String(error);
  
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #d32f2f;">Error Loading Application</h2>
      <p><strong>Error:</strong> ${errorMessage}</p>
      <details style="margin-top: 10px;">
        <summary style="cursor: pointer; color: #1976d2;">Show Details</summary>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 10px; font-size: 12px;">${errorStack}</pre>
      </details>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px;">
        Reload Page
      </button>
    </div>
  `;
}

