import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Landmark, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Target, Lightbulb, Award,
  AlertCircle, BookOpen, Briefcase, TrendingUp, TrendingDown
} from 'lucide-react';

const COR = '#f43f5e';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const formatBRL2 = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── CALCULADORA PRICE ────────────────────────────────────────────────────────
function calcPrice(pv, taxa, n) {
  if (n === 0 || pv === 0) return { pmt: 0, totalJuros: 0, total: 0, mult: 0 };
  const i = taxa / 100;
  const pmt = pv * (i / (1 - Math.pow(1 + i, -n)));
  const total = pmt * n;
  return { pmt, totalJuros: total - pv, total, mult: total / pv };
}

// ─── TEORIA ───────────────────────────────────────────────────────────────────
const blocos = [
  {
    titulo: '1. Tabela Price: A Parcela Fixa que Esconde os Juros', cor: '#ef4444', emoji: '🎭',
    def: 'Na Tabela Price, a parcela é sempre igual — parece simples e "fácil no bolso". Mas nos primeiros meses, quase tudo que você paga são juros. O capital só começa a cair de verdade na segunda metade do contrato. Isso é deliberado: o banco recebe a maior parte dos juros logo no começo.',
    formula: 'PMT = PV × [i ÷ (1 − (1+i)^−n)]\nCusto real = PMT × n − PV',
    exemplos: ['R$30.000 a 3,5% em 48x: parcela R$1.178', 'Total pago: R$56.554 (+88% sobre o capital)', 'Mês 1: R$1.050 de juros + R$128 de amortização', 'Mês 48: R$41 de juros + R$1.137 de amortização'],
    alerta: 'O gerente mostra só a parcela mensal — nunca o total pago. Sempre calcule o custo total antes de assinar. Um equipamento de R$30.000 pode custar R$56.000 ao banco.',
  },
  {
    titulo: '2. Tabela SAC: O Sufoco Inteligente', cor: '#f59e0b', emoji: '📉',
    def: 'No Sistema de Amortização Constante (SAC), a amortização é sempre igual, mas os juros caem mês a mês. A primeira parcela é maior que na Price, mas o total pago ao longo do contrato é menor. Quem aguenta o sufoco inicial paga menos no final.',
    formula: 'Amortização = PV ÷ n (constante)\nJuros mês k = Saldo devedor × i\nParcela k = Amortização + Juros k',
    exemplos: ['R$30.000 a 3,5% em 48x: parcela inicial R$1.679', 'Parcela final: R$629', 'Total pago: R$47.550 (−R$9.000 vs Price)', 'A diferença de R$9.000 é puro lucro que fica no seu bolso'],
    alerta: 'SAC exige fluxo de caixa mais robusto nos primeiros meses. Negócios com caixa apertado podem preferir Price para os primeiros meses — mas deveriam quitar antecipadamente assim que tiverem folga.',
  },
  {
    titulo: '3. Fontes de Crédito: Do Microcrédito ao BNDES', cor: '#6366f1', emoji: '🏦',
    def: 'Nem toda dívida é igual. Taxa de 1,5% a.m. (BNDES/Pronampe) é muito diferente de 6% a.m. (cheque especial). Conhecer as fontes certas para cada finalidade pode salvar dezenas de milhares de reais em juros.',
    formula: 'Custo efetivo = taxa nominal + IOF + tarifas + seguros',
    exemplos: ['MEI Microcrédito (BNB/Sebrae): 0,5-1,2% a.m.', 'Pronampe: 6% a.a. + SELIC (~1,8% a.m. em 2024)', 'BNDES Finame (equipamentos): 1,0-1,5% a.m.', 'Banco privado capital de giro: 3,5-6% a.m.', 'Cheque especial: 8-12% a.m. — nunca usar!'],
    alerta: 'Microcrédito produtivo (BNB, Caixa Aqui, Banco do Povo) é para quem ainda não tem CNPJ formal ou tem histórico de crédito limitado. Formalizar o negócio como MEI abre acesso a linhas muito mais baratas.',
  },
  {
    titulo: '4. ROI do Financiamento: Só Vale a Pena?', cor: '#22c55e', emoji: '📊',
    def: 'Tomar crédito para investir só faz sentido se o retorno do investimento superar o custo do crédito. Se um forno financia a R$1.200/mês mas gera receita adicional de apenas R$800/mês, o financiamento destrói valor — mesmo que o negócio pareça estar crescendo.',
    formula: 'Vale a pena se: Receita adicional mensal > Parcela mensal\nROI = (Receita adicional − Parcela) ÷ Parcela × 100',
    exemplos: ['Forno R$35.000 → parcela R$1.178/mês', 'Produção extra: 200 marmitas × R$7 margem = R$1.400/mês', 'ROI mensal: (R$1.400 − R$1.178) ÷ R$1.178 = 18,8% ✅', 'Se margem extra = R$900: ROI = −23,6% → NÃO FAZER'],
    alerta: 'Muitos empreendedores financiam crescimento sem calcular o ROI. O banco ganha em qualquer cenário — você só ganha se o investimento render mais do que custa o empréstimo.',
  },
];

// ─── EXEMPLOS SETORIAIS ───────────────────────────────────────────────────────
const exemplos = [
  {
    id: 'microcredito', tipo: 'MEI / Informal', subtipo: 'Microcrédito Produtivo', emoji: '🌱',
    cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    pv: 5000, taxa: 0.9, n: 18,
    descricao: 'Rosa vende marmitas na rua. MEI recente, sem histórico de crédito bancário. O BNB oferece microcrédito de R$5.000 a 0,9% a.m. em 18 meses para comprar equipamento.',
    uso: 'Freezer e panelas profissionais para aumentar produção de 40 para 80 marmitas/dia.',
    receitaExtra: 600,
    fonteIdeal: 'BNB Crediamigo, Banco do Povo, AgroAmigo',
  },
  {
    id: 'pronampe', tipo: 'MEI / ME', subtipo: 'Pronampe', emoji: '🏛️',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    pv: 30000, taxa: 1.7, n: 36,
    descricao: 'Carlos tem marmitaria há 3 anos, fatura R$18.000/mês. Pronampe oferece crédito de até 30% do faturamento anual (R$216.000 × 30% = R$64.800) a taxa SELIC + 6%.',
    uso: 'Cozinha industrial completa: forno combinado, fritadeira e câmara fria.',
    receitaExtra: 3200,
    fonteIdeal: 'Pronampe via Caixa, BB, Bradesco — exige CNPJ ativo há 1+ ano',
  },
  {
    id: 'privado', tipo: 'Empresa Consolidada', subtipo: 'Banco Privado', emoji: '🏢',
    cor: '#ef4444', corBg: 'rgba(239,68,68,0.08)',
    pv: 80000, taxa: 3.2, n: 48,
    descricao: 'Empresa de catering fatura R$120.000/mês e precisa de van frigorificada + cozinha satélite. Banco privado oferece capital de giro a 3,2% a.m.',
    uso: 'Van frigorificada + equipamentos para segunda unidade de produção.',
    receitaExtra: 9500,
    fonteIdeal: 'BNDES Finame (para veículo) a 1,2% seria muito melhor — banco privado cobra 2,7x mais',
  },
];

// ─── DOSSIÊ ───────────────────────────────────────────────────────────────────
const dossie = {
  empresa: 'Marmitaria Sabor de Casa',
  segmento: 'Marmitaria — delivery e balcão — faturamento R$ 14.400/mês',
  contexto: 'Dona Aparecida tem 34 anos, vende marmitas há 4 anos, MEI formalizada. Fatura R$14.400/mês (480 marmitas × R$30). Quer comprar um forno combinado de R$22.000 para aumentar a capacidade em 60%. O banco ofereceu 3 opções de financiamento. Ela contratou você como consultora antes de assinar.',
  dados: {
    faturamento: 14400,
    custoVariavelPerc: 55,
    custoFixo: 3200,
    valorBem: 22000,
    aumentoCapacidade: 60,
    aumentoReceita: 8640, // 60% de R$14.400
    margemContribuicao: 45, // %
    receitaExtraEstimada: 3888, // R$8.640 × 45%
  },
  propostas: [
    {
      id: 'A',
      nome: 'Banco Privado Digital',
      tipo: 'Price',
      taxa: 3.8,
      n: 48,
      entrada: 2000,
      cor: '#ef4444',
      destaque: 'Aprovação em 24h. Sem burocracia.',
    },
    {
      id: 'B',
      nome: 'Pronampe — Caixa Econômica',
      tipo: 'SAC',
      taxa: 1.65,
      n: 36,
      entrada: 0,
      cor: '#6366f1',
      destaque: 'Linha federal subsidiada. Prazo 15 dias.',
    },
    {
      id: 'C',
      nome: 'BNB Crediamigo',
      tipo: 'Price',
      taxa: 1.2,
      n: 24,
      entrada: 0,
      cor: '#22c55e',
      destaque: 'Microcrédito produtivo para MEI.',
    },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      contexto: 'Proposta A: Banco Digital a 3,8% a.m. em 48x Price, com entrada de R$2.000. Capital financiado: R$20.000. Qual o custo real total e a parcela?',
      opcoes: [
        { id: 'a', texto: 'Parcela R$912/mês. Total pago R$45.790 — Aparecida pagará 2,08x o valor do bem' },
        { id: 'b', texto: 'Parcela R$760/mês. Total pago R$36.480 — razoável para 4 anos' },
        { id: 'c', texto: 'Parcela R$458/mês. Total pago R$22.000 — só o valor do bem' },
        { id: 'd', texto: 'Parcela R$1.100/mês. Total pago R$52.800 — muito caro, desconsiderar' },
      ],
      correta: 'a',
      explicacao: 'PMT = R$20.000 × [0,038 ÷ (1 − 1,038^−48)] = R$912/mês. Total parcelas = R$912 × 48 = R$43.790. Mais a entrada de R$2.000 = custo total R$45.790 por um bem de R$22.000 — multiplicador de 2,08×. Os juros totais somam R$23.790 — mais que o valor do bem! O banco digital "sem burocracia" é o crédito mais caro das 3 opções.',
    },
    {
      id: 'c2',
      contexto: 'Proposta B: Pronampe (Caixa) a 1,65% a.m. em 36x SAC, sem entrada. Qual a primeira parcela, a última parcela e o total pago? Compare com a Proposta A.',
      opcoes: [
        { id: 'a', texto: 'Parcela inicial R$974, final R$621, total R$28.716. Economiza R$17.074 vs Proposta A' },
        { id: 'b', texto: 'Parcela inicial R$611, final R$611, total R$22.000 — só o principal' },
        { id: 'c', texto: 'Parcela inicial R$1.200, final R$200, total R$26.000' },
        { id: 'd', texto: 'Parcela inicial R$950, final R$600, total R$32.000' },
      ],
      correta: 'a',
      explicacao: 'SAC: amortização = R$22.000 ÷ 36 = R$611/mês. Juros mês 1 = R$22.000 × 1,65% = R$363. Parcela 1 = R$611 + R$363 = R$974. Juros mês 36 = R$611 × 1,65% = R$10. Parcela final = R$611 + R$10 = R$621. Total pago ≈ R$28.716. Economia vs Proposta A: R$45.790 − R$28.716 = R$17.074 — quase o valor do bem economizado escolhendo a fonte certa!',
    },
    {
      id: 'c3',
      contexto: 'Proposta C: BNB Crediamigo a 1,2% a.m. em 24x Price, sem entrada. Qual o valor da parcela e o total? É a melhor opção para Aparecida?',
      opcoes: [
        { id: 'a', texto: 'Parcela R$1.060/mês, total R$25.451. Menor custo total, mas parcela mais alta pode comprometer o caixa' },
        { id: 'b', texto: 'Parcela R$870/mês, total R$20.880 — mais barato que o bem original' },
        { id: 'c', texto: 'Parcela R$960/mês, total R$23.040 — ideal por ser o mais rápido' },
        { id: 'd', texto: 'Parcela R$1.200/mês, total R$28.800 — similar ao Pronampe' },
      ],
      correta: 'a',
      explicacao: 'PMT = R$22.000 × [0,012 ÷ (1 − 1,012^−24)] = R$1.060/mês. Total = R$25.451. Juros totais = R$3.451 — o menor de todas as opções! Porém a parcela de R$1.060 em 24 meses exige disciplina de caixa. O Crediamigo tem limite de crédito menor para MEI iniciante — precisa verificar elegibilidade. Se Aparecida se qualificar, é a melhor opção em custo total.',
    },
    {
      id: 'c4',
      contexto: 'O forno aumentará a capacidade em 60% — potencial de R$8.640/mês a mais de receita. Com margem de contribuição de 45%, qual a receita adicional líquida e o ROI de cada proposta?',
      opcoes: [
        { id: 'a', texto: 'Receita extra líquida: R$3.888/mês. ROI Proposta A: 335%, B: 299%, C: 273% — todas viáveis' },
        { id: 'b', texto: 'Receita extra líquida: R$3.888/mês. Com qualquer proposta, o lucro extra supera a parcela — investimento válido' },
        { id: 'c', texto: 'Receita extra líquida: R$8.640/mês. ROI enorme em qualquer proposta' },
        { id: 'd', texto: 'Não é possível calcular sem saber a demanda real adicional — o ROI é hipotético' },
      ],
      correta: 'b',
      explicacao: 'Receita extra bruta: R$8.640/mês. Margem de contribuição 45%: R$8.640 × 45% = R$3.888/mês de receita adicional líquida. Parcela A: R$912 → sobra R$2.976. Parcela B: R$974 (inicial) → sobra R$2.914. Parcela C: R$1.060 → sobra R$2.828. Todas as propostas são viáveis financeiramente — o lucro extra supera qualquer parcela. A diferença entre elas é quanto sobra no caixa. Isso valida a decisão de tomar crédito, mas a escolha da proposta importa muito.',
    },
    {
      id: 'c5',
      contexto: 'Qual sua recomendação final para Dona Aparecida? Considere custo total, ROI, capacidade de caixa e burocracia.',
      opcoes: [
        { id: 'a', texto: 'Proposta A — aprovação rápida vale a pena para não perder o forno disponível agora' },
        { id: 'b', texto: 'Proposta B (Pronampe) — melhor equilíbrio entre taxa, prazo e custo total. Aguardar 15 dias compensa R$14.000 de economia' },
        { id: 'c', texto: 'Proposta C (Crediamigo) — sempre a melhor por ter taxa menor, sem avaliar elegibilidade' },
        { id: 'd', texto: 'Nenhuma — aguardar 6 meses para acumular R$22.000 em caixa e comprar à vista' },
      ],
      correta: 'b',
      explicacao: 'Proposta B (Pronampe) é a recomendação certa para o perfil de Aparecida: taxa 1,65% vs 3,8% do banco digital; economia de R$14.478; prazo de 36 meses reduz o peso da parcela; CNPJ ativo há 4 anos facilita aprovação. A Proposta C tem custo menor, mas parcela de R$1.042 é mais pesada e o Crediamigo tem limite menor — verificar elegibilidade primeiro. Aguardar 6 meses (opção D) é arriscado: o negócio pode perder clientes que vão para concorrentes. Já o banco digital (A) é literalmente a opção mais cara — a "conveniência" custa R$14.000 extras.',
    },
  ],
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
const DICAS = {
  c1: {
    titulo: `PMT Price - Formula Correta`,
    formula: `PMT = PV x [i / (1 - (1+i)^-n)]
PV = R$ 20.000 (financiado = R$22.000 - R$2.000 entrada)
i = 0.038 | n = 48
Custo total = PMT x n + entrada
Juros totais = Custo total - R$ 22.000`,
    raciocinio: `No Price todas as parcelas sao iguais. O PV e o valor FINANCIADO (sem a entrada). Calcule a PMT, multiplique pelo numero de parcelas, some a entrada e compare com o valor do bem.`,
  },
  c2: {
    titulo: `Formula SAC - Amortizacao Constante`,
    formula: `Amortizacao = PV / n (igual todo mes)
Juros mes k = Saldo devedor(k) x i
Parcela(k) = Amortizacao + Juros(k)
PV = R$22.000 | i = 0.0165 | n = 36
Mes 1: saldo = R$22.000 | Mes 36: saldo = R$611`,
    raciocinio: `No SAC a amortizacao e constante, mas os juros caem a cada mes. Calcule o mes 1 (maior parcela) e o mes final (menor). O total pago e a soma de todas as parcelas.`,
  },
  c3: {
    titulo: `Price com Taxa Menor - Analise pelo Caixa`,
    formula: `PMT = PV x [i / (1 - (1+i)^-n)]
PV = R$22.000 | i = 0.012 | n = 24
Custo total = PMT x 24
Juros = Custo total - R$22.000
Taxa menor nao e sempre melhor se parcela for alta`,
    raciocinio: `Com prazo menor (24 meses vs 36), a parcela sera maior mesmo com taxa menor. Calcule se o caixa suporta essa parcela antes de recomendar.`,
  },
  c4: {
    titulo: `ROI do Investimento e Viabilidade`,
    formula: `Receita extra bruta = faturamento x % capacidade
Lucro extra = Receita extra x MC%
ROI mensal = Lucro extra / Parcela x 100
Payback = Parcela / Lucro extra (meses)
Projeto viavel se: lucro extra maior que parcela`,
    raciocinio: `Calcule o que o forno gera: faturamento x 60% = receita extra. Aplique a MC% para o lucro real. Compare com cada parcela. Se lucro maior que parcela, o investimento se paga.`,
  },
  c5: {
    titulo: `Framework de Decisao de Credito`,
    formula: `Criterios em ordem:
1. Custo total (menor = melhor)
2. Taxa de juros mensal
3. Capacidade de caixa para a parcela
4. Elegibilidade / burocracia
5. Prazo de aprovacao vs urgencia
Ideal: menor custo + parcela suportavel + elegibilidade`,
    raciocinio: `Compare as 3 propostas em 5 criterios: custo total, parcela vs caixa, taxa, elegibilidade e prazo de aprovacao. A resposta pondera todos esses fatores.`,
  },
};

export default function MarmitariaConsultoriaFinanciamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [exemploAtivo, setExemploAtivo] = useState('microcredito');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const price = calcPrice(ex.pv, ex.taxa, ex.n);
  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  // Propostas do dossiê calculadas
  const propostasCalc = dossie.propostas.map(p => {
    const pv = dossie.dados.valorBem - p.entrada;
    const c = calcPrice(pv, p.taxa, p.n);
    return { ...p, pv, ...c };
  });

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/financiamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Landmark size={22} color={COR} /> Consultoria: Crédito e Financiamento</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      {/* HERO */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(239,68,68,0.08) 100%)', borderColor: 'rgba(244,63,94,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244,63,94,0.2)', color: '#fda4af', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Crédito e Financiamento
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Escolher o Crédito Errado Pode Custar R$ 14.000</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          O banco não é seu inimigo — mas também não é seu amigo. Saber <strong style={{ color: 'var(--text-main)' }}>qual linha, qual sistema e qual prazo</strong> pode fazer a diferença entre crescer com lucro ou trabalhar para pagar juros.
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(244,63,94,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#fda4af' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {/* TEORIA */}
      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Fundamentos do Crédito para Pequenos Negócios</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#ef4444' ? '239,68,68' : bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : '34,197,94'}, 0.06)`, overflow: 'hidden' }}>
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
          {/* Tabela comparativa de fontes */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: COR }}>🏦 Fontes de Crédito por Perfil</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Linha', 'Taxa típica', 'Perfil', 'Finalidade', 'Agilidade'].map((h, i) => (
                      <th key={i} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['BNB Crediamigo', '0,5–1,2% a.m.', 'MEI / Informal', 'Capital de giro', '1-2 semanas'],
                    ['Pronampe', 'SELIC+6% a.a.', 'ME/EPP', 'Giro e investimento', '2-3 semanas'],
                    ['BNDES Finame', '1,0–1,5% a.m.', 'ME/EPP', 'Máquinas e equipamentos', '4-8 semanas'],
                    ['Banco privado CG', '3,5–5,5% a.m.', 'Qualquer', 'Capital de giro', '2-5 dias'],
                    ['Cartão PJ', '5–10% a.m.', 'Qualquer', 'Emergência', 'Imediato'],
                    ['Cheque especial', '8–12% a.m.', 'Qualquer', 'EVITAR', 'Automático'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '0.6rem 0.75rem', color: j === 5 ? '#ef4444' : j === 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos →</button>
          </div>
        </div>
      )}

      {/* EXEMPLOS */}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Valor financiado', val: formatBRL(ex.pv), cor: '#6366f1' },
              { label: 'Taxa mensal', val: `${ex.taxa}%`, cor: '#ef4444' },
              { label: 'Prazo', val: `${ex.n} meses`, cor: '#f59e0b' },
              { label: 'Parcela (Price)', val: formatBRL2(price.pmt), cor: COR },
              { label: 'Total pago', val: formatBRL(price.total), cor: '#ef4444' },
              { label: 'Juros totais', val: formatBRL(price.totalJuros), cor: '#ef4444' },
              { label: 'Multiplicador', val: `${price.mult.toFixed(2)}×`, cor: price.mult > 1.5 ? '#ef4444' : '#22c55e' },
              { label: 'Receita extra/mês', val: formatBRL(ex.receitaExtra), cor: '#22c55e' },
            ].map((k, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.cor}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: k.cor }}>{k.val}</div>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', borderLeft: '3px solid #facc15', background: 'rgba(250,204,21,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.2rem' }}>Fonte ideal para este perfil:</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{ex.fonteIdeal}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-main)' }}>Uso do crédito:</strong> {ex.uso}</p>
                <p style={{ color: price.mult > 1.8 ? '#ef4444' : '#22c55e', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  ROI mensal: {(((ex.receitaExtra - price.pmt) / price.pmt) * 100).toFixed(1)}% — {price.pmt < ex.receitaExtra ? '✅ Viável' : '❌ Não recomendado'}
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {/* DESAFIO */}
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

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Faturamento/mês', val: formatBRL(dossie.dados.faturamento), cor: '#22c55e' },
                { label: 'CV (% receita)', val: `${dossie.dados.custoVariavelPerc}%`, cor: '#f59e0b' },
                { label: 'Custo Fixo/mês', val: formatBRL(dossie.dados.custoFixo), cor: '#ef4444' },
                { label: 'Valor do forno', val: formatBRL(dossie.dados.valorBem), cor: '#6366f1' },
                { label: 'Aumento capacidade', val: `+${dossie.dados.aumentoCapacidade}%`, cor: COR },
                { label: 'Receita extra est.', val: formatBRL(dossie.dados.aumentoReceita), cor: '#22c55e' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.cor}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.cor }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Propostas */}
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 3 Propostas Recebidas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {propostasCalc.map((p) => (
                <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: p.cor, fontSize: '1.1rem' }}>Proposta {p.id}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.nome}</div>
                    </div>
                    <span style={{ background: `rgba(${p.cor === '#ef4444' ? '239,68,68' : p.cor === '#6366f1' ? '99,102,241' : '34,197,94'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>{p.tipo}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Taxa</span>
                      <span style={{ color: p.cor, fontWeight: 600 }}>{p.taxa}% a.m.</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Prazo</span>
                      <span>{p.n} meses</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Entrada</span>
                      <span>{p.entrada > 0 ? formatBRL(p.entrada) : 'Sem entrada'}</span>
                    </div>
                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>1ª parcela est.</span>
                      <span style={{ fontWeight: 700 }}>~{formatBRL(p.pmt)}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.destaque}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Perguntas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(244,63,94,0.2)', color: '#fda4af', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pergunta da Consultoria</div>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                  </div>
                </div>

                {/* Botão de dica */}
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
                        <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          🧮 {DICAS[q.id].titulo}
                        </div>
                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '0.4rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fcd34d', whiteSpace: 'pre-wrap', marginBottom: '0.75rem', lineHeight: 1.7 }}>
                          {DICAS[q.id].formula}
                        </pre>
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> calcule o custo total de cada proposta, não só a parcela. Uma parcela menor por mais tempo pode custar muito mais do que uma parcela maior por menos tempo.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : nota >= 60 ? '📊' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Dona Aparecida escolheu bem — graças a você!' : nota >= 80 ? 'Muito bom! Revise os cálculos dos itens errados.' : 'Revise a teoria de Price vs SAC e os cálculos de custo total.'}
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
