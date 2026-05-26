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
    subtipo: 'Confecção de Moda Feminina',
    icon: <Factory size={32} />,
    cor: '#f59e0b',
    corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Confecção Bella Forma produz 500 blusas/mês. Na indústria têxtil, os custos de matéria-prima dominam a estrutura.',
    custosVariaveis: [
      { item: 'Tecido (por peça)', valor: 18.00, obs: 'por blusa' },
      { item: 'Linha, botões e aviamentos', valor: 3.50, obs: 'por peça' },
      { item: 'Embalagem e etiqueta', valor: 2.00, obs: 'por peça' },
      { item: 'Comissão da costureira (por peça)', valor: 7.00, obs: 'por peça produzida' },
    ],
    custosFixos: [
      { item: 'Aluguel do ateliê', valor: 1200.00, obs: 'mensal' },
      { item: 'Salário da modelista', valor: 2000.00, obs: 'mensal' },
      { item: 'Energia elétrica das máquinas', valor: 280.00, obs: 'mensal' },
      { item: 'Depreciação das máquinas de costura', valor: 200.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Fotografia de produto (lookbook)', valor: 300.00, obs: 'mensal' },
      { item: 'Instagram Ads', valor: 250.00, obs: 'mensal' },
      { item: 'Contador', valor: 220.00, obs: 'mensal' },
      { item: 'Embalagem de envio (frete)', valor: 150.00, obs: 'mensal' },
    ],
    conceito: [
      { termo: 'Custo da Costureira: Fixo ou Variável?', def: 'Se a costureira recebe por peça produzida (diarista/faccionista), é custo variável. Se tem salário fixo, é custo fixo. Essa distinção muda completamente a estrutura de custos da confecção.' },
      { termo: 'Landed Cost na Moda', def: 'O custo real de uma peça inclui tecido + aviamentos + embalagem + frete + tributos de importação (se houver). Muitos confeccionistas esquecem dos aviamentos e subestimam o custo.' },
      { termo: 'Coleção vs. Produção Contínua', def: 'Confecções que trabalham por coleção têm custos fixos de desenvolvimento (modelagem, piloto) que precisam ser rateados por toda a produção da coleção.' },
      { termo: 'Perdas de Tecido (Corte)', def: 'O processo de corte gera sobras e desperdícios. Uma boa modelagem minimiza perdas — cada centímetro de tecido desperdiçado é custo variável que não virou produto.' },
    ],
    producao: 500,
    unidade: 'blusas',
  },
  {
    id: 'comercio',
    tipo: 'Comércio',
    subtipo: 'Loja de Moda Jovem',
    icon: <ShoppingBag size={32} />,
    cor: '#ec4899',
    corBg: 'rgba(236,72,153,0.08)',
    descricao: 'A Loja Tendência compra roupas no Brás e revende. No varejo de moda, o CMV e a sazonalidade são os maiores desafios.',
    custosVariaveis: [
      { item: 'CMV – Custo das peças compradas', valor: 8400.00, obs: '~60% do faturamento de R$14.000' },
      { item: 'Sacola personalizada da loja', valor: 180.00, obs: 'mensal' },
      { item: 'Etiqueta de preço e tag da loja', valor: 60.00, obs: 'mensal' },
      { item: 'Perdas por peças danificadas/encalhadas', valor: 300.00, obs: 'estimativa mensal' },
    ],
    custosFixos: [
      { item: 'Aluguel do ponto comercial', valor: 1800.00, obs: 'mensal' },
      { item: 'Salário da vendedora + encargos', valor: 1600.00, obs: 'mensal' },
      { item: 'Energia elétrica + internet', valor: 220.00, obs: 'mensal' },
      { item: 'Seguro da loja e estoque', valor: 120.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Instagram + influencer local', valor: 350.00, obs: 'mensal' },
      { item: 'Sistema de ponto de venda (PDV)', valor: 89.00, obs: 'mensal' },
      { item: 'Contador', valor: 200.00, obs: 'mensal' },
      { item: 'Frete das compras no Brás', valor: 180.00, obs: 'por viagem de compras' },
    ],
    conceito: [
      { termo: 'Sazonalidade no Varejo de Moda', def: 'Verão e inverno têm demandas completamente diferentes. Os custos fixos (aluguel, salário) não caem no entressafra, mas as vendas podem cair 50%. Reserva financeira é essencial.' },
      { termo: 'Encalhe: O Vilão do Varejo', def: 'Peça que não vende é dinheiro parado. Na moda, uma peça fora de tendência pode nunca ser vendida. O custo do encalhe precisa estar previsto no preço das peças que giram.' },
      { termo: 'Frete de Compra como Custo', def: 'A viagem ao Brás ou Bom Retiro tem custo (passagem, hospedagem se for longe, frete). Esse custo precisa ser rateado no preço das peças compradas na viagem.' },
      { termo: 'Ticket Médio e Mix de Produtos', def: 'Lojas de moda devem monitorar o ticket médio por cliente e o mix entre peças básicas (giro alto, margem baixa) e peças especiais (giro baixo, margem alta).' },
    ],
    producao: 14000,
    unidade: 'R$ faturados',
  },
  {
    id: 'servico',
    tipo: 'Serviço',
    subtipo: 'Personal Stylist / Consultoria de Imagem',
    icon: <Wrench size={32} />,
    cor: '#a855f7',
    corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A consultora Carol atende 20 clientes/mês oferecendo consultoria de imagem, personal shopping e montagem de looks.',
    custosVariaveis: [
      { item: 'Transporte para acompanhar cliente nas compras', valor: 25.00, obs: 'por atendimento' },
      { item: 'Material de apresentação (moodboard impresso)', valor: 15.00, obs: 'por cliente' },
      { item: 'Aplicativo premium de colorimetria (por análise)', valor: 8.00, obs: 'por cliente' },
      { item: 'Comissão de assistente (quando necessário)', valor: 0, obs: 'variável por projeto' },
    ],
    custosFixos: [
      { item: 'Aluguel do estúdio de atendimento', valor: 800.00, obs: 'mensal' },
      { item: 'Plataforma de agendamento e CRM', valor: 89.00, obs: 'mensal' },
      { item: 'Assinatura de revistas de moda e tendências', valor: 80.00, obs: 'mensal' },
      { item: 'Celular e internet (uso profissional)', valor: 120.00, obs: 'mensal' },
    ],
    despesas: [
      { item: 'Instagram + reels patrocinados', valor: 300.00, obs: 'mensal' },
      { item: 'Fotógrafo para portfólio (mensal)', valor: 200.00, obs: 'mensal' },
      { item: 'Contador', valor: 150.00, obs: 'mensal' },
      { item: 'Cursos de atualização em moda', valor: 100.00, obs: 'mensal (média)' },
    ],
    conceito: [
      { termo: 'Serviço Intangível: O Valor é a Expertise', def: 'A consultora não vende tecido nem peça — vende conhecimento, tempo e resultado. O custo principal é o tempo dela. Precificar por hora ou por projeto muda tudo.' },
      { termo: 'Atualização como Custo Estratégico', def: 'Em moda, estar desatualizado equivale a oferecer um serviço inferior. Cursos e revistas são despesas estratégicas que mantêm o valor do serviço — diferente de um contador que pode trabalhar com normas estáveis.' },
      { termo: 'Portfólio como Ferramenta de Venda', def: 'O investimento em fotografia profissional gera o portfólio que atrai novos clientes. É despesa de marketing com retorno de longo prazo.' },
      { termo: 'Capacidade Máxima de Atendimento', def: 'Uma consultora individual tem um limite de clientes por mês. Superar esse limite compromete a qualidade. O preço deve refletir a escassez do serviço.' },
    ],
    producao: 20,
    unidade: 'clientes/mês',
  },
];

const itensDesafio = [
  { id: 'a', desc: 'Custo das peças compradas no atacado para revenda', correto: 'variavel' },
  { id: 'b', desc: 'Aluguel mensal do ponto comercial no shopping', correto: 'fixo' },
  { id: 'c', desc: 'Sacola personalizada da loja (por compra do cliente)', correto: 'variavel' },
  { id: 'd', desc: 'Salário fixo da vendedora', correto: 'fixo' },
  { id: 'e', desc: 'Comissão de venda (% sobre cada venda realizada)', correto: 'variavel' },
  { id: 'f', desc: 'Sistema de PDV (ponto de venda) — assinatura mensal', correto: 'despesa' },
  { id: 'g', desc: 'Etiqueta de preço colada em cada peça', correto: 'variavel' },
  { id: 'h', desc: 'Energia elétrica (valor fixo mensal do estabelecimento)', correto: 'fixo' },
  { id: 'i', desc: 'Campanha no Instagram para divulgar nova coleção', correto: 'despesa' },
  { id: 'j', desc: 'Perdas por peças danificadas ou encalhadas', correto: 'variavel' },
];

const opcoes = [
  { valor: 'variavel', label: 'Custo Variável', cor: '#f59e0b' },
  { valor: 'fixo', label: 'Custo Fixo', cor: '#6366f1' },
  { valor: 'despesa', label: 'Despesa', cor: '#ef4444' },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ModaConsultoriaCustos() {
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
          <button className="btn-secondary" onClick={() => navigate('/moda/custos')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <Briefcase size={22} /> Consultoria: Custos e Despesas
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      {/* HERO */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.08) 100%)', borderColor: 'rgba(236,72,153,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Módulo de Consultoria Prática
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Classificação de Custos e Despesas</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
          No varejo de moda, a sazonalidade e o risco de encalhe tornam a gestão de custos ainda mais crítica. Entender cada gasto é o que diferencia uma loja lucrativa de uma cheia de estoque parado.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {secoes.map((s) => (
          <button key={s.id} onClick={() => setSecaoAberta(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secaoAberta === s.id ? '2px solid #ec4899' : '2px solid var(--border-color)', background: secaoAberta === s.id ? 'rgba(236,72,153,0.12)' : 'var(--bg-card)', color: secaoAberta === s.id ? '#f9a8d4' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* TEORIA */}
      {secaoAberta === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="#ec4899" /> Fundamentos para o Varejo de Moda
            </h2>
            {[
              { titulo: '1. Custos Variáveis (CV)', cor: '#f59e0b', emoji: '📈', def: 'No varejo de moda, o principal custo variável é o CMV — o valor pago pelas peças que você revende. Cada sacola, etiqueta e embalagem também é variável: só existe quando uma peça é vendida.', formula: 'CMV = Preço de compra das peças vendidas no período', exemplos: ['Custo das peças compradas para revenda', 'Sacola personalizada (por venda)', 'Etiqueta e tag de preço', 'Perdas por encalhe e avaria'], alerta: 'O CMV no varejo de moda é diferente: você compra uma coleção inteira mas não vende tudo. As peças encalhadas são custo real, mesmo sem gerar receita.' },
              { titulo: '2. Custos Fixos (CF)', cor: '#6366f1', emoji: '🏛️', def: 'O aluguel do ponto, o salário da vendedora e a energia existem independentemente de quanto você vende. Numa semana de baixo movimento, esses custos continuam integralmente.', formula: 'CF Unitário = CF Total ÷ Quantidade de peças vendidas', exemplos: ['Aluguel do ponto comercial', 'Salário da vendedora', 'Energia elétrica', 'Seguro do estabelecimento'], alerta: 'Em shoppings, o aluguel pode ser fixo + percentual das vendas (aluguel mínimo garantido). Essa parte variável precisa estar no cálculo do CMV.' },
              { titulo: '3. Despesas', cor: '#ef4444', emoji: '💼', def: 'Marketing, sistema de gestão, contador — gastos que sustentam o negócio mas não "entram" nas peças. São estratégicos para atrair clientes e manter a operação regularizada.', formula: 'Custo Total = CMV + CF + Despesas', exemplos: ['Instagram Ads e influencers', 'Sistema de ponto de venda (PDV)', 'Contador/contabilidade', 'Frete das compras no atacado'], alerta: 'No varejo de moda jovem, marketing digital é quase obrigatório. Cortar despesas de marketing pode funcionar no curto prazo, mas compromete novos clientes no futuro.' },
              { titulo: '4. Sazonalidade e Giro de Estoque', cor: '#a855f7', emoji: '🔄', def: 'Moda tem estações. O custo de manter estoque parado entre coleções é real: espaço físico ocupado, capital imobilizado, risco de depreciação da peça fora de moda.', formula: 'Giro de Estoque = CMV ÷ Estoque Médio do Período', exemplos: ['Peças de verão encalham no inverno', 'Liquidação = venda abaixo do custo para liberar caixa', 'Capital preso em estoque = menos capital de giro', 'Tendência passageira = encalhe imediato'], alerta: 'Uma boa consultora de moda monitora o giro por categoria. Básicos giram rápido com margem menor; peças da moda giram devagar mas com margem maior.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#ef4444' ? '239,68,68' : '168,85,247'}, 0.06)`, overflow: 'hidden' }}>
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
            <button className="btn-primary" onClick={() => setSecaoAberta('exemplos')} style={{ padding: '0.875rem 2rem', background: '#ec4899', border: 'none' }}>Ver Exemplos Práticos →</button>
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
            <button className="btn-primary" onClick={() => setSecaoAberta('desafio')} style={{ padding: '0.875rem 2rem', background: '#ec4899', border: 'none' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {/* DESAFIO */}
      {secaoAberta === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(236,72,153,0.06)', borderColor: 'rgba(236,72,153,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color="#ec4899" /> Sua Consultoria: Boutique Estilo Jovem
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              A <strong style={{ color: 'var(--text-main)' }}>Boutique Estilo Jovem</strong> é uma loja de roupas femininas que compra no atacado e revende. A proprietária quer organizar os custos para melhorar o preço e a margem. Classifique cada gasto:
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {itensDesafio.map((item, idx) => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: enviado ? respostas[item.id] === item.correto ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <span style={{ background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
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
              <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < itensDesafio.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: '#ec4899', border: 'none', opacity: Object.keys(respostas).length < itensDesafio.length ? 0.5 : 1, cursor: Object.keys(respostas).length < itensDesafio.length ? 'not-allowed' : 'pointer' }}>
                Enviar Consultoria ({Object.keys(respostas).length}/{itensDesafio.length} respondidos)
              </button>
            </div>
          )}
          {enviado && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : nota >= 50 ? '📚' : '💡'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {itensDesafio.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Você está pronto para consultar lojas de moda!' : nota >= 70 ? 'Muito bom! Revise os itens marcados em vermelho.' : 'Revise a teoria e tente novamente — a moda tem suas particularidades!'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecaoAberta('teoria')} style={{ padding: '0.75rem 1.5rem', background: '#ec4899', border: 'none' }}>Rever Teoria</button>
              </div>
            </div>
          )}
          {!enviado && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
              <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <strong style={{ color: '#facc15' }}>Dica de moda:</strong> "Esse gasto está em cada peça vendida?" (Sim → variável). "Pago mesmo sem vender nada?" (Sim → fixo). "Sustenta o negócio mas não toca no produto?" (→ despesa).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
