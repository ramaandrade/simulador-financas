import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Briefcase, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Target, Lightbulb, Award,
  AlertCircle, BookOpen, TrendingUp, PiggyBank, Scale
} from 'lucide-react';

const COR = '#0ea5e9';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const formatBRL2 = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function jurosCompostos(pv, taxaMensal, meses) {
  return pv * Math.pow(1 + taxaMensal / 100, meses);
}
function roi(lucro, investimento) {
  return ((lucro / investimento) * 100).toFixed(1);
}
function payback(investimento, lucroMensal) {
  return (investimento / lucroMensal).toFixed(1);
}

// ─── TEORIA ───────────────────────────────────────────────────────────────────
const blocos = [
  {
    titulo: '1. Custo de Oportunidade: O Inimigo Invisível', cor: '#f59e0b', emoji: '⚖️',
    def: 'Toda decisão de investimento tem um custo invisível: o que você deixou de ganhar com a segunda melhor opção. Se você aplica R$20.000 na poupança a 0,7%/mês quando poderia reinvestir no negócio a 4%/mês, o custo de oportunidade em 12 meses é a diferença entre esses retornos.',
    formula: 'Custo de Oportunidade = Retorno da melhor alternativa − Retorno da opção escolhida\nEM 12 MESES: R$20.000 × (1,04^12 − 1,007^12) = diferença brutal',
    exemplos: ['R$20.000 na poupança (0,7%/mês): vira R$21.748 em 12 meses', 'R$20.000 reinvestidos no negócio (4%/mês): vira R$32.010 em 12 meses', 'Custo de oportunidade: R$10.262 em 12 meses', 'Escolha errada = R$10.000 "doados" ao banco sem perceber'],
    alerta: 'O custo de oportunidade só vale se o retorno do negócio for comprovado — não estimado otimistamente. Antes de comparar, calcule o ROI real dos últimos 6 meses.',
  },
  {
    titulo: '2. ROI e Payback: As Duas Réguas do Investimento', cor: '#6366f1', emoji: '📐',
    def: 'ROI (Retorno sobre Investimento) mede quanto você ganha em relação ao que investiu. Payback mede em quanto tempo recupera o capital investido. Projetos com ROI alto e Payback curto são os favoritos. Mas atenção: payback curto com ROI baixo pode não valer o risco.',
    formula: 'ROI = (Lucro gerado pelo projeto / Investimento) × 100\nPayback = Investimento / Lucro adicional mensal',
    exemplos: ['Forno novo R$18.000, lucro extra R$2.400/mês → Payback 7,5 meses', 'ROI = R$2.400/R$18.000 × 100 = 13,3%/mês', 'Tesouro Selic: ROI ~0,85%/mês. Forno: 13,3%/mês', 'Vantagem do forno: 15,6× mais rentável que o Tesouro'],
    alerta: 'O Payback simples ignora o que acontece depois que o capital é recuperado. Um equipamento que dura 10 anos com payback de 8 meses gera lucro por mais 9,3 anos após se pagar.',
  },
  {
    titulo: '3. VPL: Valor Presente Líquido', cor: '#22c55e', emoji: '📊',
    def: 'O VPL traz todos os fluxos de caixa futuros de um projeto para o valor presente, descontando uma taxa mínima de atratividade (TMA). Se VPL > 0, o projeto cria valor acima da alternativa de referência. Se VPL < 0, é melhor investir na taxa de referência.',
    formula: 'VPL = −Investimento + Σ [FC_t / (1 + TMA)^t]\nTMA típica para pequenas empresas: CDI + 5% ao ano',
    exemplos: ['Projeto A: investimento R$15.000, retorno R$2.000/mês por 12 meses', 'TMA 1%/mês: VPL = R$22.523 − R$15.000 = R$7.523 ✅', 'Projeto B: investimento R$30.000, retorno R$2.200/mês por 12 meses', 'VPL = R$24.775 − R$30.000 = −R$5.225 ❌'],
    alerta: 'VPL negativo significa que o projeto destrói valor em relação à taxa mínima — seria melhor deixar o dinheiro no Tesouro. Projetos com VPL positivo criam valor acima da alternativa livre de risco.',
  },
  {
    titulo: '4. Diversificação: Não Apostar Tudo em Uma Carta', cor: '#ec4899', emoji: '🃏',
    def: 'Empreendedores costumam colocar todo o lucro de volta no negócio. Isso maximiza o retorno mas também maximiza o risco — se o negócio enfrentar crise, perdem tudo. A diversificação inteligente divide o capital: parte reinvestida, parte em reserva, parte em ativos financeiros.',
    formula: 'Regra 70-20-10: 70% reinvestimento no negócio\n20% reserva de emergência (renda fixa líquida)\n10% investimento pessoal (longo prazo)',
    exemplos: ['Lucro anual R$36.000: reinveste R$25.200, reserva R$7.200, pessoal R$3.600', 'Reserva em CDB liquidez diária: disponível em 1 dia se precisar', '10% em renda variável: proteção de longo prazo contra inflação', 'Regra adaptável: em crescimento acelerado, pode ir a 85-10-5'],
    alerta: 'A reserva de emergência (20%) não é o mesmo que o capital de giro. São coisas diferentes: CG cobre o ciclo operacional; reserva cobre crises inesperadas. Ter só uma delas é insuficiente.',
  },
];

// ─── EXEMPLOS SETORIAIS ───────────────────────────────────────────────────────
const exemplos = [
  {
    id: 'reinvestimento', tipo: 'Reinvestimento', subtipo: 'Forno vs Renda Fixa', emoji: '🍳',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    investimento: 18000, lucroMensal: 2400, meses: 12, taxaRF: 0.85,
    descricao: 'Dona Rosa acumulou R$18.000 de lucro. Família sugere CDB. Ela pensa em comprar um segundo forno para dobrar a produção de marmitas no jantar.',
    projeto: 'Segundo forno combinado — capacidade: +80 marmitas/dia no turno noturno',
  },
  {
    id: 'expansao', tipo: 'Expansão Operacional', subtipo: 'Entregador vs App Delivery', emoji: '🛵',
    cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    investimento: 8000, lucroMensal: 1600, meses: 12, taxaRF: 0.85,
    descricao: 'Carlos quer contratar um entregador fixo (R$8.000/ano entre salário e encargos) para abandonar o iFood e montar delivery próprio com margem maior.',
    projeto: 'Entregador próprio: elimina comissão de 25% do iFood em R$6.400/mês de pedidos',
  },
  {
    id: 'misto', tipo: 'Carteira Mista', subtipo: 'Negócio + Tesouro', emoji: '⚖️',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    investimento: 30000, lucroMensal: 3200, meses: 24, taxaRF: 0.85,
    descricao: 'Empresária de catering acumulou R$30.000. Divide: R$20.000 em novo equipamento, R$10.000 em Tesouro Selic como reserva de segurança.',
    projeto: 'Câmara fria R$20.000 (lucro extra R$3.200/mês) + Tesouro R$10.000 (segurança)',
  },
];

// ─── DOSSIÊ DA CONSULTORIA ────────────────────────────────────────────────────
const dossie = {
  empresa: 'Marmitas da Tereza',
  segmento: 'Marmitaria artesanal — delivery e empresa — faturamento R$ 19.200/mês',
  contexto: 'Tereza, 41 anos, tem a marmitaria há 6 anos. Acumulou R$28.000 de lucro nos últimos 8 meses (juntou com disciplina). Tem 4 projetos em mente e não sabe como alocar. O marido quer colocar tudo no CDB. Você foi contratado como consultor de investimentos.',
  capital: 28000,
  taxaRF: 0.85,
  projetos: [
    {
      id: 'A', nome: 'Câmara Fria Industrial',
      valor: 12000, lucroMensal: 2100, prazoMeses: 60,
      risco: 'baixo', cor: '#22c55e',
      descricao: 'Permite estocar ingredientes em maior quantidade, comprar a preço de atacado e reduzir o CMV de 58% para 51%. Lucro extra: R$2.100/mês.',
      obs: 'Equipamento físico. ROI direto e mensurável.',
    },
    {
      id: 'B', nome: 'Van de Entrega (Usada)',
      valor: 22000, lucroMensal: 1800, prazoMeses: 60,
      risco: 'médio', cor: '#f59e0b',
      descricao: 'Elimina R$3.200/mês de custo com entregadores terceiros. Mas van tem manutenção (estimada R$400/mês) — lucro líquido extra: R$1.800/mês.',
      obs: 'Maior investimento. Depreciação e manutenção reduzem o retorno líquido.',
    },
    {
      id: 'C', nome: 'Tesouro Selic (Reserva)',
      valor: 10000, lucroMensal: 85, prazoMeses: 12,
      risco: 'nulo', cor: '#6366f1',
      descricao: 'Reserva de emergência em Tesouro Selic (liquidez diária). Rende ~0,85%/mês. Não é investimento produtivo — é proteção.',
      obs: 'Essencial para saúde financeira. Não deve ser comparado com projetos produtivos.',
    },
    {
      id: 'D', nome: 'Tráfego Pago (Instagram Ads)',
      valor: 4000, lucroMensal: 1100, prazoMeses: 3,
      risco: 'alto', cor: '#ef4444',
      descricao: 'Campanha de 3 meses para captar clientes empresariais (almoço corporativo). Potencial: R$1.100/mês de lucro extra se conversão atingir meta. Mas resultado não garantido.',
      obs: 'Alto risco: resultado depende de conversão. Se não converter bem, perde R$4.000.',
    },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      contexto: 'O marido quer colocar os R$28.000 todos no CDB a 0,85%/mês. Quanto isso renderá em 12 meses? Compare com o Projeto A (câmara fria) no mesmo período.',
      opcoes: [
        { id: 'a', texto: 'CDB: R$28.000 → R$30.964 (+R$2.964). Câmara fria R$12.000: +R$25.200 em 12 meses. O projeto produtivo é 8,5× mais rentável' },
        { id: 'b', texto: 'CDB: R$28.000 → R$31.200. Câmara fria: R$25.000 em lucro. Diferença pequena não justifica risco' },
        { id: 'c', texto: 'CDB: R$28.000 → R$30.000. Câmara fria: R$15.000 em lucro. Equivalentes considerando o risco' },
        { id: 'd', texto: 'CDB: R$28.000 → R$34.800. Câmara fria: R$12.600 em lucro. CDB é melhor neste horizonte' },
      ],
      correta: 'a',
      explicacao: 'CDB: R$28.000 × (1,0085)^12 = R$30.964. Lucro: R$2.964. Câmara fria: R$2.100/mês × 12 = R$25.200 de lucro adicional (sobre o investimento de R$12.000). ROI câmara fria: 17,5%/mês vs CDB: 0,85%/mês. O custo de oportunidade de colocar tudo no CDB é gigantesco: Tereza deixaria de ganhar R$22.236 (R$25.200 − R$2.964) em apenas 12 meses.',
    },
    {
      id: 'c2',
      contexto: 'Compare o ROI e o Payback do Projeto A (câmara fria R$12.000 / R$2.100/mês) e do Projeto B (van R$22.000 / R$1.800/mês). Qual é melhor financeiramente?',
      opcoes: [
        { id: 'a', texto: 'Projeto A: ROI 17,5%/mês, Payback 5,7 meses. Projeto B: ROI 8,2%/mês, Payback 12,2 meses. A é muito superior em ambas as métricas' },
        { id: 'b', texto: 'Projeto B gera mais receita absoluta, portanto é melhor' },
        { id: 'c', texto: 'Projeto A: ROI 12%/mês. Projeto B: ROI 10%/mês. Diferença pequena — escolher pela necessidade operacional' },
        { id: 'd', texto: 'Projeto B: investimento maior = retorno maior. É a melhor escolha para quem tem R$28.000' },
      ],
      correta: 'a',
      explicacao: 'Projeto A: ROI = R$2.100 ÷ R$12.000 = 17,5%/mês. Payback = R$12.000 ÷ R$2.100 = 5,7 meses. Projeto B: ROI = R$1.800 ÷ R$22.000 = 8,2%/mês. Payback = R$22.000 ÷ R$1.800 = 12,2 meses. O Projeto A é claramente superior: ROI 2,1× maior e payback 2,1× mais rápido. Investir mais (Projeto B) não é sinônimo de melhor retorno. R$ por R$ aplicado, a câmara fria é muito mais eficiente.',
    },
    {
      id: 'c3',
      contexto: 'O Projeto C (Tesouro Selic R$10.000) tem ROI muito inferior aos projetos produtivos. Por que ele ainda deve fazer parte da carteira de Tereza?',
      opcoes: [
        { id: 'a', texto: 'Não deve — ROI baixo nunca se justifica quando há projetos produtivos disponíveis' },
        { id: 'b', texto: 'Deve — é a reserva de emergência. Se a câmara fria quebrar ou as vendas caírem, Tereza tem R$10.000 líquidos sem precisar de empréstimo de emergência' },
        { id: 'c', texto: 'Deve — mas apenas se Tereza não tiver confiança no negócio' },
        { id: 'd', texto: 'Indiferente — pode ser substituído por deixar o dinheiro na conta corrente' },
      ],
      correta: 'b',
      explicacao: 'O Tesouro Selic não é investimento produtivo — é reserva de segurança. Função diferente: não maximizar retorno, mas garantir liquidez em crises. Sem reserva, qualquer imprevisto (equipamento quebra, queda de vendas, doença) força Tereza a buscar empréstimo emergencial a 8-10%/mês. A reserva de R$10.000 "custando" 0,85%/mês economiza potencialmente R$800-1.000/mês em juros de crise. O custo da reserva é o prêmio do seguro.',
    },
    {
      id: 'c4',
      contexto: 'O Projeto D (Instagram Ads R$4.000) tem ROI de 27,5%/mês se a meta for atingida — o mais alto de todos. Por que não deve receber a maior parte do capital?',
      opcoes: [
        { id: 'a', texto: 'Porque ROI alto significa risco alto. Se a campanha não converter, perde R$4.000 sem retorno. É o único projeto sem resultado garantido' },
        { id: 'b', texto: 'Porque marketing não é investimento — é despesa. Nunca deve receber capital de investimento' },
        { id: 'c', texto: 'Porque ROI de 3 meses não é comparável com projetos de 60 meses' },
        { id: 'd', texto: 'Porque R$4.000 é muito pouco para uma campanha eficaz de Instagram' },
      ],
      correta: 'a',
      explicacao: 'ROI potencial alto de 27,5%/mês (R$1.100 ÷ R$4.000) só se realiza SE a campanha converter bem. Marketing digital tem resultado incerto — dependente de segmentação, criativo, sazonalidade e concorrência. Os outros 3 projetos têm retorno previsível (equipamento produz, van entrega). O Projeto D tem risco binário: funciona muito bem ou não funciona. Por isso, deve receber capital limitado (15-20% do portfólio de risco), não o investimento principal.',
    },
    {
      id: 'c5',
      contexto: 'Qual a alocação ideal dos R$28.000 de Tereza, considerando ROI, risco, reserva de emergência e diversificação?',
      opcoes: [
        { id: 'a', texto: 'R$12.000 Projeto A + R$10.000 Projeto C + R$4.000 Projeto D + R$2.000 reserva em conta = alocação diversificada e eficiente' },
        { id: 'b', texto: 'R$22.000 Projeto B + R$6.000 restante no CDB = máximo produtivo' },
        { id: 'c', texto: 'R$28.000 todos no CDB — segurança primeiro para quem tem família' },
        { id: 'd', texto: 'R$28.000 todos no Projeto A — maximizar o melhor ROI' },
      ],
      correta: 'a',
      explicacao: 'Alocação recomendada: R$12.000 no Projeto A (melhor ROI, baixo risco, payback 5,7 meses); R$10.000 no Projeto C (reserva essencial — 3 meses de custo fixo R$3.200 = mínimo R$9.600); R$4.000 no Projeto D (testar marketing com capital que pode perder sem comprometer o negócio); R$2.000 mantidos em conta para giro. Essa alocação: maximiza o retorno produtivo (câmara fria), protege a operação (reserva), e testa crescimento de clientes (marketing) com exposição controlada. O Projeto B (van) fica para quando gerar mais capital — payback mais longo e investimento maior não se justificam agora.',
    },
  ],
};

export default function MarmitariaConsultoriaInvestimentos() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [exemploAtivo, setExemploAtivo] = useState('reinvestimento');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const retornoRF = jurosCompostos(ex.investimento, ex.taxaRF, ex.meses);
  const retornoProjeto = ex.lucroMensal * ex.meses;
  const roiMes = (ex.lucroMensal / ex.investimento * 100).toFixed(1);
  const pbk = payback(ex.investimento, ex.lucroMensal);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/investimentos')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Briefcase size={22} color={COR} /> Consultoria: Gestão de Investimentos</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(6,182,212,0.08) 100%)', borderColor: 'rgba(14,165,233,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Gestão de Investimentos
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Onde Colocar o Lucro? A Carteira do Empreendedor</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Um negócio bem-gerido gera lucro. Mas <strong style={{ color: 'var(--text-main)' }}>onde alocar esse lucro</strong> define se o negócio vai crescer, estagnar ou retroceder. No desafio, você monta a carteira de investimentos de Tereza.
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Fundamentos da Gestão de Investimentos</h2>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>{ex.projeto}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { l: 'Investimento', v: formatBRL(ex.investimento), c: '#6366f1' },
              { l: 'Lucro extra/mês', v: formatBRL(ex.lucroMensal), c: '#22c55e' },
              { l: 'ROI mensal', v: `${roiMes}%`, c: '#f59e0b' },
              { l: 'Payback', v: `${pbk} meses`, c: COR },
              { l: `Retorno projeto ${ex.meses}m`, v: formatBRL(retornoProjeto), c: '#22c55e' },
              { l: `Renda fixa ${ex.meses}m`, v: formatBRL(retornoRF - ex.investimento), c: '#ef4444' },
              { l: 'Custo oportunidade', v: formatBRL(retornoProjeto - (retornoRF - ex.investimento)), c: ex.cor },
              { l: 'Vantagem vs RF', v: `${((ex.lucroMensal / ex.investimento) / (ex.taxaRF / 100)).toFixed(1)}×`, c: '#22c55e' },
            ].map((k, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          {/* Dossiê */}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'Capital disponível', v: formatBRL(dossie.capital), c: '#22c55e' },
                { l: 'Faturamento/mês', v: 'R$ 19.200', c: COR },
                { l: 'Custo fixo/mês', v: 'R$ 3.200', c: '#ef4444' },
                { l: 'Taxa renda fixa', v: '0,85%/mês', c: '#6366f1' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 4 Projetos em Análise</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {dossie.projetos.map(p => {
                const roiP = (p.lucroMensal / p.valor * 100).toFixed(1);
                const pbkP = (p.valor / p.lucroMensal).toFixed(1);
                return (
                  <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: p.cor }}>Projeto {p.id}</span>
                      <span style={{ background: `rgba(${p.risco === 'nulo' ? '99,102,241' : p.risco === 'baixo' ? '34,197,94' : p.risco === 'médio' ? '245,158,11' : '239,68,68'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 600 }}>risco {p.risco}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{p.nome}</div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.descricao}</p>
                    {[
                      { l: 'Investimento', v: formatBRL(p.valor) },
                      { l: 'Lucro extra/mês', v: formatBRL(p.lucroMensal) },
                      { l: 'ROI mensal', v: `${roiP}%` },
                      { l: 'Payback', v: `${pbkP} meses` },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                        <span style={{ fontWeight: 600, color: p.cor }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '0.6rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.obs}</div>
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> analise cada projeto pelo ROI e Payback, mas lembre-se que risco e liquidez importam tanto quanto retorno. Um projeto com ROI de 27% mas resultado incerto pode ser pior que um de 17% com resultado garantido.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Tereza vai crescer com a carteira que você montou!' : nota >= 80 ? 'Muito bom! Revise as alocações dos itens errados.' : 'Revise ROI, Payback e a importância da reserva de emergência.'}
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
