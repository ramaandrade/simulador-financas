import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Star, TrendingUp } from 'lucide-react';

export default function Menu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Images will be replaced with real generated ones
  const modules = [
    {
      id: 'marmitaria',
      title: 'Marmitaria Gourmet',
      desc: 'Simule a montagem, custos fixos, variáveis e despesas de uma marmitaria de bairro.',
      image: '/marmitaria_menu_cover.png',
      path: '/marmitaria',
      isNew: true
    },
    {
      id: 'padaria',
      title: 'Padaria da Esquina',
      desc: 'Gerencie estoque e margens de lucro dos pãezinhos mais famosos do bairro.',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400',
      path: '/padaria',
      isNew: true
    },
    {
      id: 'loja-roupa',
      title: 'Loja de Moda Jovem',
      desc: 'Avalie precificação baseada em sazonalidade e marketing para o varejo de moda.',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400',
      path: '/moda',
      isNew: true
    }
  ];

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div className="navbar-brand">
          <BookOpen size={24} /> Consultoria 360º
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.role === 'admin' && (
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/admin')}>
              Painel Professor
            </button>
          )}
          <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Olá, {user?.name || 'Aluno'}</span>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={logout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </nav>

      <div className="mb-8 animate-fade-in">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Escolha seu Desafio <TrendingUp color="var(--primary)" size={32} />
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Selecione um dos nossos módulos simulados de pequenos empreendimentos para estudar a estrutura de custos, despesas e lucro.
        </p>
      </div>

      <div className="card-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {modules.map(mod => (
          <div 
            key={mod.id} 
            className="module-card glass-panel"
            onClick={() => mod.path !== '#' ? navigate(mod.path) : alert('Módulo em breve!')}
          >
            {mod.isNew && (
              <span style={{ 
                position: 'absolute', top: '1rem', right: '1rem', 
                background: 'var(--primary)', color: 'white', 
                padding: '0.25rem 0.5rem', borderRadius: '0.5rem', 
                fontSize: '0.75rem', fontWeight: 600, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
              }}>
                <Star size={12} fill="white" /> DESTAQUE
              </span>
            )}
            <img src={mod.image} alt={mod.title} className="module-card-img" />
            <div className="module-card-content">
              <h3 className="module-card-title">{mod.title}</h3>
              <p className="module-card-desc">{mod.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                  {mod.path !== '#' ? 'Iniciar Simulação →' : 'Em Breve'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
