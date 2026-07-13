import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { MentorProvider } from './context/MentorContext.jsx'
import { PortalProvider } from './context/PortalContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
      <MentorProvider>
        <PortalProvider>
          <App />
        </PortalProvider>
      </MentorProvider>
    </SearchProvider>
  </StrictMode>,
)
