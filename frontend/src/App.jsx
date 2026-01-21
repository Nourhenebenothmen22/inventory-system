import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/AuthStore';

// Layouts
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/Layout/MainLayout';

// Pages
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Home from './pages/Home/Home';
import ProductList from './pages/Products/ProductList';
import CategoryList from './pages/Categories/CategoryList';
import SupplierList from './pages/Suppliers/SupplierList';
import OrderList from './pages/Orders/OrderList';
import InventoryLogs from './pages/Logs/InventoryLogs';
import UserList from './pages/Users/UserList';

// Placeholder for other pages to avoid crashes
const Placeholder = ({ name }) => (
  <div className="glass-card p-10 text-center">
    <h2>Page {name}</h2>
    <p className="text-muted">Cette page est en cours de développement.</p>
  </div>
);

function App() {
  const getMe = useAuthStore((state) => state.getMe);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      getMe();
    }
  }, [isAuthenticated, getMe]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="logs" element={<InventoryLogs />} />
          <Route path="users" element={<UserList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Router>
    </>
  );
}

export default App;
