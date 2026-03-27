import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (!email || !password) {
      setError('Preencha os dois campos.');
      return;
    }
    
    if (!email.endsWith('@urca.br') && email !== 'rama.lucas@urca.br') {
        setError('O e-mail deve terminar com @urca.br');
        return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Success triggers context update. The next render checks role if we want to redirect to admin
      if (email === 'rama.lucas@urca.br') {
         navigate('/admin');
      } else {
         navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            <Briefcase size={40} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Simulação de Finanças</h1>
          <p className="input-label">Identifique-se para acessar o módulo de simulações empresariais.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">E-mail Universitário</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }} 
                placeholder="nome@urca.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }} 
                placeholder="Sua senha (Ex: 123456 para 1º acesso)"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="error-text" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                <AlertCircle size={14} /> {error}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Simulador'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Nota: Atenção! Somente alunos previamente liberados pelo Prof. Lucas possuem acesso ao portal simulador.
          </p>
        </div>
      </div>
    </div>
  );
}
