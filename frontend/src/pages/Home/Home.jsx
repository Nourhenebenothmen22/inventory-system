import React, { useEffect, useMemo } from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import useProductStore from '../../store/ProductStore';
import useOrderStore from '../../store/OrderStore';
import useAuthStore from '../../store/AuthStore';
import './Home.css';

const Home = () => {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.some(role => role.name === 'admin');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity < 10).length;
  const recentOrders = orders.slice(0, 5);
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

  // Prepare data for Sales Trend Chart (Last 7 days or by date)
  const salesData = useMemo(() => {
    const dates = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      dates[date] = (dates[date] || 0) + parseFloat(order.total_price);
    });
    return Object.entries(dates)
      .map(([name, total]) => ({ name, total }))
      .slice(-7); // Last 7 unique dates
  }, [orders]);

  // Prepare data for Stock by Category (Distribution par Catégorie)
  const categoryData = useMemo(() => {
    const cats = {};
    products.forEach(p => {
      const catName = p.category?.name || 'Sans Catégorie';
      // On somme les quantités pour avoir une distribution réelle du stock
      cats[catName] = (cats[catName] || 0) + p.quantity;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0); // Ne montrer que les catégories avec du stock
  }, [products]);

  // Prepare data for Order Status distribution
  const statusData = useMemo(() => {
    const counts = { pending: 0, completed: 0, canceled: 0 };
    orders.forEach(o => {
      if (counts.hasOwnProperty(o.status)) {
        counts[o.status]++;
      }
    });
    return [
      { name: 'En attente', value: counts.pending, color: '#f59e0b' },
      { name: 'Confirmées', value: counts.completed, color: '#10b981' },
      { name: 'Annulées', value: counts.canceled, color: '#f43f5e' }
    ];
  }, [orders]);

  // Prepare data for Order volume by Product
  const productSalesData = useMemo(() => {
    const prodCounts = {};
    orders.forEach(order => {
      const prodName = order.product?.name || 'Inconnu';
      prodCounts[prodName] = (prodCounts[prodName] || 0) + order.quantity;
    });
    return Object.entries(prodCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // Pick top 5
  }, [orders]);

  // Prepare data for User Category Dependence (Volume d'achats par catégorie)
  const userOrderCategoryData = useMemo(() => {
    const cats = {};
    orders.forEach(o => {
      const catName = o.product?.category?.name || 'Sans Catégorie';
      cats[catName] = (cats[catName] || 0) + o.quantity;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  const COLORS = ['#6366f1', '#a855f7', '#f43f5e', '#10b981', '#f59e0b'];

  const stats = [
    { 
      label: 'Produits Totaux', 
      value: totalProducts, 
      icon: <Package className="text-primary" />, 
      change: '+12%', 
      isUp: true 
    },
    { 
      label: isAdmin ? 'Ventes Totales' : 'Mes Dépenses', 
      value: `${totalSales.toFixed(0)} €`, 
      icon: <ShoppingCart className="text-secondary" />, 
      change: '+5%', 
      isUp: true 
    },
    { 
      label: 'Stock Faible', 
      value: lowStockProducts, 
      icon: <AlertTriangle className="text-accent" />, 
      change: '-2%', 
      isUp: false 
    },
    { 
      label: 'Croissance', 
      value: '24.5%', 
      icon: <TrendingUp className="text-success" />, 
      change: '+2.4%', 
      isUp: true 
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>{isAdmin ? 'Aperçu analytique de votre activité' : 'Suivi de vos commandes'}</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-card">
            <div className="stat-icon-wrapper">
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <h2 className="stat-value">{stat.value}</h2>
              <div className={`stat-change ${stat.isUp ? 'up' : 'down'}`}>
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid mt-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {isAdmin && (
          <div className="chart-card glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3>Tendance des Ventes</h3>
              <span className="text-muted text-xs">Dates actives</span>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="chart-card glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3>État des Commandes</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-card p-6">
          {isAdmin ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3>Distribution par Catégorie</h3>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3>Produits les plus commandés</h3>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={productSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                    />
                    <Bar dataKey="quantity" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-main mt-8">
        <div className="recent-orders glass-card">
          <div className="card-header">
            <h3>Commandes Récentes</h3>
            <button className="btn btn-outline p-2">Voir tout</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-img-placeholder"></div>
                        <span>{order.product?.name}</span>
                      </div>
                    </td>
                    <td>{order.user?.name}</td>
                    <td className="font-bold">{order.total_price} €</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="inventory-alerts glass-card">
          <div className="card-header">
            <h3>Alertes Stock</h3>
          </div>
          <div className="alert-list">
            {products.filter(p => p.quantity < 10).map((product) => (
              <div key={product.id} className="alert-item">
                <div className="alert-dot red"></div>
                <div className="alert-content">
                  <span className="alert-title">{product.name}</span>
                  <span className="alert-desc">{product.quantity} unités</span>
                </div>
              </div>
            ))}
            {lowStockProducts === 0 && (
              <div className="p-4 text-center text-muted">Tout est en stock !</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
