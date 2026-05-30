import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BarChart4, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase, PieChart } from 'lucide-react';

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
    titulo: '1. Mix de Vendas: O Produto que Paga as Contas', cor: '#f59e0b', emoji: '🥖',
    def: 'Nem todo produto contribui igualmente para o lucro. O pão francês atrai o cliente mas tem margem baixa. O café expresso, a torta e o refrigerante têm margem alta. Analisar a MC% por categoria revela quais produtos são "chamariz" e quais são "geradores de lucro".',
    formula: 'MC por categoria = Receita categoria − Custo variável categoria\nMC% por categoria = MC ÷ Receita × 100\nMix ideal: maximizar categorias com MC% > média',
    exemplos: ['Pão francês: receita R$40.000, custo R$28.000 → MC% = 30%', 'Frios/tortas: receita R$35.000, custo R$12.000 → MC% = 65,7%', 'Pão traz o cliente; torta paga o aluguel', 'Estratégia: usar pão como "isca" e fidelizar nos itens de alto valor'],
    alerta: 'Padarias que vendem só pão têm MC% de 30-35% — muito baixa. As lucrativas têm café, sanduíches e confeitaria com MC% de 60-70%. A diversificação do mix é a principal alavanca de margem.',
  },
  {
    titulo: '2. Ticket de Balcão: Quanto Cada Cliente Vale', cor: '#6366f1', emoji: '🛒',
    def: 'Ticket de balcão é o gasto médio por cliente por visita. Aumentar o ticket sem aumentar o fluxo de clientes é a maneira mais eficiente de crescer na padaria. Técnicas: cross-selling (comprou pão → ofereça manteiga), upselling (pão simples → pão australiano premium).',
    formula: 'Ticket Médio = Faturamento ÷ Número de clientes\nCrescimento por ticket: +R$2/cliente × 5.000 clientes = +R$10.000/mês',
    exemplos: ['Ticket R$11 → com treinamento → R$14 (+27%)', 'Oferta relâmpago "Pão + café = R$6" eleva ticket e giro', '5.000 clientes × +R$3 ticket = +R$15.000 faturamento sem novo cliente', 'Vitrine estratégica dos itens de alta margem no caminho do caixa'],
    alerta: 'Treinar a equipe para sugerir itens complementares é o investimento com maior ROI da padaria. Um "gostaria de levar manteiga?" aumenta o ticket em R$3-5 com custo zero.',
  },
  {
    titulo: '3. Giro de Estoque: Pão Velho é Prejuízo', cor: '#22c55e', emoji: '🔄',
    def: 'Na padaria, produto que não vende no dia vira descarte. O giro de estoque mede quantas vezes o estoque é renovado — quanto mais rápido, menos desperdício. PME (Prazo Médio de Estocagem) baixo é sinal de eficiência operacional.',
    formula: 'Giro = CMV mensal ÷ Estoque médio\nPME = 30 ÷ Giro (dias)\nDesperdício % = (Produção − Vendas) ÷ Produção × 100',
    exemplos: ['CMV R$43.000, Estoque médio R$3.800: Giro = 11,3× ao mês', 'PME = 30 ÷ 11,3 = 2,65 dias — renovação a cada 2,7 dias', 'Desperdício 8%: por cada R$100 produzidos, R$8 vira lixo', 'Meta: Desperdício < 5% — acima disso, revisar produção diária'],
    alerta: 'Padaria que produz "o de sempre" independente da demanda desperdiça 8-15% da produção. Ajustar a produção pela demanda do dia anterior (mais na sexta, menos na segunda) reduz desperdício e melhora a MC%.',
  },
  {
    titulo: '4. Ponto de Equilíbrio por Turno', cor: '#ec4899', emoji: '⏱️',
    def: 'Padarias com múltiplos turnos (manhã de pão, tarde de café, noite de lanches) precisam calcular o PE por turno. Um turno operando abaixo do PE consome os lucros dos outros. Saber o PE de cada turno permite decidir se vale a pena manter os 3 ou cortar o menos lucrativo.',
    formula: 'PE turno = CF alocado ao turno ÷ MC% médio do turno\nTurno viável: Faturamento do turno > PE do turno',
    exemplos: ['Turno manhã: MC% 32%, CF alocado R$8.000 → PE R$25.000', 'Turno tarde: MC% 58%, CF alocado R$5.000 → PE R$8.621', 'Turno noite (lanches): MC% 45%, CF R$4.000 → PE R$8.889', 'Se tarde faturas R$12.000 e noite R$7.000 → noite está no prejuízo'],
    alerta: 'Muitas padarias mantêm o turno da noite "por costume" sem saber que ele opera no prejuízo. O PE por turno revela essa verdade. Às vezes, fechar 2 horas mais cedo aumenta o lucro.',
  },
];

const dossie = {
  empresa: 'Padaria São Benedito',
  segmento: 'Padaria tradicional + confeitaria — bairro histórico — 18 anos de operação',
  contexto: 'Sebastiana tem a padaria há 18 anos. Orgulha-se de vender pão de qualidade. Mas nos últimos 2 anos o lucro caiu progressivamente mesmo com o faturamento crescendo. O contador disse que "os números não batem". Você foi chamado para fazer o diagnóstico.',
  categorias: [
    { cat: 'Pão e Derivados', fat: 42000, cv: 30240, clientes: 4200, cor: '#f59e0b' },
    { cat: 'Bebidas (café, suco, refri)', fat: 18000, cv: 5400, clientes: 2800, cor: '#6366f1' },
    { cat: 'Confeitaria (bolos, doces)', fat: 14000, cv: 5600, clientes: 680, cor: '#ec4899' },
    { cat: 'Salgados e Sanduíches', fat: 10000, cv: 4500, clientes: 900, cor: '#22c55e' },
  ],
  custoFixo: 23000,
  totalClientes: 8580,
  perguntasConsultoria: [
    {
      id: 'c1',
      
      contexto: 'Calcule a MC% de cada categoria. Qual categoria tem o maior peso no faturamento (44%) mas a menor MC%? Qual tem o menor peso mas a maior MC%?',
      opcoes: [
        { id: 'a', texto: 'Pão: MC% = 28% (maior peso, menor MC%). Bebidas: MC% = 70% (segundo maior em faturamento, MC% excelente). Confeitaria: MC% = 60%. Salgados: MC% = 55%' },
        { id: 'b', texto: 'Pão: MC% = 40%. Bebidas: MC% = 65%. Confeitaria: MC% = 55%. Salgados: MC% = 50%' },
        { id: 'c', texto: 'Pão: MC% = 28%. Bebidas: MC% = 70%. Confeitaria: MC% = 60%. Salgados: MC% = 55% — correto, e o mix está mal calibrado' },
        { id: 'd', texto: 'Todas as categorias têm MC% entre 50-60% — o problema não está no mix' },
      ],
      correta: 'c',
      explicacao: 'Pão: MC = (R$42.000 − R$30.240)/R$42.000 = 28%. Bebidas: MC = (R$18.000 − R$5.400)/R$18.000 = 70%. Confeitaria: MC = (R$14.000 − R$5.600)/R$14.000 = 60%. Salgados: MC = (R$10.000 − R$4.500)/R$10.000 = 55%. O pão, que representa 49% do faturamento total, tem a menor MC% (28%). As bebidas, com 21% do faturamento, têm MC% de 70% — 2,5× maior. Esse mix é o principal problema: Sebastiana está "trabalhando muito" para vender o produto menos lucrativo.',
    },
    {
      id: 'c2',
      
      contexto: 'O faturamento total é R$84.000 e o custo fixo é R$23.000. Calcule a MC% ponderada do mix e o PE. A padaria está saudável?',
      opcoes: [
        { id: 'a', texto: 'MC total = R$38.260. MC% ponderada = 45,5%. PE = R$50.549. Faturamento R$84.000 → margem segurança 39,8% — saudável' },
        { id: 'b', texto: 'MC% = 35%. PE = R$65.714. Margem segurança apenas 21,8% — atenção' },
        { id: 'c', texto: 'MC% = 50%. PE = R$46.000. Margem segurança 45,2% — excelente' },
        { id: 'd', texto: 'PE = R$84.000. A padaria está exatamente no equilíbrio — sem lucro' },
      ],
      correta: 'a',
      explicacao: 'MC total = (R$42.000−R$30.240) + (R$18.000−R$5.400) + (R$14.000−R$5.600) + (R$10.000−R$4.500) = R$11.760 + R$12.600 + R$8.400 + R$5.500 = R$38.260. MC% ponderada = R$38.260/R$84.000 = 45,5%. Lucro = R$38.260 − R$23.000 = R$15.260. Margem líquida = 18,2%. PE = R$23.000/0,455 = R$50.549. Margem segurança = (R$84.000−R$50.549)/R$84.000 = 39,8%. A padaria está lucrativa! O problema não é a sobrevivência, mas a eficiência — o mix ruim está escondendo quanto melhor poderia estar.',
    },
    {
      id: 'c3',
      
      contexto: 'O ticket médio geral da padaria é R$9,79 (R$84.000 ÷ 8.580 clientes). Mas o ticket médio de confeitaria é R$20,59 (R$14.000 ÷ 680 clientes). Qual a estratégia para aumentar o ticket geral para R$12,00?',
      opcoes: [
        { id: 'a', texto: 'Aumentar os preços de todos os produtos em 22,6% para atingir R$12,00 de ticket' },
        { id: 'b', texto: 'Migrar 800 clientes do pão (ticket R$10,00) para comprar também 1 item de confeitaria ou bebida: 800 × R$7 extra = R$5.600/mês. Ticket médio sobe para R$10,45 — ainda longe' },
        { id: 'c', texto: 'Treinar equipe para sugestão de produto complementar em cada compra. Se 30% dos 4.200 clientes de pão adicionarem 1 café (R$5): 1.260 × R$5 = R$6.300 extra. Ticket geral: (R$84.000+R$6.300)/8.580 = R$10,53/cliente' },
        { id: 'd', texto: 'Criar combo "Pão + Bebida + Doce" a R$15: deslocamento de clientes para ticket alto de forma sistematizada. Impacto imediato e mensurável' },
      ],
      correta: 'd',
      explicacao: 'O combo é a estratégia mais eficaz para padaria tradicional. "Pão + Café + Doce = R$15" (preço individual: R$4 + R$6 + R$5 = R$15) não exige desconto — apenas empacotamento. Cliente percebe conveniência; padaria eleva ticket de R$9,79 para R$15 para quem adota o combo. Se 20% dos 8.580 clientes migrarem para o combo: 1.716 × (R$15 − R$9,79) = R$8.940/mês a mais de faturamento. Com MC% das bebidas (70%) e confeitaria (60%) muito maior que pão (28%), o combo eleva também a MC% geral — lucro cresce mais que proporcionalmente.',
    },
    {
      id: 'c4',
      
      contexto: 'Se Sebastiana investir R$8.000 para montar uma pequena área de café especial (máquina expresso + treinamento), e com isso aumentar as vendas de bebidas de R$18.000 para R$26.000/mês, qual o impacto no lucro?',
      opcoes: [
        { id: 'a', texto: 'Bebidas sobem R$8.000, com MC% 70% → MC extra = R$5.600/mês. Payback: R$8.000 ÷ R$5.600 = 1,4 meses. ROI = 70%/mês. Melhor investimento disponível' },
        { id: 'b', texto: 'Bebidas sobem R$8.000, lucro extra R$3.200/mês. Payback 2,5 meses. Bom mas não excepcional' },
        { id: 'c', texto: 'Impacto R$2.400/mês de lucro extra. Payback de 3,3 meses — razoável' },
        { id: 'd', texto: 'O investimento não se justifica — máquina expresso exige barista especializado que aumentará o custo fixo' },
      ],
      correta: 'a',
      explicacao: 'Bebidas têm MC% de 70% — a maior de todas as categorias. Aumento de R$8.000 em receita de bebidas → MC extra = R$8.000 × 70% = R$5.600/mês. Payback do investimento = R$8.000 ÷ R$5.600 = 1,43 meses. Em 12 meses, lucro extra acumulado = R$5.600 × 12 = R$67.200 sobre investimento de R$8.000. ROI anual = 740%. Isso pressupõe que não há aumento de custo fixo significativo (treinamento do próprio atendente existente). Este é o tipo de investimento que um bom analista de indicadores identifica: onde a MC% é mais alta, o ROI do investimento também é mais alto.',
    },
    {
      id: 'c5',
      
      contexto: 'Diagnóstico final: qual a principal recomendação estratégica para Sebastiana, considerando todos os KPIs analisados?',
      opcoes: [
        { id: 'a', texto: 'Reduzir preço do pão para atrair mais clientes e elevar o faturamento pela quantidade' },
        { id: 'b', texto: 'Rebalancear o mix: reduzir o espaço físico e mental dedicado ao pão; ampliar confeitaria e bebidas especiais. Manter o pão como "isca" mas monetizar o cliente nas categorias de MC% alta' },
        { id: 'c', texto: 'Manter o mix atual — 18 anos de tradição não devem ser alterados' },
        { id: 'd', texto: 'Abrir nova unidade focada exclusivamente em confeitaria, abandonando o pão' },
      ],
      correta: 'b',
      explicacao: 'O diagnóstico dos KPIs é claro: Pão = 49% do faturamento, MC% 28%. Bebidas + Confeitaria + Salgados = 51% do faturamento, MC% média de 63%. Se Sebastiana invertesse a proporção (50% das receitas em itens de alta margem), a MC% geral subiria de 45,5% para ~55% — o lucro aumentaria de R$15.260 para ~R$23.200/mês (+52%) sem mudar o faturamento. A recomendação: (1) Investir na área de café expresso; (2) Criar seção de confeitaria premium visível; (3) Treinar equipe para combo e sugestão. O pão continua — porque traz os 8.580 clientes que depois compram o que tem margem.',
    },
  ],
};

const DICAS = {
  c1: {
    titulo: `MC% por Categoria de Produto`,
    formula: `MC% categoria = (Receita - CV) / Receita x 100
Peso no faturamento = Receita categoria / Total
MC ponderada = Soma(MC% cat x Peso cat)
Problema: alto peso + baixa MC%`,
    raciocinio: `Calcule a MC% de cada categoria. Multiplique pelo peso no faturamento. A categoria com maior peso e menor MC% e a prioridade de melhoria.`,
  },
  c2: {
    titulo: `PE e Margem de Seguranca do Mix`,
    formula: `PE = CF / MC% ponderada
Margem de Seguranca = (Fat - PE) / Fat x 100
Lucro = Fat x MC% ponderada - CF
Dados: CF = R$23.000, Fat = R$84.000
Calcule MC% ponderada primeiro`,
    raciocinio: `Use a MC% ponderada calculada na Q1 para encontrar o PE. Se a margem de seguranca for alta, a padaria tem folga.`,
  },
  c3: {
    titulo: `Ticket Medio e Estrategia de Combo`,
    formula: `Ticket atual = Faturamento / Clientes
Impacto de combo:
Clientes que aderem x Ticket extra = Receita extra
MC extra = Receita extra x MC% combo
Ideal: combo com itens de alta MC%`,
    raciocinio: `O combo deve incluir itens de alta margem como ancora. Calcule quantos clientes precisariam adotar o combo para atingir o ticket medio desejado.`,
  },
  c4: {
    titulo: `ROI de Investimento em Area de Cafe`,
    formula: `ROI mensal = Lucro extra / Investimento x 100
Payback = Investimento / Lucro extra mensal
Lucro extra = Receita extra x MC% bebidas
MC% bebidas (cafe): geralmente 60-70%`,
    raciocinio: `Invista onde a MC% e mais alta. Bebidas tem MC% muito superior ao pao - cada R$ investido em area de cafe gera mais lucro que o mesmo R$ em producao de pao.`,
  },
  c5: {
    titulo: `Estrategia de Rebalanceamento de Mix`,
    formula: `Cenario atual: MC ponderada = X%
Cenario meta: aumentar peso das categorias de alta MC%
Ganho de MC = (MC% nova - MC% atual) x Faturamento
Meta: mover 10-15% do faturamento de pao para bebidas`,
    raciocinio: `Nao e necessario vender menos pao - e vender mais dos produtos de alta margem. O pao continua como isca; o cafe e a confeitaria pagam as contas.`,
  },
};

export default function PadariaConsultoriaIndicadores() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  const catCalc = dossie.categorias.map(c => ({
    ...c,
    mc: c.fat - c.cv,
    mcPct: ((c.fat - c.cv) / c.fat * 100),
    ticket: c.fat / c.clientes,
    fatPct: c.fat / 84000 * 100,
  }));
  const mcTotal = catCalc.reduce((s, c) => s + c.mc, 0);
  const mcPctTotal = mcTotal / 84000 * 100;
  const lucro = mcTotal - dossie.custoFixo;
  const pe = dossie.custoFixo / (mcPctTotal / 100);

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/indicadores')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><BarChart4 size={22} color={COR} /> Consultoria: Indicadores Financeiros</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(234,179,8,0.08) 100%)', borderColor: 'rgba(139,92,246,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Indicadores Financeiros
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>O Pão que Atrai vs o Café que Paga o Aluguel</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Sebastiana fatura R$84.000 e lucra R$15.260. Com o mesmo faturamento, poderia lucrar R$23.200 — se soubesse <strong style={{ color: 'var(--text-main)' }}>o que a MC% por categoria revela</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '📊 Mix de Categorias' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(139,92,246,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c4b5fd' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Indicadores de Mix e Rentabilidade — Padaria</h2>
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
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Mix de Categorias →</button>
          </div>
        </div>
      )}

      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: COR }}>📊 Análise de Mix — {dossie.empresa}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Categoria', 'Fat.', '% Fat.', 'Custo Var.', 'MC (R$)', 'MC%', 'Clientes', 'Ticket', 'Diagnóstico'].map((h, i) => (
                      <th key={i} style={{ padding: '0.6rem 0.75rem', textAlign: i > 1 ? 'right' : 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catCalc.map((c, i) => {
                    const sem = semaforo(c.mcPct, [35, 55]);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                        <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: c.cor }}>{c.cat}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{formatBRL(c.fat)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{pct(c.fatPct)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#ef4444' }}>{formatBRL(c.cv)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>{formatBRL(c.mc)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 700, color: sem.cor }}>{pct(c.mcPct)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{c.clientes.toLocaleString()}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{formatBRL(c.ticket)}</td>
                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontSize: '0.8rem', color: sem.cor }}>{sem.label}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 700 }}>
                    <td style={{ padding: '0.75rem' }}>TOTAL</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatBRL(84000)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>100%</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444' }}>{formatBRL(84000 - mcTotal)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#22c55e' }}>{formatBRL(mcTotal)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#22c55e' }}>{pct(mcPctTotal)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{dossie.totalClientes.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatBRL(84000 / dossie.totalClientes)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { l: 'MC Total', v: formatBRL(mcTotal), c: '#22c55e' },
                { l: 'MC% Ponderada', v: pct(mcPctTotal), c: '#22c55e' },
                { l: 'Lucro Líquido', v: formatBRL(lucro), c: lucro > 0 ? '#22c55e' : '#ef4444' },
                { l: 'Ponto de Equilíbrio', v: formatBRL(pe), c: '#6366f1' },
                { l: 'Margem de Segurança', v: pct((84000 - pe) / 84000 * 100), c: '#22c55e' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {catCalc.map((c, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${c.cor}` }}>
                  <div style={{ fontWeight: 700, color: c.cor, marginBottom: '0.5rem' }}>{c.cat}</div>
                  {[
                    { l: 'Faturamento', v: formatBRL(c.fat) },
                    { l: 'Custo Variável', v: formatBRL(c.cv) },
                    { l: 'MC (R$)', v: formatBRL(c.mc) },
                    { l: 'MC%', v: pct(c.mcPct) },
                    { l: 'Clientes/mês', v: c.clientes.toLocaleString() },
                    { l: 'Ticket médio', v: formatBRL(c.ticket) },
                  ].map((r, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                      <span style={{ fontWeight: 600, color: r.l === 'MC%' ? semaforo(c.mcPct, [35, 55]).cor : 'var(--text-main)' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[
                { l: 'Custo Fixo', v: formatBRL(dossie.custoFixo), c: '#ef4444' },
                { l: 'MC Total', v: formatBRL(mcTotal), c: '#22c55e' },
                { l: 'Lucro', v: formatBRL(lucro), c: '#22c55e' },
                { l: 'Ticket geral', v: formatBRL(84000 / dossie.totalClientes), c: '#6366f1' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}`, flex: 1, minWidth: '120px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> compare a MC% de cada categoria com o peso delas no faturamento. O produto com maior peso e menor MC% é sempre o foco de melhoria prioritária.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Sebastiana vai rebalancear o mix e lucrar muito mais!' : nota >= 80 ? 'Muito bom! Revise os cálculos de MC% por categoria.' : 'Releia a análise de mix — o pão e o café contam histórias opostas.'}
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
