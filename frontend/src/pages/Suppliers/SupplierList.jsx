import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail,
  Phone,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSupplierStore from '../../store/SupplierStore';

const SupplierList = () => {
  const { suppliers, loading, fetchSuppliers, deleteSupplier, addSupplier, updateSupplier } = useSupplierStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await deleteSupplier(id);
        toast.success('Fournisseur supprimé');
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
        toast.success('Fournisseur mis à jour');
      } else {
        await addSupplier(formData);
        toast.success('Fournisseur ajouté');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Erreur lors de l’enregistrement');
      console.error(err);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Fournisseurs</h1>
          <p className="text-muted">Gérez vos partenaires commerciaux</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={20} /> Ajouter un fournisseur
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex gap-4">
        <div className="search-bar flex-1">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un fournisseur..." 
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
                <th>Nom</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && suppliers.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-10">Chargement...</td></tr>
              ) : filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="user-avatar" style={{width: '32px', height: '32px'}}>
                        <User size={16} />
                      </div>
                      <span className="font-bold">{supplier.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-muted" />
                      {supplier.email || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-muted" />
                      {supplier.phone || '-'}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(supplier)} className="btn btn-outline p-2">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="btn btn-outline p-2 text-accent">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && !loading && (
                <tr><td colSpan="4" className="text-center p-10 text-muted">Aucun fournisseur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="input-group">
                <label>Nom de l'entreprise</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Email de contact</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Téléphone</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Adresse</label>
                <textarea 
                  className="input-field" 
                  style={{height: '80px', paddingTop: '10px'}}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary">{editingSupplier ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
