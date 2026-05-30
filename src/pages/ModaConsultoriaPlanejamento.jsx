import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase } from 'lucide-react';

const COR = '#a855f7';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const blocosTeoría = [
  {
    titulo: '1. Curva ABC: Nem Toda Peça Vale Igual', cor: '#f59e0b', emoji: '📊',
    def: 'A Curva ABC classifica produtos pelo impacto no faturamento: A (20% dos produtos = 80% da receita), B (30% = 15% da receita), C (50% = 5% da receita). No varejo de moda, básicos e best-sellers são "A". Tendências arriscadas são "C". O erro mais comum: gastar mais com C e estocar pouco de A.',
    formula: 'Classe A: concentrar 60-70% do orçamento de compras\nClasse B: 20-25% do orçamento\nClasse C: máximo 10-15% do orçamento',
    exemplos: ['Calça jeans básica = Classe A (vende todo dia)', 'Blusa floral da temporada = Classe C (risco de encalhe)', 'Vestido casual = Classe B (giro médio)', 'Regra: nunca falte A, compre C com cautela'],
    alerta: 'Lojistas iniciantes fazem o contrário: enchem a vitrine de tendências (C) porque "chama atenção" e ficam sem estoque do básico (A) que paga as contas.',
  },
  {
    titulo: '2. Open-to-Buy: Orçamento de Compras Controlado', cor: '#6366f1', emoji: '🛒',
    def: 'Open-to-Buy (OTB) é o orçamento mensal disponível para compras, calculado com base na previsão de vendas e no estoque atual. Impede o comprador de gastar mais do que o negócio pode absorver — o principal motivo de estoque excessivo.',
    formula: 'OTB = Estoque final desejado + Vendas previstas − Estoque inicial disponível',
    exemplos: ['Estoque atual: R$25.000', 'Vendas previstas mês: R$18.000 (CMV 60% = R$10.800)', 'Estoque final desejado: R$20.000', 'OTB = R$20.000 + R$10.800 − R$25.000 = R$5.800'],
    alerta: 'Sem OTB, o comprador vai ao Brás e gasta R$15.000 "porque estava bonito". Com OTB de R$5.800, só compra o necessário. Disciplina de compras é tão importante quanto habilidade de vender.',
  },
  {
    titulo: '3. Planejamento por Coleção: Básicos vs. Tendência', cor: '#22c55e', emoji: '🗓️',
    def: 'O orçamento de compras deve ser dividido entre básicos (baixo risco, giro constante) e tendências (alto risco, alto potencial de margem). A proporção ideal depende do perfil da loja, mas consultores recomendam 60-70% em básicos para lojas com menos de 3 anos.',
    formula: 'Risco de encalhe = % investido em tendência × taxa histórica de liquidação',
    exemplos: ['70% básicos + 30% tendência: risco controlado', 'Se 30% de tendência → 15% encalha → perda 4,5% do total', '100% tendência: em queda de moda → 40-50% em liquidação', 'Básico nunca liquida — apenas repõe quando esgota'],
    alerta: 'A margem de tendência parece maior porque o preço é mais alto. Mas depois da liquidação, a margem real pode ser menor que a do básico vendido pelo preço cheio.',
  },
  {
    titulo: '4. Sazonalidade e Planejamento de Coleção', cor: '#ec4899', emoji: '🌡️',
    def: 'Moda tem ciclos sazonais previsíveis: Verão (Out-Jan), Inverno (Abr-Jul), Carnaval, Dia das Mães, Natal. O planejamento de compras precisa antecipar 60-90 dias cada coleção — quando você precisa comprar inverno, ainda está vendendo verão.',
    formula: 'Data de compra = Data de início da estação − Lead time (60-90 dias)',
    exemplos: ['Inverno começa em Junho → comprar em Março-Abril', 'Natal começa em Novembro → comprar em Setembro', 'Comprar na última hora = preços maiores + menos opção', 'Estação anterior que não vendeu = liquidar em 60% antes da troca'],
    alerta: 'Quem compra na hora errada paga mais caro e recebe tarde. A loja que planeja com 3 meses de antecedência tem mais poder de negociação e garante os lançamentos mais vendáveis.',
  },
];

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Confecção Feminina', emoji: '🧵',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Confecção Bela lança 2 coleções por ano. O planejamento financeiro precisa considerar o ciclo de 6 meses entre criação, produção e venda.',
    planejado: { receita: 95000, producao: 57000, custoFixo: 18000 },
    real: { receita: 102000, producao: 63000, custoFixo: 19500 },
    analise: 'Receita +7,4% (coleção de verão bem aceita). Produção +10,5% (aumentou lotes por demanda). CF +8,3% (horas extras). Margem planejada: 21,1%. Margem real: 19,1%. O crescimento foi real mas a produção em excesso criou estoque além do necessário — parte ficará para a próxima coleção.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Loja Multimarca', emoji: '🛍️',
    cor: '#ec4899', corBg: 'rgba(236,72,153,0.08)',
    descricao: 'A Loja Estilo Total compra de 8 fornecedores diferentes. A gestão de múltiplos fornecedores exige planejamento financeiro rigoroso por coleção.',
    planejado: { receita: 32000, compras: 18560, custoFixo: 7200 },
    real: { receita: 27400, compras: 17800, custoFixo: 7200 },
    analise: 'Receita −14,4% (tendência escolhida não performou — público rejeitou o estilo). Compras levemente abaixo (gestora teve cautela com um fornecedor novo). CF fixo. Margem caiu de 19,5% para 8,8%. A escolha de tendências erradas é o maior risco do varejo de moda. Curva ABC prévia teria evitado o investimento excessivo em tendência não testada.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Personal Shopper', emoji: '✨',
    cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A consultora Carol faz personal shopping para executivas. O planejamento considera ciclos de atualização de guarda-roupa (2x ao ano) e agenda de novos clientes.',
    planejado: { receita: 18000, despesas: 5400, custoFixo: 4500 },
    real: { receita: 21600, despesas: 6800, custoFixo: 4500 },
    analise: 'Receita +20% (indicações geraram 3 novos clientes). Despesas +25,9% (acompanhou mais clientes ao Brás = mais transporte e tempo). CF fixo. Margem real: 47,7% vs planejada: 44,4%. Excelente desempenho — mas o aumento de despesas variáveis alerta para a necessidade de rever o preço quando há deslocamento intenso.',
  },
];

const dossie = {
  empresa: 'Boutique Giovanna',
  segmento: 'Loja de moda jovem feminina — cidade de médio porte',
  contexto: 'Giovanna tem a loja há 2 anos. Compra no Brás a cada 45 dias, faturamento crescendo mas sempre "no sufoco" no caixa. Quer entender por que cresce mas não sobra dinheiro, e se vale a pena abrir uma segunda unidade.',
  dados: {
    faturamentoMensal: 22000,
    custoFixoMensal: 6800,
    cmvPerc: 58,
    estoqueAtual: 38000,
    estoqueIdeal: 28000,
    giroMedio: 90,
    percBasicos: 35,
    percTendencia: 65,
  },
  historico: [
    { mes: 'Jan', receita: 18200, compras: 14800, lucro: 810 },
    { mes: 'Fev', receita: 19400, compras: 13200, lucro: 2230 },
    { mes: 'Mar', receita: 20100, compras: 16900, lucro: 840 },
    { mes: 'Abr', receita: 21500, compras: 12400, lucro: 4340 },
    { mes: 'Mai', receita: 22000, compras: 18600, lucro: -360 },
    { mes: 'Jun', receita: 23400, compras: 11200, lucro: 6870 },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      
      contexto: 'Giovanna investe 65% do orçamento em tendências e 35% em básicos. Com faturamento de R$22.000, CMV 58% e taxa histórica de liquidação de 25% das tendências, qual o impacto real na margem?',
      opcoes: [
        { id: 'a', texto: 'Impacto irrelevante — liquidação é normal e já está precificada no markup' },
        { id: 'b', texto: 'Perda de R$2.080/mês em liquidação: 65% × R$12.760 CMV × 25% encalhe = R$2.080. Margem real cai ~9,4 pontos percentuais' },
        { id: 'c', texto: 'Perda de R$800/mês — valor pequeno comparado ao faturamento' },
        { id: 'd', texto: 'Perda de R$5.500/mês — toda tendência que encalha vira prejuízo total' },
      ],
      correta: 'b',
      explicacao: 'CMV total = R$22.000 × 58% = R$12.760. Parcela de tendência: 65% × R$12.760 = R$8.294. Liquidação: 25% × R$8.294 = R$2.073 de custo que não gera receita plena. Ajustando: margem planejada seria 42%, mas a liquidação retira ~9,4 pontos → margem real ~32,6%. Reduzir tendência de 65% para 40% e aumentar básicos para 60% recuperaria ~6 pontos de margem — sem mudar nenhuma venda.',
    },
    {
      id: 'c2',
      
      contexto: 'Analisando o histórico, Maio foi o único mês negativo (−R$360) apesar de faturamento crescendo. Qual a causa mais provável?',
      opcoes: [
        { id: 'a', texto: 'Queda de vendas em Maio — o mês foi fraco' },
        { id: 'b', texto: 'Compras de R$18.600 em Maio (85% da receita) geraram caixa negativo — típico de quem comprou a coleção de inverno toda de uma vez' },
        { id: 'c', texto: 'Custo fixo aumentou em Maio — provavelmente reajuste de aluguel' },
        { id: 'd', texto: 'Desvio pontual sem causa clara — acontece em qualquer negócio' },
      ],
      correta: 'b',
      explicacao: 'Em Maio, Giovanna comprou R$18.600 — 85% do faturamento de R$22.000 — provavelmente a coleção completa de inverno de uma vez. O CMV realizado (R$12.760) é diferente das compras (R$18.600): as compras adicionaram R$5.840 ao estoque sem gerar receita ainda. Isso explica o "sufoço no caixa" sem prejuízo real. A solução é escalonar as compras: comprar 50% da coleção em Março e repor os mais vendidos em Maio — o Open-to-Buy evitaria esse pico.',
    },
    {
      id: 'c3',
      
      contexto: 'Giovanna tem R$38.000 em estoque mas o ideal seria R$28.000 (giro de 90 dias com faturamento atual). O que isso significa e como resolver?',
      opcoes: [
        { id: 'a', texto: 'R$10.000 em excesso de estoque. Não é urgente — o produto não vence' },
        { id: 'b', texto: 'R$10.000 em capital imobilizado desnecessariamente. Resolver com liquidação estratégica de 20-30% das peças mais antigas, priorizando as C da curva ABC' },
        { id: 'c', texto: 'R$10.000 em excesso. Solução: parar de comprar por 3 meses até normalizar' },
        { id: 'd', texto: 'R$10.000 não é excesso — é reserva para os meses de baixo faturamento' },
      ],
      correta: 'b',
      explicacao: 'R$10.000 parados em estoque além do necessário é o equivalente a ter R$10.000 "congelados" sem rendimento. O correto é liquidar estrategicamente as peças mais antigas (geralmente tendências de estações passadas) com 20-30% de desconto. Isso gera caixa imediato e libera capital para comprar básicos que giram mais rápido. Parar de comprar (opção C) é perigoso — a loja ficaria sem novidade e perderia clientes.',
    },
    {
      id: 'c4',
      
      contexto: 'Olhando o histórico, qual o padrão de compras de Giovanna e como ele explica o "sufoço no caixa" que ela sente?',
      opcoes: [
        { id: 'a', texto: 'Ela compra sempre no mesmo valor — não há padrão problemático' },
        { id: 'b', texto: 'Compras concentradas em alguns meses (Jan R$14.800, Mar R$16.900, Mai R$18.600) criam picos de saída de caixa não alinhados com a entrada de receita' },
        { id: 'c', texto: 'O problema é que ela não vende o suficiente — precisa de mais marketing' },
        { id: 'd', texto: 'As compras são baixas demais — está perdendo oportunidades de estoque' },
      ],
      correta: 'b',
      explicacao: 'O padrão claro: a cada 45 dias ela vai ao Brás e gasta entre R$11.200 e R$18.600. Nos meses de compra alta (Jan, Mar, Mai), o lucro cai drasticamente ou fica negativo. Nos meses sem compra grande (Fev, Abr, Jun), o lucro dispara. O negócio é saudável — o problema é o ritmo concentrado de compras. Open-to-Buy mensalizado resolveria: em vez de R$18.600 em Maio, compraria R$7.500 em Abril e R$7.500 em Maio, suavizando o fluxo de caixa.',
    },
    {
      id: 'c5',
      
      contexto: 'Giovanna quer abrir uma segunda unidade com investimento de R$45.000. Com base no diagnóstico completo, qual a recomendação do consultor?',
      opcoes: [
        { id: 'a', texto: 'Abrir imediatamente — faturamento crescendo e segunda loja vai dobrar a receita' },
        { id: 'b', texto: 'Não abrir — o negócio ainda tem problemas de gestão que serão amplificados na segunda loja' },
        { id: 'c', texto: 'Plano 4 etapas: (1) Liquidar excesso de estoque (→R$7.000 caixa); (2) Implementar OTB e Curva ABC por 3 meses; (3) Confirmar margem real acima de 35% por 2 meses consecutivos; (4) Aí sim, planejar a segunda unidade' },
        { id: 'd', texto: 'Abrir em 6 meses independentemente dos indicadores — o mercado não espera' },
      ],
      correta: 'c',
      explicacao: 'Esta é a recomendação mais responsável. Abrir uma segunda loja com gestão de estoque desordenada e curva ABC invertida duplica os problemas, não as oportunidades. O consultor recomenda resolver primeiro: (1) Liquidar o excesso de R$10.000 (com desconto de 30% gera ~R$7.000 em caixa); (2) OTB mensal evita picos de compra; (3) Curva ABC melhora a margem em 6-9 pontos; (4) Só quando a margem real estiver consistente acima de 35% o negócio tem base sólida para crescer. Com uma unidade bem gerida gerando margem de 35%+, a segunda unidade se financiaria parcialmente com o próprio fluxo da primeira.',
    },
  ],
};

const DICAS = {
  c1: {
    titulo: `Mix de Produtos e Margem Ponderada`,
    formula: `MC% ponderada = Soma(MC% categoria x % faturamento)
Ex: Tendencias (65% fat, MC 38%) + Basicos (35% fat, MC 52%)
MC ponderada = 0.65x38 + 0.35x52 = 42.9%`,
    raciocinio: `A margem do negocio depende do mix. Se vender mais dos produtos de baixa margem, a MC total cai mesmo que o faturamento suba.`,
  },
  c2: {
    titulo: `Diagnostico de Mes Negativo`,
    formula: `Lucro = MC - CF
Se Lucro menor que 0, MC nao cobriu o CF
Diagnostico:
- MC% caiu? (preco ou CMV pioraram)
- CF subiu? (novos custos fixos)
- Volume caiu? (menos vendas)`,
    raciocinio: `Para diagnosticar um mes ruim, compare os tres elementos: faturamento, MC% e custo fixo. Qual mudou mais em relacao ao mes anterior? Esse e o culpado principal.`,
  },
  c3: {
    titulo: `Giro de Estoque e PME`,
    formula: `Giro = CMV / Estoque medio
PME = 30 / Giro (dias)
Estoque ideal = Faturamento x MC% x 90 dias / 30
Capital imobilizado extra = Estoque atual - Estoque ideal`,
    raciocinio: `Calcule quanto do estoque excede o ideal. Esse excesso e capital imobilizado sem necessidade. Reduzir o estoque libera caixa sem reduzir as vendas.`,
  },
  c4: {
    titulo: `Padrao de Compras e Fluxo de Caixa`,
    formula: `Fluxo de caixa = Receita - Pagamentos no periodo
Compras concentradas -> saidas concentradas -> sufoco
Compras distribuidas -> saidas regulares -> estabilidade`,
    raciocinio: `Se as compras sao em grandes lotes irregulares mas as vendas sao constantes, o caixa vai oscilar muito. A solucao e distribuir as compras conforme a demanda real.`,
  },
  c5: {
    titulo: `Pre-requisitos para Segunda Unidade`,
    formula: `Checklist de expansao:
- Lucro consistente ha 6+ meses
- Reserva = 6 meses de CF das 2 unidades
- Processos documentados
- Demanda comprovada na nova localizacao
- Payback menor que 24 meses`,
    raciocinio: `Expansao prematura e a causa mais comum de falencia em moda. A segunda unidade deve ser aberta quando a primeira estiver solida, com reserva e processos maduros.`,
  },
};

export default function ModaConsultoriaPlanejamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const lucroP = ex.planejado.receita - (ex.planejado.producao ?? ex.planejado.compras ?? ex.planejado.despesas) - ex.planejado.custoFixo;
  const lucroR = ex.real.receita - (ex.real.producao ?? ex.real.compras ?? ex.real.despesas) - ex.real.custoFixo;
  const dR = ((ex.real.receita - ex.planejado.receita) / ex.planejado.receita * 100).toFixed(1);
  const dL = ((lucroR - lucroP) / Math.abs(lucroP) * 100).toFixed(1);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/moda/planejamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><TrendingUp size={22} color={COR} /> Consultoria: Planejamento Financeiro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.08) 100%)', borderColor: 'rgba(168,85,247,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Planejamento Financeiro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Curva ABC, Open-to-Buy e a Decisão da Segunda Loja</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Na moda, crescer o faturamento sem controle de compras é <strong style={{ color: 'var(--text-main)' }}>trabalhar para o estoque, não para o caixa</strong>. No desafio, você vai diagnosticar uma loja que cresce mas não sobra dinheiro.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(168,85,247,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c084fc' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Planejamento no Varejo de Moda</h2>
            {blocosTeoría.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: bloco.cor, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{bloco.formula}</div>
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
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos Práticos →</button>
          </div>
        </div>
      )}

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
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>📊 Planejado vs. Real — {ex.subtipo}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Item', 'Planejado', 'Real', 'Desvio'].map((h, i) => (
                      <th key={i} style={{ padding: '0.75rem 1rem', textAlign: i === 0 ? 'left' : 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'Receita', plan: ex.planejado.receita, real: ex.real.receita, desv: dR },
                    { item: 'Custo Variável/Produção', plan: ex.planejado.producao ?? ex.planejado.compras ?? ex.planejado.despesas, real: ex.real.producao ?? ex.real.compras ?? ex.real.despesas, desv: (((ex.real.producao ?? ex.real.compras ?? ex.real.despesas) - (ex.planejado.producao ?? ex.planejado.compras ?? ex.planejado.despesas)) / (ex.planejado.producao ?? ex.planejado.compras ?? ex.planejado.despesas) * 100).toFixed(1) },
                    { item: 'Custo Fixo', plan: ex.planejado.custoFixo, real: ex.real.custoFixo, desv: ((ex.real.custoFixo - ex.planejado.custoFixo) / ex.planejado.custoFixo * 100).toFixed(1) },
                    { item: 'Lucro', plan: lucroP, real: lucroR, desv: dL },
                  ].map((row, i) => {
                    const dv = parseFloat(row.desv);
                    const isCusto = row.item !== 'Receita' && row.item !== 'Lucro';
                    const cor = row.item === 'Lucro' ? (dv >= 0 ? '#22c55e' : '#ef4444') : isCusto ? (dv > 5 ? '#ef4444' : '#22c55e') : (dv >= 0 ? '#22c55e' : '#ef4444');
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontWeight: row.item === 'Lucro' ? 700 : 400 }}>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.item}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{formatBRL(row.plan)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{formatBRL(row.real)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: cor, fontWeight: 600 }}>{dv > 0 ? '+' : ''}{row.desv}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '3px solid #facc15' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.25rem' }}>Diagnóstico do consultor:</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ex.analise}</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          {/* Dossiê */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(168,85,247,0.06)', borderColor: 'rgba(168,85,247,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(168,85,247,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Briefcase size={24} color={COR} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Fat. médio/mês', valor: formatBRL(dossie.dados.faturamentoMensal), cor: '#22c55e' },
                { label: 'Custo Fixo/mês', valor: formatBRL(dossie.dados.custoFixoMensal), cor: '#ef4444' },
                { label: 'CMV médio', valor: `${dossie.dados.cmvPerc}%`, cor: '#f59e0b' },
                { label: 'Estoque atual', valor: formatBRL(dossie.dados.estoqueAtual), cor: '#ef4444' },
                { label: 'Estoque ideal', valor: formatBRL(dossie.dados.estoqueIdeal), cor: '#22c55e' },
                { label: 'Mix tendência', valor: `${dossie.dados.percTendencia}%`, cor: '#ec4899' },
                { label: 'Mix básicos', valor: `${dossie.dados.percBasicos}%`, cor: '#6366f1' },
                { label: 'Giro médio', valor: `${dossie.dados.giroMedio} dias`, cor: COR },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.cor}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.cor }}>{k.valor}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📅 Histórico 6 meses (Receita | Compras | Lucro)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
              {dossie.historico.map((m, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', borderTop: m.lucro < 0 ? '2px solid #ef4444' : m.lucro > 4000 ? '2px solid #22c55e' : '2px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{m.mes}</div>
                  <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>{formatBRL(m.receita)}</div>
                  <div style={{ fontSize: '0.65rem', color: '#f59e0b' }}>compra: {formatBRL(m.compras)}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: m.lucro < 0 ? '#ef4444' : m.lucro > 4000 ? '#22c55e' : COR, marginTop: '0.2rem' }}>{formatBRL(m.lucro)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#22c55e' }}>■ Lucro alto</span>
              <span style={{ color: COR }}>■ Lucro médio</span>
              <span style={{ color: '#ef4444' }}>■ Prejuízo</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pergunta da Consultoria</div>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                  </div>
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
<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(168,85,247,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#c084fc' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#c084fc' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
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
                  <strong style={{ color: '#facc15' }}>Dica do consultor:</strong> compare os meses de compras altas com os lucros dos mesmos meses. O histórico conta a história de um negócio que tem caixa e gestão de estoque como principais gargalos — não as vendas.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : nota >= 60 ? '📊' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Você diagnosticou a Boutique Giovanna como um consultor sênior!' : nota >= 80 ? 'Muito bom! Revise os raciocínios dos itens errados.' : 'Releia o dossiê com atenção — os dados do histórico são a chave.'}
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
