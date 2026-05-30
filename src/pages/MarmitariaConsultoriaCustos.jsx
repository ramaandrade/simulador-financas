import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Briefcase, ChevronDown, ChevronUp,
  Factory, ShoppingBag, Wrench, CheckCircle2, XCircle,
  BookOpen, Target, Lightbulb, Award, AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────
// DADOS DOS EXEMPLOS
// ─────────────────────────────────────────────
const exemplos = [
  {
    id: 'industria',
    tipo: 'Pequena Indústria',
    subtipo: 'Fábrica de Velas Artesanais',
    icon: <Factory size={32} />,
    cor: '#f59e0b',
    corBg: 'rgba(245, 158, 11, 0.08)',
    descricao:
      'A Velas & Luz produz 800 velas/mês. Veja como separar corretamente seus custos e despesas.',
    custosVariaveis: [
      { item: 'Parafina (matéria-prima)', valor: 1.80, obs: 'por vela' },
      { item: 'Pavio de algodão', valor: 0.30, obs: 'por vela' },
      { item: 'Corante e fragrância', valor: 0.50, obs: 'por vela' },
      { item: 'Embalagem (caixinha)', valor: 0.40, obs: 'por vela' },
    ],
    custosFixos: [
      { item: 'Aluguel do galpão', valor: 900.00, obs: 'mensal' },
      { item: 'Salário do operador', valor: 1.500, obs: 'mensal' },
      { item: 'Energia elétrica (máquinas)', valor: 280.00, obs: 'mensal' },
      { item: 'Manutenção de equipamentos', valor: 120.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Contador', valor: 200.00, obs: 'mensal' },
      { item: 'Marketing (Instagram/Meta Ads)', valor: 180.00, obs: 'mensal' },
      { item: 'Frete para clientes', valor: 250.00, obs: 'mensal' },
      { item: 'Telefone/internet', valor: 80.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'Custo Variável (CV)', def: 'Gasto diretamente ligado à produção de cada unidade. Aumenta quando você produz mais e cai quando produz menos. Na indústria, é a matéria-prima e insumos.' },
      { termo: 'Custo Fixo (CF)', def: 'Gasto que existe independentemente do quanto você produz. O aluguel do galpão é cobrado mesmo se a fábrica parar por um mês.' },
      { termo: 'Despesa', def: 'Gasto de suporte ao negócio, não ligado diretamente à fabricação. O contador e o marketing não "entram" na vela, mas são essenciais para o negócio funcionar.' },
      { termo: 'Custo Unitário', def: 'Custo Total ÷ Quantidade produzida. Serve para saber o mínimo que cada vela precisa render para cobrir todos os gastos.' },
    ],
    producao: 800,
    unidade: 'velas',
  },
  {
    id: 'comercio',
    tipo: 'Comércio',
    subtipo: 'Mercearia de Bairro',
    icon: <ShoppingBag size={32} />,
    cor: '#22c55e',
    corBg: 'rgba(34, 197, 94, 0.08)',
    descricao:
      'O Mercadinho do Zé fatura R$ 18.000/mês revendendo produtos. Veja como os custos funcionam no varejo.',
    custosVariaveis: [
      { item: 'CMV – Custo das Mercadorias Vendidas', valor: 10800.00, obs: 'média: 60% do faturamento' },
      { item: 'Sacolas e embalagens', valor: 120.00, obs: 'mensal' },
      { item: 'Perdas e vencimentos', valor: 200.00, obs: 'estimativa mensal' },
    ],
    custosFixos: [
      { item: 'Aluguel do ponto comercial', valor: 1.200, obs: 'mensal' },
      { item: 'Salário do atendente + encargos', valor: 1.650, obs: 'mensal' },
      { item: 'Energia elétrica (refrigeração)', valor: 350.00, obs: 'mensal' },
      { item: 'Seguro do estabelecimento', valor: 100.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Sistema de gestão (software)', valor: 89.00, obs: 'mensal' },
      { item: 'Publicidade local (panfleto/mídias)', valor: 120.00, obs: 'mensal' },
      { item: 'Manutenção (freezer, câmara fria)', valor: 80.00, obs: 'mensal' },
      { item: 'Contador', valor: 200.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'CMV (Custo da Mercadoria Vendida)', def: 'No comércio, o principal custo variável é o preço de compra dos produtos revendidos. Se você compra arroz a R$ 3 e vende a R$ 5, o CMV é R$ 3 por pacote.' },
      { termo: 'Margem Bruta', def: 'Faturamento − CMV. Mostra quanto sobra das vendas antes de pagar os custos fixos e despesas. No varejo, é o indicador mais monitorado.' },
      { termo: 'Ponto Comercial', def: 'Aluguel de ponto de alto fluxo é custo fixo estratégico: paga-se sempre, mas gera volume de clientes que justifica o gasto.' },
      { termo: 'Perdas', def: 'Produtos vencidos ou avariados são custos variáveis "invisíveis". Uma mercearia eficiente controla o giro de estoque para minimizar esse custo.' },
    ],
    producao: 18000,
    unidade: 'R$ faturados',
  },
  {
    id: 'servico',
    tipo: 'Serviço',
    subtipo: 'Salão de Beleza',
    icon: <Wrench size={32} />,
    cor: '#ec4899',
    corBg: 'rgba(236, 72, 153, 0.08)',
    descricao:
      'O Salão Beleza Total atende 120 clientes/mês. No setor de serviços, a lógica de custos é diferente.',
    custosVariaveis: [
      { item: 'Tinta para cabelo (por atendimento)', valor: 25.00, obs: 'por cliente (coloração)' },
      { item: 'Produtos químicos (hidratação/alisamento)', valor: 18.00, obs: 'por serviço' },
      { item: 'Material descartável (toucas, luvas)', valor: 3.00, obs: 'por cliente' },
      { item: 'Comissão da profissional (30%)', valor: 0, obs: 'varia com a receita' },
    ],
    custosFixos: [
      { item: 'Aluguel da sala/cadeiras', valor: 1.100, obs: 'mensal' },
      { item: 'Salário base da recepcionista', valor: 1.320, obs: 'mensal' },
      { item: 'Energia + água + alvará', valor: 220.00, obs: 'mensal' },
      { item: 'Equipamentos (secador, chapinha)', valor: 80.00, obs: 'depreciação mensal' },
    ],
    despesas: [
      { item: 'Instagram + divulgação', valor: 150.00, obs: 'mensal' },
      { item: 'Sistema de agendamento online', valor: 59.00, obs: 'mensal' },
      { item: 'Contador', valor: 180.00, obs: 'mensal' },
      { item: 'Material de limpeza', valor: 60.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'Mão de obra como custo variável', def: 'No setor de serviços, parte da remuneração do profissional pode ser variável (comissão por serviço realizado), tornando-se custo variável — diferente da indústria onde o operário fixo é custo fixo.' },
      { termo: 'Depreciação', def: 'Equipamentos perdem valor ao longo do tempo. Distribuir esse custo mensalmente é uma forma de custo fixo que muitos pequenos negócios ignoram — e depois são pegos de surpresa quando precisam repor.' },
      { termo: 'Intangibilidade do serviço', def: 'Diferente do produto físico, o serviço não tem "matéria-prima" principal — o maior custo é o tempo e habilidade do profissional, além dos insumos aplicados.' },
      { termo: 'Ociosidade', def: 'Cadeira vazia = prejuízo. Os custos fixos continuam mesmo sem clientes. Por isso, taxa de ocupação é indicador crítico em serviços.' },
    ],
    producao: 120,
    unidade: 'atendimentos',
  },
];

// ─────────────────────────────────────────────
// DESAFIO DE CONSULTORIA
// ─────────────────────────────────────────────

                {/* Guia de classificação */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    💡 Guia de Classificação: Como Decidir?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {[
                      { cat: '📌 Custo Fixo', cor: '#6366f1', def: 'Não muda com o volume produzido. Pago todo mês igual.', ex: 'Aluguel, salário, contador' },
                      { cat: '🔄 Custo Variável', cor: '#22c55e', def: 'Cresce com as vendas. Zero produção = zero custo.', ex: 'Ingredientes, embalagem, comissão' },
                      { cat: '💸 Despesa', cor: '#f59e0b', def: 'Necessário mas indireto à produção.', ex: 'Marketing, imposto, taxa cartão' },
                    ].map((k, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: `3px solid ${k.cor}` }}>
                        <div style={{ fontWeight: 700, color: k.cor, marginBottom: '0.3rem', fontSize: '0.8rem' }}>{k.cat}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.def}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ex: {k.ex}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    💬 <strong style={{ color: '#fbbf24' }}>Teste rápido:</strong> "Se eu não produzir nada esse mês, esse gasto some?" Sim → variável. Não → fixo. É indireto → despesa.
                  </p>
                </div>
const itensDesafio = [
  { id: 'a', desc: 'Farinha de trigo (por quilo, ingrediente)', correto: 'variavel' },
  { id: 'b', desc: 'Aluguel do forno industrial', correto: 'fixo' },
  { id: 'c', desc: 'Embalagem plástica (por unidade vendida)', correto: 'variavel' },
  { id: 'd', desc: 'Salário fixo do padeiro', correto: 'fixo' },
  { id: 'e', desc: 'Comissão do entregador (por entrega realizada)', correto: 'variavel' },
  { id: 'f', desc: 'Assinatura do software de caixa (mensal)', correto: 'despesa' },
  { id: 'g', desc: 'Fermento biológico (por lote)', correto: 'variavel' },
  { id: 'h', desc: 'Conta de energia elétrica (fixa mensal)', correto: 'fixo' },
  { id: 'i', desc: 'Investimento em anúncio no Facebook', correto: 'despesa' },
  { id: 'j', desc: 'Depreciação da batedeira industrial (mensal)', correto: 'fixo' },
];

const opcoes = [
  { valor: 'variavel', label: 'Custo Variável', cor: '#f59e0b' },
  { valor: 'fixo', label: 'Custo Fixo', cor: '#6366f1' },
  { valor: 'despesa', label: 'Despesa', cor: '#ef4444' },
];

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function MarmitariaConsultoriaCustos() {
  const navigate = useNavigate();
  const [secaoAberta, setSecaoAberta] = useState('teoria');
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [expandidoConceito, setExpandidoConceito] = useState({});

  const exemplo = exemplos.find((e) => e.id === exemploAtivo);

  const totalCV = exemplo.custosVariaveis.reduce((s, i) => s + i.valor, 0);
  const totalCF = exemplo.custosFixos.reduce((s, i) => s + i.valor, 0);
  const totalDesp = exemplo.despesas.reduce((s, i) => s + i.valor, 0);
  const totalGeral = totalCV * (exemplo.id === 'comercio' ? 1 : exemplo.producao) + totalCF + totalDesp;

  const acertos = enviado
    ? itensDesafio.filter((i) => respostas[i.id] === i.correto).length
    : 0;
  const nota = enviado ? Math.round((acertos / itensDesafio.length) * 100) : 0;

  const toggleConceito = (idx) =>
    setExpandidoConceito((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const secoes = [
    { id: 'teoria', label: '📚 Teoria', icon: BookOpen },
    { id: 'exemplos', label: '🏢 Exemplos Reais', icon: Briefcase },
    { id: 'desafio', label: '🎯 Seu Desafio', icon: Target },
  ];

  return (
    <div className="container">
      {/* NAVBAR */}
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            onClick={() => navigate('/marmitaria/custos')}
            style={{ padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/')}
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}
          >
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <Briefcase size={22} /> Consultoria: Custos e Despesas
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          URCA · Educação Financeira
        </div>
      </nav>

      {/* HERO */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          borderColor: 'rgba(99,102,241,0.3)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.2)',
            color: '#818cf8',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <Award size={14} /> Módulo de Consultoria Prática
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
          Classificação de Custos e Despesas
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
          Toda consultoria começa pela mesma pergunta: <strong style={{ color: 'var(--text-main)' }}>esse gasto é variável, fixo ou uma despesa?</strong> Entender essa diferença é o que separa um negócio bem gerido de um que "não sabe onde o dinheiro foi".
        </p>
      </div>

      {/* TABS */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {secoes.map((s) => (
          <button
            key={s.id}
            onClick={() => setSecaoAberta(s.id)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: secaoAberta === s.id ? '2px solid var(--primary)' : '2px solid var(--border-color)',
              background: secaoAberta === s.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
              color: secaoAberta === s.id ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ══════════ SEÇÃO: TEORIA ══════════ */}
      {secaoAberta === 'teoria' && (
        <div className="animate-fade-in">
          {/* Conceitos */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="var(--primary)" /> Fundamentos Essenciais
            </h2>

            {[
              {
                titulo: '1. Custos Variáveis (CV)',
                cor: '#f59e0b',
                emoji: '📈',
                def: 'São gastos que variam proporcionalmente ao volume de produção ou vendas. Quanto mais você produz, maior o gasto. Quando a produção para, o gasto zera.',
                formula: 'CV Total = CVu (por unidade) × Quantidade produzida',
                exemplos: ['Ingredientes de uma marmita', 'Parafina para fabricar velas', 'Tecido para confeccionar camisetas', 'Comissão por venda realizada'],
                alerta: 'Na consultoria, mapear os CVu (custos variáveis unitários) é o ponto de partida para calcular o custo de cada produto.',
              },
              {
                titulo: '2. Custos Fixos (CF)',
                cor: '#6366f1',
                emoji: '🏛️',
                def: 'São gastos que existem independentemente do volume de produção. Mesmo que você não venda nada em um mês, esses custos continuam sendo cobrados.',
                formula: 'CF Unitário = CF Total ÷ Quantidade produzida',
                exemplos: ['Aluguel do espaço', 'Salário fixo de funcionários', 'Energia elétrica (consumo mínimo)', 'Seguro do negócio'],
                alerta: 'Quanto maior a produção, menor o custo fixo por unidade — isso é a lógica de escala: produza mais para diluir os fixos.',
              },
              {
                titulo: '3. Despesas',
                cor: '#ef4444',
                emoji: '💼',
                def: 'São gastos ligados à administração e suporte comercial do negócio, não diretamente à produção. Não entram no produto, mas são essenciais para o funcionamento da empresa.',
                formula: 'Custo Total = CV + CF + Despesas',
                exemplos: ['Honorários do contador', 'Marketing e publicidade', 'Sistema de gestão (software)', 'Material de escritório'],
                alerta: 'Confundir despesa com custo é um erro clássico de gestão. Uma empresa pode cortar marketing (despesa) sem parar de produzir, mas não pode cortar a matéria-prima (custo variável).',
              },
              {
                titulo: '4. Custos Semivariáveis',
                cor: '#8b5cf6',
                emoji: '〰️',
                def: 'Têm uma parte fixa e uma variável. São os mais difíceis de classificar e os que mais "enganam" o gestor iniciante.',
                formula: 'CS = Parcela Fixa + (Taxa Variável × Uso)',
                exemplos: ['Conta de energia (taxa mínima fixa + consumo variável)', 'Plano de celular (franquia + excedente)', 'Frete (valor mínimo + cobrança por volume)'],
                alerta: 'Na prática de consultoria, separe a parte fixa dos semivariáveis nos Custos Fixos e a parte variável nos Custos Variáveis para maior precisão.',
              },
            ].map((bloco, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  marginBottom: '1.25rem',
                  borderLeft: `4px solid ${bloco.cor}`,
                  background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#ef4444' ? '239,68,68' : '139,92,246'}, 0.06)`,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => toggleConceito(idx)}
                >
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}>
                    <span>{bloco.emoji}</span> {bloco.titulo}
                  </h3>
                  {expandidoConceito[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>

                {expandidoConceito[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>

                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: bloco.cor, marginBottom: '1rem' }}>
                      {bloco.formula}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((ex, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {ex}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <Lightbulb size={16} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{bloco.alerta}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tabela Resumo */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>📊 Quadro Comparativo</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Característica', 'Custo Variável', 'Custo Fixo', 'Despesa'].map((h, i) => (
                      <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: i === 1 ? '#f59e0b' : i === 2 ? '#6366f1' : i === 3 ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Varia com produção?', '✅ Sim', '❌ Não', '❌ Não'],
                    ['Entra no produto?', '✅ Diretamente', '✅ Rateado', '❌ Não'],
                    ['Existe sem produção?', '❌ Não', '✅ Sim', '✅ Sim'],
                    ['Impacto no custo unitário', 'Direto', 'Dilui-se com escala', 'Indireto'],
                    ['Exemplo clássico', 'Matéria-prima', 'Aluguel', 'Marketing'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '0.75rem 1rem', color: j === 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecaoAberta('exemplos')} style={{ padding: '0.875rem 2rem' }}>
              Ver Exemplos Práticos →
            </button>
          </div>
        </div>
      )}

      {/* ══════════ SEÇÃO: EXEMPLOS ══════════ */}
      {secaoAberta === 'exemplos' && (
        <div className="animate-fade-in">
          {/* Seletor de setor */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setExemploAtivo(ex.id)}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  border: exemploAtivo === ex.id ? `2px solid ${ex.cor}` : '2px solid var(--border-color)',
                  background: exemploAtivo === ex.id ? ex.corBg : 'var(--bg-card)',
                  color: exemploAtivo === ex.id ? ex.cor : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>{ex.icon}</div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', opacity: 0.7 }}>{ex.tipo}</div>
                <div style={{ fontSize: '1rem' }}>{ex.subtipo}</div>
              </button>
            ))}
          </div>

          {/* Descrição */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${exemplo.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{exemplo.descricao}</p>
          </div>

          {/* Cards de custos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* Custo Variável */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderTop: `3px solid #f59e0b` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#f59e0b' }}>
                📈 Custos Variáveis
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Variam com a produção
              </p>
              {exemplo.custosVariaveis.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.item}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>{formatBRL(item.valor)}</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.obs}</span>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 700, color: '#f59e0b' }}>
                Total: {formatBRL(totalCV)} {exemplo.id !== 'comercio' ? '/ uni' : ''}
              </div>
            </div>

            {/* Custo Fixo */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderTop: `3px solid #6366f1` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#6366f1' }}>
                🏛️ Custos Fixos
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Mensais, independem da produção
              </p>
              {exemplo.custosFixos.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.item}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: '#6366f1' }}>{formatBRL(item.valor)}</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.obs}</span>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 700, color: '#6366f1' }}>
                Total: {formatBRL(totalCF)} / mês
              </div>
            </div>

            {/* Despesas */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderTop: `3px solid #ef4444` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ef4444' }}>
                💼 Despesas
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Administrativas / comerciais
              </p>
              {exemplo.despesas.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.item}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>{formatBRL(item.valor)}</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.obs}</span>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 700, color: '#ef4444' }}>
                Total: {formatBRL(totalDesp)} / mês
              </div>
            </div>
          </div>

          {/* Conceitos específicos do setor */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: exemplo.cor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={20} /> Conceitos-chave para {exemplo.tipo}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {exemplo.conceito.map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: `3px solid ${exemplo.cor}` }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: exemplo.cor, fontSize: '0.9rem' }}>{c.termo}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.def}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecaoAberta('desafio')} style={{ padding: '0.875rem 2rem' }}>
              Partir para o Desafio 🎯
            </button>
          </div>
        </div>
      )}

      {/* ══════════ SEÇÃO: DESAFIO ══════════ */}
      {secaoAberta === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color="var(--primary)" /> Sua Consultoria: Padaria Artesanal
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              A <strong style={{ color: 'var(--text-main)' }}>Padaria Pão Quente</strong> é uma pequena padaria de bairro que produz pães, bolos e salgados artesanais. O dono contratou <em>você</em> como consultor financeiro. Classifique corretamente cada gasto abaixo:
            </p>
          </div>

          {/* Itens para classificar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {itensDesafio.map((item, idx) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: enviado
                    ? respostas[item.id] === item.correto
                      ? '4px solid #22c55e'
                      : '4px solid #ef4444'
                    : '4px solid var(--border-color)',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <span style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{item.desc}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {opcoes.map((op) => (
                    <button
                      key={op.valor}
                      disabled={enviado}
                      onClick={() => setRespostas((prev) => ({ ...prev, [item.id]: op.valor }))}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '2rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: enviado ? 'default' : 'pointer',
                        border: respostas[item.id] === op.valor ? `2px solid ${op.cor}` : '2px solid var(--border-color)',
                        background: respostas[item.id] === op.valor ? `rgba(${op.valor === 'variavel' ? '245,158,11' : op.valor === 'fixo' ? '99,102,241' : '239,68,68'}, 0.2)` : 'transparent',
                        color: respostas[item.id] === op.valor ? op.cor : 'var(--text-muted)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {enviado && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', minWidth: '120px' }}>
                    {respostas[item.id] === item.correto ? (
                      <><CheckCircle2 size={18} color="#22c55e" /><span style={{ color: '#22c55e', fontWeight: 600 }}>Correto!</span></>
                    ) : (
                      <><XCircle size={18} color="#ef4444" /><span style={{ color: '#ef4444', fontWeight: 600 }}>
                        {opcoes.find(o => o.valor === item.correto)?.label}
                      </span></>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão enviar */}
          {!enviado && (
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn-primary"
                onClick={() => setEnviado(true)}
                disabled={Object.keys(respostas).length < itensDesafio.length}
                style={{
                  padding: '1rem 3rem',
                  fontSize: '1.1rem',
                  opacity: Object.keys(respostas).length < itensDesafio.length ? 0.5 : 1,
                  cursor: Object.keys(respostas).length < itensDesafio.length ? 'not-allowed' : 'pointer',
                }}
              >
                Enviar Consultoria ({Object.keys(respostas).length}/{itensDesafio.length} respondidos)
              </button>
            </div>
          )}

          {/* Resultado */}
          {enviado && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                borderColor: nota >= 70 ? '#22c55e' : '#ef4444',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                {nota === 100 ? '🏆' : nota >= 70 ? '🎓' : nota >= 50 ? '📚' : '💡'}
              </div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>
                {acertos} de {itensDesafio.length} corretas — {nota}%
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100
                  ? 'Perfeito! Você domina a classificação de custos. Está pronto para consultorias reais!'
                  : nota >= 70
                  ? 'Muito bom! Revise os itens marcados em vermelho e refaça o quiz para consolidar.'
                  : nota >= 50
                  ? 'Bom começo! Volte à seção de Teoria e Exemplos, focando nos conceitos que errou.'
                  : 'Não desanime! A classificação de custos é tricky. Revise a teoria e tente novamente.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  onClick={() => { setRespostas({}); setEnviado(false); }}
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Tentar Novamente
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setSecaoAberta('teoria')}
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Rever Teoria
                </button>
              </div>
            </div>
          )}

          {/* Dica extra para quem não enviou */}
          {!enviado && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
              <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: '#facc15' }}>Dica do consultor:</strong> pergunte-se sempre — "esse gasto existe se eu parar de produzir?" (Não → variável). "Ele está ligado ao produto diretamente?" (Não → despesa). "Ele é cobrado todo mês independentemente?" (Sim → fixo).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
