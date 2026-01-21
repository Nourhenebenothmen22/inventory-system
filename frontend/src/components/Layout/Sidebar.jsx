import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Truck, 
  ShoppingCart, 
  History, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../store/AuthStore';
import './Sidebar.css';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', id: 'dashboard', path: '/' },
    { icon: <Package size={20} />, label: 'Produits', id: 'products', path: '/products' },
    { icon: <ShoppingCart size={20} />, label: 'Commandes', id: 'orders', path: '/orders' },
    { icon: <History size={20} />, label: 'Historique', id: 'logs', path: '/logs' },
  ];

  // Admin exclusive items
  if (user?.roles?.some(role => role.name === 'admin')) {
    menuItems.splice(2, 0, 
      { icon: <Tags size={20} />, label: 'Catégories', id: 'categories', path: '/categories' },
      { icon: <Truck size={20} />, label: 'Fournisseurs', id: 'suppliers', path: '/suppliers' }
    );
    menuItems.push({ icon: <Users size={20} />, label: 'Utilisateurs', id: 'users', path: '/users' });
  }

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">I</div>
          <span className="logo-text">Inven<span className="text-primary">Track</span></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.id} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
