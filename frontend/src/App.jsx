import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FloattingShape } from './components/FloattingShape'
import { Routes,Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth.store'
import { Loader } from 'lucide-react'
import DashboardPage from './pages/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPasswordPage'


const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

    if(!isAuthenticated){
      return <Navigate to="/login" replace />
    }

    if(!user.isVerified){
      return <Navigate to="/verify-email" replace />
    }

    return children;
  }

const RedirectAuthenticatedUser = ({children}) => {
    const {isAuthenticated, user} = useAuthStore();

    if(isAuthenticated && user.isVerified){
      return <Navigate to="/" replace />
    }

    return children;
  }

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth){
    return (<LoadingSpinner />)
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-br 
    from-gray-900 via-green-900 to-emerald-900 
    flex items-center justify-center relative overflow-hidden'>
      <FloattingShape color='bg-green-500' size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <FloattingShape color='bg-emerald-500' size="w-48 h-48" top="70%" left="80%" delay={5}/>
      <FloattingShape color='bg-lime-500' size="w-32 h-32" top="40%" left="-10%" delay={2}/>

      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }/>
        
        <Route path="/Signup" element= {
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>}
        />
        
        <Route path='/Login' element = {
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>}
        />

        <Route path="/verify-email" element={<EmailVerificationPage />}/>
        <Route path="/forgot-password" element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        }/>

        <Route path="/reset-password/:token" element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
        </RedirectAuthenticatedUser>}/>
        <Route path="*" element={"Page Not Found"} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
