/**
 * main.jsx
 * 
 * APPLICATION ENTRY POINT: CREMIx CRM System
 * 
 * PURPOSE:
 * - Bootstrap the React application and render to DOM
 * - Set up error handling and development tools
 * - Initialize global CSS and styling framework
 * - Provide application-wide error boundary for graceful failure handling
 * 
 * ARCHITECTURE:
 * - React 18 with createRoot for concurrent rendering features
 * - StrictMode for development warnings and best practices
 * - ErrorBoundary for production error handling and user experience
 * - Global CSS import for Tailwind and custom styles
 * 
 * ERROR HANDLING:
 * - ErrorBoundary catches JavaScript errors anywhere in component tree
 * - Provides fallback UI instead of white screen of death
 * - Logs errors for debugging while maintaining user experience
 * - Prevents single component failures from crashing entire application
 * 
 * DEVELOPMENT FEATURES:
 * - StrictMode enables additional checks and warnings
 * - Helps identify unsafe lifecycles and deprecated APIs
 * - Double-renders components to catch side effects
 * - Warns about deprecated string refs and findDOMNode usage
 * 
 * PRODUCTION OPTIMIZATIONS:
 * - React 18 concurrent features for better performance
 * - Automatic batching for state updates
 * - Suspense-ready architecture for code splitting
 * - Error boundaries prevent complete application crashes
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'                                           // Global styles: Tailwind CSS + custom styling
import App from './App.jsx'                                    // Main application component with routing
import ErrorBoundary from './Components/common/ErrorBoundary.jsx'  // Application-wide error handling

// APPLICATION INITIALIZATION
// Mount React application to DOM with error handling and development tools
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
