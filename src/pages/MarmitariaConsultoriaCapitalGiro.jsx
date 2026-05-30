import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCcw, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen } from 'lucide-react';

const COR = '#10b981';
const COR_WARN = '#ef4444';

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Fábrica de Molhos Artesanais', emoji: '🫙', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Fábrica Saborosa produz molhos em lote e vende para supermercados com prazo de pagamento de 45 dias. O ciclo financeiro é crítico.',
    pme: 15, pmr: 45, pmp: 20,
    faturamentoDiario: 800,
    contexto: 'Compra matéria-prima à vista, estoca 15 dias, entrega ao supermercado e recebe em 45 dias.',
    estrategia: 'Negociar prazo maior com fornecedor de vidros e tampas (de 20 para 40 dias) reduziria o ciclo financeiro de 40 para 20 dias, cortando a NCG pela metade.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Distribuidora de Refeições', emoji: '🚚', cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    descricao: 'A Dist. Sabor Delivery fornece marmitas para empresas. Fatura no boleto com 15 dias, mas compra ingredientes pagando na entrega.',
    pme: 2, pmr: 15, pmp: 0,
    faturamentoDiario: 1200,
    contexto: 'Paga fornecedor à vista (PMR=0), estoca 2 dias, entrega para empresas e recebe em 15 dias.',
    estrategia: 'Negociar pagamento semanal com fornecedor (PMP de 7 dias) já reduziria o ciclo financeiro de 17 para 10 dias — economia de R$8.400 em necessidade de capital.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Catering para Eventos', emoji: '🎪', cor: '#ec4899', corBg: 'rgba(236,72,153,0.08)',
    descricao: 'A Chef Events faz catering para casamentos. Compra tudo à vista, executa o evento e recebe 50% no dia + 50% em 30 dias.',
    pme: 5, pmr: 15, pmp: 0,
    faturamentoDiario: 600,
    contexto: 'PMR de 15 dias (média entre recebimento imediato de 50% e 30 dias dos outros 50%). Paga fornecedor à vista.',
    estrategia: 'Exigir 70% de entrada no fechamento do contrato (antes do evento) reduziria o PMR para menos de 5 dias e eliminaria quase toda a necessidade de capital de giro.',
  },
];

const questoes = [
  {
    id: 'q1',
    enunciado: 'Uma marmitaria tem PME=2 dias, PMR=30 dias (iFood) e PMP=5 dias (feira). Qual o Ciclo Financeiro e o que ele significa?',
    opcoes: [
      { id: 'a', texto: 'CF = 27 dias — precisa financiar 27 dias de operação com capital próprio' },
      { id: 'b', texto: 'CF = 37 dias — ciclo operacional total desde o ingrediente até o recebimento' },
      { id: 'c', texto: 'CF = 33 dias — tempo entre pagar fornecedor e receber do cliente' },
      { id: 'd', texto: 'CF = −3 dias — o negócio recebe antes de pagar, sem necessidade de capital' },
    ],
    correta: 'a',
    explicacao: 'CO = PME + PMR = 2 + 30 = 32 dias. CF = CO − PMP = 32 − 5 = 27 dias. Significa que por 27 dias a marmitaria opera "no negativo": já pagou o fornecedor mas ainda não recebeu do iFood. Precisa de capital próprio para cobrir esse intervalo.',
  },
  {
    id: 'q2',
    enunciado: 'A marmitaria fatura R$600/dia. Com CF de 27 dias, qual a NCG (Necessidade de Capital de Giro)?',
    opcoes: [
      { id: 'a', texto: 'R$ 8.100 — faturamento de 13,5 dias' },
      { id: 'b', texto: 'R$ 16.200 — faturamento de 27 dias' },
      { id: 'c', texto: 'R$ 4.050 — metade do ciclo financeiro' },
      { id: 'd', texto: 'R$ 600 — apenas um dia de operação' },
    ],
    correta: 'b',
    explicacao: 'NCG = Ciclo Financeiro × Faturamento Diário = 27 × R$600 = R$16.200. Esse é o valor que a marmitaria precisa ter disponível em caixa para continuar operando sem depender de empréstimo. Se não tiver, fica sem dinheiro para comprar os ingredientes de amanhã.',
  },
  {
    id: 'q3',
    enunciado: 'Qual a estratégia MAIS eficaz para reduzir a NCG de uma marmitaria que vende no iFood?',
    opcoes: [
      { id: 'a', texto: 'Aumentar o preço das marmitas para ter mais receita diária' },
      { id: 'b', texto: 'Negociar antecipação de recebíveis com o iFood (reduzir PMR de 30 para 2 dias)' },
      { id: 'c', texto: 'Comprar ingredientes em menor quantidade para reduzir o PME' },
      { id: 'd', texto: 'Contratar mais entregadores para vender mais' },
    ],
    correta: 'b',
    explicacao: 'O PMR de 30 dias do iFood é o maior vilão do ciclo financeiro. Antecipar recebíveis (pagar uma taxa para receber em D+1 ou D+2 em vez de D+30) reduz o CF de 27 para menos de 2 dias. NCG cai de R$16.200 para menos de R$1.200 — impacto monstruoso. O iFood e outras plataformas oferecem essa opção.',
  },
  {
    id: 'q4',
    enunciado: 'Uma marmitaria migra para vendas diretas por WhatsApp (recebe no Pix, PMR=0) e abandona o iFood. Como isso afeta o capital de giro?',
    opcoes: [
      { id: 'a', texto: 'Piora, pois perde o volume de clientes do marketplace' },
      { id: 'b', texto: 'Não muda, pois o PME e PMP continuam iguais' },
      { id: 'c', texto: 'Melhora drasticamente — CF cai para PME − PMP, eliminando o descasamento do iFood' },
      { id: 'd', texto: 'Piora, pois Pix não tem proteção financeira como o cartão' },
    ],
    correta: 'c',
    explicacao: 'Com PMR=0 (Pix imediato), CF = PME − PMP = 2 − 5 = −3 dias. Ciclo financeiro negativo! A marmitaria recebe antes de pagar o fornecedor — como a padaria. Libera todo o capital imobilizado e ainda ganha a comissão que pagava ao iFood. O desafio é construir a base de clientes própria.',
  },
  {
    id: 'q5',
    enunciado: 'O Ciclo Financeiro NEGATIVO significa que:',
    opcoes: [
      { id: 'a', texto: 'O negócio está no prejuízo e precisa de empréstimo urgente' },
      { id: 'b', texto: 'O negócio recebe dos clientes antes de pagar os fornecedores — situação favorável' },
      { id: 'c', texto: 'O cálculo está errado, pois ciclo financeiro negativo é impossível' },
      { id: 'd', texto: 'O negócio precisa devolver dinheiro aos fornecedores' },
    ],
    correta: 'b',
    explicacao: 'CF negativo é a situação ideal: o cliente paga antes de você precisar pagar o fornecedor. Os fornecedores estão, na prática, financiando sua operação gratuitamente. Supermercados e padarias com boa negociação operam assim. O dinheiro dos clientes de hoje cobre a compra de insumos de amanhã — sem necessidade de capital próprio.',
  },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function MarmitariaConsultoriaCapitalGiro() {
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
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/capital-giro')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><RefreshCcw size={22} color={COR} /> Consultoria: Capital de Giro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Marmitaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)', borderColor: 'rgba(16,185,129,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Capital de Giro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>NCG: A Necessidade Invisível que Quebra Negócios</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Um negócio pode vender muito e ainda quebrar por falta de caixa. O <strong style={{ color: 'var(--text-main)' }}>descasamento entre pagar e receber</strong> é o maior inimigo silencioso do pequeno empreendedor.
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Os Três Prazos que Definem seu Caixa</h2>
            {[
              { titulo: '1. PME — Prazo Médio de Estoque', cor: '#a855f7', emoji: '📦', def: 'Quantos dias em média um ingrediente fica parado antes de virar marmita e ser entregue. Na marmitaria, o PME costuma ser baixo (1 a 3 dias) pois os ingredientes são frescos. Quanto menor o PME, melhor para o caixa.', formula: 'PME = (Estoque Médio ÷ Custo Diário)', exemplos: ['Verdura fresca: PME = 1 a 2 dias', 'Arroz e feijão a granel: PME = 7 a 15 dias', 'Carnes congeladas: PME = 3 a 7 dias', 'Reduzir PME = comprar em menor quantidade e com mais frequência'], alerta: 'Comprar em grandes quantidades para economizar pode aumentar o PME e piorar o ciclo financeiro. O custo financeiro do estoque parado pode superar a economia obtida.' },
              { titulo: '2. PMR — Prazo Médio de Recebimento', cor: '#3b82f6', emoji: '💳', def: 'Quantos dias leva para o dinheiro das vendas cair no caixa. É o maior vilão da marmitaria: vendas no iFood demoram 30 dias para cair, enquanto os ingredientes precisam ser comprados imediatamente.', formula: 'PMR = (Contas a Receber ÷ Receita Diária)', exemplos: ['Pix imediato: PMR = 0 dias (ideal)', 'Débito: PMR = 1 dia', 'Cartão de crédito: PMR = 28 a 30 dias', 'iFood/Rappi: PMR = 30 dias (D+30)'], alerta: 'Um negócio que vende 80% no iFood e 20% no Pix tem PMR médio ≈ 24 dias. Migrar para mais vendas diretas é a estratégia mais poderosa para reduzir a NCG.' },
              { titulo: '3. PMP — Prazo Médio de Pagamento', cor: '#ef4444', emoji: '🤝', def: 'Quantos dias você tem para pagar seus fornecedores. Quanto maior o PMP, melhor para o seu caixa — pois você está usando o dinheiro do fornecedor para financiar sua operação.', formula: 'PMP = (Contas a Pagar ÷ Compras Diárias)', exemplos: ['Feira: PMP = 0 (compra à vista)', 'CEASA com crédito: PMP = 7 dias', 'Atacado com boleto: PMP = 15 a 30 dias', 'Grandes distribuidores: PMP até 45 dias'], alerta: 'Negociar prazo com fornecedores é tão importante quanto negociar preço. Um dia a mais de prazo é um dia a menos de capital imobilizado.' },
              { titulo: '4. NCG — Necessidade de Capital de Giro', cor: COR, emoji: '💰', def: 'É o valor em reais que o negócio precisa ter disponível para continuar operando durante o ciclo financeiro. Quanto maior o CF, maior a NCG. Negócios com CF positivo precisam de "reserva" para cobrir o descasamento.', formula: 'NCG = Ciclo Financeiro (dias) × Faturamento Diário', exemplos: ['CF 27 dias × R$600/dia = R$16.200 de NCG', 'CF 0 dias = sem necessidade de capital de giro', 'CF negativo = fornecedor financia sua operação', 'Crescer com CF alto = precisa de mais capital proporcionalmente'], alerta: 'Crescer sem capital de giro suficiente é perigoso. Se a marmitaria dobrar o faturamento sem resolver o CF, a NCG também dobra — e o negócio pode quebrar justamente por vender demais.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#a855f7' ? '168,85,247' : bloco.cor === '#3b82f6' ? '59,130,246' : bloco.cor === '#ef4444' ? '239,68,68' : '16,185,129'}, 0.06)`, overflow: 'hidden' }}>
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

          {/* Fórmula resumo */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: COR }}>📐 Fórmulas em Ordem</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Ciclo Operacional (CO)', formula: 'CO = PME + PMR', cor: '#a855f7' },
                { label: 'Ciclo Financeiro (CF)', formula: 'CF = CO − PMP = PME + PMR − PMP', cor: '#3b82f6' },
                { label: 'NCG (em R$)', formula: 'NCG = CF × Faturamento Diário', cor: COR },
                { label: 'CF negativo = situação ideal', formula: 'PMP > CO → fornecedor financia você', cor: '#22c55e' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.label}</span>
                  <code style={{ color: f.cor, fontWeight: 700, fontSize: '0.9rem' }}>{f.formula}</code>
                </div>
              ))}
            </div>
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

          {/* Cálculo visual */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {[
              { label: 'PME (Estoque)', valor: ex.pme, unidade: 'dias', cor: '#a855f7', desc: 'Tempo parado em estoque' },
              { label: 'PMR (Recebimento)', valor: ex.pmr, unidade: 'dias', cor: '#3b82f6', desc: 'Espera para receber do cliente' },
              { label: 'PMP (Pagamento)', valor: ex.pmp, unidade: 'dias', cor: '#ef4444', desc: 'Prazo para pagar fornecedor' },
            ].map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${item.cor}` }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: item.cor }}>{item.valor}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unidade} · {item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid #6366f1` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CO = PME + PMR</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{co} dias</div>
              <div style={{ fontWeight: 600 }}>Ciclo Operacional</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${cf < 0 ? '#22c55e' : COR_WARN}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CF = CO − PMP</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: cf < 0 ? '#22c55e' : COR_WARN }}>{cf} dias</div>
              <div style={{ fontWeight: 600 }}>Ciclo Financeiro {cf < 0 ? '✅ Favorável' : '⚠️ Precisa capital'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${ncg < 0 ? '#22c55e' : COR_WARN}` }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>NCG = CF × R${ex.faturamentoDiario}/dia</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: ncg < 0 ? '#22c55e' : COR_WARN }}>{formatBRL(Math.abs(ncg))}</div>
              <div style={{ fontWeight: 600 }}>{ncg < 0 ? 'Sobra de caixa' : 'Capital necessário'}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `3px solid #facc15` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.25rem' }}>Estratégia recomendada:</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ex.estrategia}</p>
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
              <Target size={24} color={COR} /> Desafio: Capital de Giro na Marmitaria
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>PME, PMR, PMP, Ciclo Financeiro e NCG — cinco questões para fixar os conceitos.</p>
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
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                  Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#facc15' }}>Dica:</strong> CF positivo = você precisa de capital. CF negativo = o fornecedor te financia. NCG = quanto dinheiro você precisa ter no caixa para não parar.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Domina capital de giro na marmitaria!' : nota >= 70 ? 'Muito bom! Releia as explicações dos erros.' : 'Revise a teoria — NCG e Ciclo Financeiro são conceitos-chave.'}
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
