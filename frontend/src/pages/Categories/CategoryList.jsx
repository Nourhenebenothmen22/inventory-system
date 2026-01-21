import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import useCategoryStore from '../../store/CategoryStore';

const CategoryList = () => {
  const { categories, loading, fetchCategories, deleteCategory, addCategory, updateCategory } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id);
        toast.success('Catégorie supprimée');
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Catégorie mise à jour');
      } else {
        await addCategory(formData);
        toast.success('Catégorie ajoutée');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Erreur lors de l’enregistrement');
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Catégories</h1>
          <p className="text-muted">Gérez les types de produits</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={20} /> Nouvelle catégorie
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex gap-4">
        <div className="search-bar flex-1">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher une catégorie..." 
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
                <th>Description</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && categories.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-10">Chargement...</td></tr>
              ) : filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="flex items-center gap-2">
                       <Tag size={16} className="text-primary" />
                       <span className="font-bold">{category.name}</span>
                    </div>
                  </td>
                  <td>{category.description || '-'}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(category)} className="btn btn-outline p-2">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="btn btn-outline p-2 text-accent">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && !loading && (
                <tr><td colSpan="3" className="text-center p-10 text-muted">Aucune catégorie trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="input-group">
                <label>Nom de la catégorie</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Description (Optionnelle)</label>
                <textarea 
                  className="input-field" 
                  style={{height: '100px', paddingTop: '10px'}}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary">{editingCategory ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
