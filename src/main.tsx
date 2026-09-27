import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LaunchScreen } from './components/LaunchScreen'
import { SatProvider } from './store'
import 'leaflet/dist/leaflet.css'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SatProvider>
      <LaunchScreen><App /></LaunchScreen>
    </SatProvider>
  </StrictMode>,
)
