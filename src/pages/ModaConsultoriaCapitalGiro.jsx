import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCcw, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen } from 'lucide-react';

const COR = '#ef4444';
const COR_BG = 'rgba(239,68,68,0.08)';

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Confecção de Uniformes', emoji: '🏭', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Confecção Uniforme Ágil produz uniformes corporativos sob pedido. O modelo B2B com contratos grandes tem CF diferente do varejo.',
    pme: 20, pmr: 45, pmp: 30,
    faturamentoDiario: 2000,
    contexto: 'Recebe pedido, compra tecido (PMP=30 dias), produz em 20 dias, entrega e recebe em 45 dias.',
    insight: 'CF = 20+45−30 = +35 dias. NCG = 35 × R$2.000 = R$70.000. Na indústria têxtil B2B, contratos grandes exigem capital de giro alto. A estratégia mais comum é exigir 40-50% de entrada no pedido, reduzindo o PMR efetivo.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Loja de Moda Jovem', emoji: '👗', cor: COR, corBg: COR_BG,
    descricao: 'A Boutique Trend compra coleção, estoca 120 dias em média (pme alto!), clientes parcelam em 3x (PMR=30 dias). O "Abismo de Caixa".',
    pme: 120, pmr: 30, pmp: 30,
    faturamentoDiario: 600,
    contexto: 'Compra no Brás a prazo de 30 dias, mas a peça fica 4 meses na arara antes de vender, e cliente parcela em 3x.',
    insight: 'CF = 120+30−30 = +120 dias. NCG = 120 × R$600 = R$72.000! A loja precisa de R$72.000 em capital de giro para funcionar. Por isso, lojas de moda frequentemente precisam de crédito ou capital de sócios — o negócio é estruturalmente devorador de caixa.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Aluguel de Roupas de Festa', emoji: '✨', cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A Ateliê Sonho de Festa aluga vestidos de festa. Modelo de negócio inteligente: mesmo ativo gera receita repetida, sem PME alto.',
    pme: 3, pmr: 0, pmp: 90,
    faturamentoDiario: 300,
    contexto: 'Vestido alugado volta em 3 dias, cliente paga no ato (PMR=0), fornecedor do tecido deu 90 dias (compra rara).',
    insight: 'CF = 3+0−90 = −87 dias! CF extremamente negativo — o melhor possível. O modelo de aluguel transforma um único ativo em receita recorrente. O vestido que custou R$800 pode ser alugado 50x ao ano a R$200 = R$10.000/ano de receita. ROI de 1.150% ao ano no ativo.',
  },
];

const questoes = [
  {
    id: 'q1',
    enunciado: 'Uma loja de moda tem PME=90 dias, PMR=30 dias (parcelamento) e PMP=30 dias (fornecedor Brás). Qual a NCG para faturamento de R$800/dia?',
    opcoes: [
      { id: 'a', texto: 'R$ 24.000 — apenas o PMR de 30 dias importa' },
      { id: 'b', texto: 'R$ 72.000 — CF de 90 dias × R$800/dia' },
      { id: 'c', texto: 'R$ 48.000 — CF de 60 dias × R$800/dia' },
      { id: 'd', texto: 'R$ 0 — PMP e PMR se cancelam' },
    ],
    correta: 'b',
    explicacao: 'CO = PME + PMR = 90 + 30 = 120 dias. CF = CO − PMP = 120 − 30 = 90 dias. NCG = 90 × R$800 = R$72.000. Esse é o capital que a loja precisa ter para não quebrar. É por isso que abrir uma loja de roupas exige capital inicial muito superior ao que muitos empreendedores imaginam.',
  },
  {
    id: 'q2',
    enunciado: 'Por que o varejo de moda tem o pior ciclo financeiro entre os setores estudados?',
    opcoes: [
      { id: 'a', texto: 'Porque as margens são menores que em outros setores' },
      { id: 'b', texto: 'Porque o PME é altíssimo (peças ficam meses na arara) e o PMR é alto (cliente parcela)' },
      { id: 'c', texto: 'Porque os fornecedores de moda não dão prazo de pagamento' },
      { id: 'd', texto: 'Porque a sazonalidade reduz as vendas 6 meses por ano' },
    ],
    correta: 'b',
    explicacao: 'A combinação letal é: PME alto (120 dias de giro médio de estoque) + PMR alto (cliente parcela em 2-3x = 30-45 dias médio). O PMP raramente supera 30-45 dias no varejo de moda. Resultado: CO de 150+ dias vs PMP de 30 dias = CF de 120+ dias. Nenhum outro setor tem PME tão alto em combinação com PMR elevado.',
  },
  {
    id: 'q3',
    enunciado: 'Qual estratégia MAIS reduz o CF de uma loja de moda?',
    opcoes: [
      { id: 'a', texto: 'Oferecer desconto de 5% para pagamento à vista (reduz PMR)' },
      { id: 'b', texto: 'Comprar em maior quantidade para conseguir preço melhor (aumenta PME)' },
      { id: 'c', texto: 'Reduzir o mix de produtos para girar o estoque mais rápido (reduz PME de 120 para 45 dias)' },
      { id: 'd', texto: 'Contratar mais vendedoras para atender melhor' },
    ],
    correta: 'c',
    explicacao: 'O PME é o maior vilão do ciclo financeiro no varejo de moda. Reduzir o PME de 120 para 45 dias reduz o CF em 75 dias — impacto enorme. Para faturamento de R$600/dia, isso libera R$45.000 de capital. Girar o estoque rápido (comprando menos e com mais frequência, focando em produtos campeões de venda) é a estratégia mais eficaz.',
  },
  {
    id: 'q4',
    enunciado: 'Uma loja decide aceitar apenas Pix (sem parcelamento). O PMR cai de 30 para 0 dias. Com PME=120 e PMP=30, qual o novo CF e a variação na NCG (faturamento R$600/dia)?',
    opcoes: [
      { id: 'a', texto: 'CF cai de 120 para 90 dias → libera R$18.000 de capital' },
      { id: 'b', texto: 'CF cai de 120 para 90 dias → libera R$54.000 a mais' },
      { id: 'c', texto: 'CF não muda, pois PME ainda é 120 dias' },
      { id: 'd', texto: 'CF sobe para 150 dias pois perde clientes que parcelam' },
    ],
    correta: 'a',
    explicacao: 'Novo CF = 120 + 0 − 30 = 90 dias (antes: 120 dias). Variação: −30 dias. NCG antiga: 120 × R$600 = R$72.000. NCG nova: 90 × R$600 = R$54.000. Diferença: R$18.000 liberados. Não é a maior melhora possível (o PME ainda domina), mas eliminar parcelamento tem efeito imediato no caixa sem precisar mudar a operação.',
  },
  {
    id: 'q5',
    enunciado: 'Uma loja de roupas tem CF de +120 dias e está crescendo 20% ao mês em faturamento. Por que isso pode ser perigoso?',
    opcoes: [
      { id: 'a', texto: 'Não é perigoso — crescimento é sempre positivo' },
      { id: 'b', texto: 'Porque quanto mais vende, mais capital de giro precisa, podendo quebrar por excesso de crescimento' },
      { id: 'c', texto: 'Porque o governo vai cobrar mais impostos com o crescimento' },
      { id: 'd', texto: 'Porque os fornecedores podem não conseguir entregar com o aumento do volume' },
    ],
    correta: 'b',
    explicacao: 'Com CF positivo alto, crescer significa precisar de mais capital. Se faturamento cresce de R$600 para R$720/dia (+20%), a NCG cresce de R$72.000 para R$86.400 — são mais R$14.400 que precisam estar no caixa para sustentar o crescimento. Empresas com CF positivo que crescem rápido sem capitalização adequada quebram por excesso de crescimento — fenômeno chamado de "overtrading" ou "insolvência do sucesso".',
  },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ModaConsultoriaCapitalGiro() {
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
          <button className="btn-secondary" onClick={() => navigate('/moda/capital-giro')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><RefreshCcw size={22} color={COR} /> Consultoria: Capital de Giro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.08) 100%)', borderColor: 'rgba(239,68,68,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Capital de Giro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>O Abismo de Caixa: Por que Lojas Bem-Sucedidas Quebram</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          No varejo de moda, PME de 120 dias é comum — e devastador. Entenda por que uma loja pode vender muito, ter boa margem e ainda assim <strong style={{ color: 'var(--text-main)' }}>quebrar por falta de caixa</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Seu Desafio' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? COR_BG : 'var(--bg-card)', color: secao === s.id ? '#fca5a5' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> O Pior Ciclo Financeiro do Varejo</h2>
            {[
              { titulo: '1. PME de 120 Dias: O Estoque que Imobiliza', cor: COR, emoji: '🧊', def: 'Uma blusa comprada em março pode só ser vendida em julho. São 4 meses de capital imobilizado em tecido pendurado na arara. Cada R$1.000 investido em estoque fica "congelado" por até 120 dias antes de virar receita.', formula: 'Capital imobilizado = Estoque × (PME ÷ 30)', exemplos: ['Estoque R$50.000 × PME 120 dias = R$200.000 de capital imobilizado/mês-dia', 'Mesmo produto não vendido em 3 meses → entra em liquidação com desconto', 'Peça de inverno comprada em abril fica parada até junho/julho', 'Reduzir PME de 120 para 60 dias libera metade do capital imobilizado'], alerta: 'A estratégia mais eficaz é "open-to-buy" — orçamento de compras que limita o estoque total como % do faturamento esperado. Comprar pouco com frequência maior é melhor do que grandes remessas.' },
              { titulo: '2. Parcelamento: O PMR que Sufoca', cor: '#f59e0b', emoji: '💳', def: 'Cliente que parcela em 3x sem juros parece bom para as vendas — mas o dinheiro demora. PMR médio de parcelamento 3x = 45 dias (recebe em D+30 e D+60, média 45). O caixa sente o impacto imediatamente mas o recebimento é lento.', formula: 'PMR médio = Σ(% vendas por canal × prazo de cada canal)', exemplos: ['100% no cartão 3x: PMR ≈ 45 dias', '50% Pix + 50% cartão 3x: PMR ≈ 22 dias', '70% Pix + 30% cartão: PMR ≈ 9 dias', 'Desconto de 5% no Pix pode ser viável se taxa de cartão é 3,5%+'], alerta: 'Calcular o PMR médio ponderado pelo mix de canais é essencial. Uma loja que migra de 70% no cartão para 70% no Pix reduz o PMR de ~35 para ~9 dias — liberando semanas de capital.' },
              { titulo: '3. Overtrading: Quebrar por Crescer Rápido', cor: '#a855f7', emoji: '📈', def: 'Overtrading é quando o crescimento das vendas consome mais capital do que a empresa consegue gerar. Com CF positivo alto, cada % de crescimento exige mais capital. Uma loja que cresce 30% pode falir se não tiver capital suficiente para financiar o ciclo maior.', formula: 'Capital adicional necessário = Variação do Faturamento Diário × CF (dias)', exemplos: ['Faturamento cresce de R$600 para R$780/dia (+30%)', 'NCG cresce de R$72.000 para R$93.600 (+R$21.600)', 'De onde vem os R$21.600 extras?', 'Sem capitalização adequada → atraso de pagamentos → crise'], alerta: 'Antes de expandir, calcule o impacto na NCG. Crescimento saudável no varejo de moda exige capitalização prévia ou aumento de PMP proporcional ao crescimento.' },
              { titulo: '4. Estratégias para Sobreviver ao Abismo', cor: '#22c55e', emoji: '🧗', def: 'Existem estratégias concretas para reduzir o abismo de caixa no varejo de moda: reduzir PME, aumentar PMP, migrar clientes para Pix e adotar gestão de estoque inteligente.', formula: 'Impacto: −1 dia de PME × R$600/dia = −R$600 de NCG', exemplos: ['Reduzir PME: comprar em menor quantidade com maior frequência', 'Aumentar PMP: negociar 45-60 dias com fornecedores recorrentes', 'Reduzir PMR: incentivar Pix com desconto de 3-5%', 'Consignação: pagar o fornecedor só após vender (PME=0 efetivo)'], alerta: 'Consignação é o modelo ideal para moda: você expõe o produto sem imobilizar capital. Se não vender, devolve. É difícil de conseguir com fornecedores grandes, mas comum com marcas menores e artesãos.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === COR ? '239,68,68' : bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#a855f7' ? '168,85,247' : '34,197,94'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: bloco.cor, marginBottom: '1rem' }}>{bloco.formula}</div>
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
              { label: 'PME', valor: ex.pme, cor: '#a855f7', desc: 'dias em estoque / arara' },
              { label: 'PMR', valor: ex.pmr, cor: '#3b82f6', desc: 'dias para receber do cliente' },
              { label: 'PMP', valor: ex.pmp, cor: '#22c55e', desc: 'dias para pagar fornecedor' },
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
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${cf < 0 ? '#22c55e' : COR}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CF = CO − PMP</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: cf < 0 ? '#22c55e' : COR }}>{cf} dias</div>
              <div style={{ fontWeight: 600 }}>{cf < 0 ? '✅ Ciclo Favorável' : cf > 60 ? '🔴 Abismo de Caixa' : '⚠️ Atenção necessária'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${ncg <= 0 ? '#22c55e' : ncg > 50000 ? COR : '#f59e0b'}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>NCG = CF × R${ex.faturamentoDiario}/dia</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: ncg <= 0 ? '#22c55e' : ncg > 50000 ? COR : '#f59e0b' }}>{formatBRL(Math.abs(ncg))}</div>
              <div style={{ fontWeight: 600 }}>{ncg <= 0 ? 'Caixa extra!' : 'Capital mínimo necessário'}</div>
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
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: COR_BG, borderColor: 'rgba(239,68,68,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color={COR} /> Desafio: Capital de Giro no Varejo de Moda
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>PME alto, parcelamento, overtrading e estratégias de sobrevivência — cinco questões sobre o abismo de caixa na moda.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {questoes.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
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
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#fca5a5' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" />}
                      <strong style={{ minWidth: '1rem' }}>{op.id.toUpperCase()})</strong> {op.texto}
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#fca5a5' }}>Explicação: </strong>{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!enviado ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                  Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#facc15' }}>Lembre-se:</strong> no varejo de moda, PME é o inimigo número 1. Cada dia a menos de estoque parado é R$ liberados no caixa. Overtrading = crescer sem capital = quebrar por excesso de sucesso.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Entende o abismo de caixa na moda!' : nota >= 70 ? 'Muito bom! Revise as explicações.' : 'Revise PME, overtrading e estratégias de redução de NCG.'}
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
