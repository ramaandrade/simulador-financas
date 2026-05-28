import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, ChevronRight, Download,
  BarChart4, FileText, Plus, Trash2,
  Lightbulb, Target, TrendingUp, RefreshCcw
} from 'lucide-react';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const pct = (v) => `${(v || 0).toFixed(1)}%`;
const num = (v) => parseFloat(String(v).replace(',', '.')) || 0;

const COR = '#22c55e';
const ETAPAS = [
  { id: 0, label: 'Identificação', emoji: '🏥' },
  { id: 1, label: 'Custos Fixos', emoji: '📌' },
  { id: 2, label: 'Custos Variáveis', emoji: '🔄' },
  { id: 3, label: 'Precificação', emoji: '🏷️' },
  { id: 4, label: 'Capital de Giro', emoji: '💧' },
  { id: 5, label: 'Indicadores', emoji: '📊' },
  { id: 6, label: 'Relatório', emoji: '📋' },
];

// ─── DEFAULTS ────────────────────────────────────────────────────────────────
const defaultState = () => ({
  // Etapa 0 — Identificação
  nomeEmpresa: 'Farmácia Saúde & Vida',
  responsavel: 'João Silva',
  cidade: 'Crato - CE',
  regime: 'Simples Nacional',
  faturamento: 22000,
  clientes: 380,
  ticketMedio: 57.89,
  // Etapa 1 — Custos Fixos
  fixos: [
    { id: 1, desc: 'Aluguel do ponto', valor: 2200 },
    { id: 2, desc: 'Salário farmacêutico RT', valor: 3800 },
    { id: 3, desc: 'Salário caixa', valor: 1412 },
    { id: 4, desc: 'Encargos sociais (~35%)', valor: 1824 },
    { id: 5, desc: 'Energia elétrica (câmara fria + iluminação)', valor: 680 },
    { id: 6, desc: 'Internet + telefone', valor: 180 },
    { id: 7, desc: 'Software de gestão farmacêutica', valor: 280 },
    { id: 8, desc: 'Alvará sanitário (rateio mensal)', valor: 83 },
    { id: 9, desc: 'Contabilidade', valor: 350 },
    { id: 10, desc: 'Depreciação de equipamentos', valor: 220 },
  ],
  // Etapa 2 — Custos Variáveis
  cmvPerc: 58,
  embalagem: 0.8,
  comissaoVenda: 0,
  perdaVencimento: 1.2,
  impostoPerc: 4.5,
  taxaCartao: 2.8,
  frete: 0.3,
  outrosCV: [],
  // Etapa 3 — Precificação
  categorias: [
    { id: 1, nome: 'Medicamentos genéricos', cmv: 52, markup: 35, fatPerc: 45 },
    { id: 2, nome: 'Medicamentos de marca', cmv: 62, markup: 28, fatPerc: 25 },
    { id: 3, nome: 'Dermocosméticos', cmv: 48, markup: 55, fatPerc: 18 },
    { id: 4, nome: 'Higiene pessoal', cmv: 45, markup: 60, fatPerc: 12 },
  ],
  // Etapa 4 — Capital de Giro
  pme: 25,
  pmr: 8,
  pmp: 20,
  // Etapa 5 — KPIs extras
  satisfacaoClientes: 8.2,
  reclamacoes: 3,
  funcionariosTotal: 3,
  metaFaturamento: 28000,
  notasConsultor: '',
});

// ─── COMPONENTES AUXILIARES ──────────────────────────────────────────────────
function Campo({ label, value, onChange, type = 'text', prefix, suffix, small }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }}>
        {prefix && <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid var(--border-color)' }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '0.6rem 0.75rem', color: 'var(--text-main)', fontSize: small ? '0.85rem' : '0.95rem' }}
        />
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

// ─── CÁLCULOS ────────────────────────────────────────────────────────────────
function calcular(s) {
  const fat = num(s.faturamento);
  const totalFixo = s.fixos.reduce((acc, f) => acc + num(f.valor), 0);

  // CV total em %
  const cvPerc = num(s.cmvPerc) + num(s.embalagem) + num(s.comissaoVenda) + num(s.perdaVencimento) + num(s.impostoPerc) + num(s.taxaCartao) + num(s.frete) + s.outrosCV.reduce((a, c) => a + num(c.perc), 0);
  const cvReais = fat * cvPerc / 100;
  const mc = fat - cvReais;
  const mcPerc = fat > 0 ? mc / fat * 100 : 0;
  const lucro = mc - totalFixo;
  const margemLiq = fat > 0 ? lucro / fat * 100 : 0;
  const pe = mcPerc > 0 ? totalFixo / (mcPerc / 100) : 0;
  const margSeg = fat > 0 ? (fat - pe) / fat * 100 : 0;
  const roic = fat > 0 ? lucro / (fat * 3) * 100 : 0;

  // Capital de Giro
  const co = num(s.pme) + num(s.pmr);
  const cf = co - num(s.pmp);
  const fatDia = fat / 30;
  const ncg = cf * fatDia;

  // Mix de preços
  const precoMedio = fat / (num(s.clientes) || 1);

  return { fat, totalFixo, cvPerc, cvReais, mc, mcPerc, lucro, margemLiq, pe, margSeg, roic, co, cf, ncg, fatDia, precoMedio };
}

function semaforo(v, [ruim, bom]) {
  if (v < ruim) return '#ef4444';
  if (v < bom) return '#f59e0b';
  return '#22c55e';
}

// ─── RELATÓRIO ───────────────────────────────────────────────────────────────
function Relatorio({ s, calc }) {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const recomendacoes = [];
  if (calc.mcPerc < 30) recomendacoes.push({ tipo: 'critico', titulo: 'Margem de Contribuição Crítica', texto: `A MC% de ${pct(calc.mcPerc)} está abaixo do mínimo recomendado (30%) para farmácias. Recomendamos revisão imediata do CMV e mix de produtos, priorizando dermocosméticos e higiene (MC% mais alta).` });
  else if (calc.mcPerc < 40) recomendacoes.push({ tipo: 'atencao', titulo: 'Margem de Contribuição pode melhorar', texto: `MC% de ${pct(calc.mcPerc)} é aceitável, mas há espaço para melhoria. Aumentar a participação de dermocosméticos no mix pode elevar a MC% para 38-42%.` });
  else recomendacoes.push({ tipo: 'ok', titulo: 'Margem de Contribuição Saudável', texto: `MC% de ${pct(calc.mcPerc)} é excelente para o setor farmacêutico. Manter o mix atual e buscar ampliar volume.` });

  if (calc.margSeg < 10) recomendacoes.push({ tipo: 'critico', titulo: 'Margem de Segurança Baixíssima', texto: `Com apenas ${pct(calc.margSeg)} de margem de segurança, qualquer queda de faturamento gera prejuízo. Urgente: reduzir custos fixos ou aumentar faturamento mínimo em ${fmt(calc.pe - calc.fat * 0.9)}.` });
  else if (calc.margSeg < 25) recomendacoes.push({ tipo: 'atencao', titulo: 'Margem de Segurança Moderada', texto: `Margem de ${pct(calc.margSeg)} oferece alguma proteção, mas não é confortável. Recomendar reserva de emergência de 3 meses de custos fixos (${fmt(calc.totalFixo * 3)}).` });
  else recomendacoes.push({ tipo: 'ok', titulo: 'Boa Margem de Segurança', texto: `${pct(calc.margSeg)} de margem de segurança garante estabilidade operacional. Continue monitorando mensalmente.` });

  if (calc.cf > 20) recomendacoes.push({ tipo: 'atencao', titulo: 'Capital de Giro Elevado', texto: `Ciclo financeiro de ${calc.cf.toFixed(0)} dias exige ${fmt(calc.ncg)} de capital de giro. Negociar maior prazo com fornecedores (PMP) ou reduzir estoque médio pode liberar até ${fmt(calc.ncg * 0.3)} de caixa.` });

  if (calc.lucro < 0) recomendacoes.push({ tipo: 'critico', titulo: '⚠️ Operação com Prejuízo', texto: `A farmácia opera com prejuízo de ${fmt(Math.abs(calc.lucro))}/mês. Ação imediata necessária: revisar todos os custos fixos e aumentar faturamento para ${fmt(calc.pe)}.` });

  recomendacoes.push({ tipo: 'oportunidade', titulo: 'Oportunidade: Canal Digital', texto: 'Farmácias que adotam WhatsApp Business para pedidos e atendimento aumentam faturamento em 15-25%. Custo de implementação baixo, retorno em 30-60 dias.' });
  recomendacoes.push({ tipo: 'oportunidade', titulo: 'Oportunidade: Dermocosméticos', texto: `Dermocosméticos representam ${s.categorias.find(c => c.nome.includes('Dermo'))?.fatPerc || 18}% do faturamento mas têm a maior MC%. Aumentar participação para 25-30% pode elevar o lucro em ${fmt(calc.fat * 0.07 * (1 - calc.cvPerc / 100))}/mês.` });

  return (
    <div id="relatorio-print" style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* CABEÇALHO */}
      <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', borderRadius: '1rem', padding: '2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'rgba(34,197,94,0.15)', borderRadius: '50%', transform: 'translate(60px,-60px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', marginBottom: '0.5rem', fontWeight: 600 }}>Relatório de Consultoria Financeira</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>💊 {s.nomeEmpresa}</h1>
            <p style={{ color: '#bbf7d0', fontSize: '0.9rem' }}>{s.cidade} · {s.regime}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#86efac', marginBottom: '0.25rem' }}>Elaborado por</div>
            <div style={{ fontWeight: 700 }}>{s.responsavel || 'Consultor Financeiro'}</div>
            <div style={{ fontSize: '0.8rem', color: '#bbf7d0', marginTop: '0.25rem' }}>{dataHoje}</div>
          </div>
        </div>
      </div>

      {/* PAINEL DE KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Faturamento', v: fmt(calc.fat), c: '#22c55e', sub: 'Mensal atual' },
          { l: 'Margem de Contribuição', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [30, 40]), sub: fmt(calc.mc) + '/mês' },
          { l: 'Lucro Líquido', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.08]), sub: pct(calc.margemLiq) + ' do fat.' },
          { l: 'Ponto de Equilíbrio', v: fmt(calc.pe), c: semaforo(calc.margSeg, [10, 25]), sub: 'Margem seg. ' + pct(calc.margSeg) },
          { l: 'NCG', v: fmt(calc.ncg), c: semaforo(30 - calc.cf, [0, 10]), sub: 'Ciclo fin. ' + calc.cf.toFixed(0) + 'd' },
          { l: 'Ticket Médio', v: fmt(calc.precoMedio), c: '#7dd3fc', sub: (s.clientes || 0) + ' clientes/mês' },
        ].map((k, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{k.l}</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* DRE SIMPLIFICADA */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: COR }}>📑 DRE Gerencial Simplificada</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { l: 'Receita Bruta', v: calc.fat, bold: true, cor: '#22c55e' },
            { l: `(-) Custos Variáveis (${pct(calc.cvPerc)})`, v: -calc.cvReais, cor: '#ef4444' },
            { l: '= Margem de Contribuição', v: calc.mc, bold: true, cor: '#22c55e', sep: true },
            { l: '(-) Custos Fixos Totais', v: -calc.totalFixo, cor: '#ef4444' },
            { l: '= Lucro Operacional', v: calc.lucro, bold: true, grande: true, cor: calc.lucro >= 0 ? '#22c55e' : '#ef4444', sep: true },
          ].map((row, i) => (
            <div key={i}>
              {row.sep && <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.4rem 0' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.75rem', borderRadius: '0.35rem', background: row.bold ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                <span style={{ fontSize: row.grande ? '1rem' : '0.875rem', fontWeight: row.bold ? 700 : 400, color: row.bold ? 'var(--text-main)' : 'var(--text-muted)' }}>{row.l}</span>
                <span style={{ fontSize: row.grande ? '1.1rem' : '0.9rem', fontWeight: 700, color: row.cor }}>{fmt(row.v)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detalhamento CV */}
        <details style={{ marginTop: '1.5rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>▶ Ver detalhamento dos custos variáveis</summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
            {[
              { l: 'CMV (mercadorias)', v: pct(s.cmvPerc) },
              { l: 'Embalagens', v: pct(s.embalagem) },
              { l: 'Perdas por vencimento', v: pct(s.perdaVencimento) },
              { l: 'Impostos s/ faturamento', v: pct(s.impostoPerc) },
              { l: 'Taxa de cartão', v: pct(s.taxaCartao) },
              { l: 'Frete e logística', v: pct(s.frete) },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                <span style={{ color: '#fca5a5', fontWeight: 600 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </details>

        {/* Detalhamento CF */}
        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>▶ Ver detalhamento dos custos fixos</summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
            {s.fixos.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{f.desc}</span>
                <span style={{ color: '#fca5a5', fontWeight: 600 }}>{fmt(f.valor)}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* CAPITAL DE GIRO */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: COR }}>💧 Análise de Capital de Giro</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {[
            { l: 'PME (Estoque)', v: `${s.pme} dias`, c: '#a855f7', desc: 'Prazo médio de estoque' },
            { l: 'PMR (Recebimento)', v: `${s.pmr} dias`, c: '#3b82f6', desc: 'Prazo médio de recebimento' },
            { l: 'PMP (Pagamento)', v: `${s.pmp} dias`, c: '#22c55e', desc: 'Prazo médio de pagamento' },
          ].map((k, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.6rem', textAlign: 'center', borderTop: `2px solid ${k.c}` }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: k.c }}>{k.v}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.6rem', textAlign: 'center', borderTop: `2px solid ${calc.cf < 0 ? '#22c55e' : '#ef4444'}` }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: calc.cf < 0 ? '#22c55e' : '#ef4444' }}>{calc.cf.toFixed(0)} dias</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ciclo Financeiro {calc.cf < 0 ? '✅ Favorável' : '⚠️ Capital necessário'}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.6rem', textAlign: 'center', borderTop: `2px solid ${calc.ncg > calc.fat * 0.3 ? '#ef4444' : '#22c55e'}` }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: calc.ncg > calc.fat * 0.3 ? '#ef4444' : '#22c55e' }}>{fmt(Math.abs(calc.ncg))}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{calc.ncg < 0 ? 'Caixa extra gerado' : 'Necessidade de Capital de Giro'}</div>
          </div>
        </div>
      </div>

      {/* MIX DE PRODUTOS */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: COR }}>🏷️ Análise de Mix e Precificação</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                {['Categoria', '% Faturamento', 'CMV%', 'Markup%', 'MC% est.', 'Diagnóstico'].map((h, i) => (
                  <th key={i} style={{ padding: '0.6rem 0.75rem', textAlign: i === 0 ? 'left' : 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.categorias.map((cat, i) => {
                const mcEst = 100 - cat.cmv - s.impostoPerc - s.taxaCartao;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{cat.nome}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{pct(cat.fatPerc)}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#fca5a5' }}>{pct(cat.cmv)}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#7dd3fc' }}>{pct(cat.markup)}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 700, color: semaforo(mcEst, [25, 40]) }}>{pct(mcEst)}</td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontSize: '0.78rem', color: semaforo(mcEst, [25, 40]) }}>
                      {mcEst < 25 ? '🔴 Margem crítica' : mcEst < 40 ? '🟡 Atenção' : '🟢 Saudável'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: COR }}>🎯 Recomendações do Consultor</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recomendacoes.map((r, i) => {
            const cores = { critico: '#ef4444', atencao: '#f59e0b', ok: '#22c55e', oportunidade: '#3b82f6' };
            const emojis = { critico: '🔴', atencao: '🟡', ok: '🟢', oportunidade: '💡' };
            return (
              <div key={i} style={{ padding: '1.25rem', borderRadius: '0.6rem', borderLeft: `4px solid ${cores[r.tipo]}`, background: `rgba(${r.tipo === 'critico' ? '239,68,68' : r.tipo === 'atencao' ? '245,158,11' : r.tipo === 'ok' ? '34,197,94' : '59,130,246'}, 0.08)` }}>
                <div style={{ fontWeight: 700, color: cores[r.tipo], marginBottom: '0.4rem', fontSize: '0.9rem' }}>{emojis[r.tipo]} {r.titulo}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{r.texto}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* NOTAS DO CONSULTOR */}
      {s.notasConsultor && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid #a855f7' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#a855f7' }}>📝 Observações do Consultor</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{s.notasConsultor}</p>
        </div>
      )}

      {/* RODAPÉ */}
      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', borderTop: '1px solid var(--border-color)' }}>
        Relatório gerado pelo Simulador Financeiro URCA · Disciplina: Educação Financeira · {dataHoje}
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ConsultoriaFarmacia() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [s, setS] = useState(defaultState());
  const relRef = useRef();

  const calc = calcular(s);
  const total = ETAPAS.length;

  const set = (key, val) => setS(prev => ({ ...prev, [key]: val }));
  const setFixo = (id, updated) => set('fixos', s.fixos.map(f => f.id === id ? updated : f));
  const addFixo = () => set('fixos', [...s.fixos, { id: Date.now(), desc: 'Novo item', valor: 0 }]);
  const delFixo = (id) => set('fixos', s.fixos.filter(f => f.id !== id));
  const setCat = (id, updated) => set('categorias', s.categorias.map(c => c.id === id ? updated : c));

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body > *:not(#print-root) { display: none !important; }
        #print-root { display: block !important; }
        .glass-panel { border: 1px solid #ccc !important; background: white !important; color: black !important; margin-bottom: 1rem; page-break-inside: avoid; }
        * { color: #111 !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  return (
    <div className="container">
      {/* NAV */}
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/desafios-avancados')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /></button>
        </div>
        <div className="navbar-brand" style={{ color: COR }}>💊 Consultoria — Farmácia Popular</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Etapa {etapa + 1} de {total}</div>
      </nav>

      {/* PROGRESS BAR */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {ETAPAS.map((e, i) => (
            <button key={e.id} onClick={() => i <= etapa && setEtapa(i)}
              style={{ flex: 1, minWidth: '80px', padding: '0.6rem 0.4rem', borderRadius: '0.5rem', border: 'none', cursor: i <= etapa ? 'pointer' : 'default', background: i < etapa ? 'rgba(34,197,94,0.2)' : i === etapa ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)', borderBottom: i === etapa ? `3px solid ${COR}` : i < etapa ? '3px solid rgba(34,197,94,0.5)' : '3px solid transparent', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>{i < etapa ? '✅' : e.emoji}</div>
              <div style={{ fontSize: '0.65rem', color: i === etapa ? COR : i < etapa ? '#86efac' : 'var(--text-muted)', fontWeight: i === etapa ? 700 : 400, whiteSpace: 'nowrap' }}>{e.label}</div>
            </button>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(etapa / (total - 1)) * 100}%`, background: `linear-gradient(90deg, ${COR}, #86efac)`, borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* ══ ETAPA 0 — IDENTIFICAÇÃO ══ */}
      {etapa === 0 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: `4px solid ${COR}` }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🏥 Identificação da Empresa</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Os dados abaixo estão pré-preenchidos com valores realistas. Ajuste conforme as informações do estabelecimento visitado.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem' }}>
              <Campo label="Nome da Farmácia" value={s.nomeEmpresa} onChange={v => set('nomeEmpresa', v)} />
              <Campo label="Responsável / Consultor" value={s.responsavel} onChange={v => set('responsavel', v)} />
              <Campo label="Cidade / UF" value={s.cidade} onChange={v => set('cidade', v)} />
              <Campo label="Regime Tributário" value={s.regime} onChange={v => set('regime', v)} />
              <Campo label="Faturamento Mensal (R$)" value={s.faturamento} onChange={v => set('faturamento', num(v))} type="number" prefix="R$" />
              <Campo label="Nº Clientes por Mês" value={s.clientes} onChange={v => set('clientes', num(v))} type="number" />
            </div>
          </div>

          {/* Preview calculado */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Lightbulb size={18} color="#facc15" />
              <span style={{ color: '#facc15', fontWeight: 600, fontSize: '0.875rem' }}>Dados do estabelecimento em tempo real</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Faturamento: <strong style={{ color: '#22c55e' }}>{fmt(s.faturamento)}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Ticket médio: <strong style={{ color: '#7dd3fc' }}>{fmt(s.faturamento / (s.clientes || 1))}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Faturamento/dia: <strong style={{ color: '#f9a8d4' }}>{fmt(s.faturamento / 26)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ══ ETAPA 1 — CUSTOS FIXOS ══ */}
      {etapa === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>📌 Levantamento de Custos Fixos</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Custos que não mudam com o volume de vendas. Ajuste os valores conforme levantamento in loco.</p>
            {s.fixos.map(f => (
              <LinhaItem key={f.id} item={f} onChange={upd => setFixo(f.id, upd)} onDelete={() => delFixo(f.id)} corAcento="#fca5a5" />
            ))}
            <button onClick={addFixo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px dashed rgba(34,197,94,0.4)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: COR, cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              <Plus size={14} /> Adicionar item
            </button>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total Custos Fixos</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fca5a5' }}>{fmt(calc.totalFixo)}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Representa {pct(calc.totalFixo / calc.fat * 100)} do faturamento atual
            </div>
          </div>
        </div>
      )}

      {/* ══ ETAPA 2 — CUSTOS VARIÁVEIS ══ */}
      {etapa === 2 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🔄 Custos Variáveis (% sobre o faturamento)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Cada item abaixo incide sobre o faturamento. Ajuste conforme dados da farmácia.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
              <Campo label="CMV — Custo das Mercadorias Vendidas" value={s.cmvPerc} onChange={v => set('cmvPerc', num(v))} type="number" suffix="%" />
              <Campo label="Embalagens e sacolas" value={s.embalagem} onChange={v => set('embalagem', num(v))} type="number" suffix="%" />
              <Campo label="Perdas por vencimento" value={s.perdaVencimento} onChange={v => set('perdaVencimento', num(v))} type="number" suffix="%" />
              <Campo label="Impostos sobre faturamento (Simples)" value={s.impostoPerc} onChange={v => set('impostoPerc', num(v))} type="number" suffix="%" />
              <Campo label="Taxa de cartão (média)" value={s.taxaCartao} onChange={v => set('taxaCartao', num(v))} type="number" suffix="%" />
              <Campo label="Frete e entregas" value={s.frete} onChange={v => set('frete', num(v))} type="number" suffix="%" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid #fca5a5` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CV Total</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fca5a5' }}>{pct(calc.cvPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.cvReais)}/mês</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${semaforo(calc.mcPerc, [30, 42])}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Margem de Contribuição</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: semaforo(calc.mcPerc, [30, 42]) }}>{pct(calc.mcPerc)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(calc.mc)}/mês</div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ETAPA 3 — PRECIFICAÇÃO ══ */}
      {etapa === 3 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>🏷️ Análise de Mix e Precificação</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Configure o CMV e markup de cada categoria. O percentual do faturamento deve somar 100%.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {s.categorias.map(cat => (
                <div key={cat.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <input value={cat.nome} onChange={e => setCat(cat.id, { ...cat, nome: e.target.value })}
                      style={{ flex: 1, minWidth: '160px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', outline: 'none', color: COR, fontWeight: 700, fontSize: '0.9rem', padding: '0.25rem 0' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <Campo label="% do Faturamento" value={cat.fatPerc} onChange={v => setCat(cat.id, { ...cat, fatPerc: num(v) })} type="number" suffix="%" small />
                    <Campo label="CMV (%)" value={cat.cmv} onChange={v => setCat(cat.id, { ...cat, cmv: num(v) })} type="number" suffix="%" small />
                    <Campo label="Markup (%)" value={cat.markup} onChange={v => setCat(cat.id, { ...cat, markup: num(v) })} type="number" suffix="%" small />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>MC estimada: <strong style={{ color: semaforo(100 - cat.cmv - s.impostoPerc - s.taxaCartao, [25, 40]) }}>{pct(100 - cat.cmv - s.impostoPerc - s.taxaCartao)}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Faturamento: <strong style={{ color: COR }}>{fmt(s.faturamento * cat.fatPerc / 100)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ∑ % faturamento: <strong style={{ color: s.categorias.reduce((a, c) => a + c.fatPerc, 0) === 100 ? '#22c55e' : '#ef4444' }}>{s.categorias.reduce((a, c) => a + c.fatPerc, 0)}%</strong>
              {s.categorias.reduce((a, c) => a + c.fatPerc, 0) !== 100 && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>⚠️ Deve somar 100%</span>}
            </div>
          </div>
        </div>
      )}

      {/* ══ ETAPA 4 — CAPITAL DE GIRO ══ */}
      {etapa === 4 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>💧 Capital de Giro</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Levantamento dos prazos médios da operação. Esses dados determinam a necessidade de capital de giro.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div>
                <Campo label="PME — Prazo Médio de Estoque (dias)" value={s.pme} onChange={v => set('pme', num(v))} type="number" suffix="dias" />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Tempo médio que o medicamento fica em estoque antes de ser vendido</p>
              </div>
              <div>
                <Campo label="PMR — Prazo Médio de Recebimento (dias)" value={s.pmr} onChange={v => set('pmr', num(v))} type="number" suffix="dias" />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Prazo médio para receber após a venda (cartão, convênio etc.)</p>
              </div>
              <div>
                <Campo label="PMP — Prazo Médio de Pagamento (dias)" value={s.pmp} onChange={v => set('pmp', num(v))} type="number" suffix="dias" />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Prazo que o distribuidor/fornecedor dá para pagar</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { l: 'Ciclo Operacional', v: `${calc.co} dias`, c: '#6366f1', f: 'CO = PME + PMR' },
              { l: 'Ciclo Financeiro', v: `${calc.cf.toFixed(0)} dias`, c: calc.cf < 0 ? '#22c55e' : '#ef4444', f: calc.cf < 0 ? '✅ Favorável (fornecedor financia você!)' : '⚠️ Você precisa financiar a operação' },
              { l: 'Faturamento Diário', v: fmt(calc.fatDia), c: '#7dd3fc', f: 'Base para cálculo da NCG' },
              { l: 'NCG', v: fmt(Math.abs(calc.ncg)), c: calc.ncg < 0 ? '#22c55e' : '#f59e0b', f: calc.ncg < 0 ? 'Capital extra gerado' : 'Capital mínimo necessário em caixa' },
            ].map((k, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', borderTop: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.c, marginBottom: '0.25rem' }}>{k.v}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{k.f}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ETAPA 5 — INDICADORES ══ */}
      {etapa === 5 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: COR }}>📊 Indicadores e Diagnóstico Final</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Preencha dados adicionais e adicione suas observações como consultor.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
              <Campo label="Meta de Faturamento (R$)" value={s.metaFaturamento} onChange={v => set('metaFaturamento', num(v))} type="number" prefix="R$" />
              <Campo label="Satisfação dos Clientes (0-10)" value={s.satisfacaoClientes} onChange={v => set('satisfacaoClientes', num(v))} type="number" suffix="/10" />
              <Campo label="Reclamações no mês" value={s.reclamacoes} onChange={v => set('reclamacoes', num(v))} type="number" />
              <Campo label="Total de Funcionários" value={s.funcionariosTotal} onChange={v => set('funcionariosTotal', num(v))} type="number" />
            </div>
          </div>

          {/* Painel de KPIs com semáforo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { l: 'Margem de Contribuição', v: pct(calc.mcPerc), c: semaforo(calc.mcPerc, [30, 42]), lim: 'Ref: > 40%' },
              { l: 'Margem Líquida', v: pct(calc.margemLiq), c: semaforo(calc.margemLiq, [5, 12]), lim: 'Ref: > 8%' },
              { l: 'Margem de Segurança', v: pct(calc.margSeg), c: semaforo(calc.margSeg, [10, 25]), lim: 'Ref: > 20%' },
              { l: 'Ponto de Equilíbrio', v: fmt(calc.pe), c: semaforo(calc.fat - calc.pe, [0, calc.fat * 0.1]), lim: fmt(calc.fat - calc.pe) + ' de folga' },
              { l: 'Lucro Operacional', v: fmt(calc.lucro), c: semaforo(calc.lucro, [0, calc.fat * 0.08]), lim: calc.lucro >= 0 ? '✅ Positivo' : '❌ Prejuízo' },
              { l: 'Meta vs Atual', v: pct(calc.fat / s.metaFaturamento * 100), c: semaforo(calc.fat / s.metaFaturamento * 100, [70, 90]), lim: 'Da meta de ' + fmt(s.metaFaturamento) },
            ].map((k, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: k.c }}>{k.v}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{k.lim}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Observações do Consultor (aparecerão no relatório)</label>
            <textarea value={s.notasConsultor} onChange={e => set('notasConsultor', e.target.value)}
              rows={5} placeholder="Anote aqui suas impressões sobre o negócio, pontos fortes, riscos identificados in loco, conversas com o dono etc."
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem', color: 'var(--text-main)', resize: 'vertical', outline: 'none', fontSize: '0.875rem', lineHeight: 1.6, boxSizing: 'border-box' }} />
          </div>
        </div>
      )}

      {/* ══ ETAPA 6 — RELATÓRIO ══ */}
      {etapa === 6 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: COR, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Relatório de Consultoria Pronto
            </h2>
            <button onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: COR, border: 'none', borderRadius: '0.6rem', padding: '0.75rem 1.5rem', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
              <Download size={18} /> Imprimir / Salvar PDF
            </button>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            💡 Para salvar como PDF: clique em "Imprimir / Salvar PDF" → selecione "Salvar como PDF" na impressora do seu computador.
          </div>
          <div ref={relRef} id="print-root">
            <Relatorio s={s} calc={calc} />
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => setEtapa(e => Math.max(0, e - 1))} disabled={etapa === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: '2px solid var(--border-color)', background: 'transparent', color: etapa === 0 ? 'var(--text-muted)' : 'var(--text-main)', cursor: etapa === 0 ? 'default' : 'pointer', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Anterior
        </button>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {ETAPAS[etapa]?.label}
        </div>

        {etapa < total - 1 ? (
          <button onClick={() => setEtapa(e => Math.min(total - 1, e + 1))}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: 'none', background: COR, color: 'white', cursor: 'pointer', fontWeight: 700 }}>
            {etapa === total - 2 ? <><FileText size={18} /> Ver Relatório</> : <>{ETAPAS[etapa + 1]?.label} <ChevronRight size={18} /></>}
          </button>
        ) : (
          <button onClick={() => setEtapa(0)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.6rem', border: `2px solid ${COR}`, background: 'transparent', color: COR, cursor: 'pointer', fontWeight: 700 }}>
            Reiniciar Consultoria
          </button>
        )}
      </div>
    </div>
  );
}
