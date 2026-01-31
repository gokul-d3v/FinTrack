import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/login-page"
import SignupPage from "./components/signup-page"
import ForgotPasswordPage from "./components/forgot-password-page"
import DashboardPage from "./components/dashboard-page"
import TransactionsPage from "./components/transactions-page"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
