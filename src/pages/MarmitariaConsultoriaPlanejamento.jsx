import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, TrendingUp, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle,
  BookOpen, FileText, Briefcase, ArrowRight, ArrowDown
} from 'lucide-react';

const COR = '#a855f7';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

// ─── TEORIA ──────────────────────────────────────────────────────────────────
const blocosTeoría = [
  {
    titulo: '1. Orçamento vs. Resultado Real', cor: '#f59e0b', emoji: '📋',
    def: 'Planejar sem acompanhar não adianta. O ciclo do planejamento financeiro tem 3 etapas: Planejar (projetar receitas e custos), Executar (operar o mês) e Comparar (real vs. planejado). O desvio entre o que foi planejado e o que aconteceu é o principal indicador de maturidade de gestão.',
    formula: 'Desvio (%) = (Real − Planejado) ÷ Planejado × 100',
    exemplos: ['Receita planejada R$15.000, real R$13.200 → desvio −12%', 'Custo planejado R$10.000, real R$11.400 → desvio +14%', 'Desvio aceitável: até ±10%', 'Desvio recorrente: sinal de problema estrutural, não pontual'],
    alerta: 'O desvio de custo é mais perigoso que o de receita. Custo 14% acima do planejado com receita 12% abaixo gera uma tesoura que corrói o lucro em velocidade exponencial.',
  },
  {
    titulo: '2. Projeção com Juros Compostos', cor: '#6366f1', emoji: '📈',
    def: 'Crescer 10% ao mês parece modesto, mas em 6 meses transforma R$15.000 em R$26.600 (+77%). O problema: custos também crescem por compostos. Se custos sobem 5% ao mês e receita 8%, a diferença parece pequena — mas a margem aumenta continuamente. Se for o contrário (custo cresce mais), a margem encolhe até desaparecer.',
    formula: 'Valor no mês N = Valor Inicial × (1 + taxa)^N',
    exemplos: ['R$15.000 × (1,10)^6 = R$26.600 (+77%)', 'Custo R$11.000 × (1,05)^6 = R$14.750 (+34%)', 'Margem mês 1: R$4.000. Margem mês 6: R$11.850', 'Se custo sobe 12%: mês 6 custo R$21.700 → prejuízo de R$4.900'],
    alerta: 'A simulação no app usa juros compostos reais. Um diferencial de 2% entre crescimento de receita e custo parece insignificante no mês 1, mas gera enorme divergência no mês 6.',
  },
  {
    titulo: '3. Ponto de Equilíbrio Dinâmico', cor: '#22c55e', emoji: '⚖️',
    def: 'O ponto de equilíbrio não é fixo — ele muda conforme os custos fixos crescem (aluguel reajusta, contratou funcionário). Planejar o crescimento exige recalcular o PE a cada mudança estrutural. Expandir sem saber o novo PE é operar no escuro.',
    formula: 'PE (unidades) = Custo Fixo ÷ (Preço − Custo Variável Unitário)',
    exemplos: ['CF R$3.000, preço R$12, CVu R$7 → PE = 600 marmitas/mês', 'Contratou ajudante (+R$1.400 CF) → PE = 880 marmitas/mês (+47%)', 'Aumento de R$1 no preço reduz PE: novo PE = 560 marmitas', 'Toda mudança de custo fixo exige recalcular o PE'],
    alerta: 'Marmiteiros que expandem sem recalcular o PE descobrem tarde que precisam vender 40% mais só para cobrir os novos custos fixos da expansão.',
  },
  {
    titulo: '4. Reserva Financeira e Margem de Segurança', cor: '#ec4899', emoji: '🛡️',
    def: 'Planejamento sem reserva é ilusão. A meta de crescimento pode não se cumprir. Ingredientes podem encarecer. Equipamento pode quebrar. A reserva de 3 a 6 meses de custos fixos é o colchão que impede a crise pontual de virar falência.',
    formula: 'Reserva mínima = Custos Fixos Mensais × 3 meses',
    exemplos: ['CF R$3.500/mês → reserva mínima R$10.500', 'Equipamento quebra (gasto inesperado R$2.800)', 'Sem reserva: empréstimo de emergência a 8% a.m.', 'Com reserva: absorve o choque sem endividamento'],
    alerta: 'A reserva não é capital parado — é o que permite crescer com segurança. Um negócio sem reserva que tem oportunidade de crescer pode não ter caixa para executá-la.',
  },
];

// ─── EXEMPLOS SETORIAIS ───────────────────────────────────────────────────────
const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Fábrica de Sopas Congeladas', emoji: '🥣',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Sopa Boa Ltda. planeja lançar uma linha de sopas congeladas para supermercados. Veja como o planejamento financeiro estrutura o lançamento.',
    planejado: { receita: 22000, custoVariavel: 13200, custoFixo: 5500 },
    real: { receita: 18700, custoVariavel: 12100, custoFixo: 6200 },
    projecao: { crescimento: 12, inflaçãoCusto: 4 },
    analise: 'A receita ficou 15% abaixo do planejado (penetração no supermercado mais lenta que o esperado), mas os custos fixos cresceram 12,7% (contratação de operador antecipada). O desvio duplo corroeu o lucro de R$3.300 planejado para apenas R$400 realizado.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Delivery de Marmitas Fitness', emoji: '🥗',
    cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    descricao: 'O Nutri Delivery tem 120 clientes fixos de assinatura semanal. O modelo de receita recorrente facilita o planejamento financeiro.',
    planejado: { receita: 19200, custoVariavel: 11520, custoFixo: 4800 },
    real: { receita: 20400, custoVariavel: 12850, custoFixo: 4800 },
    projecao: { crescimento: 8, inflaçãoCusto: 6 },
    analise: 'Receita 6,25% acima do planejado (captou 15 clientes novos). Mas custo variável cresceu 11,5% (alta do frango e azeite). Margem planejada: 30,0%. Margem real: 27,7%. A gestão de compras precisa ser revisada — talvez trocar fornecedor ou ajustar o cardápio sazonal.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Catering Corporativo', emoji: '🍱',
    cor: '#ec4899', corBg: 'rgba(236,72,153,0.08)',
    descricao: 'A Chef Corp atende empresas com almoço diário. Contratos anuais trazem previsibilidade, mas exigem planejamento detalhado de custos.',
    planejado: { receita: 35000, custoVariavel: 21000, custoFixo: 7000 },
    real: { receita: 35000, custoVariavel: 23800, custoFixo: 7200 },
    projecao: { crescimento: 5, inflaçãoCusto: 8 },
    analise: 'Receita exatamente no planejado (contrato fixo). Porém custo variável 13,3% acima (inflação alimentar não prevista no contrato). O contrato não tem cláusula de reajuste. Em 6 meses, a inflação de custos de 8% sobre receita fixa vai eliminar toda a margem.',
  },
];

// ─── DOSSIÊ DA CONSULTORIA REAL ───────────────────────────────────────────────
const dossie = {
  empresa: 'Marmita da Cida',
  segmento: 'Marmitaria artesanal — vendas por WhatsApp e iFood',
  contexto: 'Cida tem 3 anos de negócio, vende em média 1.200 marmitas/mês a R$14,00. Quer contratar uma ajudante e alugar uma cozinha maior, mas não sabe se é o momento certo. Você foi contratado como consultor.',
  dados: {
    receitaMensal: 16800,
    custoVariavelUnitario: 6.50,
    custoFixoAtual: 3200,
    custoFixoNovo: 5100, // com ajudante + cozinha maior
    unidadesAtuais: 1200,
    precoUnitario: 14.00,
  },
  historico: [
    { mes: 'Jan', receita: 14200, custo: 11800 },
    { mes: 'Fev', receita: 15100, custo: 12200 },
    { mes: 'Mar', receita: 16800, custo: 12950 },
    { mes: 'Abr', receita: 16400, custo: 13100 },
    { mes: 'Mai', receita: 17200, custo: 13400 },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      
      contexto: 'Com os dados atuais (1.200 marmitas/mês, preço R$14, CVu R$6,50, CF R$3.200), qual o Ponto de Equilíbrio atual e a folga atual de segurança?',
      opcoes: [
        { id: 'a', texto: 'PE = 427 marmitas/mês. Folga: 773 marmitas acima do PE (64,4% de segurança)' },
        { id: 'b', texto: 'PE = 640 marmitas/mês. Folga: 560 marmitas acima do PE (46,7% de segurança)' },
        { id: 'c', texto: 'PE = 533 marmitas/mês. Folga: 667 marmitas acima do PE (55,6% de segurança)' },
        { id: 'd', texto: 'PE = 320 marmitas/mês. Folga: 880 marmitas acima do PE (73,3% de segurança)' },
      ],
      correta: 'a',
      explicacao: 'MCu = Preço − CVu = R$14 − R$6,50 = R$7,50. PE = CF ÷ MCu = R$3.200 ÷ R$7,50 = 427 marmitas. Produção atual: 1.200. Folga: 1.200 − 427 = 773 marmitas (64,4%). Excelente margem de segurança — Cida opera bem acima do ponto de equilíbrio.',
    },
    {
      id: 'c2',
      
      contexto: 'Se Cida contratar a ajudante e mudar para cozinha maior, o CF sobe para R$5.100. Qual o novo PE e qual o impacto na margem de segurança?',
      opcoes: [
        { id: 'a', texto: 'Novo PE = 680 marmitas. Margem de segurança cai de 64,4% para 43,3% — ainda saudável' },
        { id: 'b', texto: 'Novo PE = 1.020 marmitas. Margem cai de 64,4% para 15% — risco elevado' },
        { id: 'c', texto: 'Novo PE = 850 marmitas. Margem cai de 64,4% para 29,2% — atenção necessária' },
        { id: 'd', texto: 'Novo PE = 765 marmitas. Margem cai de 64,4% para 36,3% — aceitável' },
      ],
      correta: 'a',
      explicacao: 'Novo PE = R$5.100 ÷ R$7,50 = 680 marmitas. Margem de segurança: (1.200 − 680) ÷ 1.200 = 43,3%. A expansão é viável financeiramente — desde que Cida mantenha as 1.200 vendas atuais. Se vender menos de 680/mês, passa a dar prejuízo. A decisão é: ela consegue manter o volume com a operação maior?',
    },
    {
      id: 'c3',
      
      contexto: 'Analisando o histórico de 5 meses, qual a tendência de crescimento médio mensal da receita e o que ela indica para os próximos 3 meses?',
      opcoes: [
        { id: 'a', texto: 'Crescimento médio de ~4,7%/mês. Em 3 meses, receita projetada de R$19.300 — expansão bem suportada' },
        { id: 'b', texto: 'Crescimento médio de ~8%/mês. Em 3 meses, receita de R$21.200 — expansão necessária urgentemente' },
        { id: 'c', texto: 'Crescimento instável (queda em Abril). Não há tendência clara — esperar mais 3 meses antes de decidir' },
        { id: 'd', texto: 'Crescimento médio de ~2%/mês. Muito lento — expansão não recomendada' },
      ],
      correta: 'a',
      explicacao: 'Crescimento Jan→Mai: (R$17.200 − R$14.200) ÷ R$14.200 ÷ 4 meses = 5,3% ao mês (média). A queda em Abril (−2,4%) foi pontual (possivelmente feriados). A tendência geral é de crescimento sólido. Projetando 4,7%: Mês 6 ≈ R$18.010, Mês 7 ≈ R$18.856, Mês 8 ≈ R$19.742. A expansão é recomendada, mas com reserva de 3 meses de novos custos fixos antes de contratar.',
    },
    {
      id: 'c4',
      
      contexto: 'Os custos também vêm crescendo. De Jan a Mai, o custo total cresceu de R$11.800 para R$13.400. Isso é problema ou é normal?',
      opcoes: [
        { id: 'a', texto: 'Problema grave — custo cresceu 13,6% enquanto receita cresceu 21,1%. Tesoura de margem' },
        { id: 'b', texto: 'Normal e saudável — custo cresceu menos que a receita, margem está melhorando' },
        { id: 'c', texto: 'Indiferente — o que importa é o lucro absoluto, não a proporção' },
        { id: 'd', texto: 'Problema leve — custo cresceu igual à receita, margem estável' },
      ],
      correta: 'b',
      explicacao: 'Receita cresceu: (17.200 − 14.200) ÷ 14.200 = +21,1%. Custo cresceu: (13.400 − 11.800) ÷ 11.800 = +13,6%. Custo cresceu MENOS que a receita — ótimo sinal! A margem está melhorando. Jan: R$2.400 lucro (16,9%). Mai: R$3.800 lucro (22,1%). Cida está ganhando escala — cada marmita a mais gera mais lucro proporcionalmente. Isso valida a decisão de expandir.',
    },
    {
      id: 'c5',
      
      contexto: 'Qual a sua recomendação final como consultor para a Cida?',
      opcoes: [
        { id: 'a', texto: 'Não expandir — o risco de elevar o PE de 427 para 680 é alto demais para um negócio pequeno' },
        { id: 'b', texto: 'Expandir imediatamente — a tendência é clara e o novo PE de 680 ainda tem boa margem de segurança' },
        { id: 'c', texto: 'Expandir em 2 etapas: primeiro contratar a ajudante (CF +R$1.200), aguardar 2 meses para confirmar volume, depois mudar a cozinha' },
        { id: 'd', texto: 'Aumentar o preço para R$16,00 antes de expandir, para melhorar a margem de contribuição' },
      ],
      correta: 'c',
      explicacao: 'A melhor consultoria é a que minimiza risco sem impedir crescimento. Etapa 1: contratar a ajudante (CF sobe para R$4.400, PE = 587 marmitas — ainda 51% de margem de segurança). Se em 2 meses o volume se mantiver em 1.200+, etapa 2: mudar a cozinha. Essa abordagem escalonada valida o crescimento antes de assumir o custo fixo maior, e é a recomendação que um consultor experiente daria.',
    },
  ],
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
const DICAS = {
  c1: {
    titulo: `Ponto de Equilibrio`,
    formula: `PE(R$) = Custo Fixo / MC%
PE(unid) = Custo Fixo / MC unitaria
MC% = (Preco - CVu) / Preco x 100
Margem de Seguranca = (Fat - PE) / Fat`,
    raciocinio: `Calcule a MC unitaria (preco menos custo variavel por unidade). Divida o custo fixo pela MC unitaria para encontrar quantas unidades precisa vender sem prejuizo.`,
  },
  c2: {
    titulo: `Novo PE apos mudanca de Custo Fixo`,
    formula: `Novo PE = Novo CF / MC%
Delta PE = Novo PE - PE antigo
Delta vendas = Delta PE / Preco
Expansao se justifica se: aumento capacidade maior que delta vendas`,
    raciocinio: `Quando o custo fixo sobe, o PE sobe proporcionalmente. Calcule o novo PE e verifique se a nova capacidade produtiva consegue atingi-lo.`,
  },
  c3: {
    titulo: `Taxa de Crescimento Mensal`,
    formula: `Crescimento medio = (Receita final - Receita inicial) / (n-1) periodos
Taxa composta = (Rfinal / Rinicial)^(1/n) - 1
Projecao = Receita atual x (1 + taxa)^meses`,
    raciocinio: `Use o crescimento medio dos ultimos meses para projetar os proximos. Se irregular, use media simples. Se consistente, use taxa composta (mais precisa).`,
  },
  c4: {
    titulo: `Analise Custo x Receita`,
    formula: `Custo como % da receita = Custo Total / Receita x 100
Se % custo cresce enquanto receita cresce:
-> Eficiencia caindo (custos crescem mais que receita)
Ideal: % custo constante ou caindo (ganho de escala)`,
    raciocinio: `Calcule o custo como percentual da receita em cada mes. Se essa porcentagem esta crescendo, os custos crescem mais rapido que as receitas - sinal de perda de eficiencia.`,
  },
  c5: {
    titulo: `Framework de Decisao Estrategica`,
    formula: `Decisao de expansao - 3 criterios:
1. PE novo menor ou igual a capacidade nova
2. Reserva suficiente para mes ruim
3. MC extra maior que custo fixo extra
So expandir quando os 3 forem positivos`,
    raciocinio: `Uma boa recomendacao avalia os tres criterios. Expansao prematura antes de ter reserva e demanda comprovada e a causa numero 1 de falencia de pequenos negocios.`,
  },
};

export default function MarmitariaConsultoriaPlanejamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const lucroPlaneado = ex.planejado.receita - ex.planejado.custoVariavel - ex.planejado.custoFixo;
  const lucroReal = ex.real.receita - ex.real.custoVariavel - ex.real.custoFixo;
  const desvioReceita = ((ex.real.receita - ex.planejado.receita) / ex.planejado.receita * 100).toFixed(1);
  const desvioCV = ((ex.real.custoVariavel - ex.planejado.custoVariavel) / ex.planejado.custoVariavel * 100).toFixed(1);
  const desvioLucro = ((lucroReal - lucroPlaneado) / Math.abs(lucroPlaneado) * 100).toFixed(1);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/planejamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><TrendingUp size={22} color={COR} /> Consultoria: Planejamento Financeiro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(139,92,246,0.08) 100%)', borderColor: 'rgba(168,85,247,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Planejamento Financeiro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Planejar, Executar, Comparar — e Decidir</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Planejamento financeiro não é prever o futuro — é ter <strong style={{ color: 'var(--text-main)' }}>critérios claros para tomar decisões</strong> quando o futuro chegar diferente do esperado. No desafio, você será consultor de uma marmitaria real.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(168,85,247,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c084fc' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {/* ══ TEORIA ══ */}
      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Fundamentos do Planejamento Financeiro</h2>
            {blocosTeoría.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
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
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos Práticos →</button>
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

          {/* Tabela Planejado vs Real */}
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
                    { item: 'Receita', plan: ex.planejado.receita, real: ex.real.receita, desv: desvioReceita },
                    { item: 'Custo Variável', plan: ex.planejado.custoVariavel, real: ex.real.custoVariavel, desv: desvioCV },
                    { item: 'Custo Fixo', plan: ex.planejado.custoFixo, real: ex.real.custoFixo, desv: ((ex.real.custoFixo - ex.planejado.custoFixo) / ex.planejado.custoFixo * 100).toFixed(1) },
                    { item: 'Lucro Líquido', plan: lucroPlaneado, real: lucroReal, desv: desvioLucro },
                  ].map((row, i) => {
                    const dv = parseFloat(row.desv);
                    const isLucro = row.item === 'Lucro Líquido';
                    const isCusto = row.item !== 'Receita' && row.item !== 'Lucro Líquido';
                    const cor = isLucro ? (dv >= 0 ? '#22c55e' : '#ef4444') : isCusto ? (dv > 5 ? '#ef4444' : dv > 0 ? '#f59e0b' : '#22c55e') : (dv >= 0 ? '#22c55e' : '#ef4444');
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontWeight: isLucro ? 700 : 400 }}>
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

      {/* ══ DESAFIO: CONSULTORIA REAL ══ */}
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
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Receita Mensal', valor: formatBRL(dossie.dados.receitaMensal), cor: '#22c55e' },
                { label: 'Marmitas/mês', valor: '1.200', cor: COR },
                { label: 'Preço unitário', valor: 'R$ 14,00', cor: '#6366f1' },
                { label: 'CVu', valor: 'R$ 6,50', cor: '#f59e0b' },
                { label: 'CF Atual', valor: formatBRL(dossie.dados.custoFixoAtual), cor: '#ef4444' },
                { label: 'CF com expansão', valor: formatBRL(dossie.dados.custoFixoNovo), cor: '#ef4444' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.cor}` }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: k.cor }}>{k.valor}</div>
                </div>
              ))}
            </div>

            {/* Histórico */}
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>📅 Histórico dos últimos 5 meses</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
              {dossie.historico.map((m, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{m.mes}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#22c55e' }}>{formatBRL(m.receita)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{formatBRL(m.custo)}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a855f7', marginTop: '0.25rem' }}>{formatBRL(m.receita - m.custo)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#22c55e' }}>■ Receita</span>
              <span style={{ color: '#ef4444' }}>■ Custo Total</span>
              <span style={{ color: COR }}>■ Lucro</span>
            </div>
          </div>

          {/* Perguntas da Consultoria */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pergunta da Consultoria</div>
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
                  <strong style={{ color: '#facc15' }}>Como um consultor real pensa:</strong> leia todos os dados do dossiê antes de responder. O histórico de 5 meses é tão importante quanto os KPIs atuais. Boa consultoria é baseada em tendência, não apenas em foto do mês atual.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : nota >= 60 ? '📊' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Você pensa como um consultor financeiro experiente!' : nota >= 80 ? 'Muito bom! Revise as recomendações dos itens errados.' : nota >= 60 ? 'Bom início! Releia o dossiê e os raciocínios apresentados.' : 'Revise a teoria e o dossiê completo antes de tentar novamente.'}
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
