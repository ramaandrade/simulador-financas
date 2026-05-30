import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Briefcase, ChevronDown, ChevronUp,
  Factory, ShoppingBag, Wrench, CheckCircle2, XCircle,
  BookOpen, Target, Lightbulb, Award, AlertCircle
} from 'lucide-react';

const exemplos = [
  {
    id: 'industria',
    tipo: 'Pequena Indústria',
    subtipo: 'Fábrica de Biscoitos Artesanais',
    icon: <Factory size={32} />,
    cor: '#f59e0b',
    corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Doceria Boa Massa produz 2.000 biscoitos/mês. Veja como separar corretamente seus custos no ambiente industrial.',
    custosVariaveis: [
      { item: 'Farinha de trigo (por lote)', valor: 2.10, obs: 'por unidade' },
      { item: 'Manteiga e ovos', valor: 1.80, obs: 'por unidade' },
      { item: 'Açúcar e chocolate', valor: 0.90, obs: 'por unidade' },
      { item: 'Embalagem/caixinha', valor: 0.50, obs: 'por unidade' },
    ],
    custosFixos: [
      { item: 'Aluguel da fábrica', valor: 1100.00, obs: 'mensal' },
      { item: 'Salário do confeiteiro', valor: 1700.00, obs: 'mensal' },
      { item: 'Energia dos fornos industriais', valor: 420.00, obs: 'mensal' },
      { item: 'Depreciação dos equipamentos', valor: 150.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Contador', valor: 200.00, obs: 'mensal' },
      { item: 'Delivery/frete para clientes', valor: 220.00, obs: 'mensal' },
      { item: 'Marketing digital', valor: 160.00, obs: 'mensal' },
      { item: 'Material de escritório', valor: 50.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'Batelada vs. Unidade', def: 'Na indústria de alimentos, os custos são apurados por lote (batelada) e depois divididos pela quantidade produzida. O custo unitário só faz sentido quando se sabe exatamente quantas unidades saem de cada lote.' },
      { termo: 'Depreciação como Custo Fixo', def: 'Fornos, batedeiras e equipamentos perdem valor com o uso. Essa perda mensal (depreciação) é um custo fixo real que precisa estar no preço — caso contrário, quando o equipamento quebrar, não haverá capital para repor.' },
      { termo: 'Yield (Rendimento)', def: 'Na panificação industrial, o peso da massa crua difere do produto assado (perda por evaporação). O rendimento real afeta diretamente o custo unitário.' },
      { termo: 'Escala de Produção', def: 'Dobrar a produção de biscoitos não dobra os custos fixos. O aluguel continua o mesmo. Por isso, aumentar o volume dilui os fixos e reduz o custo por unidade.' },
    ],
    producao: 2000,
    unidade: 'biscoitos',
  },
  {
    id: 'comercio',
    tipo: 'Comércio',
    subtipo: 'Distribuidora de Pães e Frios',
    icon: <ShoppingBag size={32} />,
    cor: '#22c55e',
    corBg: 'rgba(34,197,94,0.08)',
    descricao: 'A Distribuidora Pão & Frios revende produtos para mercadinhos e lanchonetes. No comércio, o CMV é o principal custo a controlar.',
    custosVariaveis: [
      { item: 'CMV – Custo dos pães e frios comprados', valor: 9200.00, obs: '~58% do faturamento de R$15.800' },
      { item: 'Embalagens e proteção para entrega', valor: 180.00, obs: 'mensal' },
      { item: 'Quebras, avarias e vencimentos', valor: 250.00, obs: 'estimativa mensal' },
    ],
    custosFixos: [
      { item: 'Aluguel do depósito refrigerado', valor: 1400.00, obs: 'mensal' },
      { item: 'Salário do entregador + encargos', valor: 1750.00, obs: 'mensal' },
      { item: 'Energia elétrica (câmara fria)', valor: 480.00, obs: 'mensal' },
      { item: 'Financiamento da van de entrega', valor: 650.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Sistema de pedidos (software)', valor: 99.00, obs: 'mensal' },
      { item: 'Combustível da van', valor: 320.00, obs: 'variável, mas tratado como despesa operacional' },
      { item: 'Contador', valor: 220.00, obs: 'mensal' },
      { item: 'Celular corporativo', valor: 80.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'CMV no Comércio de Alimentos Perecíveis', def: 'Diferente de outros varejos, alimentos têm prazo de validade. O CMV real inclui as perdas por vencimento — um biscoito que vence no estoque virou custo sem gerar receita.' },
      { termo: 'Câmara Fria como Custo Estratégico', def: 'A energia da câmara fria é custo fixo essencial. Sem ela, todo o estoque perece. Esse custo não pode ser cortado e precisa estar embutido no preço de venda.' },
      { termo: 'Giro de Estoque', def: 'Em distribuidoras de perecíveis, giro alto de estoque é sobrevivência. Produto parado = produto perdido. O ideal é que o estoque gire em menos de 3 dias.' },
      { termo: 'Margem de Distribuição', def: 'O distribuidor compra barato no atacado e vende com uma margem ao varejo. Essa margem precisa cobrir CMV + custos fixos + despesas + lucro.' },
    ],
    producao: 15800,
    unidade: 'R$ faturados',
  },
  {
    id: 'servico',
    tipo: 'Serviço',
    subtipo: 'Escola de Confeitaria',
    icon: <Wrench size={32} />,
    cor: '#ec4899',
    corBg: 'rgba(236,72,153,0.08)',
    descricao: 'A Escola Mãos na Massa ministra cursos presenciais de confeitaria. No setor de serviços educacionais, os custos têm lógica própria.',
    custosVariaveis: [
      { item: 'Ingredientes consumidos por aluno (por aula)', valor: 45.00, obs: 'por aluno/aula' },
      { item: 'Material didático impresso', valor: 8.00, obs: 'por aluno' },
      { item: 'Embalagem para o aluno levar o produto', valor: 5.00, obs: 'por aluno' },
      { item: 'Comissão do instrutor convidado (quando aplicável)', valor: 0, obs: 'variável por turma' },
    ],
    custosFixos: [
      { item: 'Aluguel da cozinha-escola', valor: 1800.00, obs: 'mensal' },
      { item: 'Salário do instrutor fixo', valor: 2200.00, obs: 'mensal' },
      { item: 'Energia elétrica (fornos + ar)', valor: 350.00, obs: 'mensal' },
      { item: 'Depreciação de utensílios e equipamentos', valor: 200.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Plataforma de inscrições online', valor: 79.00, obs: 'mensal' },
      { item: 'Instagram Ads / divulgação', valor: 200.00, obs: 'mensal' },
      { item: 'Contador', valor: 180.00, obs: 'mensal' },
      { item: 'Limpeza e higienização da cozinha', valor: 120.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'Capacidade Ociosa', def: 'Uma turma com 5 alunos em vez de 15 mantém os mesmos custos fixos. O custo por aluno sobe drasticamente. Lotar as turmas é a chave para viabilidade financeira em escolas.' },
      { termo: 'Custo por Aluno vs. Custo por Turma', def: 'Gestores de escolas precisam pensar em dois níveis: o custo da turma (fixos do período) e o custo por aluno (variáveis). O preço da mensalidade precisa cobrir ambos.' },
      { termo: 'Ingredientes como CV Direto', def: 'Em escolas de gastronomia, os ingredientes que os alunos consomem nas aulas são custo variável direto — aumentam com cada aluno matriculado.' },
      { termo: 'Ponto de Equilíbrio de Turma', def: 'Existe um número mínimo de alunos por turma abaixo do qual o curso dá prejuízo. Calcular esse ponto de equilíbrio evita abrir turmas inviáveis.' },
    ],
    producao: 30,
    unidade: 'alunos/mês',
  },
];

const itensDesafio = [
  { id: 'a', desc: 'Farinha de trigo (ingrediente por batelada de pão)', correto: 'variavel' },
  { id: 'b', desc: 'Aluguel do ponto da padaria', correto: 'fixo' },
  { id: 'c', desc: 'Sacolas de papel para o cliente', correto: 'variavel' },
  { id: 'd', desc: 'Salário fixo do padeiro-chefe', correto: 'fixo' },
  { id: 'e', desc: 'Combustível da moto de entrega (por km rodado)', correto: 'variavel' },
  { id: 'f', desc: 'Assinatura do sistema de ponto eletrônico', correto: 'despesa' },
  { id: 'g', desc: 'Fermento biológico (por lote produzido)', correto: 'variavel' },
  { id: 'h', desc: 'Energia elétrica do forno (consumo fixo mensal)', correto: 'fixo' },
  { id: 'i', desc: 'Panfletos de divulgação distribuídos no bairro', correto: 'despesa' },
  { id: 'j', desc: 'Depreciação da amassadeira industrial (mensal)', correto: 'fixo' },
];

const opcoes = [
  { valor: 'variavel', label: 'Custo Variável', cor: '#f59e0b' },
  { valor: 'fixo', label: 'Custo Fixo', cor: '#6366f1' },
  { valor: 'despesa', label: 'Despesa', cor: '#ef4444' },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function PadariaConsultoriaCustos() {
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

  const acertos = enviado ? itensDesafio.filter((i) => respostas[i.id] === i.correto).length : 0;
  const nota = enviado ? Math.round((acertos / itensDesafio.length) * 100) : 0;

  const toggleConceito = (idx) => setExpandidoConceito((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const secoes = [
    { id: 'teoria', label: '📚 Teoria' },
    { id: 'exemplos', label: '🏢 Exemplos Reais' },
    { id: 'desafio', label: '🎯 Seu Desafio' },
  ];

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/custos')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <Briefcase size={22} /> Consultoria: Custos e Despesas
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      {/* HERO */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(245,158,11,0.08) 100%)', borderColor: 'rgba(234,179,8,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234,179,8,0.2)', color: '#facc15', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Módulo de Consultoria Prática
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Classificação de Custos e Despesas</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
          Na padaria, a diferença entre o custo da farinha e o aluguel do forno pode definir se o negócio sobrevive ou quebra. Aprenda a classificar cada gasto antes de simular.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {secoes.map((s) => (
          <button key={s.id} onClick={() => setSecaoAberta(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secaoAberta === s.id ? '2px solid #eab308' : '2px solid var(--border-color)', background: secaoAberta === s.id ? 'rgba(234,179,8,0.12)' : 'var(--bg-card)', color: secaoAberta === s.id ? '#facc15' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* TEORIA */}
      {secaoAberta === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="#eab308" /> Fundamentos para a Padaria
            </h2>
            {[
              { titulo: '1. Custos Variáveis (CV)', cor: '#f59e0b', emoji: '📈', def: 'Na padaria, todo ingrediente que entra na massa é custo variável. Quanto mais pão você produz, mais farinha, fermento e embalagem consome. Se não produzir nada em um dia, esse custo é zero.', formula: 'CV Total = CVu × Quantidade de bateladas', exemplos: ['Farinha de trigo', 'Fermento biológico', 'Manteiga e ovos', 'Embalagens e sacolas'], alerta: 'Na padaria, o custo variável por batelada é mais útil do que por unidade — porque os ingredientes são misturados em lote.' },
              { titulo: '2. Custos Fixos (CF)', cor: '#6366f1', emoji: '🏛️', def: 'O forno esquenta, o aluguel vence e o padeiro recebe — independentemente de quantos pães foram vendidos. Esses são os custos fixos: obrigações mensais que existem mesmo nos dias ruins.', formula: 'CF Unitário = CF Total ÷ Quantidade produzida', exemplos: ['Aluguel do espaço', 'Salário do padeiro', 'Energia elétrica (consumo base)', 'Depreciação dos fornos'], alerta: 'Dias de baixa produção são perigosos: os custos fixos não caem, mas a receita cai. O ponto de equilíbrio diário é fundamental na padaria.' },
              { titulo: '3. Despesas', cor: '#ef4444', emoji: '💼', def: 'Gastos que sustentam a operação do negócio mas não entram no pão. O contador não amassa a massa, o panfleto não vai ao forno — mas ambos são necessários para o negócio funcionar.', formula: 'Custo Total = CV + CF + Despesas', exemplos: ['Honorários do contador', 'Panfletos e divulgação', 'Sistema de caixa (software)', 'Manutenção do site'], alerta: 'Em padarias de bairro, o boca a boca reduz as despesas de marketing. Mas ignorar a divulgação completamente pode custar clientes novos.' },
              { titulo: '4. Custo da Batelada', cor: '#8b5cf6', emoji: '🍞', def: 'Na panificação, o custeio por batelada (saco de farinha) é mais preciso do que por unidade isolada. Um saco de 50kg de farinha pode render 65kg de pão assado (yield de 130%) — essa diferença muda o custo unitário real.', formula: 'Custo/kg = Custo da Batelada ÷ Kg de Pão Produzido', exemplos: ['50kg farinha → ~65kg pão assado (evaporação da água)', 'Custo da batelada inclui todos os ingredientes do lote', 'Energia do forno por batelada', 'Hora-trabalho do padeiro por lote'], alerta: 'Ignorar o yield (rendimento) leva a subprecificação. Se achar que 1kg de farinha = 1kg de pão, o preço ficará errado.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#ef4444' ? '239,68,68' : '139,92,246'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => toggleConceito(idx)}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandidoConceito[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandidoConceito[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: bloco.cor, marginBottom: '1rem' }}>{bloco.formula}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((ex, i) => (<span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ex}</span>))}
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
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecaoAberta('exemplos')} style={{ padding: '0.875rem 2rem', background: '#eab308', border: 'none' }}>Ver Exemplos Práticos →</button>
          </div>
        </div>
      )}

      {/* EXEMPLOS */}
      {secaoAberta === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map((ex) => (
              <button key={ex.id} onClick={() => setExemploAtivo(ex.id)} style={{ flex: 1, minWidth: '180px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === ex.id ? `2px solid ${ex.cor}` : '2px solid var(--border-color)', background: exemploAtivo === ex.id ? ex.corBg : 'var(--bg-card)', color: exemploAtivo === ex.id ? ex.cor : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ marginBottom: '0.5rem' }}>{ex.icon}</div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', opacity: 0.7 }}>{ex.tipo}</div>
                <div style={{ fontSize: '1rem' }}>{ex.subtipo}</div>
              </button>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${exemplo.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{exemplo.descricao}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { label: '📈 Custos Variáveis', cor: '#f59e0b', items: exemplo.custosVariaveis, total: totalCV, sufixo: exemplo.id !== 'comercio' ? '/ uni' : '' },
              { label: '🏛️ Custos Fixos', cor: '#6366f1', items: exemplo.custosFixos, total: totalCF, sufixo: '/ mês' },
              { label: '💼 Despesas', cor: '#ef4444', items: exemplo.despesas, total: totalDesp, sufixo: '/ mês' },
            ].map((card, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderTop: `3px solid ${card.cor}` }}>
                <h3 style={{ color: card.cor, marginBottom: '1rem' }}>{card.label}</h3>
                {card.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.item}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: card.cor }}>{formatBRL(item.valor)}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.obs}</span>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: '1rem', fontWeight: 700, color: card.cor }}>Total: {formatBRL(card.total)} {card.sufixo}</div>
              </div>
            ))}
          </div>
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
            <button className="btn-primary" onClick={() => setSecaoAberta('desafio')} style={{ padding: '0.875rem 2rem', background: '#eab308', border: 'none' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {/* DESAFIO */}
      {secaoAberta === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color="#eab308" /> Sua Consultoria: Padaria Dona Conceição
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              A <strong style={{ color: 'var(--text-main)' }}>Padaria Dona Conceição</strong> é uma padaria tradicional que produz pão francês, bolo caseiro e salgados. A proprietária pediu ajuda para organizar as finanças. Classifique cada gasto:
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

                {/* Dica de classificação de custos */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🧮</span> Guia de Classificação: Como Saber a Categoria?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {[
                      { cat: '📌 Custo Fixo', cor: '#6366f1', def: 'Não muda com o volume produzido. Pago todo mês igual.', ex: 'Aluguel, salário fixo, contador' },
                      { cat: '🔄 Custo Variável', cor: '#22c55e', def: 'Cresce proporcionalmente às vendas. Zero produção = zero custo.', ex: 'Ingredientes, embalagens, comissão' },
                      { cat: '💸 Despesa', cor: '#f59e0b', def: 'Gasto necessário mas não ligado diretamente à produção.', ex: 'Marketing, taxa de cartão, imposto' },
                    ].map((k, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: \`3px solid \${k.cor}\` }}>
                        <div style={{ fontWeight: 700, color: k.cor, marginBottom: '0.3rem', fontSize: '0.82rem' }}>{k.cat}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.def}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ex: {k.ex}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>💬 <strong style={{ color: '#fbbf24' }}>Teste rápido:</strong> "Se eu não produzir nada esse mês, esse gasto some?" Se sim → variável. Se não → fixo. Se é indireto → despesa.</p>
                </div>
            {itensDesafio.map((item, idx) => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: enviado ? respostas[item.id] === item.correto ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <span style={{ background: 'rgba(234,179,8,0.2)', color: '#facc15', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
                  <span style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{item.desc}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {opcoes.map((op) => (
                    <button key={op.valor} disabled={enviado} onClick={() => setRespostas((prev) => ({ ...prev, [item.id]: op.valor }))} style={{ padding: '0.4rem 0.9rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, cursor: enviado ? 'default' : 'pointer', border: respostas[item.id] === op.valor ? `2px solid ${op.cor}` : '2px solid var(--border-color)', background: respostas[item.id] === op.valor ? `rgba(${op.valor === 'variavel' ? '245,158,11' : op.valor === 'fixo' ? '99,102,241' : '239,68,68'}, 0.2)` : 'transparent', color: respostas[item.id] === op.valor ? op.cor : 'var(--text-muted)', transition: 'all 0.15s' }}>{op.label}</button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', minWidth: '120px' }}>
                    {respostas[item.id] === item.correto
                      ? <><CheckCircle2 size={18} color="#22c55e" /><span style={{ color: '#22c55e', fontWeight: 600 }}>Correto!</span></>
                      : <><XCircle size={18} color="#ef4444" /><span style={{ color: '#ef4444', fontWeight: 600 }}>{opcoes.find(o => o.valor === item.correto)?.label}</span></>}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!enviado && (
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < itensDesafio.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: '#eab308', border: 'none', opacity: Object.keys(respostas).length < itensDesafio.length ? 0.5 : 1, cursor: Object.keys(respostas).length < itensDesafio.length ? 'not-allowed' : 'pointer' }}>
                Enviar Consultoria ({Object.keys(respostas).length}/{itensDesafio.length} respondidos)
              </button>
            </div>
          )}
          {enviado && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : nota >= 50 ? '📚' : '💡'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {itensDesafio.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Você domina a classificação de custos na padaria!' : nota >= 70 ? 'Muito bom! Revise os itens em vermelho e reforce o aprendizado.' : 'Revise a teoria focando nos conceitos que errou e tente novamente.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecaoAberta('teoria')} style={{ padding: '0.75rem 1.5rem', background: '#eab308', border: 'none' }}>Rever Teoria</button>
              </div>
            </div>
          )}
          {!enviado && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
              <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: '#facc15' }}>Dica:</strong> Na padaria, pergunte-se — "esse gasto vai para dentro do pão?" (Sim → variável). "Pago mesmo se não assar nada hoje?" (Sim → fixo). "Não está ligado à produção?" (→ despesa).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
