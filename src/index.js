import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Main entry point for the Family Doctor Finder React application
 * 
 * This file initializes the React application and renders the main App component
 * into the DOM element with id 'root'.
 * 
 * The application is wrapped in React.StrictMode for additional development
 * checks and warnings.
 */

// Get the root DOM element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component in strict mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 