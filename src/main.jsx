import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WateredGardenChurch from './WateredGardenChurch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WateredGardenChurch />
  </StrictMode>,
)
