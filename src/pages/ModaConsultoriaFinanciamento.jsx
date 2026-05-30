import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Landmark, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase } from 'lucide-react';

const COR = '#f43f5e';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const formatBRL2 = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function calcPrice(pv, taxa, n) {
  if (!pv || !n) return { pmt: 0, total: 0, juros: 0, mult: 0 };
  const i = taxa / 100;
  const pmt = pv * (i / (1 - Math.pow(1 + i, -n)));
  const total = pmt * n;
  return { pmt, total, juros: total - pv, mult: total / pv };
}

function calcSAC(pv, taxa, n) {
  if (!pv || !n) return { pmtInicial: 0, pmtFinal: 0, total: 0, juros: 0, amort: 0 };
  const i = taxa / 100;
  const amort = pv / n;
  const pmtInicial = amort + pv * i;
  const pmtFinal = amort + amort * i;
  const total = ((pmtInicial + pmtFinal) / 2) * n;
  return { pmtInicial, pmtFinal, total, juros: total - pv, amort };
}

const blocos = [
  {
    titulo: '1. Crédito para Reforma vs. Crédito para Estoque', cor: '#ec4899', emoji: '🏗️',
    def: 'Na moda, existem dois tipos principais de crédito: para reforma/estrutura (longo prazo, ativo fixo) e para estoque (capital de giro, curto prazo). Misturar os dois é um erro grave — usar crédito de giro de curto prazo para pagar reforma de loja pode gerar crises de caixa em 90 dias.',
    formula: 'Reforma/Ativo fixo: financiar em 36-60 meses\nEstoque/Capital de giro: financiar em 12-24 meses\nNunca usar cartão de crédito para reforma',
    exemplos: ['Reforma R$50.000: financiar em 48x a 2% → parcela R$1.469', 'Comprar coleção R$20.000: capital de giro 12x a 1,4% → parcela R$1.810', 'Usar cheque especial para reforma → desastre em 30 dias', 'Regra: o prazo do crédito deve acompanhar o prazo de retorno do investimento'],
    alerta: 'Lojista que usa empréstimo de capital de giro (90 dias) para pagar reforma que retorna em 24 meses está criando uma crise de caixa programada. O mismatch de prazo é a causa número 1 de falência no varejo.',
  },
  {
    titulo: '2. ROI de Reforma: Quando Vale a Pena?', cor: '#f59e0b', emoji: '📐',
    def: 'Reformar a loja é um investimento — mas precisa gerar retorno mensurável. Uma reforma bem feita pode aumentar o ticket médio e a conversão de visitantes em compradores. Mas quanto aumenta? Sem meta clara, a reforma é gasto, não investimento.',
    formula: 'ROI reforma = (Aumento de receita mensal × meses) − Custo total reforma\nPayback = Custo total (com juros) ÷ Aumento mensal de receita',
    exemplos: ['Reforma R$45.000 (total com juros R$62.000)', 'Aumenta ticket médio de R$110 para R$135 (+23%)', 'Com 200 vendas/mês: R$5.000 a mais por mês', 'Payback: R$62.000 ÷ R$5.000 = 12,4 meses → ✅ Excelente'],
    alerta: 'Reforma sem projeção de aumento de receita é decoração cara. O consultor sempre pergunta: "Quanto você espera vender a mais por mês após a reforma?" Se a resposta for "não sei", a reforma não está pronta para acontecer.',
  },
  {
    titulo: '3. SAC vs Price em Taxas Altas: A Diferença Explode', cor: '#6366f1', emoji: '💥',
    def: 'Em taxas acima de 2% a.m. (comuns em bancos privados para moda e varejo), a diferença entre SAC e Price cresce exponencialmente. Em 48 meses a 3%, o SAC economiza R$8.000-12.000 vs Price em empréstimos de R$50.000. Essa diferença compra meia coleção.',
    formula: 'Quanto maior a taxa e o prazo, maior a vantagem do SAC:\nEconomia SAC = Total Price − Total SAC',
    exemplos: ['R$50.000 a 3% em 48x: Price total R$87.552', 'SAC total: R$76.890 → Economia R$10.662', 'R$50.000 a 1,5% em 48x: Economy apenas R$3.800', 'A 3%: diferença 2,8x maior que a 1,5% — taxa amplifica tudo'],
    alerta: 'Banco privado raramente oferece SAC espontaneamente para crédito de varejo. É preciso solicitar explicitamente. Se o gerente disser "não temos SAC", pesquise outro banco — todos os bancos são obrigados a oferecer.',
  },
  {
    titulo: '4. Antecipação de Recebíveis: Crédito sem Empréstimo', cor: '#22c55e', emoji: '⚡',
    def: 'Loja de moda que vende no cartão de crédito tem uma forma de crédito sem pagar juros de empréstimo: antecipar os recebíveis. Em vez de esperar 28-30 dias para receber, paga uma taxa de 1,5-2,5% e recebe hoje. Para capital de giro de curto prazo, pode ser mais barato que empréstimo.',
    formula: 'Custo antecipação = Valor × taxa antecipação\nEquivalente anual = (1 + taxa mensal)^12 − 1',
    exemplos: ['Recebíveis R$30.000 em 30 dias, taxa 2%: custo R$600', 'Equivale a 26,8% a.a. — ainda assim pode ser melhor que o cheque especial', 'Comparar com: custo do empréstimo mensal equivalente', 'Ideal para: cobrir compra de coleção antes do recebimento das vendas'],
    alerta: 'Antecipação é ferramenta de curto prazo, não de longo prazo. Usar antecipação de forma crônica para cobrir déficit estrutural é sinal de que o negócio tem problema de planejamento financeiro, não de crédito.',
  },
];

const exemplos = [
  {
    id: 'reforma', tipo: 'Reforma Comercial', subtipo: 'Loja no Shopping', emoji: '🏪',
    cor: '#ec4899', corBg: 'rgba(236,72,153,0.08)',
    pv: 55000, taxa: 2.2, n: 48,
    descricao: 'A Loja Donna quer reformar o ponto no shopping. Banco oferece crédito a 2,2% a.m. em 48 meses. Reforma inclui nova vitrine, iluminação e provador ampliado.',
    receitaExtra: 5800,
    obs: 'Reforma em shopping costuma ter ROI mais alto — fluxo de pessoas pré-existente. Negociar com o shopping fundo de reforma do próprio contrato de aluguel pode reduzir o crédito necessário.',
  },
  {
    id: 'estoque', tipo: 'Capital de Giro', subtipo: 'Compra de Coleção', emoji: '👗',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    pv: 22000, taxa: 1.6, n: 18,
    descricao: 'A Boutique Lis não tem caixa para a coleção de inverno. Usa Pronampe a 1,6% a.m. em 18 meses para antecipar as compras no Brás.',
    receitaExtra: 3200,
    obs: 'Crédito para estoque precisa ter prazo menor que o giro do estoque. Se o estoque gira em 90 dias (PME), financiar em 18 meses é conservador e seguro.',
  },
  {
    id: 'antecipacao', tipo: 'Antecipação de Recebíveis', subtipo: 'Fluxo de Caixa', emoji: '⚡',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    pv: 35000, taxa: 1.9, n: 1,
    descricao: 'A loja tem R$35.000 em recebíveis de cartão para os próximos 30 dias. Antecipa pagando 1,9% para receber agora e comprar a coleção à vista com desconto de 5% no atacado.',
    receitaExtra: 1750,
    obs: 'Desconto de 5% no atacado (R$1.750 em R$35.000 de compras) supera o custo da antecipação (R$665). ROI positivo de R$1.085 — vale a pena antecipar.',
  },
];

const dossie = {
  empresa: 'Boutique Renata',
  segmento: 'Loja de moda feminina — rua comercial — faturamento R$ 31.000/mês',
  contexto: 'Renata tem a loja há 5 anos, fatura R$31.000/mês. A loja está com visual desatualizado. Um arquiteto orçou a reforma em R$48.000 (nova fachada, vitrine LED, espelhos e provadores). Ao mesmo tempo, veio uma oportunidade: o lojista ao lado está deixando o ponto — dobrar o espaço custaria mais R$30.000 de obras. Renata não sabe se reforma a atual ou aproveita para expandir. Você foi contratado como consultor.',
  dados: {
    faturamento: 31000,
    custoFixo: 8500,
    margemContribuicao: 40,
    custoReformaAtual: 48000,
    custoExpansao: 78000, // reforma + ponto novo
    aumentoReformaPerc: 18,
    aumentoExpansaoPerc: 55,
    receitaExtraReforma: 5580,
    receitaExtraExpansao: 17050,
    lucroExtraReforma: 2232,
    lucroExtraExpansao: 6820,
  },
  propostas: [
    { id: 'A', nome: 'Banco Digital — Reforma Simples', valor: 48000, tipo: 'Price', taxa: 3.4, n: 36, entrada: 0, cor: '#ef4444', obs: 'Rápido. Alta taxa pois é capital de giro.' },
    { id: 'B', nome: 'Pronampe via BB — Reforma Simples', valor: 48000, tipo: 'SAC', taxa: 1.55, n: 48, entrada: 0, cor: '#6366f1', obs: 'Baixa taxa. Limite Pronampe OK (R$372K/ano × 30% = R$111.600).' },
    { id: 'C', nome: 'Pronampe via BB — Expansão Completa', valor: 78000, tipo: 'SAC', taxa: 1.55, n: 60, entrada: 0, cor: '#22c55e', obs: 'Financia a oportunidade do espaço maior. Prazo maior absorve o valor.' },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      contexto: 'Proposta A: Banco digital R$48.000 em Price a 3,4% por 36 meses. Qual o custo total e como isso afeta a viabilidade da reforma simples?',
      opcoes: [
        { id: 'a', texto: 'Parcela R$1.973, total R$71.028. Juros de R$23.028 sobre reforma de R$48.000. Payback: R$71.028 ÷ R$2.232 lucro extra = 31,8 meses — dentro do prazo de 36 meses ✅' },
        { id: 'b', texto: 'Parcela R$1.600, total R$57.600 — custo aceitável para uma reforma comercial' },
        { id: 'c', texto: 'Parcela R$2.200, total R$79.200 — inviável, reforma não se paga' },
        { id: 'd', texto: 'Parcela R$1.400, total R$50.400 — quase o valor da reforma, ótimo negócio' },
      ],
      correta: 'a',
      explicacao: 'PMT = R$48.000 × [0,034 ÷ (1 − 1,034^−36)] = R$1.973/mês. Total = R$71.028. Juros = R$23.028 — 48% do valor reformado apenas em juros! O lucro extra estimado é R$2.232/mês (R$5.580 receita extra × 40% MC). Payback: R$71.028 ÷ R$2.232 = 31,8 meses — tecnicamente dentro do prazo de 36 meses, mas sem margem. Qualquer frustração na receita esperada torna o payback negativo. Não é a melhor opção, mas é viável se a Renata não tiver acesso ao Pronampe.',
    },
    {
      id: 'c2',
      contexto: 'Proposta B: Pronampe R$48.000 em SAC a 1,55% por 48 meses. Compare com a Proposta A: quanto Renata economiza e qual o payback?',
      opcoes: [
        { id: 'a', texto: 'Parcela inicial R$1.748, total ~R$60.384. Economia vs A: R$10.644. Payback: R$60.384 ÷ R$2.232 = 27 meses — 9 meses antes do vencimento ✅' },
        { id: 'b', texto: 'Parcela inicial R$2.100, total R$75.600. Mais caro que A por ser SAC' },
        { id: 'c', texto: 'Parcela fixa R$1.400, total R$67.200. Mesmo custo que A, só muda o sistema' },
        { id: 'd', texto: 'Parcela inicial R$1.200, total R$52.000. Quase sem juros — melhor opção absoluta' },
      ],
      correta: 'a',
      explicacao: 'SAC: amort = R$48.000 ÷ 48 = R$1.000/mês. Juros mês 1 = R$48.000 × 1,55% = R$744. Parcela inicial = R$1.744. Juros mês 48 = R$1.000 × 1,55% = R$15,5. Parcela final ≈ R$1.015. Total ≈ [(1.744+1.015)/2] × 48 ≈ R$66.216. Economia vs Proposta A: R$71.028 − R$66.216 = R$4.812. Payback: R$66.216 ÷ R$2.232 = 29,7 meses — 18 meses antes do vencimento. Muito mais confortável que a Proposta A.',
    },
    {
      id: 'c3',
      contexto: 'Proposta C: Pronampe R$78.000 (expansão completa) em SAC a 1,55% por 60 meses. O lucro extra estimado é R$6.820/mês. Vale a pena dobrar o espaço em vez de só reformar?',
      opcoes: [
        { id: 'a', texto: 'Parcela inicial ~R$2.511, total ~R$101.790. Payback: R$101.790 ÷ R$6.820 = 14,9 meses. Com 60 meses de prazo, payback em 25% do contrato → ✅ Muito superior à Proposta B' },
        { id: 'b', texto: 'Parcela inicial ~R$3.500, total R$126.000. Payback de 18,5 meses — bom, mas parcela muito alta para o caixa' },
        { id: 'c', texto: 'Parcela inicial ~R$2.000, total R$90.000. Payback 13,2 meses — a melhor opção numericamente' },
        { id: 'd', texto: 'Não é possível comparar — expansão tem risco de demanda muito maior que reforma simples' },
      ],
      correta: 'a',
      explicacao: 'SAC R$78.000: amort = R$78.000 ÷ 60 = R$1.300/mês. Juros mês 1 = R$78.000 × 1,55% = R$1.209. Parcela inicial = R$2.509. Juros mês 60 = R$1.300 × 1,55% = R$20. Total ≈ [(2.509+1.320)/2] × 60 ≈ R$114.870. Lucro extra R$6.820/mês. Payback: R$114.870 ÷ R$6.820 = 16,8 meses — em menos de 17 meses o investimento se paga, com 43 meses de lucro puro restantes. ROI superior à Proposta B.',
    },
    {
      id: 'c4',
      contexto: 'O maior risco da expansão (Proposta C) é a demanda não se confirmar. Se a receita extra for 40% menor que o esperado (R$10.230 em vez de R$17.050), o negócio continua viável?',
      opcoes: [
        { id: 'a', texto: 'Sim — lucro extra ainda seria R$4.092/mês. Payback sobe para 28 meses vs 60 de prazo. Ainda viável com boa margem de segurança' },
        { id: 'b', texto: 'Não — receita menor que o esperado torna o financiamento inviável imediatamente' },
        { id: 'c', texto: 'Depende — se a queda for temporária (adaptação do mercado), aguardar 3 meses e reavaliar' },
        { id: 'd', texto: 'Sim — a parcela do SAC cai ao longo do tempo, então mesmo com receita menor, o fluxo melhora' },
      ],
      correta: 'a',
      explicacao: 'Com receita extra 40% menor: R$10.230 × 40% MC = R$4.092 de lucro extra/mês. Parcela inicial ≈ R$2.509 — o lucro extra ainda cobre a parcela (R$4.092 > R$2.509). Payback: R$114.870 ÷ R$4.092 = 28 meses — ainda dentro do prazo de 60 meses. O negócio aguenta um underperformance de 40% e ainda é viável. Isso é a "margem de segurança financeira" do projeto — fundamental avaliar antes de assinar.',
    },
    {
      id: 'c5',
      contexto: 'Recomendação final: Renata deve reformar a loja atual (Proposta B) ou aproveitar a expansão (Proposta C)? Como estruturar essa decisão?',
      opcoes: [
        { id: 'a', texto: 'Proposta B — reformar é menos arriscado. A expansão pode vir depois, quando tiver mais caixa próprio' },
        { id: 'b', texto: 'Proposta C — os números justificam: payback 2,8x melhor que a Proposta B, risco tolerável mesmo com 40% de queda na receita esperada. A oportunidade do espaço não volta' },
        { id: 'c', texto: 'Nenhuma — aguardar 12 meses acumulando caixa e fazer à vista para evitar juros' },
        { id: 'd', texto: 'Proposta A — a rapidez de aprovação é crítica para não perder o espaço do vizinho' },
      ],
      correta: 'b',
      explicacao: 'A Proposta C é a recomendação correta por três razões: (1) ROI superior — payback 16,8 meses vs 29,7 meses da B; (2) Oportunidade irrepetível — o espaço do vizinho não estará disponível depois; (3) Análise de sensibilidade mostra viabilidade mesmo com 40% de queda na receita. A Proposta B é mais segura numericamente, mas desperdiça a oportunidade estratégica. O consultor deve recomendar a C com uma condição: Renata ter pelo menos 3 meses de reserva de custos fixos (R$25.500) em caixa antes de fechar o Pronampe — isso cria o colchão para absorver os primeiros meses de adaptação do novo espaço.',
    },
  ],
};

const DICAS = {
  c1: {
    titulo: `PMT Price - Custo Real`,
    formula: `PMT = PV x [i / (1 - (1+i)^-n)]
Custo total = PMT x n
Juros = Custo total - PV
Multiplicador = Custo total / PV`,
    raciocinio: `Calcule o multiplicador: acima de 1.5x e caro. Abaixo de 1.2x e razoavel para credito produtivo.`,
  },
  c2: {
    titulo: `Comparando Price vs SAC`,
    formula: `Price: parcelas iguais, amortizacao crescente
SAC: amortizacao fixa, parcelas decrescentes
Price: menor parcela inicial
SAC: menor custo total
Compare os totais pagos`,
    raciocinio: `Para caixa apertado no inicio: Price e mais facil. Para pagar menos no total: SAC e melhor.`,
  },
  c3: {
    titulo: `Cartao BNDES - Credito Rotativo`,
    formula: `Cartao BNDES: taxa fixa anual (aprox 1.5%/mes)
Limite: ate R$500.000
Uso: equipamentos de fornecedores credenciados
Vantagem: parcelamento sem entrada, credito pre-aprovado`,
    raciocinio: `O Cartao BNDES exige CNPJ ativo e fornecedor credenciado. Verifique se o equipamento esta na lista BNDES antes de recomendar.`,
  },
  c4: {
    titulo: `Viabilidade do Investimento`,
    formula: `Receita extra = clientes extras x ticket medio
MC extra = Receita extra x MC%
Sobra mensal = MC extra - Parcela
Payback = Investimento / MC extra
Cenario conservador = 60% da projecao`,
    raciocinio: `O investimento e viavel se a MC extra superar a parcela em todos os cenarios. Calcule o cenario conservador para garantir margem de seguranca.`,
  },
  c5: {
    titulo: `Decisao Final: Pontuacao Multicriterio`,
    formula: `Pontue 1-5 em cada criterio:
- Custo total (peso 30%)
- Parcela vs caixa (peso 25%)
- Taxa de juros (peso 20%)
- Elegibilidade (peso 15%)
- Prazo aprovacao (peso 10%)
Melhor = maior pontuacao ponderada`,
    raciocinio: `Na pratica, o consultor pondera todos os fatores e explica o trade-off ao cliente. Nunca recomendar so pelo criterio mais obvio.`,
  },
};

export default function ModaConsultoriaFinanciamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('reforma');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const price = calcPrice(ex.pv, ex.taxa, ex.n);
  const sac = ex.n > 1 ? calcSAC(ex.pv, ex.taxa, ex.n) : null;
  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  const propostasCalc = dossie.propostas.map(p => {
    const price = calcPrice(p.valor, p.taxa, p.n);
    const sac = calcSAC(p.valor, p.taxa, p.n);
    return { ...p, price, sac };
  });

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/moda/financiamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Landmark size={22} color={COR} /> Consultoria: Crédito e Financiamento</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(236,72,153,0.08) 100%)', borderColor: 'rgba(244,63,94,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244,63,94,0.2)', color: '#fda4af', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Crédito e Financiamento
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Reformar ou Expandir? A Decisão que Muda a Loja</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          No varejo de moda, o crédito para reforma é mais caro e mais arriscado do que para equipamentos. Mas às vezes a <strong style={{ color: 'var(--text-main)' }}>oportunidade estratégica justifica o risco calculado</strong>. No desafio, você decide o futuro da Boutique Renata.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(244,63,94,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#fda4af' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Crédito Inteligente no Varejo de Moda</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#ec4899' ? '236,72,153' : bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : '34,197,94'}, 0.06)`, overflow: 'hidden' }}>
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
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos →</button>
          </div>
        </div>
      )}

      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map(e => (
              <button key={e.id} onClick={() => setExemploAtivo(e.id)} style={{ flex: 1, minWidth: '160px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === e.id ? `2px solid ${e.cor}` : '2px solid var(--border-color)', background: exemploAtivo === e.id ? e.corBg : 'var(--bg-card)', color: exemploAtivo === e.id ? e.cor : 'var(--text-muted)', cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{e.emoji}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.25rem' }}>{e.tipo}</div>
                <div style={{ fontSize: '0.9rem' }}>{e.subtipo}</div>
              </button>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${ex.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{ex.descricao}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { l: 'Valor financiado', v: formatBRL(ex.pv), c: '#6366f1' },
              { l: 'Taxa mensal', v: `${ex.taxa}%`, c: '#ef4444' },
              { l: 'Prazo', v: `${ex.n} mês(es)`, c: '#f59e0b' },
              { l: 'Parcela (Price)', v: formatBRL2(price.pmt), c: COR },
              { l: 'Total pago', v: formatBRL(price.total), c: '#ef4444' },
              { l: 'Juros totais', v: formatBRL(price.juros), c: '#ef4444' },
              { l: 'Multiplicador', v: `${price.mult.toFixed(2)}×`, c: price.mult > 1.5 ? '#ef4444' : '#22c55e' },
              { l: 'Receita extra/mês', v: formatBRL(ex.receitaExtra), c: '#22c55e' },
            ].map((k, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>
          {sac && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.3)' }}>
              <h3 style={{ color: '#22c55e', marginBottom: '1rem', fontSize: '1rem' }}>💰 Se fosse SAC:</h3>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                <span>1ª parcela: <strong style={{ color: '#f59e0b' }}>{formatBRL2(sac.pmtInicial)}</strong></span>
                <span>Última: <strong style={{ color: '#22c55e' }}>{formatBRL2(sac.pmtFinal)}</strong></span>
                <span>Total SAC: <strong style={{ color: '#22c55e' }}>{formatBRL(sac.total)}</strong></span>
                <span>Economia: <strong style={{ color: '#22c55e' }}>{formatBRL(price.total - sac.total)}</strong></span>
              </div>
            </div>
          )}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', borderLeft: '3px solid #facc15' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{ex.obs}</p>
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
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(244,63,94,0.05)', borderColor: 'rgba(244,63,94,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(244,63,94,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Briefcase size={24} color={COR} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>

            {/* Cenários lado a lado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { titulo: '🔧 Opção 1: Reforma Simples', valor: dossie.dados.custoReformaAtual, receitaExtra: dossie.dados.receitaExtraReforma, lucroExtra: dossie.dados.lucroExtraReforma, aumento: dossie.dados.aumentoReformaPerc, cor: '#f59e0b' },
                { titulo: '🏗️ Opção 2: Expansão Completa', valor: dossie.dados.custoExpansao, receitaExtra: dossie.dados.receitaExtraExpansao, lucroExtra: dossie.dados.lucroExtraExpansao, aumento: dossie.dados.aumentoExpansaoPerc, cor: '#22c55e' },
              ].map((op, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${op.cor}` }}>
                  <div style={{ fontWeight: 700, color: op.cor, marginBottom: '0.75rem', fontSize: '0.9rem' }}>{op.titulo}</div>
                  {[
                    { l: 'Investimento', v: formatBRL(op.valor), c: '#ef4444' },
                    { l: 'Aumento faturamento', v: `+${op.aumento}%`, c: op.cor },
                    { l: 'Receita extra/mês', v: formatBRL(op.receitaExtra), c: '#22c55e' },
                    { l: 'Lucro extra/mês (MC 40%)', v: formatBRL(op.lucroExtra), c: '#22c55e' },
                  ].map((r, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                      <span style={{ fontWeight: 600, color: r.c }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Propostas */}
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 3 Propostas de Crédito</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {propostasCalc.map(p => {
                const ref = p.tipo === 'SAC' ? p.sac : p.price;
                const pmtRef = p.tipo === 'SAC' ? ref.pmtInicial : ref.pmt;
                return (
                  <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: p.cor }}>Proposta {p.id}</span>
                      <span style={{ background: `rgba(${p.cor === '#22c55e' ? '34,197,94' : p.cor === '#6366f1' ? '99,102,241' : '239,68,68'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 600 }}>{p.tipo}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{p.nome}</div>
                    {[
                      { l: 'Valor', v: formatBRL(p.valor) },
                      { l: 'Taxa', v: `${p.taxa}% a.m.` },
                      { l: 'Prazo', v: `${p.n} meses` },
                      { l: '1ª parcela est.', v: `~${formatBRL(pmtRef)}` },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                        <span style={{ fontWeight: 600 }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '0.6rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.obs}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Perguntas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(244,63,94,0.2)', color: '#fda4af', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                </div>
                
                {/* Botão de dica contextual */}
                {DICAS[q.id] && !enviado && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => setDicasAbertas(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: dicasAbertas[q.id] ? 'rgba(250,204,21,0.12)' : 'rgba(250,204,21,0.06)',
                        border: '1px solid rgba(250,204,21,0.3)',
                        borderRadius: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        color: '#facc15',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
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
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(244,63,94,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#fda4af' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#fda4af' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
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
                  <strong style={{ color: '#facc15' }}>Dica do consultor:</strong> calcule o payback real de cada proposta (custo total com juros ÷ lucro extra mensal). O projeto com payback menor em relação ao prazo é sempre o mais atraente financeiramente.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Renata vai expandir com segurança graças à sua análise!' : nota >= 80 ? 'Muito bom! Revise os cálculos de payback dos itens errados.' : 'Revise ROI de reforma, SAC vs Price em taxas altas e análise de sensibilidade.'}
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
