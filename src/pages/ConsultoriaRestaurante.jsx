import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, ChevronRight, ChevronLeft, Printer,
  Building2, DollarSign, Tag, RefreshCcw, TrendingUp,
  BarChart4, FileText, Plus, Trash2, Lightbulb, UtensilsCrossed
} from 'lucide-react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const pct = (v) => `${(v || 0).toFixed(1)}%`;
const num = (v) => parseFloat(String(v).replace(',', '.')) || 0;
const COR = '#f97316';

const ETAPAS = [
  { id: 0, label: 'Identificação', emoji: '🍽️' },
  { id: 1, label: 'Custos Fixos', emoji: '📌' },
  { id: 2, label: 'Custos Variáveis', emoji: '🔄' },
  { id: 3, label: 'Cardápio/Preço', emoji: '🏷️' },
  { id: 4, label: 'Capital de Giro', emoji: '💧' },
  { id: 5, label: 'Indicadores', emoji: '📊' },
  { id: 6, label: 'Relatório', emoji: '📋' },
];

const defaultState = () => ({
  nomeEmpresa: 'Restaurante Sabor do Cariri',
  responsavel: '',
  cidade: 'Crato - CE',
  regime: 'Simples Nacional',
  modelo: 'self-service',
  faturamento: 28800,
  clientesDia: 80,
  diasMes: 26,
  precoKg: 42,
  gramaturaMed: 0.35,
  fixos: [
    { id: 1, desc: 'Aluguel do ponto', valor: 2800 },
    { id: 2, desc: 'Salário cozinheira principal', valor: 1800 },
    { id: 3, desc: 'Salário auxiliar de cozinha', valor: 1412 },
    { id: 4, desc: 'Salário caixa / atendente', valor: 1412 },
    { id: 5, desc: 'Encargos sociais (~35%)', valor: 1617 },
    { id: 6, desc: 'Energia elétrica (fogão ind., refrigeração)', valor: 950 },
    { id: 7, desc: 'Gás GLP (botijões)', valor: 420 },
    { id: 8, desc: 'Água / higiene', valor: 280 },
    { id: 9, desc: 'Internet + sistema de caixa', valor: 150 },
    { id: 10, desc: 'Contabilidade', valor: 400 },
    { id: 11, desc: 'Alvará e vigilância sanitária (rateio)', valor: 83 },
  ],
  cmvPerc: 35,
  descartavelPerc: 2.2,
  desperdicioPerc: 4.5,
  impostoPerc: 5.5,
  taxaCartao: 2.8,
  deliveryComissao: 0,
  outrosCV: [],
  categorias: [
    { id: 1, nome: 'Carnes (boi, frango, suíno)', cmv: 42, fatPerc: 40 },
    { id: 2, nome: 'Acompanhamentos (arroz, feijão, macarrão)', cmv: 22, fatPerc: 30 },
    { id: 3, nome: 'Saladas e guarnições', cmv: 18, fatPerc: 15 },
    { id: 4, nome: 'Bebidas (sucos, refri, água)', cmv: 38, fatPerc: 15 },
  ],
  pme: 3, pmr: 5, pmp: 15,
  satisfacaoClientes: 8.0,
  funcionariosTotal: 4,
  metaFaturamento: 38000,
  notasConsultor: '',
});

function Campo({ label, value, onChange, type = 'text', prefix, suffix, small }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }}>
        {prefix && <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid var(--border-color)' }}>{prefix}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '0.6rem 0.75rem', color: 'var(--text-main)', fontSize: small ? '0.85rem' : '0.95rem' }} />
        {suffix && <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function LinhaItem({ item, onChange, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
      <input value={item.desc} onChange={e => onChange({ ...item, desc: e.target.value })}
        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', overflow: 'hidden', minWidth: '120px' }}>
        <span style={{ padding: '0 0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>R$</span>
        <input type="number" value={item.valor} onChange={e => onChange({ ...item, valor: num(e.target.value) })}
          style={{ width: '80px', background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem 0.25rem', color: '#fca5a5', fontWeight: 600, fontSize: '0.875rem' }} />
      </div>
      <button onClick={onDelete} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '0.4rem', padding: '0.5rem', cursor: 'pointer', color: '#ef4444' }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function calcular(s) {
  const clientesMes = num(s.clientesDia) * num(s.diasMes || 26);
  const fat = num(s.precoKg) * num(s.gramaturaMed) * clientesMes;
  const fatReal = num(s.faturamento) > 0 ? num(s.faturamento) : fat;
  const totalFixo = s.fixos.reduce((a, f) => a + num(f.valor), 0);
  const cvPerc = num(s.cmvPerc) + num(s.descartavelPerc) + num(s.desperdicioPerc) + num(s.impostoPerc) + num(s.taxaCartao) + num(s.deliveryComissao);
  const cvReais = fatReal * cvPerc / 100;
  const mc = fatReal - cvReais;
  const mcPerc = fatReal > 0 ? mc / fatReal * 100 : 0;
  const lucro = mc - totalFixo;
  const margemLiq = fatReal > 0 ? lucro / fatReal * 100 : 0;
  const pe = mcPerc > 0 ? totalFixo / (mcPerc / 100) : 0;
  const margSeg = fatReal > 0 ? Math.max(0, (fatReal - pe) / fatReal * 100) : 0;
  const ticketMedio = fatReal / (clientesMes || 1);
  const receitaDia = fatReal / (num(s.diasMes) || 26);
  const co = num(s.pme) + num(s.pmr);
  const cf = co - num(s.pmp);
  const ncg = cf * receitaDia;
  const kgDia = num(s.gramaturaMed) * num(s.clientesDia);
  const custoKgMedAlim = fatReal > 0 ? (fatReal * num(s.cmvPerc) / 100) / (kgDia * num(s.diasMes || 26)) : 0;
  return { fat: fatReal, clientesMes, totalFixo, cvPerc, cvReais, mc, mcPerc, lucro, margemLiq, pe, margSeg, ticketMedio, receitaDia, co, cf, ncg, kgDia, custoKgMedAlim };
}

function semaforo(v, [ruim, bom]) {
  if (v < ruim) return '#ef4444';
  if (v < bom) return '#f59e0b';
  return '#22c55e';
}

function Relatorio({ s, calc }) {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const recs = [];

  if (num(s.cmvPerc) > 40) recs.push({ tipo: 'critico', titulo: 'CMV Acima da Referência', texto: `CMV de ${pct(s.cmvPerc)} está acima do recomendado para restaurante self-service (32-38%). Principais ações: ficha técnica de todas as preparações, controle de porções e negociação com fornecedores de proteína. Reduzir para 36% geraria ${fmt(calc.fat * (num(s.cmvPerc) - 36) / 100)}/mês a mais de MC.` });

  if (num(s.desperdicioPerc) > 5) recs.push({ tipo: 'critico', titulo: 'Desperdício Alimentar Crítico', texto: `Desperdício de ${pct(s.desperdicioPerc)} representa ${fmt(calc.fat * num(s.desperdicioPerc) / 100)}/mês jogados fora. Meta: < 3%. Estratégias: produção baseada na demanda histórica (dia a dia), reaproveitamento de sobras em caldos e pratos do dia seguinte, porção de teste no balcão.` });

  if (calc.mcPerc < 40) recs.push({ tipo: 'atencao', titulo: 'Margem de Contribuição Baixa', texto: `MC% de ${pct(calc.mcPerc)} está abaixo do esperado (45-55%) para self-service. Revisar precificação por kg — o preço atual de ${fmt(s.precoKg)}/kg pode estar defasado em relação à inflação de alimentos.` });

  recs.push({ tipo: 'oportunidade', titulo: 'Marmitas para Viagem e Delivery Direto', texto: `Marmitas vendidas diretamente (WhatsApp/Instagram) têm MC% similar ao self-service mas sem custo de salão. Uma operação de marmitas de segunda a sexta pode gerar ${fmt(80 * 25 * 20 * calc.mcPerc / 100)} de MC adicional com custo fixo zero.` });

  if (num(s.precoKg) < 45) recs.push({ tipo: 'oportunidade', titulo: 'Preço por Kg Pode Ser Reajustado', texto: `Preço atual de ${fmt(s.precoKg)}/kg pode ser comparado com a média regional. Um reajuste de R$3/kg no preço (${fmt(s.precoKg + 3)}/kg) geraria ${fmt(num(s.clientesDia) * 26 * num(s.gramaturaMed) * 3)}/mês a mais de receita sem aumento de custo.` });

  recs.push({ tipo: 'ok', titulo: 'Diferencial: Produto Regional', texto: 'Restaurantes self-service que destacam pratos típicos regionais (baião-de-dois, sarapatel, carne-de-sol) têm maior fidelização e ticket médio superior em até 15%. Comunicar a origem dos ingredientes locais atrai clientes de perfil "experiência gastronômica".' });

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)', borderRadius: '1rem', padding: '2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '220px', height: '220px', background: 'rgba(249,115,22,0.2)', borderRadius: '50%', transform: 'translate(70px,-70px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fdba74', marginBottom: '0.5rem', fontWeight: 600 }}>Relatório de Consultoria Financeira</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>🍽️ {s.nomeEmpresa}</h1>
            <p style={{ color: '#fed7aa', fontSize: '0.9rem' }}>{s.cidade} · {s.regime} · Self-Service</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#fdba74', marginBottom: '0.25rem' }}>Elaborado por</div>
            <div style={{ fontWeight: 700 }}>{s.responsavel || 'Consultor Financeiro'}</div>
            <div style={{ fontSize: '0.8rem', color: '#fed7aa', marginTop: '0.25rem' }}>{dataHoje}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Faturamento', v: fmt(calc.fat), c: COR, sub: 'Mensal atual' },
          { l: 'MC%', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [38, 50]), sub: fmt(calc.mc) + '/mês' },
          { l: 'Lucro Líquido', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.08]), sub: pct(calc.margemLiq) },
          { l: 'PE', v: fmt(calc.pe), c: semaforo(calc.margSeg, [10, 25]), sub: 'Seg. ' + pct(calc.margSeg) },
          { l: 'Ticket Médio', v: fmt(calc.ticketMedio), c: '#7dd3fc', sub: calc.clientesMes + ' clientes/mês' },
          { l: 'Clientes/Dia', v: s.clientesDia, c: '#fb923c', sub: fmt(calc.receitaDia) + '/dia' },
        ].map((k, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{k.l}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: COR }}>📑 DRE Gerencial</h2>
        {[
          { l: 'Receita Bruta', v: calc.fat, c: '#22c55e', bold: true },
          { l: `(-) CMV Alimentos (${pct(s.cmvPerc)})`, v: -(calc.fat * num(s.cmvPerc) / 100), c: '#fca5a5' },
          { l: `(-) Descartáveis e embalagens (${pct(s.descartavelPerc)})`, v: -(calc.fat * num(s.descartavelPerc) / 100), c: '#fca5a5' },
          { l: `(-) Desperdício alimentar (${pct(s.desperdicioPerc)})`, v: -(calc.fat * num(s.desperdicioPerc) / 100), c: '#fca5a5' },
          { l: `(-) Impostos + cartão (${pct(num(s.impostoPerc) + num(s.taxaCartao))})`, v: -(calc.fat * (num(s.impostoPerc) + num(s.taxaCartao)) / 100), c: '#fca5a5' },
          { l: '= Margem de Contribuição', v: calc.mc, c: COR, bold: true, sep: true },
          { l: '(-) Custos Fixos Totais', v: -calc.totalFixo, c: '#fca5a5' },
          { l: '= Lucro Operacional', v: calc.lucro, c: calc.lucro >= 0 ? '#22c55e' : '#ef4444', bold: true, grande: true, sep: true },
        ].map((row, i) => (
          <div key={i}>
            {row.sep && <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.4rem 0' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', borderRadius: '0.3rem', background: row.bold ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
              <span style={{ fontSize: row.grande ? '1rem' : '0.875rem', fontWeight: row.bold ? 700 : 400, color: row.bold ? 'var(--text-main)' : 'var(--text-muted)' }}>{row.l}</span>
              <span style={{ fontSize: row.grande ? '1.1rem' : '0.9rem', fontWeight: 700, color: row.c }}>{fmt(row.v)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: COR }}>🍽️ Indicadores Operacionais</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { l: 'Receita por Cliente', v: fmt(calc.ticketMedio), c: COR },
            { l: 'Receita por Dia', v: fmt(calc.receitaDia), c: '#fb923c' },
            { l: 'Kg servido por Dia', v: `${calc.kgDia.toFixed(1)} kg`, c: '#fbbf24' },
            { l: 'Custo Alim./kg Servido', v: fmt(calc.custoKgMedAlim), c: '#f87171' },
            { l: 'Desperdício/mês', v: fmt(calc.fat * num(s.desperdicioPerc) / 100), c: '#ef4444' },
            { l: 'Clientes necessários para PE', v: `${Math.ceil(calc.pe / calc.ticketMedio)} / mês`, c: '#7dd3fc' },
          ].map((k, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.6rem', borderLeft: `3px solid ${k.c}` }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: COR }}>🎯 Recomendações</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {recs.map((r, i) => {
            const cores = { critico: '#ef4444', atencao: '#f59e0b', ok: '#22c55e', oportunidade: '#3b82f6' };
            return (
              <div key={i} style={{ padding: '1rem', borderRadius: '0.6rem', borderLeft: `4px solid ${cores[r.tipo]}`, background: `rgba(${r.tipo === 'critico' ? '239,68,68' : r.tipo === 'atencao' ? '245,158,11' : r.tipo === 'ok' ? '34,197,94' : '59,130,246'}, 0.07)` }}>
                <div style={{ fontWeight: 700, color: cores[r.tipo], marginBottom: '0.3rem', fontSize: '0.875rem' }}>{r.titulo}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{r.texto}</p>
              </div>
            );
          })}
        </div>
      </div>

      {s.notasConsultor && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #a855f7' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#a855f7' }}>📝 Observações do Consultor</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{s.notasConsultor}</p>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        Relatório gerado pelo Simulador Financeiro URCA · {dataHoje}
      </div>
    </div>
  );
}

export default function ConsultoriaRestaurante() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [s, setS] = useState(defaultState());

  const calc = calcular(s);
  const total = ETAPAS.length;
  const set = (key, val) => setS(prev => ({ ...prev, [key]: val }));
  const setFixo = (id, up) => set('fixos', s.fixos.map(f => f.id === id ? up : f));
  const addFixo = () => set('fixos', [...s.fixos, { id: Date.now(), desc: 'Novo item', valor: 0 }]);
  const delFixo = (id) => set('fixos', s.fixos.filter(f => f.id !== id));
  const setCat = (id, up) => set('categorias', s.categorias.map(c => c.id === id ? up : c));

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/desafios-avancados')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /></button>
        </div>
        <div className="navbar-brand" style={{ color: COR }}>🍽️ Consultoria — Restaurante Self-Service</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Etapa {etapa + 1} de {total}</div>
      </nav>

      {/* PROGRESS */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
          {ETAPAS.map((e, i) => (
            <button key={e.id} onClick={() => i <= etapa && setEtapa(i)}
              style={{ flex: 1, minWidth: '72px', padding: '0.6rem 0.3rem', borderRadius: '0.5rem', border: 'none', cursor: i <= etapa ? 'pointer' : 'default', background: i < etapa ? 'rgba(249,115,22,0.2)' : i === etapa ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)', borderBottom: i === etapa ? `3px solid ${COR}` : i < etapa ? '3px solid rgba(249,115,22,0.5)' : '3px solid transparent' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{i < etapa ? '✅' : e.emoji}</div>
              <div style={{ fontSize: '0.62rem', color: i === etapa ? COR : i < etapa ? '#fdba74' : 'var(--text-muted)', fontWeight: i === etapa ? 700 : 400 }}>{e.label}</div>
            </button>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(etapa / (total - 1)) * 100}%`, background: `linear-gradient(90deg, ${COR}, #fdba74)`, borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* ETAPA 0 */}
      {etapa === 0 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: `4px solid ${COR}` }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🍽️ Identificação do Restaurante</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Dados típicos de restaurante self-service de bairro no interior do Ceará. Ajuste conforme o estabelecimento.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
              <Campo label="Nome do Restaurante" value={s.nomeEmpresa} onChange={v => set('nomeEmpresa', v)} />
              <Campo label="Responsável / Consultor" value={s.responsavel} onChange={v => set('responsavel', v)} />
              <Campo label="Cidade / UF" value={s.cidade} onChange={v => set('cidade', v)} />
              <Campo label="Regime Tributário" value={s.regime} onChange={v => set('regime', v)} />
              <Campo label="Preço por Kg (R$)" value={s.precoKg} onChange={v => set('precoKg', num(v))} type="number" prefix="R$/kg" />
              <Campo label="Consumo médio por cliente (kg)" value={s.gramaturaMed} onChange={v => set('gramaturaMed', num(v))} type="number" suffix="kg" />
              <Campo label="Clientes por Dia" value={s.clientesDia} onChange={v => set('clientesDia', num(v))} type="number" />
              <Campo label="Dias de Funcionamento por Mês" value={s.diasMes} onChange={v => set('diasMes', num(v))} type="number" suffix="dias" />
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(249,115,22,0.07)', borderRadius: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fat. calculado: <strong style={{ color: COR }}>{fmt(num(s.precoKg) * num(s.gramaturaMed) * num(s.clientesDia) * num(s.diasMes || 26))}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Ticket médio: <strong style={{ color: '#fb923c' }}>{fmt(num(s.precoKg) * num(s.gramaturaMed))}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Clientes/mês: <strong style={{ color: '#fbbf24' }}>{num(s.clientesDia) * num(s.diasMes || 26)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 1 */}
      {etapa === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>📌 Custos Fixos do Restaurante</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>No restaurante, energia e gás podem variar com o movimento mas são tratados como fixos para fins de PE.</p>
            {s.fixos.map(f => <LinhaItem key={f.id} item={f} onChange={up => setFixo(f.id, up)} onDelete={() => delFixo(f.id)} />)}
            <button onClick={addFixo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: `rgba(249,115,22,0.1)`, border: `1px dashed rgba(249,115,22,0.4)`, borderRadius: '0.5rem', padding: '0.5rem 1rem', color: COR, cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              <Plus size={14} /> Adicionar item
            </button>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total Custos Fixos</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fca5a5' }}>{fmt(calc.totalFixo)}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pct(calc.totalFixo / calc.fat * 100)} do faturamento</div>
          </div>
        </div>
      )}

      {/* ETAPA 2 */}
      {etapa === 2 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🔄 Custos Variáveis (% do faturamento)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>No restaurante, o CMV e o desperdício são as maiores alavancas de melhoria de margem.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
              <Campo label="CMV — Custo dos Alimentos" value={s.cmvPerc} onChange={v => set('cmvPerc', num(v))} type="number" suffix="%" />
              <Campo label="Descartáveis (bandeja, guardanapo, copo)" value={s.descartavelPerc} onChange={v => set('descartavelPerc', num(v))} type="number" suffix="%" />
              <Campo label="Desperdício alimentar (sobras descartadas)" value={s.desperdicioPerc} onChange={v => set('desperdicioPerc', num(v))} type="number" suffix="%" />
              <Campo label="Impostos sobre faturamento (Simples)" value={s.impostoPerc} onChange={v => set('impostoPerc', num(v))} type="number" suffix="%" />
              <Campo label="Taxa de cartão / Pix" value={s.taxaCartao} onChange={v => set('taxaCartao', num(v))} type="number" suffix="%" />
              <Campo label="Comissão delivery (se tiver)" value={s.deliveryComissao} onChange={v => set('deliveryComissao', num(v))} type="number" suffix="%" />
            </div>
            <div style={{ background: 'rgba(249,115,22,0.07)', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.75rem', fontSize: '0.82rem' }}>
              <strong style={{ color: COR }}>💡 Referências do setor:</strong>
              <ul style={{ color: 'var(--text-muted)', marginTop: '0.5rem', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                <li>CMV ideal para self-service: <strong>32-38%</strong></li>
                <li>Desperdício aceitável: <strong>{'<'} 3%</strong> (reduzir com ficha técnica)</li>
                <li>MC% referência: <strong>45-55%</strong></li>
              </ul>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #fca5a5' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CV Total</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fca5a5' }}>{pct(calc.cvPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.cvReais)}/mês</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${semaforo(calc.mcPerc, [38, 50])}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MC%</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: semaforo(calc.mcPerc, [38, 50]) }}>{pct(calc.mcPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.mc)}/mês</div>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 3 — CARDÁPIO */}
      {etapa === 3 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🏷️ Mix do Cardápio por Categoria</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Configure o CMV e participação de cada categoria no faturamento. Total deve ser 100%.</p>
            {s.categorias.map(cat => (
              <div key={cat.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                <input value={cat.nome} onChange={e => setCat(cat.id, { ...cat, nome: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${COR}`, outline: 'none', color: COR, fontWeight: 700, fontSize: '0.9rem', padding: '0.2rem 0', marginBottom: '0.75rem', boxSizing: 'border-box' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Campo label="% do Faturamento" value={cat.fatPerc} onChange={v => setCat(cat.id, { ...cat, fatPerc: num(v) })} type="number" suffix="%" small />
                  <Campo label="CMV% desta categoria" value={cat.cmv} onChange={v => setCat(cat.id, { ...cat, cmv: num(v) })} type="number" suffix="%" small />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  MC estimada: <strong style={{ color: semaforo(100 - cat.cmv - num(s.impostoPerc) - num(s.taxaCartao) - num(s.desperdicioPerc), [30, 45]) }}>{pct(100 - cat.cmv - num(s.impostoPerc) - num(s.taxaCartao) - num(s.desperdicioPerc))}</strong>
                  <span style={{ marginLeft: '1rem' }}>Fat.: <strong style={{ color: COR }}>{fmt(calc.fat * cat.fatPerc / 100)}</strong></span>
                </div>
              </div>
            ))}
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ∑ % faturamento: <strong style={{ color: s.categorias.reduce((a, c) => a + c.fatPerc, 0) === 100 ? '#22c55e' : '#ef4444' }}>{s.categorias.reduce((a, c) => a + c.fatPerc, 0)}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 4 */}
      {etapa === 4 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>💧 Capital de Giro</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Restaurante tem PME muito baixo (alimentos frescos giram em 2-3 dias). PMR é quase zero (recebimento no ato).</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <Campo label="PME — Estoque (dias)" value={s.pme} onChange={v => set('pme', num(v))} type="number" suffix="dias" />
              <Campo label="PMR — Recebimento (dias)" value={s.pmr} onChange={v => set('pmr', num(v))} type="number" suffix="dias" />
              <Campo label="PMP — Fornecedor (dias)" value={s.pmp} onChange={v => set('pmp', num(v))} type="number" suffix="dias" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { l: 'Ciclo Operacional', v: `${calc.co} dias`, c: COR },
              { l: 'Ciclo Financeiro', v: `${calc.cf.toFixed(0)} dias`, c: calc.cf < 0 ? '#22c55e' : '#f59e0b' },
              { l: 'NCG', v: fmt(Math.abs(calc.ncg)), c: '#fb923c' },
              { l: 'Receita/Dia', v: fmt(calc.receitaDia), c: '#7dd3fc' },
            ].map((k, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ETAPA 5 */}
      {etapa === 5 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: COR }}>📊 Painel de KPIs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'MC%', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [38, 50]), ref: 'Ref: 45-55%' },
                { l: 'Margem Líquida', v: pct(calc.margemLiq), c: semaforo(calc.margemLiq, [5, 12]), ref: 'Ref: > 8%' },
                { l: 'Margem Segurança', v: pct(calc.margSeg), c: semaforo(calc.margSeg, [10, 25]), ref: '> 20% ideal' },
                { l: 'CMV%', v: pct(s.cmvPerc), c: semaforo(42 - num(s.cmvPerc), [0, 6]), ref: 'Ref: 32-38%' },
                { l: 'Desperdício', v: pct(s.desperdicioPerc), c: semaforo(6 - num(s.desperdicioPerc), [0, 3]), ref: 'Meta: < 3%' },
                { l: 'Lucro', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.08]), ref: pct(calc.margemLiq) },
              ].map((k, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: k.c }}>{k.v}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k.ref}</div>
                </div>
              ))}
            </div>
            <Campo label="Meta de Faturamento (R$)" value={s.metaFaturamento} onChange={v => set('metaFaturamento', num(v))} type="number" prefix="R$" />
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Observações do Consultor</label>
            <textarea value={s.notasConsultor} onChange={e => set('notasConsultor', e.target.value)} rows={5}
              placeholder="Impressões sobre o negócio, qualidade da comida, organização da cozinha, fluxo de clientes, concorrência na região..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem', color: 'var(--text-main)', resize: 'vertical', outline: 'none', fontSize: '0.875rem', lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
        </div>
      )}

      {/* ETAPA 6 — RELATÓRIO */}
      {etapa === 6 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: COR, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={22} /> Relatório Pronto</h2>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: COR, border: 'none', borderRadius: '0.6rem', padding: '0.75rem 1.5rem', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              <Printer size={18} /> Imprimir / Salvar PDF
            </button>
          </div>
          <div style={{ background: `rgba(249,115,22,0.06)`, border: `1px solid rgba(249,115,22,0.2)`, borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            💡 Clique em "Imprimir / Salvar PDF" → selecione "Salvar como PDF" para gerar o arquivo para o empreendedor.
          </div>
          <Relatorio s={s} calc={calc} />
        </div>
      )}

      {/* NAVEGAÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => setEtapa(e => Math.max(0, e - 1))} disabled={etapa === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: '2px solid var(--border-color)', background: 'transparent', color: etapa === 0 ? 'var(--text-muted)' : 'var(--text-main)', cursor: etapa === 0 ? 'default' : 'pointer', fontWeight: 600 }}>
          <ChevronLeft size={18} /> Anterior
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ETAPAS[etapa]?.label}</span>
        {etapa < total - 1 ? (
          <button onClick={() => setEtapa(e => Math.min(total - 1, e + 1))}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: 'none', background: COR, color: 'white', cursor: 'pointer', fontWeight: 700 }}>
            {etapa === total - 2 ? <><FileText size={18} /> Ver Relatório</> : <>{ETAPAS[etapa + 1]?.label} <ChevronRight size={18} /></>}
          </button>
        ) : (
          <button onClick={() => setEtapa(0)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: `2px solid ${COR}`, background: 'transparent', color: COR, cursor: 'pointer', fontWeight: 700 }}>Reiniciar</button>
        )}
      </div>
    </div>
  );
}
