import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, registerAlumn, logAccess } from '../utils/db';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem('financas_session');
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    let dbUser = await getUserByEmail(email);

    if (!dbUser) {
        throw new Error('Acesso negado. Seu e-mail não foi liberado no sistema pelo professor.');
    }

    if (dbUser.role === 'alumn' && dbUser.isBlocked) {
        throw new Error('Acesso temporariamente bloqueado pelo professor.');
    }

    if (dbUser.password === password) {
      localStorage.setItem('financas_session', JSON.stringify(dbUser));
      setUser(dbUser);
      // Registrar log (sem await para não atrasar a resposta da tela)
      if (dbUser.role === 'alumn') {
          logAccess(dbUser.email);
      }
      return true;
    }
    
    throw new Error('Senha incorreta.');
  };

  const logout = () => {
    localStorage.removeItem('financas_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
