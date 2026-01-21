import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import useAuthStore from '../../../store/AuthStore';
import '../Login/Login.css';

import toast from 'react-hot-toast';

const Register = () => {
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '' 
  });
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">I</div>
          <h1>Rejoignez-nous</h1>
          <p>Créez votre compte de gestion d'inventaire</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="name">Nom complet</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="John Doe"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="nom@exemple.com"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                className="input-field"
                placeholder="••••••••"
                value={userData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Création...' : <><UserPlus size={18} /> S'inscrire</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
