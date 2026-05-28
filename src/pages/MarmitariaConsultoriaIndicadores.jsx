import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, BarChart4, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Target, Lightbulb, Award,
  AlertCircle, BookOpen, Briefcase, TrendingUp, TrendingDown,
  Activity, Crosshair
} from 'lucide-react';

const COR = '#8b5cf6';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const pct = (v) => `${v.toFixed(1)}%`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function semaforo(valor, limites) {
  if (valor < limites[0]) return { cor: '#ef4444', label: '🔴 Crítico' };
  if (valor < limites[1]) return { cor: '#f59e0b', label: '🟡 Atenção' };
  return { cor: '#22c55e', label: '🟢 Saudável' };
}

// ─── TEORIA ──────────────────────────────────────────────────────────────────
const blocos = [
  {
    titulo: '1. Margem de Contribuição: A Força Bruta do Negócio', cor: '#f59e0b', emoji: '💪',
    def: 'MC é o que sobra de cada venda depois de pagar os custos variáveis. É com a MC que se paga os custos fixos e gera lucro. Se a MC% for menor que os custos fixos / faturamento, o negócio opera no prejuízo não importa quanto venda.',
    formula: 'MC (R$) = Receita − Custos Variáveis\nMC% = MC (R$) ÷ Receita × 100\nReferência: MC% > 40% é excelente para marmitaria',
    exemplos: ['Faturamento R$18.000, CV R$10.800 → MC = R$7.200 (40%)', 'CF = R$5.500 → Lucro = R$1.700 (9,4%)', 'Se MC% cai para 30%: MC = R$5.400 → Prejuízo de R$100', 'Pequena queda na MC% pode destruir todo o lucro'],
    alerta: 'A MC% é o indicador mais sensível da marmitaria. Alta dos insumos de 5% pode reduzir a MC% de 40% para 36% e cortar o lucro pela metade. Monitorar mensalmente é obrigatório.',
  },
  {
    titulo: '2. Ponto de Equilíbrio: O Piso da Operação', cor: '#6366f1', emoji: '⚖️',
    def: 'O PE é o faturamento mínimo para não ter prejuízo. Abaixo do PE = prejuízo. Acima = lucro. Toda decisão que aumenta custo fixo (contratar, alugar) sobe o PE e exige vender mais para cobrir.',
    formula: 'PE (R$) = Custo Fixo ÷ MC%\nPE (unidades) = Custo Fixo ÷ MC unitária\nMargem de segurança = (Faturamento − PE) ÷ Faturamento × 100',
    exemplos: ['CF R$5.500, MC% 40%: PE = R$13.750', 'Faturamento R$18.000: margem segurança = 23,6%', 'Contrata funcionário (+R$1.400): novo PE = R$17.250', 'Com novo PE, margem de segurança cai para 4,2%'],
    alerta: 'Expansões que aumentam o custo fixo reduzem dramaticamente a margem de segurança. Calcular o novo PE antes de qualquer contratação ou aluguel é regra de ouro.',
  },
  {
    titulo: '3. ROIC: Quanto o Capital Investido Rende', cor: '#22c55e', emoji: '📈',
    def: 'ROIC (Return on Invested Capital) mede quanto o lucro representa em relação ao capital total investido no negócio. ROIC mensal de 3% = 36% ao ano — muito acima da renda fixa. ROIC abaixo de 0,85%/mês significa que o capital estaria melhor no Tesouro Selic.',
    formula: 'ROIC = Lucro Líquido ÷ Capital Investido × 100\nCapital Investido = Equipamentos + Reforma + Estoques',
    exemplos: ['Lucro R$1.700, Capital R$45.000 → ROIC = 3,8%/mês', 'Equivale a 56% ao ano vs Tesouro ~10% ao ano', 'ROIC < 0,85%/mês: melhor deixar no banco', 'ROIC negativo: destruindo capital a cada mês'],
    alerta: 'ROIC negativo por mais de 3 meses consecutivos é sinal grave de que o modelo de negócio precisa ser revisado — não apenas cortados custos.',
  },
  {
    titulo: '4. Ticket Médio e Volume: Os Dois Motores do Crescimento', cor: '#ec4899', emoji: '🎯',
    def: 'Faturamento = Ticket Médio × Volume de Vendas. Para crescer, você pode aumentar o ticket (vender mais caro ou agregar mais itens) ou aumentar o volume (mais clientes ou mais frequência). Qual é mais fácil depende do mercado — mas ticket médio baixo com volume alto é mais frágil.',
    formula: 'Ticket Médio = Faturamento ÷ Número de Vendas\nCrescimento Faturamento = Δ(Ticket) × Volume + Ticket × Δ(Volume)',
    exemplos: ['500 marmitas × R$14 = R$7.000 (Ticket baixo, volume alto)', '100 marmitas gourmet × R$35 = R$3.500 (Ticket alto, volume baixo)', 'Aumentar ticket de R$14 para R$16 (+14%): +R$1.000/mês sem novo cliente', 'Melhor estratégia: aumentar ticket E volume simultaneamente'],
    alerta: 'Ticket médio estagnado por 6+ meses enquanto custos sobem é o cenário mais comum de falência silenciosa: faturamento estável, lucro encolhendo mês a mês.',
  },
];

// ─── EXEMPLOS ────────────────────────────────────────────────────────────────
const exemplosKPI = [
  {
    id: 'saudavel', label: 'Empresa Saudável', emoji: '🟢', cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    fat: 22000, cv: 12100, cf: 5500, vendas: 620, capital: 48000,
    descricao: 'Marmitaria que fez ajustes corretos: aumentou ticket médio para R$35, diversificou cardápio e manteve custos fixos sob controle.',
  },
  {
    id: 'atencao', label: 'Empresa em Atenção', emoji: '🟡', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    fat: 16800, cv: 11760, cf: 5200, vendas: 480, capital: 42000,
    descricao: 'Marmitaria com MC% comprimida (alta de ingredientes não repassada ao preço) e PE perigosamente próximo ao faturamento.',
  },
  {
    id: 'critico', label: 'Empresa Crítica', emoji: '🔴', cor: '#ef4444', corBg: 'rgba(239,68,68,0.08)',
    fat: 14200, cv: 10650, cf: 5800, vendas: 400, capital: 38000,
    descricao: 'Marmitaria operando quase no prejuízo: MC% muito baixa, PE acima de 95% do faturamento, ROIC negativo.',
  },
];

// ─── DOSSIÊ ──────────────────────────────────────────────────────────────────
const dossie = {
  empresa: 'Marmitaria Sabor & Saúde',
  segmento: 'Marmitaria fitness — delivery WhatsApp + iFood — 3 anos de operação',
  contexto: 'Marcos, 38 anos, está preocupado. A marmitaria vende bem mas o dinheiro "some". Faturou R$21.600 em março mas no fim do mês sobrou apenas R$420. Pediu consultoria para entender o que está errado e o que precisa mudar.',
  meses: [
    { mes: 'Jan', fat: 18400, cv: 10580, cf: 5200, vendas: 520, capital: 44000 },
    { mes: 'Fev', fat: 19200, cv: 11230, cf: 5400, vendas: 548, capital: 44000 },
    { mes: 'Mar', fat: 21600, cv: 13420, cf: 7620, vendas: 600, capital: 44000 },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      contexto: 'Em março, o faturamento cresceu 12,5% (de R$19.200 para R$21.600), mas o lucro caiu de R$2.570 para R$420. Qual indicador explica essa contradição?',
      opcoes: [
        { id: 'a', texto: 'A MC% caiu de 41,5% (Fev) para 37,9% (Mar) E o CF subiu 41% (de R$5.400 para R$7.620). Tesoura dupla: mais vendas com margem menor e custo fixo maior' },
        { id: 'b', texto: 'O ticket médio caiu — Marcos vendeu mais barato para atrair volume' },
        { id: 'c', texto: 'O ROIC negativo indica que o capital foi mal alocado em março' },
        { id: 'd', texto: 'O ponto de equilíbrio foi ultrapassado — normal para meses de expansão' },
      ],
      correta: 'a',
      explicacao: 'Fevereiro: CV/Fat = R$11.230/R$19.200 = 58,5% → MC% = 41,5%. Março: CV/Fat = R$13.420/R$21.600 = 62,1% → MC% = 37,9%. Queda de 3,6 pontos percentuais na MC%. Além disso, CF subiu de R$5.400 para R$7.620 (+41%): provavelmente Marcos contratou ajudante e/ou pagou aluguel de equipamento extra para dar conta do volume maior. Com MC% menor e CF maior, o lucro evaporou mesmo com faturamento crescendo. Esse é o padrão de "crescer para trás".',
    },
    {
      id: 'c2',
      contexto: 'Calcule o Ponto de Equilíbrio de março (CF R$7.620, MC% 37,9%). Qual a margem de segurança? O que isso significa?',
      opcoes: [
        { id: 'a', texto: 'PE = R$20.105. Margem de segurança = 7%. Marcos está operando perigosamente perto do limite — qualquer queda de 7% no faturamento gera prejuízo' },
        { id: 'b', texto: 'PE = R$15.000. Margem de segurança = 30%. Operação saudável' },
        { id: 'c', texto: 'PE = R$21.600. Margem de segurança = 0%. Marcos está exatamente no equilíbrio' },
        { id: 'd', texto: 'PE = R$19.050. Margem de segurança = 11,8%. Atenção mas sem urgência' },
      ],
      correta: 'a',
      explicacao: 'PE = CF ÷ MC% = R$7.620 ÷ 0,379 = R$20.105. Faturamento março: R$21.600. Margem de segurança = (R$21.600 − R$20.105) ÷ R$21.600 = 6,9% ≈ 7%. Em janeiro (CF R$5.200, MC% 42,5%), o PE era R$12.235 e a margem de segurança era 33,5%. Em 3 meses, Marcos destruiu a margem de segurança de 33,5% para 7%. Qualquer mês de demanda normal (abaixo de R$20.100) gera prejuízo. A operação está frágil.',
    },
    {
      id: 'c3',
      contexto: 'O custo variável de março foi R$13.420 para R$21.600 de faturamento (62,1% do faturamento). Em janeiro era 57,5%. O que provavelmente aconteceu e qual a ação correta?',
      opcoes: [
        { id: 'a', texto: 'Ingredientes subiram e Marcos não reajustou o preço. Ação: calcular novo preço pelo Markup Divisor e comunicar reajuste aos clientes' },
        { id: 'b', texto: 'Marcos passou a desperdiçar mais ingredientes. Ação: treinar equipe em controle de desperdício' },
        { id: 'c', texto: 'O mix de marmitas mudou para produtos mais caros. Ação: padronizar o cardápio para reduzir CV' },
        { id: 'd', texto: 'Todas as anteriores podem ser verdadeiras — só uma análise de custos por item resolverá' },
      ],
      correta: 'd',
      explicacao: 'Sem o detalhamento dos custos por item, não é possível afirmar com certeza a causa. As três hipóteses são válidas: (A) Alta de insumos sem reajuste de preço — mais provável dado o contexto macroeconômico; (B) Desperdício aumentado com novo ajudante sem treinamento; (C) Produção de itens mais elaborados (marmita fitness premium) com custo maior mas mesmo preço. A ação correta: planilha de custo por marmita para identificar quais itens subiram. Depois decidir: reajustar preço, substituir ingrediente ou cortar item do cardápio.',
    },
    {
      id: 'c4',
      contexto: 'O CF saltou de R$5.400 (fev) para R$7.620 (mar), alta de R$2.220. Com MC% de 37,9%, quantas marmitas extras precisam ser vendidas por mês só para cobrir esse novo custo fixo? (Preço médio R$36)',
      opcoes: [
        { id: 'a', texto: 'MC unitária = R$36 × 37,9% = R$13,64. Marmitas extras necessárias = R$2.220 ÷ R$13,64 = 163 marmitas/mês só para cobrir o novo CF' },
        { id: 'b', texto: '62 marmitas extras — impacto pequeno no volume necessário' },
        { id: 'c', texto: '200 marmitas extras — o dobro da capacidade atual de expansão' },
        { id: 'd', texto: 'O CF extra é absorvido pelo crescimento natural do negócio — não precisa calcular' },
      ],
      correta: 'a',
      explicacao: 'MC unitária = Preço R$36 × MC% 37,9% = R$13,64/marmita. Para cobrir R$2.220 de novo CF: R$2.220 ÷ R$13,64 = 162,8 ≈ 163 marmitas extras/mês. Marcos já vendeu 600 em março — ele precisaria vender 763/mês só para ter o mesmo lucro que tinha em fevereiro com 548 marmitas. Isso significa: a contratação/expansão de março só se justifica se gerar mais de 163 marmitas adicionais de capacidade. Se a expansão foi para atender pico pontual, Marcos destruiu a estrutura de custo permanentemente para uma demanda temporária.',
    },
    {
      id: 'c5',
      contexto: 'Com base no diagnóstico completo, quais são as 2 ações prioritárias que Marcos deve tomar imediatamente?',
      opcoes: [
        { id: 'a', texto: '(1) Cortar o funcionário contratado em março para restaurar o CF de R$5.400; (2) Não mexer no preço para não perder clientes' },
        { id: 'b', texto: '(1) Reajustar o preço para restaurar a MC% mínima de 42% (novo preço ~R$38-39); (2) Auditar o CF: manter custo novo só se a demanda confirmar volume > 763 marmitas/mês' },
        { id: 'c', texto: '(1) Aumentar o faturamento a qualquer custo; (2) Reduzir ingredientes para cortar CV' },
        { id: 'd', texto: '(1) Buscar investidor para cobrir o período de ajuste; (2) Expandir para mais canais de venda' },
      ],
      correta: 'b',
      explicacao: 'As duas ações prioritárias corretas: (1) Reajuste de preço: com MC% em 37,9% e PE em R$20.105, Marcos opera sem segurança. Para restaurar MC% de 42%, com CV médio de R$22,35/marmita: novo preço = R$22,35 ÷ (1 − 0,42) = R$38,53. Comunicar reajuste de R$36 para R$38 (+5,6%) é palatável para cliente de marmita fitness. (2) Auditar o CF novo: os R$2.220 extras se justificam apenas se Marcos mantiver 763+ marmitas/mês. Se a demanda de março foi pontual (evento, campanha), deve desativar o custo variável fixo novo. Aumentar faturamento "a qualquer custo" sem resolver a MC% só acelera o prejuízo.',
    },
  ],
};

export default function MarmitariaConsultoriaIndicadores() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [exemploAtivo, setExemploAtivo] = useState('saudavel');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemploAtivo ? exemploKPIs(exemplosKPI.find(e => e.id === exemploAtivo)) : null;
  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  function exemploKPIs(e) {
    const mc = e.fat - e.cv;
    const mcPct = mc / e.fat * 100;
    const lucro = mc - e.cf;
    const margem = lucro / e.fat * 100;
    const pe = e.cf / (mcPct / 100);
    const margSeg = (e.fat - pe) / e.fat * 100;
    const ticket = e.fat / e.vendas;
    const roic = lucro / e.capital * 100;
    return { ...e, mc, mcPct, lucro, margem, pe, margSeg, ticket, roic };
  }

  const dossieMeses = dossie.meses.map(m => {
    const mc = m.fat - m.cv;
    const mcPct = mc / m.fat * 100;
    const lucro = mc - m.cf;
    const margem = lucro / m.fat * 100;
    const pe = m.cf / (mcPct / 100);
    const margSeg = (m.fat - pe) / m.fat * 100;
    const ticket = m.fat / m.vendas;
    const roic = lucro / m.capital * 100;
    return { ...m, mc, mcPct, lucro, margem, pe, margSeg, ticket, roic };
  });

  const exData = exemploKPIs(exemplosKPI.find(e => e.id === exemploAtivo));

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/indicadores')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><BarChart4 size={22} color={COR} /> Consultoria: Indicadores Financeiros</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 100%)', borderColor: 'rgba(139,92,246,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Indicadores Financeiros
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>O Painel do CEO: Ler Números e Agir Rápido</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Marcos faturou mais e lucrou menos. No desafio, você vai ler os KPIs mês a mês, identificar onde o negócio está vazando e dar as <strong style={{ color: 'var(--text-main)' }}>duas ações prioritárias</strong> de um consultor experiente.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '📊 Painel de KPIs' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(139,92,246,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c4b5fd' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {/* TEORIA */}
      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Indicadores Essenciais da Marmitaria</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
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

      {/* EXEMPLOS — PAINEL INTERATIVO */}
      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplosKPI.map(e => (
              <button key={e.id} onClick={() => setExemploAtivo(e.id)} style={{ flex: 1, minWidth: '160px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === e.id ? `2px solid ${e.cor}` : '2px solid var(--border-color)', background: exemploAtivo === e.id ? e.corBg : 'var(--bg-card)', color: exemploAtivo === e.id ? e.cor : 'var(--text-muted)', cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{e.emoji}</div>
                <div style={{ fontSize: '0.9rem' }}>{e.label}</div>
              </button>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${exData.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{exData.descricao}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { l: 'Faturamento', v: formatBRL(exData.fat), sem: null },
              { l: 'MC (R$)', v: formatBRL(exData.mc), sem: semaforo(exData.mcPct, [30, 40]) },
              { l: 'MC%', v: pct(exData.mcPct), sem: semaforo(exData.mcPct, [30, 40]) },
              { l: 'Lucro Líquido', v: formatBRL(exData.lucro), sem: semaforo(exData.margem, [5, 15]) },
              { l: 'Margem Líquida', v: pct(exData.margem), sem: semaforo(exData.margem, [5, 15]) },
              { l: 'Ponto de Equilíbrio', v: formatBRL(exData.pe), sem: null },
              { l: 'Margem de Segurança', v: pct(exData.margSeg), sem: semaforo(exData.margSeg, [10, 25]) },
              { l: 'Ticket Médio', v: formatBRL(exData.ticket), sem: null },
              { l: 'ROIC Mensal', v: pct(exData.roic), sem: semaforo(exData.roic, [0.85, 3]) },
            ].map((k, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.sem ? k.sem.cor : exData.cor}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: k.sem ? k.sem.cor : 'var(--text-main)' }}>{k.v}</div>
                {k.sem && <div style={{ fontSize: '0.7rem', color: k.sem.cor, marginTop: '0.2rem' }}>{k.sem.label}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {/* DESAFIO */}
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

            {/* Painel de KPIs dos 3 meses */}
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📊 Painel de KPIs — 3 Meses</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Indicador</th>
                    {dossieMeses.map(m => (
                      <th key={m.mes} style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{m.mes}</th>
                    ))}
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Tendência</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l: 'Faturamento', vals: dossieMeses.map(m => formatBRL(m.fat)), trend: '📈' },
                    { l: 'Custo Variável', vals: dossieMeses.map(m => formatBRL(m.cv)), trend: '📈' },
                    { l: 'MC%', vals: dossieMeses.map(m => { const s = semaforo(m.mcPct, [30, 40]); return <span style={{ color: s.cor, fontWeight: 600 }}>{pct(m.mcPct)}</span>; }), trend: '📉' },
                    { l: 'Custo Fixo', vals: dossieMeses.map(m => formatBRL(m.cf)), trend: '📈' },
                    { l: 'Lucro', vals: dossieMeses.map(m => { const s = semaforo(m.margem, [5, 15]); return <span style={{ color: s.cor, fontWeight: 700 }}>{formatBRL(m.lucro)}</span>; }), trend: '📉' },
                    { l: 'Margem Líquida', vals: dossieMeses.map(m => pct(m.margem)), trend: '📉' },
                    { l: 'PE', vals: dossieMeses.map(m => formatBRL(m.pe)), trend: '📈' },
                    { l: 'Margem Segurança', vals: dossieMeses.map(m => { const s = semaforo(m.margSeg, [10, 25]); return <span style={{ color: s.cor }}>{pct(m.margSeg)}</span>; }), trend: '📉' },
                    { l: 'Ticket Médio', vals: dossieMeses.map(m => formatBRL(m.ticket)), trend: '➡️' },
                    { l: 'ROIC Mensal', vals: dossieMeses.map(m => { const s = semaforo(m.roic, [0.85, 3]); return <span style={{ color: s.cor }}>{pct(m.roic)}</span>; }), trend: '📉' },
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                </div>
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> leia o painel mês a mês. Não existe um único número que responde — é a tendência entre janeiro e março que conta a história real do negócio.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Marcos vai salvar a marmitaria com as suas recomendações!' : nota >= 80 ? 'Muito bom! Revise os cálculos dos itens errados.' : 'Releia o painel de KPIs — a resposta está na tendência dos 3 meses.'}
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
