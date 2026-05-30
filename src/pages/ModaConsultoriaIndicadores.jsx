import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BarChart4, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase, Users, ShoppingBag } from 'lucide-react';

const COR = '#8b5cf6';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const pct = (v) => `${v.toFixed(1)}%`;

function semaforo(valor, limites) {
  if (valor < limites[0]) return { cor: '#ef4444', label: '🔴 Crítico' };
  if (valor < limites[1]) return { cor: '#f59e0b', label: '🟡 Atenção' };
  return { cor: '#22c55e', label: '🟢 Saudável' };
}

const blocos = [
  {
    titulo: '1. Taxa de Conversão: O Funil da Loja', cor: '#ec4899', emoji: '🔻',
    def: 'Taxa de Conversão mede quantos visitantes da loja se tornam compradores. Uma loja com 1.000 visitas e 80 vendas tem conversão de 8%. Melhorar a conversão de 8% para 10% (sem mais visitantes) aumenta as vendas em 25%. É a alavanca mais poderosa do varejo físico.',
    formula: 'Conversão (%) = Vendas fechadas ÷ Visitantes × 100\nReferência: 8% baixo / 15% médio / 25%+ excelente\nImpacto: +1% conversão × visitantes = vendas extras',
    exemplos: ['800 visitas/mês, 72 vendas: conversão 9% (baixo)', 'Melhorar para 14%: 800 × 14% = 112 vendas (+56%)', 'Com ticket R$120: +R$4.800/mês sem um cliente novo', 'Treinamento de equipe + vitrine melhorada → conversão +5%'],
    alerta: 'Muitos varejistas investem em tráfego (mais pessoas) quando a solução é conversão (mais vendas das mesmas pessoas). É como encher um balde furado com mais água em vez de tampar o buraco.',
  },
  {
    titulo: '2. UPT — Unidades por Transação', cor: '#6366f1', emoji: '🛍️',
    def: 'UPT (Units Per Transaction) mede quantas peças cada cliente compra por visita. UPT de 1,0 significa que cada comprador leva só 1 peça. UPT de 2,3 significa que em média leva 2-3 peças. Aumentar o UPT de 1,5 para 2,0 aumenta o faturamento em 33% sem nenhum novo cliente.',
    formula: 'UPT = Total de peças vendidas ÷ Número de transações\nImpacto: +0,5 UPT × vendas mensais × preço médio = faturamento extra',
    exemplos: ['100 vendas, 150 peças: UPT = 1,5', 'Técnica: sugestão de complemento ("que tal uma calça para combinar?")', 'UPT 1,5 → 2,0: +33% de faturamento nas mesmas 100 vendas', 'Treinamento de "look completo" é a principal técnica de UPT'],
    alerta: 'Vendedora que diz "posso ajudar?" e recebe "só estou olhando" perdeu a venda. Vendedora que diz "essa blusa combina muito com essa calça da nossa coleção — quer experimentar junto?" treina o UPT.',
  },
  {
    titulo: '3. Ticket Médio Real: Preço vs Volume', cor: '#f59e0b', emoji: '💰',
    def: 'Ticket médio pode crescer de duas formas: clientes comprando mais peças (UPT) ou peças mais caras (preço médio por peça). Identificar qual driver está aumentando ou caindo é fundamental para a estratégia correta.',
    formula: 'Ticket Médio = Faturamento ÷ Vendas fechadas\nPreço Médio por Peça = Faturamento ÷ Peças vendidas\nUPT = Peças vendidas ÷ Vendas fechadas\nTicket = Preço Médio × UPT',
    exemplos: ['Ticket R$180 = Preço médio R$120 × UPT 1,5', 'Se ticket sobe para R$216 (+20%): pode ser UPT 1,8 (mesmo preço) ou preço R$144 (mesmo UPT)', 'Diagnóstico correto evita estratégia errada', 'Queda de ticket: primeiro verificar se é UPT ou preço'],
    alerta: 'Se o ticket caiu, não assuma que é porque os clientes estão comprando mais barato. Pode ser que estejam comprando menos peças (UPT caindo). Cada problema tem uma solução diferente.',
  },
  {
    titulo: '4. Giro de Estoque no Varejo de Moda', cor: '#22c55e', emoji: '🔄',
    def: 'Giro de estoque mede quantas vezes o estoque é renovado no período. Moda com giro baixo (PME alto) acumula estoque parado que vai para liquidação. Giro alto significa que o dinheiro circula rápido — menos capital imobilizado.',
    formula: 'Giro = CMV ÷ Estoque Médio\nPME = 30 ÷ Giro (dias)\nMeta moda jovem: PME < 60 dias (giro > 0,5/mês)',
    exemplos: ['CMV R$13.200, Estoque médio R$35.000: Giro = 0,38/mês', 'PME = 30 ÷ 0,38 = 79 dias — alto (risco de encalhe)', 'Meta: Estoque = R$22.000 → Giro 0,60/mês, PME 50 dias', 'Cada R$1.000 de redução de estoque libera capital de giro'],
    alerta: 'PME de 79 dias significa que uma peça comprada hoje só gera caixa daqui a 79 dias. Com PME de 50 dias, o capital gira mais rápido, a loja precisa de menos capital de giro e tem mais dinheiro disponível.',
  },
];

const dossie = {
  empresa: 'Boutique Clarice',
  segmento: 'Moda feminina 30-50 anos — loja de rua — centro — faturamento R$ 38.000/mês',
  contexto: 'Clarice tem a boutique há 7 anos. O faturamento está estagnado há 8 meses. Ela atribui à "crise econômica", mas o consultor pediu os dados operacionais. Ao analisar, algo chamou atenção: o faturamento parou, mas os visitantes aumentaram com a inauguração de uma academia próxima.',
  meses: [
    { mes: 'Jan', visitantes: 680, vendas: 88, pecas: 127, faturamento: 35200, cmv: 20416, cf: 9800, estoque: 32000 },
    { mes: 'Fev', visitantes: 720, vendas: 90, pecas: 126, faturamento: 36000, cmv: 20880, cf: 9800, estoque: 33000 },
    { mes: 'Mar', visitantes: 810, vendas: 89, pecas: 122, faturamento: 38200, cmv: 22156, cf: 10200, estoque: 36000 },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      
      contexto: 'Calcule a taxa de conversão dos 3 meses (vendas ÷ visitantes). O que a tendência revela sobre a loja de Clarice?',
      opcoes: [
        { id: 'a', texto: 'Jan: 12,9%, Fev: 12,5%, Mar: 11,0%. Conversão caindo enquanto visitantes sobem. A loja está atraindo mais pessoas mas convertendo menos — problema de atendimento ou vitrine' },
        { id: 'b', texto: 'Jan: 13%, Fev: 13%, Mar: 11% — queda pontual em março, não há tendência clara' },
        { id: 'c', texto: 'Conversão estável em torno de 12% — os números estão bons para o setor' },
        { id: 'd', texto: 'Taxa de conversão não é indicador relevante para loja de rua — só para shopping' },
      ],
      correta: 'a',
      explicacao: 'Jan: 88÷680 = 12,9%. Fev: 90÷720 = 12,5%. Mar: 89÷810 = 11,0%. A conversão está caindo consistentemente (-2 pontos em 3 meses) enquanto o número de visitantes cresce (graças à academia próxima). Isso significa: Clarice tem mais clientes potenciais entrando na loja, mas a equipe não está convertendo. O faturamento ficou estagnado apesar de mais tráfego porque a conversão caiu na mesma proporção em que o tráfego subiu. Oportunidade enorme: se mantivesse 12,9% de conversão com 810 visitantes: 105 vendas em vez de 89 (+18%).',
    },
    {
      id: 'c2',
      
      contexto: 'Calcule o UPT (unidades/transação) e o preço médio por peça nos 3 meses. O que esses indicadores revelam?',
      opcoes: [
        { id: 'a', texto: 'UPT: Jan 1,44, Fev 1,40, Mar 1,37 (caindo). Preço médio/peça: Jan R$277, Fev R$286, Mar R$313 (subindo). Diagnóstico: clientes comprando menos peças mas peças mais caras' },
        { id: 'b', texto: 'UPT estável em 1,4. Preço médio caindo. Clientes optando por produtos mais baratos' },
        { id: 'c', texto: 'UPT crescendo, preço estável. Tendência positiva — sem problema' },
        { id: 'd', texto: 'UPT e preço médio irrelevantes — o ticket médio é o único indicador que importa' },
      ],
      correta: 'a',
      explicacao: 'UPT Jan: 127÷88 = 1,44. UPT Fev: 126÷90 = 1,40. UPT Mar: 122÷89 = 1,37. CAINDO. Preço médio Jan: R$35.200÷127 = R$277. Fev: R$36.000÷126 = R$286. Mar: R$38.200÷122 = R$313. SUBINDO. Interpretação: Clarice está migrando para peças mais caras (tendência premium), mas os clientes estão comprando menos peças por visita. O faturamento ficou estagnado porque o efeito preço (+13%) foi cancelado pelo efeito UPT (−4,9%). Solução: treinar a equipe para "look completo" — se o cliente compra uma peça premium de R$313, a vendedora deve sugerir o acessório ou peça que completa o look.',
    },
    {
      id: 'c3',
      
      contexto: 'Em março, o estoque subiu para R$36.000 (era R$32.000 em janeiro). O CMV foi R$22.156. Calcule o giro de estoque e o PME. Isso é preocupante?',
      opcoes: [
        { id: 'a', texto: 'Giro = R$22.156 ÷ R$36.000 = 0,62/mês. PME = 30 ÷ 0,62 = 48 dias. Adequado para moda' },
        { id: 'b', texto: 'Giro = 0,62/mês. PME = 48 dias. Abaixo da meta — risco de encalhe crescente' },
        { id: 'c', texto: 'Giro = 0,45/mês. PME = 67 dias. Estoque acumulando mais rápido que as vendas' },
        { id: 'd', texto: 'O giro de estoque não é preocupante — moda jovem naturalmente tem PME alto' },
      ],
      correta: 'c',
      explicacao: 'Giro março = CMV R$22.156 ÷ Estoque médio R$34.500 ((R$33.000+R$36.000)/2) = 0,64/mês. PME = 30 ÷ 0,64 = 46,9 dias. Mas a tendência é preocupante: estoque cresceu R$4.000 (+12,5%) em 3 meses enquanto as vendas cresceram apenas R$3.000 (+8,5%). O estoque está crescendo mais rápido que as vendas. Se essa tendência continuar mais 2-3 meses, o PME ultrapassará 60 dias — zona de risco de encalhe e necessidade de liquidação. É sinal de que as compras não estão alinhadas com a velocidade de venda.',
    },
    {
      id: 'c4',
      
      contexto: 'Se Clarice treinar a equipe em técnicas de conversão e conseguir subir de 11% para 15% em março (mantendo os 810 visitantes), qual seria o impacto no faturamento? (Ticket médio R$429)',
      opcoes: [
        { id: 'a', texto: '810 × 15% = 121,5 → 122 vendas. 122 × R$429 = R$52.338 vs R$38.200 atual. Ganho de R$14.138 (37%) sem nenhum novo visitante' },
        { id: 'b', texto: '810 × 15% = 122 vendas. 122 × R$429 = R$52.338. Ganho de R$14.138 mas exigiria dobrar a equipe' },
        { id: 'c', texto: 'Impossível subir para 15% — 11% já é acima da média de loja de rua' },
        { id: 'd', texto: 'Ganho de R$8.000 — impacto moderado, não prioritário' },
      ],
      correta: 'a',
      explicacao: 'Conversão atual: 89 vendas (11%). Meta: 15%. Vendas com 15%: 810 × 0,15 = 121,5 ≈ 122 vendas. Faturamento: 122 × R$429 (ticket médio março) = R$52.338. Ganho: R$52.338 − R$38.200 = R$14.138 (+37%). Com mesma MC% de 42%: lucro extra = R$14.138 × 42% = R$5.938/mês. Com CF fixo em R$10.200, esse ganho vai direto para o bolso de Clarice. Custo do treinamento de conversão: R$2.000-3.000 (uma vez). Payback: menos de 1 mês. É o investimento com maior retorno disponível para a boutique.',
    },
    {
      id: 'c5',
      
      contexto: 'Diagnóstico completo: quais são as 3 prioridades de ação para Clarice, em ordem de urgência?',
      opcoes: [
        { id: 'a', texto: '1ª) Treinamento de conversão da equipe; 2ª) Implementar técnica de "look completo" para aumentar UPT; 3ª) Controlar compras para estabilizar o estoque em R$32.000' },
        { id: 'b', texto: '1ª) Abrir canal digital (Instagram) para atrair mais visitantes; 2ª) Promoção para liquidar o estoque; 3ª) Reduzir o preço médio para aumentar as vendas' },
        { id: 'c', texto: '1ª) Controlar o estoque; 2ª) Treinar equipe; 3ª) Aumentar o tráfego com panfletagem' },
        { id: 'd', texto: '1ª) Trocar a vitrine; 2ª) Trocar a equipe; 3ª) Mudar o mix de produtos para itens mais baratos' },
      ],
      correta: 'a',
      explicacao: 'As 3 prioridades corretas em ordem: (1ª) Treinamento de conversão — impacto imediato (+R$14.138/mês se subir de 11% para 15%), custo único baixo (R$2.000-3.000), ROI absurdo em menos de 1 mês. A academia próxima trouxe mais visitantes — é urgente converter esse tráfego antes de perder o momento; (2ª) Técnica de look completo (UPT) — UPT caindo de 1,44 para 1,37 é tendência preocupante. Reverter para 1,60 seria +R$5.000/mês adicionais. Complementa o treinamento de conversão; (3ª) Controle de compras — estoque crescendo mais rápido que vendas. Pausar ou reduzir compras por 60 dias até o estoque chegar a R$32.000 libera R$4.000 de capital de giro. Tráfego e promoção (opção B) seriam corretos apenas se o problema fosse falta de visitantes — mas Clarice tem mais visitantes e está convertendo menos.',
    },
  ],
};

const DICAS = {
  c1: {
    titulo: `Taxa de Conversao`,
    formula: `Conversao = Vendas / Visitantes x 100
Referencias:
< 10%: baixa | 10-18%: media | > 20%: boa
Impacto: +1% x visitantes = vendas extras por mes`,
    raciocinio: `Calcule para cada mes: vendas dividido por visitantes. Se conversao cai enquanto visitantes sobe, o problema e interno - nao e falta de trafego.`,
  },
  c2: {
    titulo: `UPT e Preco Medio por Peca`,
    formula: `UPT = Pecas vendidas / Vendas fechadas
Preco medio = Faturamento / Pecas vendidas
Ticket = Faturamento / Vendas = Preco medio x UPT
Se ticket sobe mas UPT cai:
-> cliente compra menos pecas, mais caras`,
    raciocinio: `Decompor o ticket em preco x UPT revela a causa de variacoes. Se o ticket subiu, verifique se foi pelo preco ou pelo UPT. Cada causa tem uma solucao diferente.`,
  },
  c3: {
    titulo: `Giro de Estoque e PME`,
    formula: `Giro = CMV / Estoque medio
PME = 30 / Giro (dias)
Moda jovem: PME ideal < 60 dias
Estoque cresce mais que vendas = PME subindo`,
    raciocinio: `Se o estoque cresce mais rapido que as vendas, o PME esta subindo - sinal de acumulo. Compare o crescimento do estoque com o crescimento do CMV.`,
  },
  c4: {
    titulo: `Impacto da Conversao no Faturamento`,
    formula: `Vendas com nova conversao = Visitantes x Nova taxa
Faturamento extra = Vendas extras x Ticket medio
MC extra = Faturamento extra x MC%
Payback = Custo treinamento / MC extra mensal`,
    raciocinio: `Calcule: visitantes x (taxa nova - taxa atual) = vendas extras. Multiplique pelo ticket medio. Compare esse ganho com o custo do treinamento para o payback.`,
  },
  c5: {
    titulo: `3 Prioridades em Ordem de Urgencia`,
    formula: `Criterio de priorizacao:
1. Maior impacto imediato no lucro
2. Menor custo de implementacao
3. Mais urgente (risco de perda)
Nao priorizar: mais trafego quando conversao esta caindo`,
    raciocinio: `A ordem importa: primeiro corrija o que perde dinheiro agora (conversao), depois otimize (UPT), por ultimo controle (estoque).`,
  },
};

export default function ModaConsultoriaIndicadores() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  const mesesCalc = dossie.meses.map(m => ({
    ...m,
    conversao: m.vendas / m.visitantes * 100,
    upt: m.pecas / m.vendas,
    precoMedio: m.faturamento / m.pecas,
    ticket: m.faturamento / m.vendas,
    mc: m.faturamento - m.cmv,
    mcPct: (m.faturamento - m.cmv) / m.faturamento * 100,
    lucro: m.faturamento - m.cmv - m.cf,
    margem: (m.faturamento - m.cmv - m.cf) / m.faturamento * 100,
    giro: m.cmv / m.estoque,
    pme: 30 / (m.cmv / m.estoque),
  }));

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/moda/indicadores')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><BarChart4 size={22} color={COR} /> Consultoria: Indicadores Financeiros</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 100%)', borderColor: 'rgba(139,92,246,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Indicadores Financeiros
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Mais Visitantes, Menos Vendas: O Funil Furado de Clarice</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          A academia abriu ao lado e dobrou o tráfego da boutique. Mas o faturamento não subiu. Os KPIs revelarão <strong style={{ color: 'var(--text-main)' }}>onde o dinheiro está vazando</strong> — e a solução está na própria loja.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '📊 Painel de KPIs' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(139,92,246,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c4b5fd' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> KPIs do Varejo de Moda</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#ec4899' ? '236,72,153' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#f59e0b' ? '245,158,11' : '34,197,94'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: bloco.cor, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{bloco.formula}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((e, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e}</span>)}
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
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Painel de KPIs →</button>
          </div>
        </div>
      )}

      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: COR }}>📊 Painel de KPIs — {dossie.empresa} (3 meses)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>KPI</th>
                    {mesesCalc.map(m => (
                      <th key={m.mes} style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{m.mes}</th>
                    ))}
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Tendência</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l: 'Visitantes', vals: mesesCalc.map(m => m.visitantes.toLocaleString()), trend: '📈' },
                    { l: 'Vendas fechadas', vals: mesesCalc.map(m => m.vendas), trend: '➡️' },
                    { l: 'Taxa de Conversão', vals: mesesCalc.map(m => { const s = semaforo(m.conversao, [10, 18]); return <span style={{ color: s.cor, fontWeight: 600 }}>{pct(m.conversao)}</span>; }), trend: '📉' },
                    { l: 'Peças vendidas', vals: mesesCalc.map(m => m.pecas), trend: '📉' },
                    { l: 'UPT', vals: mesesCalc.map(m => { const s = semaforo(m.upt, [1.3, 1.8]); return <span style={{ color: s.cor, fontWeight: 600 }}>{m.upt.toFixed(2)}</span>; }), trend: '📉' },
                    { l: 'Preço médio/peça', vals: mesesCalc.map(m => formatBRL(m.precoMedio)), trend: '📈' },
                    { l: 'Ticket Médio', vals: mesesCalc.map(m => formatBRL(m.ticket)), trend: '📈' },
                    { l: 'Faturamento', vals: mesesCalc.map(m => formatBRL(m.faturamento)), trend: '📈' },
                    { l: 'MC%', vals: mesesCalc.map(m => pct(m.mcPct)), trend: '➡️' },
                    { l: 'Lucro', vals: mesesCalc.map(m => { const s = semaforo(m.margem, [5, 15]); return <span style={{ color: s.cor, fontWeight: 700 }}>{formatBRL(m.lucro)}</span>; }), trend: '📉' },
                    { l: 'PME (dias)', vals: mesesCalc.map(m => { const s = semaforo(70 - m.pme, [0, 15]); return <span style={{ color: s.cor }}>{m.pme.toFixed(0)} dias</span>; }), trend: '📈' },
                    { l: 'Estoque', vals: mesesCalc.map(m => formatBRL(m.estoque)), trend: '📈' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{row.l}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{v}</td>
                      ))}
                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontSize: '1.1rem' }}>{row.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(139,92,246,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}><Briefcase size={24} color={COR} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>

            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📊 Painel de KPIs — 3 Meses</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>KPI</th>
                    {mesesCalc.map(m => <th key={m.mes} style={{ padding: '0.5rem 0.6rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{m.mes}</th>)}
                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'right', color: 'var(--text-muted)' }}>Tend.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l: 'Visitantes', v: m => m.visitantes.toLocaleString(), t: '📈' },
                    { l: 'Vendas', v: m => m.vendas, t: '➡️' },
                    { l: 'Conversão (%)', v: m => { const s = semaforo(m.conversao, [10, 18]); return <span style={{ color: s.cor, fontWeight: 700 }}>{pct(m.conversao)}</span>; }, t: '📉' },
                    { l: 'UPT', v: m => { const s = semaforo(m.upt, [1.3, 1.8]); return <span style={{ color: s.cor, fontWeight: 700 }}>{m.upt.toFixed(2)}</span>; }, t: '📉' },
                    { l: 'Preço médio/peça', v: m => formatBRL(m.precoMedio), t: '📈' },
                    { l: 'Ticket médio', v: m => formatBRL(m.ticket), t: '📈' },
                    { l: 'Faturamento', v: m => formatBRL(m.faturamento), t: '📈' },
                    { l: 'Lucro', v: m => <span style={{ color: m.lucro > 5000 ? '#22c55e' : '#f59e0b', fontWeight: 700 }}>{formatBRL(m.lucro)}</span>, t: '📉' },
                    { l: 'Estoque', v: m => <span style={{ color: m.estoque > 34000 ? '#ef4444' : '#22c55e' }}>{formatBRL(m.estoque)}</span>, t: '📈' },
                    { l: 'PME (dias)', v: m => <span style={{ color: m.pme > 55 ? '#f59e0b' : '#22c55e' }}>{m.pme.toFixed(0)} d</span>, t: '📈' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>{row.l}</td>
                      {mesesCalc.map((m, j) => <td key={j} style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>{row.v(m)}</td>)}
                      <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>{row.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                </div>
                {/* Dica contextual */}
                {DICAS[q.id] && !enviado && (
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
                        <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>🧮 {DICAS[q.id].titulo}</div>
                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '0.4rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fcd34d', whiteSpace: 'pre-wrap', marginBottom: '0.75rem', lineHeight: 1.7 }}>{DICAS[q.id].formula}</pre>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>💬</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{DICAS[q.id].raciocinio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(139,92,246,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#c4b5fd' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#c4b5fd' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!enviado ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < dossie.perguntasConsultoria.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < dossie.perguntasConsultoria.length ? 0.5 : 1, cursor: Object.keys(respostas).length < dossie.perguntasConsultoria.length ? 'not-allowed' : 'pointer' }}>
                  Entregar Consultoria ({Object.keys(respostas).length}/{dossie.perguntasConsultoria.length})
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#facc15' }}>Dica:</strong> observe que visitantes cresceram e vendas ficaram estáveis — isso significa que algum indicador interno está piorando. A taxa de conversão e o UPT contam essa história.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Clarice vai finalmente aproveitar o tráfego da academia!' : nota >= 80 ? 'Muito bom! Revise a interpretação dos KPIs dos itens errados.' : 'Releia o painel — taxa de conversão e UPT são os dois KPIs mais reveladores.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecao('teoria')} style={{ padding: '0.75rem 1.5rem', background: COR, border: 'none' }}>Rever Teoria</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
