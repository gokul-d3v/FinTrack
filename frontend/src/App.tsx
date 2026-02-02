import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "./components/layout/main-layout"
import FinancialLedgerPage from "./components/pages/financial-ledger-page"
import DashboardPage from "./components/pages/dashboard-page"

import SettingsPage from "./components/pages/settings-page"
import AddTransactionPage from "./components/pages/add-transaction-page"
import SavingsGoalsPage from "./components/pages/savings-goals-page"
import AddGoalPage from "./components/pages/add-goal-page"
import BudgetPage from "./components/pages/budget-page"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tracker" element={<FinancialLedgerPage />} />

          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/savings-goals" element={<SavingsGoalsPage />} />
          <Route path="/savings-goals/new" element={<AddGoalPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
