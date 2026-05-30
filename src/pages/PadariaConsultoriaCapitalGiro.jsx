import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCcw, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen } from 'lucide-react';

const COR = '#10b981';

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Moinhos de Trigo', emoji: '⚙️', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'O Moinho Grande vende farinha em sacos de 50kg para padarias. O setor industrial tem ciclo financeiro positivo — precisa financiar estoque antes de receber.',
    pme: 20, pmr: 30, pmp: 15,
    faturamentoDiario: 5000,
    contexto: 'Indústria pesada: estoca matéria-prima 20 dias, entrega com prazo de 30 dias e paga fornecedor de trigo em 15 dias.',
    insight: 'Ao contrário da padaria que é cliente, o moinho tem CF positivo (+35 dias). Para cada R$5.000/dia de faturamento, precisa de R$175.000 de capital de giro. É por isso que moinhos precisam de capital intensivo e raramente são pequenos negócios.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Padaria Tradicional', emoji: '🥖', cor: COR, corBg: 'rgba(16,185,129,0.08)',
    descricao: 'A Padaria Pão Nosso recebe farinha do moinho a 30 dias, assou e vendeu em 10 dias, e recebeu do cliente em 1 dia (Pix/débito). OPM em ação.',
    pme: 10, pmr: 1, pmp: 30,
    faturamentoDiario: 1500,
    contexto: 'Padaria clássica: compra a prazo (boleto 30 dias), vende rápido, recebe quase à vista.',
    insight: 'CF = 10 + 1 − 30 = −19 dias. NEGATIVO! A padaria recebe o dinheiro dos clientes 19 dias ANTES de precisar pagar o moinho. São R$28.500 que ficam temporariamente no caixa da padaria — dinheiro do fornecedor financiando a operação.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Escola de Panificação', emoji: '👨‍🍳', cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A Escola Pão & Arte cobra mensalidade antecipada e usa os ingredientes durante o mês. O modelo de serviço com pagamento antecipado é o melhor para o caixa.',
    pme: 5, pmr: 0, pmp: 15,
    faturamentoDiario: 400,
    contexto: 'Aluno paga a mensalidade no início do mês (PMR=0), ingredientes duram 5 dias em estoque, fornecedor recebe em 15 dias.',
    insight: 'CF = 5 + 0 − 15 = −10 dias. Negativo novamente! A escola recebe antes de gastar. Modelo de negócio com pagamento antecipado é a estratégia mais eficaz para zerar a necessidade de capital de giro em serviços.',
  },
];

const questoes = [
  {
    id: 'q1',
    dica: { titulo: 'Ciclo Operacional e Financeiro', formula: 'CO = PME + PMR\nCF = CO − PMP\n\nPME = dias em estoque\nPMR = dias para receber\nPMP = prazo que o fornecedor dá\n\nCF positivo → precisa financiar\nCF negativo → recebe antes de pagar', raciocinio: 'Some PME + PMR para o ciclo operacional. Subtraia PMP. O resultado positivo é quantos dias você financia com capital próprio.' },
    enunciado: 'A padaria tem PME=10, PMR=1, PMP=30. Calcule o Ciclo Financeiro e explique por que isso é vantajoso.',
    opcoes: [
      { id: 'a', texto: 'CF = +41 dias — padaria precisa de muito capital de giro' },
      { id: 'b', texto: 'CF = −19 dias — padaria usa dinheiro do fornecedor por 19 dias' },
      { id: 'c', texto: 'CF = +11 dias — padaria tem pequena necessidade de capital' },
      { id: 'd', texto: 'CF = 0 dias — operação perfeitamente equilibrada' },
    ],
    correta: 'b',
    explicacao: 'CO = PME + PMR = 10 + 1 = 11 dias. CF = CO − PMP = 11 − 30 = −19 dias. NEGATIVO. A padaria vende e recebe em 11 dias, mas só paga o moinho em 30 dias. Nos 19 dias de diferença, o dinheiro dos clientes fica no caixa — é o conceito de OPM (Other People\'s Money): o fornecedor financia a operação.',
  },
  {
    id: 'q2',
    dica: { titulo: 'NCG — Necessidade de Capital de Giro', formula: 'NCG = Ciclo Financeiro × Faturamento Diário\nFaturamento diário = Faturamento mensal ÷ 30\n\nEx: CF=27 dias, fat/dia=R$600\nNCG = 27 × R$600 = R$16.200', raciocinio: 'A NCG é quanto dinheiro precisa estar no caixa para a empresa continuar operando sem empréstimo. Multiplique o CF pelo faturamento diário.' },
    enunciado: 'Por que a padaria consegue operar com ciclo financeiro negativo, mas a marmitaria (que vende no iFood) não consegue?',
    opcoes: [
      { id: 'a', texto: 'Porque a padaria tem mais clientes e fatura mais' },
      { id: 'b', texto: 'Porque a padaria tem PMR baixo (Pix/débito = recebe rápido) e PMP alto (moinho dá 30 dias)' },
      { id: 'c', texto: 'Porque a padaria não paga impostos como a marmitaria' },
      { id: 'd', texto: 'Porque a padaria tem produto mais barato e menor CMV' },
    ],
    correta: 'b',
    explicacao: 'A chave está nos prazos: padaria recebe quase à vista (PMR=1 dia) e paga fornecedor com prazo longo (PMP=28-30 dias). A marmitaria que vende no iFood tem PMR=30 dias (espera o repasse) e paga ingredientes na feira à vista (PMP=0). Inversão completa dos prazos — por isso o ciclo da marmitaria é positivo (precisa de capital) e o da padaria é negativo (gera caixa).',
  },
  {
    id: 'q3',
    dica: { titulo: 'Estratégia de Redução da NCG', formula: 'Para reduzir NCG, reduza o CF:\n→ Reduza PME (menos estoque)\n→ Reduza PMR (receba mais rápido)\n→ Aumente PMP (negocie mais prazo)\n\nImpacto: cada dia reduzido no CF\n= faturamento diário liberado em caixa', raciocinio: 'A alavanca mais poderosa é aquela que mais contribui para o CF alto. Se o PMR é 30 dias, reduzi-lo é mais impactante do que reduzir o PME de 2 dias.' },
    enunciado: 'Uma padaria quer expandir e comprar um segundo forno. O gestor bancário pede "prova de capital de giro". Como a padaria deve argumentar?',
    opcoes: [
      { id: 'a', texto: 'Apresentar extrato bancário mostrando saldo positivo recorrente' },
      { id: 'b', texto: 'Mostrar que o CF é negativo — a expansão não aumenta necessidade de capital, o fornecedor cobre' },
      { id: 'c', texto: 'Comprovar que tem estoque suficiente para o crescimento' },
      { id: 'd', texto: 'Apresentar fiador com patrimônio equivalente ao valor do forno' },
    ],
    correta: 'b',
    explicacao: 'Com CF negativo, a padaria é um negócio que se autofinancia — quanto mais vende, mais caixa gera (não consome). O banco precisa entender que o risco de capital de giro é baixo: o ciclo financeiro favorável significa que a expansão não cria nova necessidade de financiamento para operação. O crédito seria apenas para o ativo fixo (forno), não para capital de giro.',
  },
  {
    id: 'q4',
    dica: { titulo: 'Impacto do Canal de Venda no CF', formula: 'iFood: PMR ≈ 30 dias\nPix direto: PMR = 0 dias\n\nCom iFood: CF = PME + 30 − PMP\nCom Pix: CF = PME + 0 − PMP\n\nDiferença = 30 dias × faturamento diário\n= capital liberado ao migrar para Pix', raciocinio: 'Calcule a NCG nos dois cenários. A diferença é o capital que seria liberado ao abandonar o marketplace. Compare esse benefício com a perda de clientes do iFood.' },
    enunciado: 'A padaria começa a vender pelo iFood (PMR sobe para 15 dias) e a comprar ingredientes extras à vista (PMP cai para 20 dias). O que acontece com o CF?',
    opcoes: [
      { id: 'a', texto: 'CF ainda negativo (−5 dias) — mantém vantagem, mas menor' },
      { id: 'b', texto: 'CF zero — equilíbrio perfeito, sem necessidade de capital' },
      { id: 'c', texto: 'CF positivo (+5 dias) — perdeu a vantagem, agora precisa de capital' },
      { id: 'd', texto: 'CF não muda — depende só do PME' },
    ],
    correta: 'c',
    explicacao: 'Novo CF = PME + PMR − PMP = 10 + 15 − 20 = +5 dias. POSITIVO! A padaria perdeu sua grande vantagem ao adotar canal com PMR alto e reduzir o prazo de pagamento. Para faturamento de R$1.500/dia, criou NCG de R$7.500. Lição: cada canal de venda e fornecedor impacta diretamente o ciclo financeiro.',
  },
  {
    id: 'q5',
    dica: { titulo: 'Ciclo Financeiro Negativo', formula: 'CF negativo = PMP > CO\n\nSignifica: o fornecedor financia mais tempo\ndo que o ciclo operacional total\n\nResultado: você recebe antes de pagar\n→ o negócio gera caixa automaticamente\n→ pode crescer sem capital externo', raciocinio: 'CF negativo não é ruim — é o melhor cenário possível. Padarias com venda no balcão + compra parcelada têm isso naturalmente.' },
    enunciado: 'O que é OPM (Other People\'s Money) no contexto da padaria?',
    opcoes: [
      { id: 'a', texto: 'Empréstimo bancário para capital de giro a juros baixos' },
      { id: 'b', texto: 'Investimento de sócios externos no negócio' },
      { id: 'c', texto: 'Usar o prazo de pagamento do fornecedor como se fosse crédito gratuito para financiar a operação' },
      { id: 'd', texto: 'Receber adiantamento de clientes grandes antes da entrega' },
    ],
    correta: 'c',
    explicacao: 'OPM é usar dinheiro alheio — neste caso, o prazo concedido pelo moinho. A padaria não precisa ter capital próprio para comprar a farinha: o moinho entrega hoje e cobra em 30 dias. Nesse período, a padaria já vendeu e recebeu. É crédito gratuito embutido na relação comercial. Negociar prazos maiores com fornecedores é tão valioso quanto conseguir crédito bancário sem juros.',
  },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function PadariaConsultoriaCapitalGiro() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const co = ex.pme + ex.pmr;
  const cf = co - ex.pmp;
  const ncg = cf * ex.faturamentoDiario;
  const acertos = enviado ? questoes.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / questoes.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/capital-giro')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><RefreshCcw size={22} color={COR} /> Consultoria: Capital de Giro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)', borderColor: 'rgba(16,185,129,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Capital de Giro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>O Segredo Milionário: OPM na Padaria</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          A padaria tem uma vantagem financeira que poucos setores têm: <strong style={{ color: 'var(--text-main)' }}>recebe dos clientes antes de pagar o fornecedor</strong>. Entenda por que o ciclo financeiro negativo é o maior ativo invisível do setor.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Seu Desafio' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#34d399' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Por que a Padaria é Financeiramente Superior?</h2>
            {[
              { titulo: '1. OPM — Other People\'s Money', cor: COR, emoji: '💵', def: 'OPM é a estratégia de usar dinheiro alheio para financiar sua operação. Na padaria, o moinho entrega a farinha hoje e cobra em 30 dias. Nesse período, a padaria já transformou a farinha em pão, vendeu e recebeu. O dinheiro do cliente chegou antes da dívida com o moinho vencer.', formula: 'OPM = PMP > CO → você usa dinheiro do fornecedor sem pagar juros', exemplos: ['Farinha entregue dia 1 → paga dia 30', 'Pão assado dia 3 → vendido dia 3 → recebido dia 4', 'Lucro disponível dias 4 a 30', 'Por 26 dias, o dinheiro da farinha ainda não saiu do caixa'], alerta: 'Perder o prazo do moinho (ex: comprar à vista para ganhar desconto) pode ser um mau negócio se o ciclo financeiro for destruído. O "desconto" de 3% pode custar mais caro que o benefício do prazo.' },
              { titulo: '2. A Inversão: Padaria vs. Moda', cor: '#6366f1', emoji: '⚡', def: 'Setores diferentes têm ciclos radicalmente opostos. Padaria: produto perecível, vende rápido, recebe na hora = PMR baixo. Moda: produto dura meses, cliente parcela = PMR alto. O setor com produto que "estraga rápido" paradoxalmente tem melhor saúde financeira.', formula: 'Padaria: CF = 10+1−30 = −19 dias (FAVORÁVEL)\nModa: CF = 120+30−30 = +120 dias (DESFAVORÁVEL)', exemplos: ['Padaria: vende hoje, recebe hoje, paga daqui 30 dias', 'Moda: compra hoje, vende em 4 meses, recebe parcelado', 'Supermercado: CF muito negativo (recebe à vista, paga em 60-90 dias)', 'Construtora: CF positivo altíssimo (paga fornecedor antes, recebe anos depois)'], alerta: 'Um empreendedor que migra da moda para a padaria percebe uma melhora enorme no caixa — mesmo com faturamento idêntico. A estrutura de prazos do setor importa mais do que o volume de vendas.' },
              { titulo: '3. O Risco Oculto: Expansão Desequilibrada', cor: '#f59e0b', emoji: '⚠️', def: 'CF negativo cria uma armadilha: parece que o caixa está ótimo, então o dono expande (novo forno, reforma, mais funcionários). Se a expansão for financiada com o "dinheiro do moinho" que na verdade é dívida futura, a padaria pode quebrar quando o boleto vencer.', formula: 'Boleto acumulado > Caixa disponível → crise de liquidez', exemplos: ['Padaria com CF −20 dias tem R$30.000 "em caixa"', 'R$30.000 = dinheiro de clientes + dinheiro que vai pagar o moinho', 'Gastar os R$30.000 em reforma = não ter caixa para pagar boleto', 'Crescimento saudável = apenas com lucro retido, não com OPM'], alerta: 'O CF negativo não é "dinheiro livre" — é um prazo temporário. A separação entre caixa operacional e reserva de pagamento de fornecedor é fundamental.' },
              { titulo: '4. Negociação de Prazo como Ativo', cor: '#ec4899', emoji: '🤝', def: 'Cada dia a mais de prazo com fornecedor é equivalente a um empréstimo sem juros. Uma padaria que negocia 30 dias com o moinho em vez de 15 dias libera capital equivalente a 15 dias de compras — sem custo financeiro.', formula: 'Valor liberado = Dias adicionais × Compras Diárias', exemplos: ['Compras R$500/dia × +15 dias = R$7.500 liberados sem custo', 'Taxa de capital de giro: 1,5% a.m. = R$112,50/mês economizados', 'Em 12 meses: R$1.350 de economia financeira só com negociação de prazo', 'Prazo maior com fornecedor = ROI infinito (custo zero)'], alerta: 'Muitos padeiros não negociam prazo porque "não quiseram pedir". O fornecedor prefere dar prazo a perder um cliente fixo. Perguntar não custa nada — não perguntar custa dinheiro.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === COR ? '16,185,129' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#f59e0b' ? '245,158,11' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { label: 'PME', valor: ex.pme, cor: '#a855f7', desc: 'dias em estoque' },
              { label: 'PMR', valor: ex.pmr, cor: '#3b82f6', desc: 'dias para receber' },
              { label: 'PMP', valor: ex.pmp, cor: '#ef4444', desc: 'dias para pagar' },
            ].map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${item.cor}` }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: item.cor }}>{item.valor}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '3px solid #6366f1' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CO = PME + PMR</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{co} dias</div>
              <div style={{ fontWeight: 600 }}>Ciclo Operacional</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${cf < 0 ? '#22c55e' : '#ef4444'}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CF = CO − PMP</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: cf < 0 ? '#22c55e' : '#ef4444' }}>{cf} dias</div>
              <div style={{ fontWeight: 600 }}>{cf < 0 ? '✅ Favorável (OPM!)' : '⚠️ Precisa capital'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${ncg <= 0 ? '#22c55e' : '#ef4444'}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>NCG = CF × R${ex.faturamentoDiario}/dia</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: ncg <= 0 ? '#22c55e' : '#ef4444' }}>{formatBRL(Math.abs(ncg))}</div>
              <div style={{ fontWeight: 600 }}>{ncg <= 0 ? '🏦 Caixa extra gerado' : 'Capital necessário'}</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '3px solid #facc15' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.25rem' }}>Insight do setor:</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ex.insight}</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color={COR} /> Desafio: Capital de Giro na Padaria
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>OPM, Ciclo Financeiro Negativo e estratégias de prazo — cinco questões sobre a vantagem financeira da panificação.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {questoes.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
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
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(16,185,129,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#34d399' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" />}
                      <strong style={{ minWidth: '1rem' }}>{op.id.toUpperCase()})</strong> {op.texto}
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#34d399' }}>Explicação: </strong>{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!enviado ? (
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
              </button>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Entende o poder do OPM na padaria!' : nota >= 70 ? 'Muito bom! Revise as explicações.' : 'Revise o conceito de OPM e ciclo financeiro negativo.'}
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
