import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { 
  ArrowLeft,
  Home, 
  Calculator, 
  Tag, 
  RefreshCcw, 
  TrendingUp, 
  Landmark, 
  Briefcase, 
  PieChart,
  BookOpen
} from 'lucide-react';

export default function MarmitariaDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const settings = useSettings();
  const consultoraLiberada = (num) => user?.role === 'admin' || settings?.[`consultoria_marmitaria_${num}`] === true;

  const options = [
    {
      id: 1,
      title: 'Custos e Despesas',
      desc: 'Simule a cozinha visualmente, entenda a divisão entre custos fixos, variáveis e despesas do negócio.',
      icon: <Calculator size={32} color="var(--primary)" />,
      path: '/marmitaria/custos',
      available: settings.marmitaria_1 !== false
    },
    {
      id: 2,
      title: 'Precificação',
      desc: 'Com base no custo, defina margens de lucro e encontre o preço de venda ideal para sua marmita.',
      icon: <Tag size={32} color="var(--warning)" />,
      path: '/marmitaria/precificacao',
      available: settings.marmitaria_2 !== false
    },
    {
      id: 3,
      title: 'Capital de Giro',
      desc: 'Avalie prazos de recebimento e pagamento para mensurar quanto a marmitaria precisa em caixa.',
      icon: <RefreshCcw size={32} color="var(--success)" />,
      path: '/marmitaria/capital-giro',
      available: settings.marmitaria_3 !== false
    },
    {
      id: 4,
      title: 'Planejamento Financeiro',
      desc: 'Organize orçamentos, crie metas de vendas e projete as finanças para os próximos meses.',
      icon: <TrendingUp size={32} color="#a855f7" />,
      path: '/marmitaria/planejamento',
      available: settings.marmitaria_4 !== false
    },
    {
      id: 5,
      title: 'Acesso ao Crédito e Financiamento',
      desc: 'Estude linhas de crédito para comprar um fogão industrial ou ampliar a capacidade da empresa.',
      icon: <Landmark size={32} color="#f43f5e" />,
      path: '/marmitaria/financiamento',
      available: settings.marmitaria_5 !== false
    },
    {
      id: 6,
      title: 'Gestão de Investimentos',
      desc: 'Análise se vale a pena investir o lucro da marmitaria ou aplicar em novos equipamentos.',
      icon: <Briefcase size={32} color="#0ea5e9" />,
      path: '/marmitaria/investimentos',
      available: settings.marmitaria_6 !== false
    },
    {
      id: 7,
      title: 'Indicadores Financeiros',
      desc: 'Veja os dashboards de ROIC, Margem Líquida, Ticket Médio e Desempenho.',
      icon: <PieChart size={32} color="#eab308" />,
      path: '/marmitaria/indicadores',
      available: settings.marmitaria_7 !== false
    }
  ];

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          Marmitaria Gourmet
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      <div className="mb-8 animate-fade-in">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Painel do Empreendimento
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Bem-vindo à simulação da Marmitaria! Selecione qual área financeira da empresa você deseja estudar e operar.
        </p>
      </div>

      <div className="card-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {options.map((opt, index) => (
          <div 
            key={opt.id} 
            className="module-card glass-panel"
            onClick={() => opt.available ? navigate(opt.path) : alert('Este módulo será desenvolvido nas próximas aulas.')}
            style={{ padding: '1.5rem', opacity: opt.available ? 1 : 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-darker)', borderRadius: '1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                {opt.icon}
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--border-color)' }}>
                0{index + 1}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{opt.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1 }}>{opt.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem', gap: '0.75rem' }}>
              {(opt.id === 1 || opt.id === 2 || opt.id === 3 || opt.id === 4 || opt.id === 5 || opt.id === 6) && (
                <button
                  onClick={(e) => { e.stopPropagation(); if (consultoraLiberada(opt.id)) navigate(opt.id === 1 ? '/marmitaria/consultoria-custos' : opt.id === 2 ? '/marmitaria/consultoria-precificacao' : opt.id === 3 ? '/marmitaria/consultoria-capital-giro' : opt.id === 4 ? '/marmitaria/consultoria-planejamento' : opt.id === 5 ? '/marmitaria/consultoria-financiamento' : '/marmitaria/consultoria-investimentos'); }}
                  style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                    borderRadius: '2rem', border: 'none', cursor: consultoraLiberada(opt.id) ? 'pointer' : 'default',
                    background: consultoraLiberada(opt.id) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                    color: consultoraLiberada(opt.id) ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <BookOpen size={12} /> Consultoria
                </button>
              )}
              <span style={{ color: opt.available ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
                {opt.available ? 'Entrar Módulo →' : 'Em Breve'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
