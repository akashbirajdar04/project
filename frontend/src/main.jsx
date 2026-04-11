

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import "./App.css"
import "./index.css"
import './style.css'

import { Toaster } from 'sonner';

import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster position="top-right" richColors />
    <SpeedInsights />
  </BrowserRouter>
)
