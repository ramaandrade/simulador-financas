import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Briefcase, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, TrendingUp, MonitorPlay } from 'lucide-react';

const COR = '#0ea5e9';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const blocos = [
  {
    titulo: '1. CAC e LTV: Os Dois Números que Definem Marketing', cor: '#ec4899', emoji: '📱',
    def: 'CAC (Custo de Aquisição de Cliente) é quanto você gasta para conquistar um cliente. LTV (Lifetime Value) é quanto esse cliente gera de receita ao longo do relacionamento. Regra de ouro: LTV deve ser pelo menos 3× o CAC. Se LTV < CAC, cada cliente novo destrói valor.',
    formula: 'CAC = Investimento em marketing / Novos clientes conquistados\nLTV = Ticket médio × Frequência mensal × Meses de retenção × Margem\nRelação saudável: LTV ≥ 3 × CAC',
    exemplos: ['Campanha R$4.000, 40 clientes novos → CAC = R$100', 'Ticket R$110, 1,5x/mês, 8 meses, margem 40% → LTV = R$528', 'LTV/CAC = R$528/R$100 = 5,28 → ✅ Excelente', 'Se CAC = R$200 e LTV = R$300 → LTV/CAC = 1,5 → ❌ Destruindo valor'],
    alerta: 'O erro mais comum é calcular o ROI de marketing só pela primeira compra. Uma cliente que compra R$110 na promoção e volta 7 vezes gera R$770 de receita — o CAC deve ser avaliado sobre o LTV, não sobre a primeira venda.',
  },
  {
    titulo: '2. ROI de Tráfego Pago vs ROI Produtivo', cor: '#f59e0b', emoji: '⚖️',
    def: 'Marketing digital tem ROI diferente de investimentos em equipamentos. Equipamentos geram receita por anos; campanhas de marketing geram receita enquanto estão ativas. Por isso, o horizonte de comparação importa — mas ambos devem superar a taxa mínima de atratividade.',
    formula: 'ROI marketing = (Receita gerada − Investimento) / Investimento × 100\nROI equipamento = Lucro adicional anual / Investimento × 100\nAmbos devem superar TMA em seus respectivos horizontes',
    exemplos: ['Campanha R$3.000, gerou R$9.000 de receita extra: ROI = 200%', 'Mas receita extra foi de custo 60%: lucro real R$3.600. ROI = 20%', 'Equipamento R$15.000, lucro extra R$1.800/mês: ROI = 12%/mês', 'Em 12 meses: equipamento gerou R$21.600 vs campanha R$3.600'],
    alerta: 'Marketing de resultado tem ROI alto mas temporário; equipamento tem ROI menor mas permanente. Uma loja madura precisa dos dois — marketing traz clientes, equipamento (ou espaço melhor) retém.',
  },
  {
    titulo: '3. Omnicanalidade como Investimento Estratégico', cor: '#6366f1', emoji: '🛒',
    def: 'Investir em presença digital (Instagram, loja virtual, WhatsApp Business) é investimento estratégico — não apenas marketing. Uma loja com canal digital bem estabelecido vende sem depender de fluxo físico e tem custo por venda menor do que loja 100% presencial.',
    formula: 'Custo por venda presencial = Aluguel + Funcionários / Vendas mensais\nCusto por venda digital = Investimento digital / Vendas digitais\nBreakeven digital = quando custo/venda digital < custo/venda presencial',
    exemplos: ['Loja física: custo/venda R$28 (aluguel+salário/vendas)', 'Canal digital: custo/venda R$12 (mktg+sistemas/vendas)', 'Economia por venda digital: R$16', 'Com 100 vendas digitais/mês: economia R$1.600/mês'],
    alerta: 'O canal digital não substitui a loja física — o cliente quer ver e experimentar. Mas o canal digital captura vendas de clientes que não iriam à loja e reduz a dependência de fluxo de rua.',
  },
  {
    titulo: '4. Portfólio de Investimentos da Loja de Moda', cor: '#22c55e', emoji: '🎯',
    def: 'A loja de moda madura investe em 3 camadas: (1) Infraestrutura produtiva (expositor, iluminação, espaço) — retorno permanente; (2) Marketing de aquisição (tráfego pago, influencer) — retorno de curto prazo; (3) Retenção (CRM, programa de fidelidade) — retorno de longo prazo via LTV.',
    formula: 'Alocação ideal: 50% infraestrutura + 30% aquisição + 20% retenção\nRetorno médio ponderado > TMA = portfólio saudável',
    exemplos: ['R$20.000: R$10.000 expositor + R$6.000 Instagram + R$4.000 CRM/fidelidade', 'Expositor: ROI permanente 8%/mês', 'Instagram: ROI de campanha 15-25% (variável)', 'CRM: aumenta LTV em 40% — o maior multiplicador de longo prazo'],
    alerta: 'A maioria dos lojistas investe 90% em aquisição e 0% em retenção. Mas reter uma cliente custa 5-7× menos do que conquistar uma nova. Investir em fidelização é o melhor ROI de longo prazo do varejo de moda.',
  },
];

const exemplos = [
  {
    id: 'instagram', tipo: 'Marketing Digital', subtipo: 'Instagram Ads', emoji: '📱',
    cor: '#ec4899', corBg: 'rgba(236,72,153,0.08)',
    investimento: 4000, novasClientes: 45, ticketMedio: 110, margem: 40, retencaoMeses: 6, freqMensal: 1.3,
    descricao: 'Campanha de 30 dias no Instagram Ads focada em mulheres 25-40 anos da cidade. Meta: 45 novas clientes com ticket médio de R$110.',
  },
  {
    id: 'influencer', tipo: 'Marketing Digital', subtipo: 'Influencer Local', emoji: '⭐',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    investimento: 3000, novasClientes: 28, ticketMedio: 145, margem: 40, retencaoMeses: 8, freqMensal: 1.2,
    descricao: 'Parceria com influenciadora local (35k seguidoras). R$3.000 incluindo brinde e comissão. Ticket médio maior pois o público é mais qualificado.',
  },
  {
    id: 'expositor', tipo: 'Infraestrutura', subtipo: 'Expositor + Iluminação', emoji: '💡',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    investimento: 15000, novasClientes: 0, ticketMedio: 0, margem: 0, retencaoMeses: 0, freqMensal: 0,
    lucroMensalFixo: 1800,
    descricao: 'Novo expositor central e iluminação direcional. Aumenta conversão de visitantes em compradores de 18% para 26% (+44% conversão). Lucro extra estimado R$1.800/mês.',
  },
];

const dossie = {
  empresa: 'Boutique Vitória',
  segmento: 'Moda feminina jovem — centro comercial — faturamento R$ 27.000/mês',
  contexto: 'Vitória, 29 anos, tem a boutique há 3 anos. Acumulou R$32.000. É apaixonada por marketing digital mas os resultados são inconsistentes. O contador diz que ela precisa ser mais rigorosa na análise. Você foi contratado como consultor de investimentos para ajudar a alocar os R$32.000 da forma mais inteligente.',
  capital: 32000,
  dados: {
    faturamento: 27000,
    custoFixo: 7200,
    margem: 40,
    ticketMedio: 115,
    clientesAtivos: 180,
    freqMedia: 1.4,
    retencaoMedia: 7,
  },
  projetos: [
    {
      id: 'A', nome: 'Meta Ads — 3 Meses',
      valor: 9000, tipo: 'marketing',
      novasClientes: 95, ticketMedio: 115, margem: 40, retencaoMeses: 7, freqMensal: 1.4,
      risco: 'médio', cor: '#ec4899',
      descricao: 'R$3.000/mês por 3 meses de Meta Ads. Estimativa: 32 clientes novos/mês. Resultado depende de criativos e segmentação.',
      obs: 'Resultado variável. Bom para crescimento rápido de base.',
    },
    {
      id: 'B', nome: 'Novo Expositor + Iluminação LED',
      valor: 14000, tipo: 'infraestrutura',
      lucroMensal: 2100, prazoMeses: 60,
      risco: 'baixo', cor: '#6366f1',
      descricao: 'Expositor central com iluminação dramática. Aumenta a taxa de conversão de 20% para 31%. Com 350 visitas/mês, gera +R$2.100/mês de lucro extra.',
      obs: 'Retorno permanente. Payback estimado 6,7 meses.',
    },
    {
      id: 'C', nome: 'Programa de Fidelidade + CRM',
      valor: 3500, tipo: 'retencao',
      aumentoLTV: 35,
      risco: 'baixo', cor: '#22c55e',
      descricao: 'Sistema de pontos (software R$150/mês + campanha de lançamento R$2.000). Aumenta frequência de compra das clientes existentes em 35%. Com 180 clientes ativos, impacto enorme no LTV.',
      obs: 'Menor ROI inicial mas maior impacto de longo prazo.',
    },
    {
      id: 'D', nome: 'Tesouro Selic (Reserva)',
      valor: 8000, tipo: 'reserva',
      taxaMensal: 0.85,
      risco: 'nulo', cor: '#a855f7',
      descricao: 'Reserva de emergência em Tesouro Selic. Cobre ~1,1 mês de custo fixo. Protege contra queda de vendas, quebra de equipamento ou oportunidade de estoque.',
      obs: 'Essencial. Vitória não tem reserva atualmente.',
    },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      
      contexto: 'Calcule o CAC e o LTV do Projeto A (Meta Ads R$9.000, 95 clientes novos, ticket R$115, margem 40%, retenção 7 meses, frequência 1,4×/mês). A relação LTV/CAC é saudável?',
      opcoes: [
        { id: 'a', texto: 'CAC = R$94,7. LTV = R$453. LTV/CAC = 4,8 → Saudável (> 3). Projeto A gera valor por cliente' },
        { id: 'b', texto: 'CAC = R$94,7. LTV = R$115. LTV/CAC = 1,2 → Insustentável — cada cliente destrói valor' },
        { id: 'c', texto: 'CAC = R$300. LTV = R$900. LTV/CAC = 3 → No limite da viabilidade' },
        { id: 'd', texto: 'CAC = R$94,7. LTV = R$1.128. LTV/CAC = 11,9 → Excelente. Não precisa de análise adicional' },
      ],
      correta: 'a',
      explicacao: 'CAC = R$9.000 ÷ 95 clientes = R$94,7. LTV = Ticket R$115 × Frequência 1,4/mês × Retenção 7 meses × Margem 40% = R$115 × 1,4 × 7 × 0,40 = R$452,8. LTV/CAC = R$452,8 ÷ R$94,7 = 4,78. Acima de 3, portanto saudável. Isso significa que cada real gasto para adquirir uma cliente gera R$4,78 de valor ao longo do relacionamento. O Projeto A é financeiramente viável.',
    },
    {
      id: 'c2',
      
      contexto: 'Compare o Projeto A (marketing) com o Projeto B (expositor R$14.000 / R$2.100/mês). Qual tem melhor ROI no horizonte de 12 meses? E em 36 meses?',
      opcoes: [
        { id: 'a', texto: 'Em 12m: A gera R$43.016 de LTV vs B R$25.200. Projeto A é melhor no curto prazo. Em 36m: B gera R$75.600 vs A R$43.016. Projeto B supera no longo prazo' },
        { id: 'b', texto: 'Projeto A sempre é melhor porque marketing traz clientes novos continuamente' },
        { id: 'c', texto: 'Projeto B sempre é melhor porque é permanente — expositor dura 10 anos' },
        { id: 'd', texto: 'São incomparáveis — marketing e infraestrutura têm naturezas diferentes demais' },
      ],
      correta: 'a',
      explicacao: 'Projeto A (12m): 95 clientes × LTV R$452,8 = R$43.016 de valor gerado (custo R$9.000, lucro líquido R$34.016). Projeto B (12m): R$2.100 × 12 = R$25.200 de lucro extra (custo R$14.000, lucro líquido R$11.200). No curto prazo (12m), A parece superior pelo volume de LTV. Mas atenção: Projeto B continua gerando R$2.100/mês por 60+ meses — ao final de 36 meses = R$75.600 de lucro cumulativo vs A que foi uma campanha de 3 meses. Projetos de infraestrutura ganham no longo prazo; campanhas ganham no curto. A loja precisa dos dois.',
    },
    {
      id: 'c3',
      
      contexto: 'Vitória atualmente não tem reserva de emergência. O Projeto D (Tesouro R$8.000) tem ROI de apenas 0,85%/mês. Por que é o projeto mais urgente?',
      opcoes: [
        { id: 'a', texto: 'Porque Vitória tem custo fixo de R$7.200/mês e zero de reserva. Um mês fraco de vendas ou equipamento quebrado pode forçar empréstimo a 6%/mês — R$432/mês de juros evitados pela reserva' },
        { id: 'b', texto: 'Porque o Tesouro tem garantia do governo, enquanto os outros projetos têm risco de perda' },
        { id: 'c', texto: 'Porque é mais simples e rápido de fazer — reduz o trabalho de análise dos outros projetos' },
        { id: 'd', texto: 'Não é urgente — Vitória pode usar cartão de crédito em emergências' },
      ],
      correta: 'a',
      explicacao: 'Sem reserva, qualquer crise força crédito emergencial: cheque especial a 8-10%/mês ou empréstimo pessoal a 5-6%/mês. Com custo fixo de R$7.200/mês, um mês fraco pode exigir R$5.000-6.000 emprestados. Juros de emergência: R$5.000 × 8% = R$400/mês. Em 12 meses, uma crise sem reserva custa R$400-800 em juros desnecessários. O Tesouro "caro" de 0,85%/mês (R$68/mês em R$8.000) protege contra juros de R$400/mês. ROI real da reserva: evitar dívida cara. É seguro, não investimento produtivo.',
    },
    {
      id: 'c4',
      
      contexto: 'O Projeto C (CRM R$3.500) aumenta a frequência das 180 clientes existentes em 35%. Com ticket R$115, margem 40% e frequência atual 1,4×/mês, qual o impacto mensal? Vale o investimento?',
      opcoes: [
        { id: 'a', texto: 'Aumento de 0,49 visitas/mês por cliente × 180 clientes × R$115 × 40% = R$4.049/mês extra. Payback: R$3.500 ÷ R$4.049 = 0,86 meses → Melhor ROI de todos os projetos' },
        { id: 'b', texto: 'Aumento de R$1.200/mês — bom mas não o mais prioritário dado o capital disponível' },
        { id: 'c', texto: 'Impacto de R$800/mês — razoável. Payback de 4,4 meses. Segundo melhor projeto' },
        { id: 'd', texto: 'Impossível calcular sem dados históricos de retenção mais detalhados' },
      ],
      correta: 'a',
      explicacao: 'Frequência atual: 1,4×/mês. Aumento 35%: nova frequência 1,4 × 1,35 = 1,89×/mês. Aumento por cliente: 0,49 visitas/mês. Receita extra/cliente = 0,49 × R$115 = R$56,35. Total com 180 clientes: R$56,35 × 180 = R$10.143/mês de receita extra. Lucro extra (40% MC): R$4.057/mês. Payback: R$3.500 ÷ R$4.057 = 0,86 meses — menos de 1 mês! ROI = R$4.057/R$3.500 = 115,9%/mês. É o projeto com maior ROI de todos — retorno quase imediato porque trabalha com a base existente.',
    },
    {
      id: 'c5',
      
      contexto: 'Qual a alocação ideal dos R$32.000 de Vitória, considerando urgência, ROI, horizonte de tempo e diversificação?',
      opcoes: [
        { id: 'a', texto: 'R$9.000 Projeto A + R$14.000 Projeto B + R$3.500 Projeto C + R$8.000 Projeto D — todos simultaneamente' },
        { id: 'b', texto: 'Prioridade: (1ª) R$8.000 Projeto D agora; (2ª) R$3.500 Projeto C agora; (3ª) R$14.000 Projeto B; (4ª) usar lucro extra dos projetos B+C para financiar o Projeto A em 3-4 meses' },
        { id: 'c', texto: 'R$32.000 todos no Projeto A — maximizar aquisição de clientes enquanto o capital permite' },
        { id: 'd', texto: 'R$14.000 Projeto B + R$8.000 Projeto D — ignorar marketing e CRM por enquanto' },
      ],
      correta: 'b',
      explicacao: 'Sequência recomendada: (1) Projeto D R$8.000 — urgente, Vitória não tem reserva. Garante que nenhuma crise desfaz os outros investimentos; (2) Projeto C R$3.500 — payback menor que 1 mês! O projeto mais eficiente é o mais barato e imediato; (3) Projeto B R$14.000 — expositor melhora a loja permanentemente. Payback 6,7 meses é excelente; (4) Projeto A com lucro dos projetos B+C: em 3-4 meses, B+C já gerarão ~R$6.100/mês extra — Vitória pode usar parte para financiar a campanha de Meta Ads sem comprometer o caixa. Essa sequência prioriza segurança (D), maior ROI primeiro (C), permanência (B) e usa o próprio crescimento para financiar aquisição (A).',
    },
  ],
};

const DICAS = {
  c1: {
    titulo: `CAC e LTV - A Regua do Marketing`,
    formula: `CAC = Investimento / Novos clientes
LTV = Ticket x Frequencia/mes x Retencao x Margem
Relacao saudavel: LTV maior ou igual a 3 x CAC
Ex: CAC = R$95, LTV = R$453
LTV/CAC = 4.8 -> saudavel`,
    raciocinio: `Calcule CAC e LTV separadamente. Divida LTV pelo CAC. Se menor que 3, cada cliente novo destroi valor.`,
  },
  c2: {
    titulo: `Horizonte Temporal: Marketing vs Infraestrutura`,
    formula: `Marketing (curto prazo):
Impacto em 1-3 meses, depois cessa
Infraestrutura (longo prazo):
Gera lucro por 60+ meses
Comparar no mesmo horizonte temporal`,
    raciocinio: `Compare marketing e infraestrutura no mesmo prazo. Em 12 meses, marketing pode parecer melhor. Em 36 meses, infraestrutura geralmente supera.`,
  },
  c3: {
    titulo: `Urgencia da Reserva de Emergencia`,
    formula: `Sem reserva: vulnerabilidade total
Custo de crise sem reserva:
Emprestimo emergencial: 6-10%/mes
Reserva em Tesouro (0.85%/mes):
Custo da protecao: R$68/mes por R$8.000
vs custo evitado: R$480-800/mes em juros`,
    raciocinio: `Com custo fixo de R$7.200 e zero de reserva, uma crise pode forcar emprestimo de R$5.000-6.000 a 8%/mes = R$400/mes de juros. A reserva e muito mais barata.`,
  },
  c4: {
    titulo: `Impacto do CRM no LTV das Clientes`,
    formula: `Frequencia atual: F
Frequencia nova: F x (1 + aumento%)
Aumento por cliente: DeltaF x Ticket x Margem
Impacto total: Aumento por cliente x Base clientes
Payback = Investimento CRM / Impacto mensal`,
    raciocinio: `O CRM trabalha sobre clientes que ja existem - sem custo de aquisicao. Calcule o aumento de frequencia, multiplique pelo ticket e pela margem, e depois por toda a base.`,
  },
  c5: {
    titulo: `Sequencia Otima de Alocacao`,
    formula: `Principio: urgencia primeiro, depois ROI
1. Reserva (urgente + protecao)
2. Maior ROI com risco baixo
3. Projeto complementar
4. Marketing (maior ROI mas risco)
Usar lucro dos projetos 1-3 para financiar 4`,
    raciocinio: `A sequencia correta considera urgencia (reserva zero e urgencia maxima), depois ROI. Nao adianta ter o maior ROI se uma crise destroi o negocio antes.`,
  },
};

export default function ModaConsultoriaInvestimentos() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('instagram');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const cac = ex.investimento && ex.novasClientes ? (ex.investimento / ex.novasClientes).toFixed(0) : 0;
  const ltv = ex.ticketMedio ? (ex.ticketMedio * ex.freqMensal * ex.retencaoMeses * ex.margem / 100).toFixed(0) : 0;
  const ltvCac = ltv && cac ? (ltv / cac).toFixed(1) : 0;

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/moda/investimentos')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Briefcase size={22} color={COR} /> Consultoria: Gestão de Investimentos</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(236,72,153,0.08) 100%)', borderColor: 'rgba(14,165,233,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Gestão de Investimentos
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>CAC, LTV e a Carteira Omnicanal da Boutique</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Na moda, a decisão de investimento vai além de ROI: é preciso equilibrar <strong style={{ color: 'var(--text-main)' }}>aquisição, infraestrutura, retenção e reserva</strong>. No desafio, você monta a carteira ideal da Boutique Vitória.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(14,165,233,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#7dd3fc' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Investimentos no Varejo de Moda</h2>
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
          {ex.tipo === 'marketing' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { l: 'Investimento', v: formatBRL(ex.investimento), c: '#6366f1' },
                { l: 'Clientes novos', v: `${ex.novasClientes}`, c: COR },
                { l: 'CAC', v: formatBRL(cac), c: '#ef4444' },
                { l: 'Ticket médio', v: formatBRL(ex.ticketMedio), c: '#f59e0b' },
                { l: 'Frequência/mês', v: `${ex.freqMensal}×`, c: '#22c55e' },
                { l: 'Retenção', v: `${ex.retencaoMeses} meses`, c: '#a855f7' },
                { l: 'LTV por cliente', v: formatBRL(ltv), c: '#22c55e' },
                { l: 'LTV/CAC', v: `${ltvCac}× ${ltvCac >= 3 ? '✅' : '❌'}`, c: ltvCac >= 3 ? '#22c55e' : '#ef4444' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { l: 'Investimento', v: formatBRL(ex.investimento), c: '#6366f1' },
                { l: 'Lucro extra/mês', v: formatBRL(ex.lucroMensalFixo), c: '#22c55e' },
                { l: 'ROI mensal', v: `${(ex.lucroMensalFixo / ex.investimento * 100).toFixed(1)}%`, c: '#22c55e' },
                { l: 'Payback', v: `${(ex.investimento / ex.lucroMensalFixo).toFixed(1)} meses`, c: COR },
                { l: 'Duração', v: '60+ meses', c: '#f59e0b' },
                { l: 'Lucro 60 meses', v: formatBRL(ex.lucroMensalFixo * 60), c: '#22c55e' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(14,165,233,0.05)', borderColor: 'rgba(14,165,233,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(14,165,233,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}><Briefcase size={24} color={COR} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'Capital disponível', v: formatBRL(dossie.capital), c: '#22c55e' },
                { l: 'Faturamento/mês', v: formatBRL(dossie.dados.faturamento), c: COR },
                { l: 'Custo fixo/mês', v: formatBRL(dossie.dados.custoFixo), c: '#ef4444' },
                { l: 'Clientes ativos', v: `${dossie.dados.clientesAtivos}`, c: '#ec4899' },
                { l: 'Ticket médio', v: formatBRL(dossie.dados.ticketMedio), c: '#f59e0b' },
                { l: 'Reserva atual', v: 'R$ 0', c: '#ef4444' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 4 Projetos em Análise</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
              {dossie.projetos.map(p => {
                const isMarketing = p.tipo === 'marketing';
                const isRetencao = p.tipo === 'retencao';
                const isReserva = p.tipo === 'reserva';
                const cacP = isMarketing ? (p.valor / p.novasClientes).toFixed(0) : null;
                const ltvP = isMarketing ? (p.ticketMedio * p.freqMensal * p.retencaoMeses * p.margem / 100).toFixed(0) : null;
                return (
                  <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: p.cor }}>Projeto {p.id}</span>
                      <span style={{ background: `rgba(${p.risco === 'nulo' ? '168,85,247' : p.risco === 'baixo' ? '34,197,94' : '245,158,11'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 600 }}>risco {p.risco}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{p.nome}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.descricao}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Valor</span>
                        <span style={{ fontWeight: 600, color: p.cor }}>{formatBRL(p.valor)}</span>
                      </div>
                      {isMarketing && <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>CAC</span>
                          <span style={{ fontWeight: 600 }}>~R$ {cacP}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                          <span style={{ color: 'var(--text-muted)' }}>LTV estimado</span>
                          <span style={{ fontWeight: 600, color: '#22c55e' }}>R$ {ltvP}</span>
                        </div>
                      </>}
                      {!isMarketing && !isReserva && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.2rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{isRetencao ? 'Aumento LTV' : 'Lucro extra/mês'}</span>
                        <span style={{ fontWeight: 600, color: '#22c55e' }}>{isRetencao ? `+${p.aumentoLTV}%` : formatBRL(p.lucroMensal)}</span>
                      </div>}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.obs}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
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
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(14,165,233,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#7dd3fc' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#7dd3fc' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> calcule o CAC e LTV antes de avaliar o ROI do marketing. Reserva de emergência zero é urgência absoluta — não há investimento que justifique operar sem proteção. E o projeto C tem o payback mais rápido de todos!
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Vitória vai crescer com excelência graças à sua carteira de investimentos!' : nota >= 80 ? 'Muito bom! Revise a sequência de alocação dos itens errados.' : 'Revise CAC, LTV e a importância da reserva antes de qualquer outro projeto.'}
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
