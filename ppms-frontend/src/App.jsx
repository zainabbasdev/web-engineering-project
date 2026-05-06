import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { SalesPage } from './pages/SalesPage';
import { StockPage } from './pages/StockPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CustomerLedgerPage } from './pages/CustomerLedgerPage';
import { CustomerTransactionDetailPage } from './pages/CustomerTransactionDetailPage';
import { ReportsPage } from './pages/ReportsPage';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';

// Components
import { Toast } from './components/ui/Toast';

// Styles
import './styles/globals.css';

/**
 * ProtectedRoute - Route guard for authenticated pages with AdminLayout
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * RoleProtectedRoute - Route guard for role-based access with AdminLayout
 * Only allows users with specified roles to access the route
 */
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to an accessible page based on user role instead of login
    // This prevents redirect loops for users with limited permissions
    const roleRedirects = {
      manager: '/sales',
      accountant: '/ledger',
      admin: '/dashboard',
    };
    const redirectPath = roleRedirects[user?.role] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toast />
      <Router>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected + Layout - Admin Only Routes */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </RoleProtectedRoute>
            } />
            <Route path="/inventory" element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <InventoryPage />
              </RoleProtectedRoute>
            } />
            <Route path="/sales" element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <SalesPage />
              </RoleProtectedRoute>
            } />
            <Route path="/stock" element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <StockPage />
              </RoleProtectedRoute>
            } />
            <Route path="/employees" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <EmployeesPage />
              </RoleProtectedRoute>
            } />
            <Route path="/expenses" element={
              <RoleProtectedRoute allowedRoles={['admin', 'accountant']}>
                <ExpensesPage />
              </RoleProtectedRoute>
            } />
            <Route path="/ledger" element={
              <RoleProtectedRoute allowedRoles={['admin', 'accountant']}>
                <CustomerLedgerPage />
              </RoleProtectedRoute>
            } />
            <Route path="/ledger/:id" element={
              <RoleProtectedRoute allowedRoles={['admin', 'accountant']}>
                <CustomerTransactionDetailPage />
              </RoleProtectedRoute>
            } />
            <Route path="/reports" element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>
                <ReportsPage />
              </RoleProtectedRoute>
            } />
          </Route>

          {/* Role-based Home Redirect */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to={(() => {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const roleRedirects = {
                  admin: '/dashboard',
                  manager: '/sales',
                  accountant: '/ledger',
                };
                return roleRedirects[user?.role] || '/login';
              })()} replace />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
