import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import useAuthStore from '../../store/AuthStore';
import './Navbar.css';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="navbar glass-card">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Rechercher..." />
      </div>

      <div className="navbar-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.roles?.[0]?.name || 'Utilisateur'}</span>
          </div>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
