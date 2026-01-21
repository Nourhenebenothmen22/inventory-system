import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../store/AuthStore';
import './MainLayout.css';

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
