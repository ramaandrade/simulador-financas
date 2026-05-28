import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, ChevronRight, Download,
  BarChart4, FileText, Plus, Trash2, Lightbulb,
  TrendingUp, RefreshCcw, Target
} from 'lucide-react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const pct = (v) => `${(v || 0).toFixed(1)}%`;
const num = (v) => parseFloat(String(v).replace(',', '.')) || 0;
const COR = '#6366f1';

const ETAPAS = [
  { id: 0, label: 'Identificação', emoji: '✂️' },
  { id: 1, label: 'Custos Fixos', emoji: '📌' },
  { id: 2, label: 'Custos Variáveis', emoji: '🔄' },
  { id: 3, label: 'Serviços', emoji: '🏷️' },
  { id: 4, label: 'Capital de Giro', emoji: '💧' },
  { id: 5, label: 'Indicadores', emoji: '📊' },
  { id: 6, label: 'Relatório', emoji: '📋' },
];

const defaultState = () => ({
  nomeEmpresa: 'Barbearia Estilo Certo',
  responsavel: '',
  cidade: 'Crato - CE',
  regime: 'MEI',
  modeloRemuneracao: 'misto',
  faturamento: 9000,
  clientes: 150,
  // Custos Fixos
  fixos: [
    { id: 1, desc: 'Aluguel da sala', valor: 800 },
    { id: 2, desc: 'Salário recepcionista', valor: 1412 },
    { id: 3, desc: 'Encargos recepcionista (~35%)', valor: 494 },
    { id: 4, desc: 'Energia elétrica', valor: 280 },
    { id: 5, desc: 'Internet + streaming (ambiente)', valor: 120 },
    { id: 6, desc: 'Sistema de agendamento online', valor: 89 },
    { id: 7, desc: 'Depreciação equipamentos (cadeiras, espelhos)', valor: 180 },
    { id: 8, desc: 'Contabilidade / MEI', valor: 80 },
  ],
  // Custos Variáveis
  produtoPerc: 8,
  toalhaDesc: 0.5,
  comissaoBarbeiro: 40,
  impostoPerc: 0,
  taxaCartao: 2.5,
  outrosCV: [],
  // Serviços
  servicos: [
    { id: 1, nome: 'Corte simples', preco: 35, custo: 4, atend: 60, tempoMin: 30 },
    { id: 2, nome: 'Corte + barba', preco: 55, custo: 7, atend: 50, tempoMin: 50 },
    { id: 3, nome: 'Barba completa', preco: 30, custo: 5, atend: 20, tempoMin: 30 },
    { id: 4, nome: 'Pigmentação / coloração', preco: 80, custo: 22, atend: 10, tempoMin: 60 },
    { id: 5, nome: 'Tratamento capilar', preco: 70, custo: 18, atend: 10, tempoMin: 45 },
  ],
  // Capital de Giro
  pme: 15, pmr: 3, pmp: 0,
  // KPIs
  horasOperacao: 8,
  diasOperacao: 26,
  barbeiros: 2,
  metaFaturamento: 14000,
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

function LinhaItem({ item, onChange, onDelete, corAcento }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
      <input value={item.desc} onChange={e => onChange({ ...item, desc: e.target.value })}
        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', overflow: 'hidden', minWidth: '120px' }}>
        <span style={{ padding: '0 0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>R$</span>
        <input type="number" value={item.valor} onChange={e => onChange({ ...item, valor: num(e.target.value) })}
          style={{ width: '80px', background: 'transparent', border: 'none', outline: 'none', padding: '0.5rem 0.25rem', color: corAcento, fontWeight: 600, fontSize: '0.875rem' }} />
      </div>
      <button onClick={onDelete} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '0.4rem', padding: '0.5rem', cursor: 'pointer', color: '#ef4444' }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function calcular(s) {
  const fat = num(s.faturamento);
  const totalFixo = s.fixos.reduce((acc, f) => acc + num(f.valor), 0);
  const cvPerc = num(s.produtoPerc) + num(s.toalhaDesc) + num(s.comissaoBarbeiro) + num(s.impostoPerc) + num(s.taxaCartao);
  const cvReais = fat * cvPerc / 100;
  const mc = fat - cvReais;
  const mcPerc = fat > 0 ? mc / fat * 100 : 0;
  const lucro = mc - totalFixo;
  const margemLiq = fat > 0 ? lucro / fat * 100 : 0;
  const pe = mcPerc > 0 ? totalFixo / (mcPerc / 100) : 0;
  const margSeg = fat > 0 ? Math.max(0, (fat - pe) / fat * 100) : 0;
  const co = num(s.pme) + num(s.pmr);
  const cf = co - num(s.pmp);
  const fatDia = fat / (s.diasOperacao || 26);
  const ncg = cf * fatDia;
  const ticketMedio = fat / (num(s.clientes) || 1);
  // Capacidade por barbeiro
  const minDia = num(s.horasOperacao) * 60;
  const totalAtend = s.servicos.reduce((a, sv) => a + num(sv.atend), 0);
  const tempoMedioAtend = totalAtend > 0 ? s.servicos.reduce((a, sv) => a + (num(sv.atend) * num(sv.tempoMin)), 0) / totalAtend : 30;
  const capacidadeDia = num(s.barbeiros) * Math.floor(minDia / tempoMedioAtend);
  const capacidadeMes = capacidadeDia * (s.diasOperacao || 26);
  const ocupacao = num(s.clientes) / capacidadeMes * 100;
  // MCs por serviço
  const servComMC = s.servicos.map(sv => ({
    ...sv,
    mc: num(sv.preco) - num(sv.custo) - num(sv.preco) * (num(s.comissaoBarbeiro) + num(s.taxaCartao)) / 100,
    mcPerc: ((num(sv.preco) - num(sv.custo) - num(sv.preco) * (num(s.comissaoBarbeiro) + num(s.taxaCartao)) / 100) / num(sv.preco)) * 100,
    fatTotal: num(sv.atend) * num(sv.preco),
  }));
  return { fat, totalFixo, cvPerc, cvReais, mc, mcPerc, lucro, margemLiq, pe, margSeg, co, cf, ncg, fatDia, ticketMedio, capacidadeMes, ocupacao, servComMC, tempoMedioAtend };
}

function semaforo(v, [ruim, bom]) {
  if (v < ruim) return '#ef4444';
  if (v < bom) return '#f59e0b';
  return '#22c55e';
}

function Relatorio({ s, calc }) {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const recs = [];

  if (calc.ocupacao < 60) recs.push({ tipo: 'critico', titulo: 'Taxa de Ocupação Baixa', texto: `Ocupação de ${pct(calc.ocupacao)} indica capacidade ociosa. Com ${s.barbeiros} barbeiros e apenas ${s.clientes} clientes, há potencial para até ${Math.round(calc.capacidadeMes * 0.75)} atendimentos. Estratégia: programa de fidelidade + marketing digital.` });
  else if (calc.ocupacao > 90) recs.push({ tipo: 'oportunidade', titulo: 'Alta Ocupação — Hora de Expandir', texto: `Ocupação de ${pct(calc.ocupacao)} é excelente, mas indica limite da capacidade. Considere: contratar barbeiro adicional ou aumentar a tabela de preços.` });

  if (calc.mcPerc < 40) recs.push({ tipo: 'critico', titulo: 'Margem de Contribuição Comprimida', texto: `MC% de ${pct(calc.mcPerc)} está abaixo do esperado para barbearias (50-60%). Revisar comissão dos barbeiros e/ou ajustar tabela de preços.` });

  const melhorServico = [...calc.servComMC].sort((a, b) => b.mcPerc - a.mcPerc)[0];
  if (melhorServico) recs.push({ tipo: 'oportunidade', titulo: `Impulsionar: ${melhorServico.nome}`, texto: `"${melhorServico.nome}" tem a maior MC% (${pct(melhorServico.mcPerc)}). Cada atendimento a mais gera ${fmt(melhorServico.mc)} de margem. Criar pacote ou promoção específica para esse serviço.` });

  recs.push({ tipo: 'oportunidade', titulo: 'Agendamento Online = Mais Clientes', texto: 'Barbearias com agendamento online ativo no WhatsApp e Instagram aumentam base de clientes em 20-35% em 3 meses. ROI do investimento em sistema: menos de 30 dias.' });

  if (s.regime === 'MEI') recs.push({ tipo: 'atencao', titulo: 'Limite MEI — Planejamento Tributário', texto: `Como MEI, o limite anual é R$81.000 (R$6.750/mês). Faturamento atual: ${fmt(s.faturamento)}/mês. ${s.faturamento > 6750 ? '⚠️ ATENÇÃO: acima do limite MEI — formalizar como ME urgentemente.' : 'Ainda dentro do limite, mas monitorar crescimento.'}` });

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '1rem', padding: '2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', transform: 'translate(60px,-60px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a5b4fc', marginBottom: '0.5rem', fontWeight: 600 }}>Relatório de Consultoria Financeira</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>✂️ {s.nomeEmpresa}</h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>{s.cidade} · {s.regime} · {s.barbeiros} barbeiro(s)</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.25rem' }}>Elaborado por</div>
            <div style={{ fontWeight: 700 }}>{s.responsavel || 'Consultor Financeiro'}</div>
            <div style={{ fontSize: '0.8rem', color: '#c7d2fe', marginTop: '0.25rem' }}>{dataHoje}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Faturamento', v: fmt(calc.fat), c: COR, sub: 'Mensal atual' },
          { l: 'MC%', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [40, 55]), sub: fmt(calc.mc) + '/mês' },
          { l: 'Lucro Líquido', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.1]), sub: pct(calc.margemLiq) },
          { l: 'PE', v: fmt(calc.pe), c: semaforo(calc.margSeg, [10, 25]), sub: 'Margem seg. ' + pct(calc.margSeg) },
          { l: 'Ticket Médio', v: fmt(calc.ticketMedio), c: '#7dd3fc', sub: s.clientes + ' clientes/mês' },
          { l: 'Ocupação', v: pct(calc.ocupacao), c: semaforo(calc.ocupacao, [50, 75]), sub: s.clientes + '/' + Math.round(calc.capacidadeMes) + ' cap.' },
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
          { l: `(-) Custos Variáveis (${pct(calc.cvPerc)})`, v: -calc.cvReais, c: '#fca5a5' },
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
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: COR }}>🏷️ Rentabilidade por Serviço</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                {['Serviço', 'Preço', 'Custo', 'MC/atend.', 'MC%', 'Atend./mês', 'Fat. total', 'Status'].map((h, i) => (
                  <th key={i} style={{ padding: '0.5rem 0.6rem', textAlign: i === 0 ? 'left' : 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calc.servComMC.map((sv, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>{sv.nome}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>{fmt(sv.preco)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right', color: '#fca5a5' }}>{fmt(sv.custo)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right', fontWeight: 700, color: COR }}>{fmt(sv.mc)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right', color: semaforo(sv.mcPerc, [35, 55]) }}>{pct(sv.mcPerc)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>{sv.atend}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right', color: '#22c55e' }}>{fmt(sv.fatTotal)}</td>
                  <td style={{ padding: '0.5rem 0.6rem', textAlign: 'right', fontSize: '0.75rem', color: semaforo(sv.mcPerc, [35, 55]) }}>
                    {sv.mcPerc < 35 ? '🔴' : sv.mcPerc < 55 ? '🟡' : '🟢'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default function ConsultoriaBarbearia() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [s, setS] = useState(defaultState());

  const calc = calcular(s);
  const total = ETAPAS.length;
  const set = (key, val) => setS(prev => ({ ...prev, [key]: val }));
  const setFixo = (id, up) => set('fixos', s.fixos.map(f => f.id === id ? up : f));
  const addFixo = () => set('fixos', [...s.fixos, { id: Date.now(), desc: 'Novo item', valor: 0 }]);
  const delFixo = (id) => set('fixos', s.fixos.filter(f => f.id !== id));
  const setSv = (id, up) => set('servicos', s.servicos.map(v => v.id === id ? up : v));
  const addSv = () => set('servicos', [...s.servicos, { id: Date.now(), nome: 'Novo serviço', preco: 0, custo: 0, atend: 0, tempoMin: 30 }]);
  const delSv = (id) => set('servicos', s.servicos.filter(v => v.id !== id));

  const handlePrint = () => window.print();

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/desafios-avancados')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /></button>
        </div>
        <div className="navbar-brand" style={{ color: COR }}>✂️ Consultoria — Barbearia Moderna</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Etapa {etapa + 1} de {total}</div>
      </nav>

      {/* PROGRESS */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
          {ETAPAS.map((e, i) => (
            <button key={e.id} onClick={() => i <= etapa && setEtapa(i)}
              style={{ flex: 1, minWidth: '72px', padding: '0.6rem 0.3rem', borderRadius: '0.5rem', border: 'none', cursor: i <= etapa ? 'pointer' : 'default', background: i < etapa ? 'rgba(99,102,241,0.2)' : i === etapa ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)', borderBottom: i === etapa ? `3px solid ${COR}` : i < etapa ? '3px solid rgba(99,102,241,0.5)' : '3px solid transparent' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{i < etapa ? '✅' : e.emoji}</div>
              <div style={{ fontSize: '0.62rem', color: i === etapa ? COR : i < etapa ? '#a5b4fc' : 'var(--text-muted)', fontWeight: i === etapa ? 700 : 400 }}>{e.label}</div>
            </button>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(etapa / (total - 1)) * 100}%`, background: `linear-gradient(90deg, ${COR}, #a5b4fc)`, borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* ETAPA 0 */}
      {etapa === 0 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: `4px solid ${COR}` }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>✂️ Identificação da Barbearia</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Dados pré-preenchidos com valores típicos de barbearia de bairro. Ajuste conforme o estabelecimento visitado.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
              <Campo label="Nome da Barbearia" value={s.nomeEmpresa} onChange={v => set('nomeEmpresa', v)} />
              <Campo label="Responsável / Consultor" value={s.responsavel} onChange={v => set('responsavel', v)} />
              <Campo label="Cidade / UF" value={s.cidade} onChange={v => set('cidade', v)} />
              <Campo label="Regime Tributário" value={s.regime} onChange={v => set('regime', v)} />
              <Campo label="Faturamento Mensal (R$)" value={s.faturamento} onChange={v => set('faturamento', num(v))} type="number" prefix="R$" />
              <Campo label="Clientes Atendidos por Mês" value={s.clientes} onChange={v => set('clientes', num(v))} type="number" />
              <Campo label="Número de Barbeiros" value={s.barbeiros} onChange={v => set('barbeiros', num(v))} type="number" />
              <Campo label="Horas de Operação por Dia" value={s.horasOperacao} onChange={v => set('horasOperacao', num(v))} type="number" suffix="h" />
              <Campo label="Dias de Operação por Mês" value={s.diasOperacao} onChange={v => set('diasOperacao', num(v))} type="number" suffix="dias" />
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99,102,241,0.07)', borderRadius: '0.6rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ticket médio: <strong style={{ color: COR }}>{fmt(s.faturamento / (s.clientes || 1))}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Fat./dia: <strong style={{ color: '#a5b4fc' }}>{fmt(s.faturamento / (s.diasOperacao || 26))}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Clientes/barbeiro/dia: <strong style={{ color: '#c4b5fd' }}>{((s.clientes || 1) / (s.barbeiros || 1) / (s.diasOperacao || 26)).toFixed(1)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 1 */}
      {etapa === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>📌 Custos Fixos da Barbearia</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Atenção: barbeiro com salário fixo entra aqui. Barbeiro que recebe por comissão entra nos custos variáveis.</p>
            {s.fixos.map(f => <LinhaItem key={f.id} item={f} onChange={up => setFixo(f.id, up)} onDelete={() => delFixo(f.id)} corAcento="#fca5a5" />)}
            <button onClick={addFixo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.4)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: COR, cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.75rem' }}>
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
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🔄 Custos Variáveis por Atendimento</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Cada % abaixo incide sobre o faturamento total da barbearia.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
              <Campo label="Produtos por atendimento (gel, cera, óleo...)" value={s.produtoPerc} onChange={v => set('produtoPerc', num(v))} type="number" suffix="%" />
              <Campo label="Toalhas descartáveis e materiais higiênicos" value={s.toalhaDesc} onChange={v => set('toalhaDesc', num(v))} type="number" suffix="%" />
              <Campo label="Comissão dos barbeiros (se por atendimento)" value={s.comissaoBarbeiro} onChange={v => set('comissaoBarbeiro', num(v))} type="number" suffix="%" />
              <Campo label="Impostos sobre faturamento" value={s.impostoPerc} onChange={v => set('impostoPerc', num(v))} type="number" suffix="%" />
              <Campo label="Taxa de cartão (média ponderada)" value={s.taxaCartao} onChange={v => set('taxaCartao', num(v))} type="number" suffix="%" />
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#fbbf24' }}>📌 Modelo de remuneração:</strong> Se o barbeiro tem salário fixo, a comissão deve ser 0% aqui e o salário entra nos custos fixos (etapa anterior). Se é comissão pura, a comissão entra aqui e não há salário fixo.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #fca5a5' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CV Total</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fca5a5' }}>{pct(calc.cvPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.cvReais)}/mês</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${semaforo(calc.mcPerc, [40, 55])}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MC%</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: semaforo(calc.mcPerc, [40, 55]) }}>{pct(calc.mcPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.mc)}/mês</div>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 3 — SERVIÇOS */}
      {etapa === 3 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🏷️ Tabela de Serviços</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Configure preço, custo direto de produto e volume de atendimentos mensais por serviço.</p>
            {s.servicos.map(sv => (
              <div key={sv.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input value={sv.nome} onChange={e => setSv(sv.id, { ...sv, nome: e.target.value })}
                    style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: `1px solid ${COR}`, outline: 'none', color: COR, fontWeight: 700, fontSize: '0.9rem', padding: '0.2rem 0' }} />
                  <button onClick={() => delSv(sv.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '0.4rem', padding: '0.4rem', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <Campo label="Preço (R$)" value={sv.preco} onChange={v => setSv(sv.id, { ...sv, preco: num(v) })} type="number" small />
                  <Campo label="Custo produto (R$)" value={sv.custo} onChange={v => setSv(sv.id, { ...sv, custo: num(v) })} type="number" small />
                  <Campo label="Atend./mês" value={sv.atend} onChange={v => setSv(sv.id, { ...sv, atend: num(v) })} type="number" small />
                  <Campo label="Tempo (min)" value={sv.tempoMin} onChange={v => setSv(sv.id, { ...sv, tempoMin: num(v) })} type="number" small />
                </div>
                {sv.preco > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>MC/atend.: <strong style={{ color: COR }}>{fmt(sv.preco - sv.custo - sv.preco * (num(s.comissaoBarbeiro) + num(s.taxaCartao)) / 100)}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>MC%: <strong style={{ color: semaforo(((sv.preco - sv.custo - sv.preco * (num(s.comissaoBarbeiro) + num(s.taxaCartao)) / 100) / sv.preco) * 100, [35, 55]) }}>{pct(((sv.preco - sv.custo - sv.preco * (num(s.comissaoBarbeiro) + num(s.taxaCartao)) / 100) / sv.preco) * 100)}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Fat./mês: <strong style={{ color: '#22c55e' }}>{fmt(sv.atend * sv.preco)}</strong></span>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addSv} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.4)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: COR, cursor: 'pointer', fontSize: '0.85rem' }}>
              <Plus size={14} /> Adicionar serviço
            </button>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.06)' }}>
            <div style={{ display: 'flex', justify: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem' }}>
              <span>Fat. por serviços: <strong style={{ color: COR }}>{fmt(s.servicos.reduce((a, sv) => a + num(sv.atend) * num(sv.preco), 0))}</strong></span>
              <span>Capacidade mensal: <strong style={{ color: '#7dd3fc' }}>{Math.round(calc.capacidadeMes)} atend.</strong></span>
              <span>Ocupação atual: <strong style={{ color: semaforo(calc.ocupacao, [50, 75]) }}>{pct(calc.ocupacao)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 4 */}
      {etapa === 4 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>💧 Capital de Giro</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Na barbearia, o PMP (prazo dos fornecedores de produto) é geralmente baixo e o PMR é quase zero (recebimento imediato).</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
              <Campo label="PME — Estoque de Produtos (dias)" value={s.pme} onChange={v => set('pme', num(v))} type="number" suffix="dias" />
              <Campo label="PMR — Prazo Recebimento (dias)" value={s.pmr} onChange={v => set('pmr', num(v))} type="number" suffix="dias" />
              <Campo label="PMP — Prazo Fornecedor (dias)" value={s.pmp} onChange={v => set('pmp', num(v))} type="number" suffix="dias" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { l: 'Ciclo Operacional', v: `${calc.co}d`, c: '#6366f1' },
              { l: 'Ciclo Financeiro', v: `${calc.cf.toFixed(0)}d`, c: calc.cf < 0 ? '#22c55e' : '#f59e0b' },
              { l: 'Fat. Diário', v: fmt(calc.fatDia), c: '#7dd3fc' },
              { l: 'NCG', v: fmt(Math.abs(calc.ncg)), c: '#f59e0b' },
            ].map((k, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.c }}>{k.v}</div>
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
                { l: 'MC%', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [40, 55]), ref: '> 50%' },
                { l: 'Margem Líquida', v: pct(calc.margemLiq), c: semaforo(calc.margemLiq, [5, 15]), ref: '> 10%' },
                { l: 'Margem Segurança', v: pct(calc.margSeg), c: semaforo(calc.margSeg, [10, 25]), ref: '> 20%' },
                { l: 'PE', v: fmt(calc.pe), c: semaforo(calc.fat - calc.pe, [0, calc.fat * 0.1]), ref: fmt(calc.fat - calc.pe) + ' folga' },
                { l: 'Lucro', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.1]), ref: calc.lucro >= 0 ? 'Positivo ✅' : 'Prejuízo ❌' },
                { l: 'Ocupação', v: pct(calc.ocupacao), c: semaforo(calc.ocupacao, [50, 75]), ref: '60-80% ideal' },
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
              placeholder="Impressões sobre o negócio, pontos fortes, riscos, sugestões específicas..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem', color: 'var(--text-main)', resize: 'vertical', outline: 'none', fontSize: '0.875rem', lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
        </div>
      )}

      {/* ETAPA 6 — RELATÓRIO */}
      {etapa === 6 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: COR }}><FileText size={22} style={{ marginRight: '0.5rem' }} />Relatório Pronto</h2>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: COR, border: 'none', borderRadius: '0.6rem', padding: '0.75rem 1.5rem', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              <Download size={18} /> Imprimir / Salvar PDF
            </button>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            💡 Clique em "Imprimir / Salvar PDF" → selecione "Salvar como PDF" para gerar o arquivo para o empreendedor.
          </div>
          <Relatorio s={s} calc={calc} />
        </div>
      )}

      {/* NAVEGAÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => setEtapa(e => Math.max(0, e - 1))} disabled={etapa === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: '2px solid var(--border-color)', background: 'transparent', color: etapa === 0 ? 'var(--text-muted)' : 'var(--text-main)', cursor: etapa === 0 ? 'default' : 'pointer', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Anterior
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ETAPAS[etapa]?.label}</span>
        {etapa < total - 1 ? (
          <button onClick={() => setEtapa(e => Math.min(total - 1, e + 1))}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: 'none', background: COR, color: 'white', cursor: 'pointer', fontWeight: 700 }}>
            {etapa === total - 2 ? <><FileText size={18} /> Ver Relatório</> : <>{ETAPAS[etapa + 1]?.label} <ChevronRight size={18} /></>}
          </button>
        ) : (
          <button onClick={() => setEtapa(0)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: `2px solid ${COR}`, background: 'transparent', color: COR, cursor: 'pointer', fontWeight: 700 }}>
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}
