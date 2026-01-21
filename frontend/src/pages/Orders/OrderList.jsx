import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  ShoppingCart,
  Calendar,
  ExternalLink,
  Trash2,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import useOrderStore from '../../store/OrderStore';
import useProductStore from '../../store/ProductStore';
import useAuthStore from '../../store/AuthStore';

const OrderList = () => {
  const { orders, loading, fetchOrders, deleteOrder, addOrder, updateOrder } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const user = useAuthStore((state) => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleOpenModal = () => {
    setFormData({ product_id: '', quantity: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addOrder(formData);
      toast.success('Commande passée avec succès');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      const msg = status === 'completed' ? 'Commande acceptée' : 'Commande annulée';
      toast.success(msg);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Commandes</h1>
          <p className="text-muted">Historique et gestion des transactions</p>
        </div>
        <button onClick={handleOpenModal} className="btn btn-primary">
          <Plus size={20} /> Nouvelle commande
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex gap-4">
        <div className="search-bar flex-1">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher par produit ou client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Réf</th>
                <th>Produit</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-10">Chargement...</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="text-xs font-mono">#{order.id}</td>
                  <td>
                    <div className="font-bold">{order.product?.name}</div>
                    <div className="text-xs text-muted">Qté: {order.quantity}</div>
                  </td>
                  <td>{order.user?.name}</td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-muted" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="font-bold">{order.total_price} €</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          {user?.roles?.[0]?.name === 'admin' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'completed')} 
                                className="btn btn-outline p-2 text-success" 
                                title="Accepter"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'canceled')} 
                                className="btn btn-outline p-2 text-accent" 
                                title="Refuser"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            user?.id === order.user_id && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'canceled')} 
                                className="btn btn-outline p-2 text-accent" 
                                title="Annuler ma commande"
                              >
                                <X size={16} /> Annuler
                              </button>
                            )
                          )}
                        </>
                      )}
                      <button className="btn btn-outline p-2" title="Détails">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && !loading && (
                <tr><td colSpan="7" className="text-center p-10 text-muted">Aucune commande trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Créer une commande</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="input-group">
                <label>Sélectionner un produit</label>
                <select 
                  className="input-field"
                  value={formData.product_id}
                  onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                  required
                >
                  <option value="">Sélectionner</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.quantity} en stock)</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Quantité</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-field" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required 
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary"><ShoppingCart size={18} /> Valider la commande</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
