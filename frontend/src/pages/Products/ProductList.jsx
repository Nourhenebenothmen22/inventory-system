import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Filter,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import useProductStore from '../../store/ProductStore';
import useCategoryStore from '../../store/CategoryStore';
import useSupplierStore from '../../store/SupplierStore';
import useAuthStore from '../../store/AuthStore';

const ProductList = () => {
  const { products, loading, fetchProducts, deleteProduct, addProduct, updateProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.some(role => role.name === 'admin');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    supplier_id: '',
    price: '',
    quantity: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
        toast.success('Produit supprimé avec succès');
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category_id: product.category_id,
        supplier_id: product.supplier_id || '',
        price: product.price,
        quantity: product.quantity,
        image: null
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category_id: '',
        supplier_id: '',
        price: '',
        quantity: '',
        image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Produit mis à jour');
      } else {
        await addProduct(data);
        toast.success('Produit ajouté avec succès');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Erreur lors de l’enregistrement');
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Produits</h1>
          <p className="text-muted">Gérez votre catalogue de produits</p>
        </div>
        {isAdmin && (
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <Plus size={20} /> Ajouter un produit
          </button>
        )}
      </div>

      <div className="glass-card p-4 mb-6 flex gap-4">
        <div className="search-bar flex-1">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline">
          <Filter size={18} /> Filtrer
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Fournisseur</th>
                {isAdmin && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading && products.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-10">Chargement...</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-img-placeholder">
                        <Package size={20} className="text-muted" />
                      </div>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs text-muted">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                      {product.category?.name}
                    </span>
                  </td>
                  <td>{product.price} €</td>
                  <td>
                    <span className={`font-bold ${product.quantity < 10 ? 'text-accent' : 'text-success'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>{product.supplier?.name || '-'}</td>
                  {isAdmin && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="btn btn-outline p-2">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="btn btn-outline p-2 text-accent">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card p-8 w-full max-w-lg">
            <h2>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="input-group">
                <label>Nom du produit</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="flex gap-4">
                <div className="input-group flex-1">
                  <label>Catégorie</label>
                  <select 
                    className="input-field"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="input-group flex-1">
                  <label>Fournisseur</label>
                  <select 
                    className="input-field"
                    value={formData.supplier_id}
                    onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="input-group flex-1">
                  <label>Prix (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group flex-1">
                  <label>Quantité</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Image (Optionnel)</label>
                <input 
                  type="file" 
                  className="input-field" 
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Mettre à jour' : 'Créer le produit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
