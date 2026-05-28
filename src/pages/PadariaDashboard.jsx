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

export default function PadariaDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const settings = useSettings();
  const consultoraLiberada = (num) => user?.role === 'admin' || settings?.[`consultoria_padaria_${num}`] === true;

  const options = [
    {
      id: 1,
      title: 'Custos e Despesas do Forno',
      desc: 'Analise o custo unitário batelado do pão (farinha, mestre padeiro, vitrine) de forma visual.',
      icon: <Calculator size={32} color="var(--primary)" />,
      path: '/padaria/custos',
      available: settings.padaria_1 !== false
    },
    {
      id: 2,
      title: 'Precificação do Kilo',
      desc: 'Entenda se o preço do Kg do pão e do pão de queijo cobre os custos fixos estruturais da padaria.',
      icon: <Tag size={32} color="var(--warning)" />,
      path: '/padaria/precificacao',
      available: settings.padaria_2 !== false
    },
    {
      id: 3,
      title: 'Capital de Giro',
      desc: 'Simule prazo médio de fornecedores de trigo vs o recebimento instantâneo em Pix/Cartão no balcão.',
      icon: <RefreshCcw size={32} color="var(--success)" />,
      path: '/padaria/capital',
      available: settings.padaria_3 !== false
    },
    {
      id: 4,
      title: 'Planejamento Financeiro de Estoque',
      desc: 'Projete compras de insumos antes do reajuste do trigo no mercado e o volume de caixa mensal.',
      icon: <TrendingUp size={32} color="#a855f7" />,
      path: '/padaria/planejamento',
      available: settings.padaria_4 !== false
    },
    {
      id: 5,
      title: 'Financiamento de Maquinário',
      desc: 'Simule o pagamento de Fornos Industriais Lastro através de linhas de crédito do BNDES.',
      icon: <Landmark size={32} color="#f43f5e" />,
      path: '/padaria/financiamento',
      available: settings.padaria_5 !== false
    },
    {
      id: 6,
      title: 'Gestão de Investimentos Expansivos',
      desc: 'Avalie se a padaria que deu lucro deve comprar freezers para vender sorvete ou aplicar o dinheiro.',
      icon: <Briefcase size={32} color="#0ea5e9" />,
      path: '/padaria/investimentos',
      available: settings.padaria_6 !== false
    },
    {
      id: 7,
      title: 'Indicadores e Ticket Médio',
      desc: 'Calcule o faturamento por cliente (quem entra compra pão + mortadela) e ponto de equilíbrio.',
      icon: <PieChart size={32} color="#eab308" />,
      path: '/padaria/indicadores',
      available: settings.padaria_7 !== false
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
          Padaria da Esquina
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      <div className="mb-8 animate-fade-in">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Expedição Comercial Panificadora
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Gestão de alto volume. Selecione uma área da operação do seu novo estabelecimento.
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
              {(opt.id === 1 || opt.id === 2 || opt.id === 3 || opt.id === 4 || opt.id === 5 || opt.id === 6 || opt.id === 7) && (
                <button
                  onClick={(e) => { e.stopPropagation(); if (consultoraLiberada(opt.id)) navigate(opt.id === 1 ? '/padaria/consultoria-custos' : opt.id === 2 ? '/padaria/consultoria-precificacao' : opt.id === 3 ? '/padaria/consultoria-capital-giro' : opt.id === 4 ? '/padaria/consultoria-planejamento' : opt.id === 5 ? '/padaria/consultoria-financiamento' : opt.id === 6 ? '/padaria/consultoria-investimentos' : '/padaria/consultoria-indicadores'); }}
                  style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                    borderRadius: '2rem', border: 'none', cursor: consultoraLiberada(opt.id) ? 'pointer' : 'default',
                    background: consultoraLiberada(opt.id) ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.06)',
                    color: consultoraLiberada(opt.id) ? '#eab308' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <BookOpen size={12} /> Consultoria
                </button>
              )}
              <span style={{ color: opt.available ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
                {opt.available ? 'Abrir Fornos →' : 'Em Breve'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
