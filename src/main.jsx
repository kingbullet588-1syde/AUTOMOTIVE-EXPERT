import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  document.getElementById('root').innerHTML = `<pre style="padding:2rem;color:#fff;background:#0d0d0d">${String(error?.stack || error)}</pre>`
  throw error
}
