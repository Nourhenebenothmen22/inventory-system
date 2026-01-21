import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Trash2, 
  Mail, 
  Shield, 
  Calendar,
  Search
} from 'lucide-react';
import userService from '../../service/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await userService.delete(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Gestion des Utilisateurs</h1>
        <p className="text-muted">Consultez et gérez les comptes de votre équipe</p>
      </div>

      <div className="glass-card p-4 mb-6 flex gap-4">
        <div className="search-bar flex-1">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
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
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-10">Chargement des utilisateurs...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-muted" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className={user.roles?.[0]?.name === 'admin' ? 'text-primary' : 'text-success'} />
                      <span className="capitalize text-sm font-medium">
                        {user.roles?.[0]?.name || 'Utilisateur'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-muted" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-outline p-2 text-accent"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr><td colSpan="5" className="text-center p-10 text-muted">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
