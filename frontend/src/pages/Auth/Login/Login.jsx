import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import useAuthStore from '../../../store/AuthStore';
import './Login.css';

import toast from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast.success('Bienvenue !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects');
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
          <h1>Bon retour !</h1>
          <p>Connectez-vous pour gérer votre inventaire</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

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
                value={credentials.email}
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
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Connexion...' : <><LogIn size={18} /> Se connecter</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
