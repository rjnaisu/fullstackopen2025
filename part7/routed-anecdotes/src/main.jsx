import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AnecdotesProvider } from './context/AnecdotesContext'

createRoot(document.getElementById('root')).render(
  <AnecdotesProvider>
    <App />
  </AnecdotesProvider>
)
