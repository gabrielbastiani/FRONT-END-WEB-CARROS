import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './contexts/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer autoClose={5000} />
    </AuthProvider>
  </React.StrictMode>,
)