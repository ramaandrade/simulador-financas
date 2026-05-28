import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { Shirt, Tag, DollarSign, CalendarHeart, PenTool, MonitorPlay, Target, Home, Sparkles, BookOpen } from 'lucide-react';

export default function ModaDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);
  const settings = useSettings();
  const consultoraLiberada = (num) => user?.role === 'admin' || settings?.[`consultoria_moda_${num}`] === true;

  const modules = [
    {
      id: 1,
      title: 'Custos e Despesas da Peça',
      desc: 'Desmembre o custo puro da peça que vem de São Paulo (Brás/Bom Retiro) com frete e impostos.',
      icon: <Shirt size={32} color="var(--primary)" />,
      path: '/moda/custos',
      available: settings.moda_1 !== false
    },
    {
      id: 2,
      title: 'Precificação da Etiqueta',
      desc: 'Defina o preço de etiqueta com gordura para aguentar liquidações e cupons de influenciadores.',
      icon: <Tag size={32} color="var(--warning)" />,
      path: '/moda/precificacao',
      available: settings.moda_2 !== false
    },
    {
      id: 3,
      title: 'Capital de Giro',
      desc: 'Simule o capital de giro corroído por araras cheias de roupas de coleções passadas.',
      icon: <DollarSign size={32} color="var(--success)" />,
      path: '/moda/capital',
      available: settings.moda_3 !== false
    },
    {
      id: 4,
      title: 'Planejamento Financeiro de Coleção',
      desc: 'Programe quando comprar a Coleção de Inverno sem quebrar se fizer calor em Julho.',
      icon: <CalendarHeart size={32} color="#a855f7" />,
      path: '/moda/planejamento',
      available: settings.moda_4 !== false
    },
    {
      id: 5,
      title: 'Financiamento de Vitrine',
      desc: 'Tabelas SAC vs PRICE para modernizar o layout da loja (Iluminação, Espelhos e Manequins).',
      icon: <PenTool size={32} color="#f43f5e" />,
      path: '/moda/financiamento',
      available: settings.moda_5 !== false
    },
    {
      id: 6,
      title: 'Gestão de Investimentos Digitais',
      desc: 'Apostar R$ 5.000 em campanhas de Instagram ou deixar o dinheiro imobilizado na Selic?',
      icon: <MonitorPlay size={32} color="#0ea5e9" />,
      path: '/moda/investimentos',
      available: settings.moda_6 !== false
    },
    {
      id: 7,
      title: 'Indicadores e Conversão',
      desc: 'Determine o Custo de Aquisição de Cliente e o Ticket Médio por sacola na frente de loja.',
      icon: <Target size={32} color="#eab308" />,
      path: '/moda/indicadores',
      available: settings.moda_7 !== false
    }
  ];

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem' }}>
          <Home size={16} /> Voltar ao Início
        </button>
        <div className="navbar-brand">
          <Sparkles size={24} color="#f472b6" /> Painel da Fast Fashion
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Consultor: {user?.name}</div>
      </nav>

      <div className="mb-8 animate-fade-in text-center" style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Bem-vindo à Moda Dinâmica</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.6 }}>
          Diferente da comida, a roupa não apodrece em 2 dias, mas seu *valor* apodrece quando a moda passa. O segredo da loja de roupas não está na margem altíssima por peça, mas sim em nunca deixar o dinheiro congelado no fundo do estoque.
        </p>
      </div>

      <div className="card-grid animate-fade-in">
        {modules.map((mod, index) => (
          <div 
            key={mod.id} 
            className={`module-card glass-panel ${!mod.available ? 'disabled' : ''}`}
            onClick={() => {
              if (mod.available) {
                navigate(mod.path);
              } else {
                alert('Módulo em desenvolvimento! A loja de roupas será inaugurada em breve.');
              }
            }}
            onMouseEnter={() => setActiveModule(mod.id)}
            onMouseLeave={() => setActiveModule(null)}
            style={{ 
              border: activeModule === mod.id ? '2px solid var(--primary)' : '2px solid transparent',
              opacity: mod.available ? 1 : 0.6,
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-darker)', borderRadius: '1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                {mod.icon}
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--border-color)' }}>
                0{index + 1}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{mod.title}</h3>
            <p className="module-card-desc">{mod.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem', gap: '0.75rem' }}>
              {(mod.id === 1 || mod.id === 2 || mod.id === 3 || mod.id === 4 || mod.id === 5 || mod.id === 6) && (
                <button
                  onClick={(e) => { e.stopPropagation(); if (consultoraLiberada(mod.id)) navigate(mod.id === 1 ? '/moda/consultoria-custos' : mod.id === 2 ? '/moda/consultoria-precificacao' : mod.id === 3 ? '/moda/consultoria-capital-giro' : mod.id === 4 ? '/moda/consultoria-planejamento' : mod.id === 5 ? '/moda/consultoria-financiamento' : '/moda/consultoria-investimentos'); }}
                  style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                    borderRadius: '2rem', border: 'none', cursor: consultoraLiberada(mod.id) ? 'pointer' : 'default',
                    background: consultoraLiberada(mod.id) ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)',
                    color: consultoraLiberada(mod.id) ? '#ec4899' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <BookOpen size={12} /> Consultoria
                </button>
              )}
              <span style={{ color: mod.available ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
                {mod.available ? 'Simular →' : 'Trancado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
