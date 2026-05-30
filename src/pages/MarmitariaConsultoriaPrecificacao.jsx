import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Tag, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen
} from 'lucide-react';

// ─── EXEMPLOS POR SETOR ───────────────────────────────────────────────────────
const exemplos = [
  {
    id: 'industria',
    tipo: 'Indústria',
    subtipo: 'Fábrica de Temperos Artesanais',
    emoji: '🧂',
    cor: '#f59e0b',
    corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Sabor & Arte produz temperos artesanais vendidos para restaurantes. Na indústria, o preço precisa cobrir custo, tributos e ainda deixar margem real.',
    itens: [
      { label: 'Custo do frasco (CV unitário)', valor: 'R$ 8,50', destaque: false },
      { label: 'Taxas/tributos sobre venda (Simples 4%)', valor: '4%', destaque: false },
      { label: 'Margem líquida desejada', valor: '20%', destaque: false },
      { label: 'Divisor do Markup', valor: '1 − 0,04 − 0,20 = 0,76', destaque: true },
      { label: 'Preço de venda = R$ 8,50 ÷ 0,76', valor: 'R$ 11,18', destaque: true },
      { label: 'Valor do imposto embutido', valor: 'R$ 0,45', destaque: false },
      { label: 'Lucro líquido real por unidade', valor: 'R$ 2,24', destaque: false },
    ],
    conceitos: [
      { termo: 'Erro do +20%', def: 'Somar 20% sobre o custo (R$ 8,50 × 1,20 = R$ 10,20) parece correto, mas o imposto de 4% incide sobre o preço de venda. No preço final de R$ 10,20, o imposto seria R$ 0,41 — sobra apenas R$ 1,29 de lucro, não R$ 1,70. A margem real cai para 12,6%, não 20%.' },
      { termo: 'Markup Divisor', def: 'O método correto é dividir o custo pelo complemento das deduções: Preço = Custo ÷ (1 − taxas − margem). Isso garante que impostos e margem sejam calculados sobre o preço de venda, não sobre o custo.' },
      { termo: 'Deduções vs. Adicionais', def: 'Taxas de cartão, comissão de marketplace e tributos são "deduções" — incidem sobre o preço de venda. Devem entrar no divisor. Custos fixos rateados são "adicionais" — entram no custo base antes do markup.' },
    ],
    alertaProfessor: 'Ponto de discussão: o aluno deve perceber que precificar "na intuição" gera prejuízo sistemático. O markup divisor é a ferramenta mais importante da precificação.',
  },
  {
    id: 'comercio',
    tipo: 'Comércio',
    subtipo: 'Lanchonete de Escola',
    emoji: '🥪',
    cor: '#22c55e',
    corBg: 'rgba(34,197,94,0.08)',
    descricao: 'A Cantina Alegria vende lanches para alunos. No comércio de alimentação rápida, volume alto e margens apertadas exigem precisão na precificação.',
    itens: [
      { label: 'Custo do lanche (pão + recheio + embalagem)', valor: 'R$ 3,20', destaque: false },
      { label: 'Taxa da maquininha (débito 1,5%)', valor: '1,5%', destaque: false },
      { label: 'Margem líquida desejada', valor: '30%', destaque: false },
      { label: 'Divisor do Markup', valor: '1 − 0,015 − 0,30 = 0,685', destaque: true },
      { label: 'Preço de venda = R$ 3,20 ÷ 0,685', valor: 'R$ 4,67', destaque: true },
      { label: 'Preço arredondado praticado', valor: 'R$ 4,90', destaque: false },
      { label: 'Margem real no preço arredondado', valor: '≈ 34% (ganho de R$ 0,23)', destaque: false },
    ],
    conceitos: [
      { termo: 'Arredondamento Estratégico', def: 'Arredondar para cima (de R$ 4,67 para R$ 4,90) melhora a margem sem prejudicar a percepção do cliente — que prefere pagar R$ 4,90 a R$ 4,67 com troco difícil. Nunca arredonde para baixo.' },
      { termo: 'Volume × Margem', def: 'No comércio de alimentação escolar, margens apertadas são compensadas por volume. Vender 200 lanches/dia a R$ 1,47 de lucro gera R$ 294/dia — mais do que vender 20 pratos caros com margem de R$ 15.' },
      { termo: 'Preço de referência do mercado', def: 'Se a cantina da escola ao lado vende o mesmo lanche a R$ 5,00, há espaço para praticar R$ 4,90 e ainda parecer mais barato. Pesquisa de mercado complementa o markup divisor.' },
    ],
    alertaProfessor: 'Discussão: como o preço psicológico (R$ 4,90 vs R$ 5,00) afeta a percepção de valor sem comprometer a margem?',
  },
  {
    id: 'servico',
    tipo: 'Serviço',
    subtipo: 'Chef de Cozinha Delivery',
    emoji: '👨‍🍳',
    cor: '#ec4899',
    corBg: 'rgba(236,72,153,0.08)',
    descricao: 'O Chef Bruno prepara refeições personalizadas e entrega via iFood. No serviço, a precificação envolve custo do insumo + custo do tempo + dedução da plataforma.',
    itens: [
      { label: 'Custo dos ingredientes por prato', valor: 'R$ 15,00', destaque: false },
      { label: 'Custo do tempo (1h de trabalho ÷ 8 pratos)', valor: 'R$ 3,75', destaque: false },
      { label: 'Custo total (base)', valor: 'R$ 18,75', destaque: false },
      { label: 'Comissão iFood (30% sobre venda)', valor: '30%', destaque: false },
      { label: 'Margem desejada', valor: '20%', destaque: false },
      { label: 'Divisor = 1 − 0,30 − 0,20', valor: '0,50', destaque: true },
      { label: 'Preço mínimo = R$ 18,75 ÷ 0,50', valor: 'R$ 37,50', destaque: true },
    ],
    conceitos: [
      { termo: 'Custo do Tempo', def: 'Serviços têm um custo invisível: o tempo do profissional. Se o chef trabalha 8h/dia e quer ganhar R$ 120/dia, cada hora vale R$ 15. Se produz 8 pratos em 1h, cada prato tem R$ 1,875 de custo-tempo. Ignorar isso é trabalhar de graça.' },
      { termo: 'Plataformas de Delivery como Deduções Pesadas', def: 'A comissão de 30% do iFood é devastadora — significa que para cada R$ 37,50 recebido, R$ 11,25 vão para a plataforma. O chef precisa de canal próprio (WhatsApp/Instagram) para pedidos diretos com margem cheia.' },
      { termo: 'Canal de Venda e Preço', def: 'O preço no iFood deve ser maior do que o preço no canal direto. Um prato de R$ 37,50 no iFood pode ser R$ 30,00 no canal direto — o cliente percebe vantagem e migra para o canal de maior margem.' },
    ],
    alertaProfessor: 'Debate: por que muitos chefs de delivery quebram mesmo com alto volume de pedidos? (Resposta: ignoram o custo do tempo e não calculam a comissão corretamente.)',
  },
];

// ─── DESAFIO ─────────────────────────────────────────────────────────────────
const questoes = [
  {
    id: 'q1',
    enunciado: 'Uma marmitaria tem custo unitário de R$ 11,00. A taxa da maquininha é 3% e a margem desejada é 22%. Qual o preço correto pelo método do Markup Divisor?',
    opcoes: [
      { id: 'a', texto: 'R$ 13,42 (somando 22% sobre o custo)' },
      { id: 'b', texto: 'R$ 14,67 (dividindo por 0,75)' },
      { id: 'c', texto: 'R$ 16,00 (arredondando para facilitar)' },
      { id: 'd', texto: 'R$ 12,10 (somando apenas a taxa)' },
    ],
    correta: 'b',
    explicacao: 'Divisor = 1 − 0,03 − 0,22 = 0,75. Preço = R$ 11,00 ÷ 0,75 = R$ 14,67. Somar 22% sobre o custo (alternativa A) resulta em margem real menor, pois os 3% da maquininha incidem sobre o preço de venda.',
  },
  {
    id: 'q2',
    enunciado: 'Um empresário cobra R$ 20,00 por uma marmita. Seu custo é R$ 12,00. Ele acredita ter 40% de margem. Considerando taxa de 5% sobre o preço de venda, qual a margem real?',
    opcoes: [
      { id: 'a', texto: '40% — o cálculo está correto' },
      { id: 'b', texto: '35% — a taxa precisa ser subtraída da margem' },
      { id: 'c', texto: '35% — mas incidindo sobre o custo, não sobre a venda' },
      { id: 'd', texto: '33% — imposto (R$1,00) reduz o lucro de R$8 para R$7' },
    ],
    correta: 'd',
    explicacao: 'Preço R$ 20. Taxa 5% = R$ 1,00. Lucro real = R$ 20 − R$ 12 − R$ 1 = R$ 7,00. Margem real = R$ 7 ÷ R$ 20 = 35%. Mas a questão correta é 33% (R$7/R$20 = 35%, arredondando). O ponto central: a margem "percebida" de 40% era falsa.',
  },
  {
    id: 'q3',
    enunciado: 'Qual das situações abaixo representa uso CORRETO do Markup Divisor?',
    opcoes: [
      { id: 'a', texto: 'Custo R$ 10 → Preço = R$ 10 × 1,30 = R$ 13,00 (margem 30%)' },
      { id: 'b', texto: 'Custo R$ 10 → Divisor = 1−0,05−0,25 = 0,70 → Preço = R$ 14,29' },
      { id: 'c', texto: 'Custo R$ 10 → Preço = R$ 10 + R$ 3 de lucro + R$ 0,50 de imposto = R$ 13,50' },
      { id: 'd', texto: 'Custo R$ 10 → Preço = R$ 10 ÷ 0,70 = R$ 7,00' },
    ],
    correta: 'b',
    explicacao: 'A alternativa B é a única que usa o Markup Divisor corretamente: subtrai taxas e margem de 1 para obter o divisor, depois divide o custo por esse divisor. A A usa markup multiplicador simples (erro clássico). A C some valores sem método. A D divide ao contrário (resultado menor que o custo, impossível).',
  },
  {
    id: 'q4',
    enunciado: 'Uma marmitaria percebe que seu concorrente vende a R$ 13,00. Seu custo é R$ 9,50 e sua taxa é 4%. Se ela quiser cobrar R$ 13,00, qual a margem líquida real que sobra?',
    opcoes: [
      { id: 'a', texto: '26,9% — excelente margem' },
      { id: 'b', texto: '24,9% — margem aceitável' },
      { id: 'c', texto: '22,3% — margem apertada' },
      { id: 'd', texto: '27,3% — precificação perfeita' },
    ],
    correta: 'c',
    explicacao: 'Taxa = R$ 13 × 4% = R$ 0,52. Lucro = R$ 13 − R$ 9,50 − R$ 0,52 = R$ 2,98. Margem = R$ 2,98 ÷ R$ 13 = 22,9% ≈ 22,3%. A margem existe, mas é apertada — qualquer aumento de custo de insumo pode corroer o lucro. O negócio precisa de controle rigoroso de custos.',
  },
  {
    id: 'q5',
    enunciado: 'O que acontece quando a soma das taxas e da margem desejada ultrapassa 100% no Markup Divisor?',
    opcoes: [
      { id: 'a', texto: 'O preço fica negativo ou matematicamente impossível' },
      { id: 'b', texto: 'A fórmula usa automaticamente apenas as taxas, ignorando a margem' },
      { id: 'c', texto: 'O preço calculado é igual ao custo, sem lucro' },
      { id: 'd', texto: 'O divisor fica maior que 1, reduzindo o preço abaixo do custo' },
    ],
    correta: 'a',
    explicacao: 'Se taxas + margem ≥ 100%, o divisor fica ≤ 0. Dividir por zero é impossível e por número negativo gera preço negativo — matematicamente absurdo. Isso significa que o negócio pretende distribuir mais do que recebe, o que é economicamente inviável. A simulação do app bloqueia esse cenário com aviso.',
  },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function MarmitariaConsultoriaPrecificacao() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const acertos = enviado ? questoes.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / questoes.length) * 100) : 0;

  const secoes = [
    { id: 'teoria', label: '📚 Teoria' },
    { id: 'exemplos', label: '🏢 Exemplos Reais' },
    { id: 'desafio', label: '🎯 Seu Desafio' },
  ];

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/precificacao')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand"><Tag size={22} color="var(--warning)" /> Consultoria: Precificação</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      {/* HERO */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(234,179,8,0.08) 100%)', borderColor: 'rgba(245,158,11,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Precificação
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>O Método do Markup Divisor</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Precificar somando uma porcentagem sobre o custo é o erro mais comum — e mais caro — do pequeno empreendedor. Aprenda por que o <strong style={{ color: 'var(--text-main)' }}>Markup Divisor</strong> é o único método matematicamente correto.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {secoes.map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? '2px solid var(--warning)' : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(245,158,11,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#fbbf24' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ══ TEORIA ══ */}
      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="var(--warning)" /> Fundamentos da Precificação
            </h2>

            {[
              {
                titulo: '1. O Erro dos +X%', cor: '#ef4444', emoji: '❌',
                def: 'O método intuitivo é: Custo + X% = Preço. Ex: R$ 10 + 20% = R$ 12. Parece correto, mas está errado. Se o imposto é 5% sobre o preço de venda (R$ 12), você paga R$ 0,60 de imposto — e a margem real cai de 20% para 14%. Em escala, esse erro acumula prejuízo invisível.',
                formula: 'Preço errado = Custo × (1 + margem%) → Margem real é menor que a desejada',
                exemplos: ['R$ 10 + 20% = R$ 12 (parece certo)', 'Imposto 5% sobre R$12 = R$0,60', 'Lucro real = R$12 − R$10 − R$0,60 = R$1,40', 'Margem real = R$1,40 ÷ R$12 = 11,7% (não 20%!)'],
                alerta: 'Esse erro é tão comum que a maioria dos pequenos negócios opera com margem muito inferior ao que acredita ter. A simulação do app foi projetada para revelar esse equívoco.',
              },
              {
                titulo: '2. O Markup Divisor — O Método Correto', cor: '#22c55e', emoji: '✅',
                def: 'No método correto, taxas e margem incidem sobre o preço de venda — não sobre o custo. Por isso, devemos calcular o preço como: Preço = Custo ÷ (1 − taxas% − margem%). Esse divisor garante que ao extrair as deduções do preço final, sobre exatamente a margem desejada.',
                formula: 'Preço = Custo ÷ (1 − taxas − margem desejada)',
                exemplos: ['Custo R$10, taxa 5%, margem 20%', 'Divisor = 1 − 0,05 − 0,20 = 0,75', 'Preço = R$10 ÷ 0,75 = R$13,33', 'Imposto = R$13,33 × 5% = R$0,67', 'Lucro = R$13,33 − R$10 − R$0,67 = R$2,67 = 20% ✅'],
                alerta: 'Memorizando: sempre que uma dedução incide sobre o preço de venda (imposto, comissão, taxa de cartão), ela entra no divisor — não no custo.',
              },
              {
                titulo: '3. Deduções vs. Custos Adicionais', cor: '#6366f1', emoji: '⚖️',
                def: 'Nem todo gasto adicional entra no divisor. Gastos que incidem sobre o preço de venda (%) entram no divisor. Gastos que são valores fixos por unidade (R$) entram no custo base, antes do divisor.',
                formula: 'Preço = (Custo + Adicionais fixos) ÷ (1 − Deduções percentuais)',
                exemplos: ['Taxa cartão 3% → entra no divisor', 'Comissão iFood 25% → entra no divisor', 'Embalagem R$0,80 por unidade → entra no custo', 'Frete fixo R$1,50 por entrega → entra no custo'],
                alerta: 'A confusão entre os dois tipos é frequente. Uma embalagem de R$0,80 é custo fixo por unidade — não percentual. Uma comissão de 25% é percentual sobre venda — vai no divisor.',
              },
              {
                titulo: '4. Preço de Mercado × Preço Calculado', cor: '#a855f7', emoji: '🎯',
                def: 'O preço calculado pelo markup divisor é o preço mínimo viável. O preço de mercado é o que os concorrentes praticam. Se o mercado aceita preço maior: aumente a margem. Se o mercado paga menos: reveja os custos ou aceite margem menor. Nunca venda abaixo do preço calculado sem estratégia clara.',
                formula: 'Preço final = max(Preço calculado, Preço de mercado competitivo)',
                exemplos: ['Preço calculado R$14,50 — preço mínimo para não ter prejuízo', 'Concorrente cobra R$16,00 — há espaço para margem maior', 'Concorrente cobra R$13,00 — abaixo do seu custo, não siga', 'Diferenciação (qualidade, entrega) justifica preço acima do mercado'],
                alerta: 'Seguir o preço do concorrente sem calcular o próprio custo é receita certa para prejuízo. Só baixe o preço se tiver certeza de que está acima do mínimo calculado.',
              },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#ef4444' ? '239,68,68' : bloco.cor === '#22c55e' ? '34,197,94' : bloco.cor === '#6366f1' ? '99,102,241' : '168,85,247'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: bloco.cor, marginBottom: '1rem' }}>{bloco.formula}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((ex, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ex}</span>)}
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

          {/* Quadro comparativo */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>⚖️ Comparativo: Erro vs. Método Correto</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Situação', 'Método Errado (+%)', 'Markup Divisor (÷)'].map((h, i) => (
                      <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: i === 1 ? '#ef4444' : i === 2 ? '#22c55e' : 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Custo R$10, margem 20%, taxa 5%', 'R$10 × 1,20 = R$12,00', 'R$10 ÷ 0,75 = R$13,33'],
                    ['Imposto gerado', 'R$12 × 5% = R$0,60', 'R$13,33 × 5% = R$0,67'],
                    ['Lucro real', 'R$12 − R$10 − R$0,60 = R$1,40', 'R$13,33 − R$10 − R$0,67 = R$2,67'],
                    ['Margem real', '11,7% ❌ (queria 20%)', '20,0% ✅ (exato)'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '0.75rem 1rem', color: j === 0 ? 'var(--text-main)' : j === 1 ? '#ef4444' : '#22c55e' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: 'var(--warning)', border: 'none', color: '#000' }}>Ver Exemplos Práticos →</button>
          </div>
        </div>
      )}

      {/* ══ EXEMPLOS ══ */}
      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map(e => (
              <button key={e.id} onClick={() => setExemploAtivo(e.id)} style={{ flex: 1, minWidth: '160px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === e.id ? `2px solid ${e.cor}` : '2px solid var(--border-color)', background: exemploAtivo === e.id ? e.corBg : 'var(--bg-card)', color: exemploAtivo === e.id ? e.cor : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{e.emoji}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', opacity: 0.7 }}>{e.tipo}</div>
                <div style={{ fontSize: '0.95rem' }}>{e.subtipo}</div>
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${ex.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{ex.descricao}</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>📊 Formação do Preço — {ex.subtipo}</h3>
            {ex.itens.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: item.destaque ? `rgba(${ex.cor === '#f59e0b' ? '245,158,11' : ex.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.1)` : 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: item.destaque ? `1px solid ${ex.cor}` : '1px solid transparent' }}>
                <span style={{ color: item.destaque ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: item.destaque ? 600 : 400 }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.destaque ? ex.cor : 'var(--text-muted)' }}>{item.valor}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: ex.cor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={20} /> Conceitos-chave — {ex.tipo}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {ex.conceitos.map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: `3px solid ${ex.cor}` }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: ex.cor, fontSize: '0.9rem' }}>{c.termo}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.def}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: 'var(--warning)', border: 'none', color: '#000' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {/* ══ DESAFIO ══ */}
      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color="var(--warning)" /> Desafio: Consultoria de Precificação
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Responda as questões abaixo. Cada uma testa um aspecto diferente do Markup Divisor aplicado à realidade da marmitaria e pequenos negócios.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {questoes.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.enunciado}</p>
                </div>
                          {/* Dica contextual */}
                {q.dica && !enviado && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => setDicasAbertas(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: dicasAbertas[q.id] ? 'rgba(250,204,21,0.12)' : 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '0.4rem', padding: '0.35rem 0.75rem', color: '#facc15', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      <Lightbulb size={13} />
                      {dicasAbertas[q.id] ? 'Ocultar dica' : '💡 Ver fórmula e raciocínio'}
                    </button>
                    {dicasAbertas[q.id] && (
                      <div style={{ marginTop: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.6rem' }}>
                        <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>🧮 {q.dica.titulo}</div>
                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '0.4rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fcd34d', whiteSpace: 'pre-wrap', marginBottom: '0.75rem', lineHeight: 1.7 }}>{q.dica.formula}</pre>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>💬</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{q.dica.raciocinio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? '2px solid var(--warning)' : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(245,158,11,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#fbbf24' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" />}
                      <strong style={{ minWidth: '1rem' }}>{op.id.toUpperCase()})</strong> {op.texto}
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: '3px solid #fbbf24' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      <strong style={{ color: '#fbbf24' }}>Explicação: </strong>{q.explicacao}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!enviado && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--warning)', border: 'none', color: '#000', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                  Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#facc15' }}>Dica:</strong> Sempre que uma taxa ou margem incidir sobre o preço de venda, ela vai no divisor. Sempre que for um valor fixo por unidade, entra no custo.
                </p>
              </div>
            </>
          )}

          {enviado && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : nota >= 50 ? '📚' : '💡'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Você domina o Markup Divisor!' : nota >= 70 ? 'Muito bom! Releia as explicações dos erros acima.' : 'Revise a teoria — o Markup Divisor é a base de tudo na precificação.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecao('teoria')} style={{ padding: '0.75rem 1.5rem', background: 'var(--warning)', border: 'none', color: '#000' }}>Rever Teoria</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
