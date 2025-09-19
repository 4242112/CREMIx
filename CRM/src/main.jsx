// ...existing code...

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
