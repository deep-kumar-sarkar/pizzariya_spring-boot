import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
