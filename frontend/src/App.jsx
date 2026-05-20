import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
const Register = lazy(() => import('./pages/Register'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Budgets = lazy(() => import('./pages/Budgets'));
const SavingsGoals = lazy(() => import('./pages/SavingsGoals'));
const AIAdviser = lazy(() => import('./pages/AIAdviser'));
const CurrencyConverter = lazy(() => import('./pages/CurrencyConverter'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const AuthDemo = lazy(() => import('./pages/AuthDemo'));

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function LoadingFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="lg" />
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Auth Demo Page - accessible without login for showcase */}
          <Route path="/auth-demo" element={<AuthDemo />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="savings" element={<SavingsGoals />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ai-adviser" element={<AIAdviser />} />
            <Route path="currency" element={<CurrencyConverter />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
