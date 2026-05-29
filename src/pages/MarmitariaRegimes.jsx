import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Library } from 'lucide-react';

export default function MarmitariaRegimes() {
  const navigate = useNavigate();

  const portes = [
    {
      nome: 'MEI',
      nomeLongo: 'Microempreendedor Individual',
      cor: '#a855f7',
      faturamento: 'Até R$ 81.000/ano',
      funcionarios: 'Até 1 funcionário',
      regime: 'DAS-MEI (taxa fixa mensal)',
      exemplo: 'Marmiteira, barbeiro autônomo, cozinheira de casa',
      destaque: 'Taxa mensal fixa de R$ 70-80 independente do faturamento',
    },
    {
      nome: 'ME',
      nomeLongo: 'Microempresa',
      cor: '#6366f1',
      faturamento: 'Até R$ 360.000/ano',
      funcionarios: 'Até 9 (comércio) ou 19 (indústria)',
      regime: 'Simples Nacional obrigatório (se optar)',
      exemplo: 'Padaria de bairro, farmácia popular, barbearia estruturada',
      destaque: 'Alíquota do Simples começa em ~4% sobre a receita bruta',
    },
    {
      nome: 'EPP',
      nomeLongo: 'Empresa de Pequeno Porte',
      cor: '#3b82f6',
      faturamento: 'R$ 360.001 a R$ 4,8 milhões/ano',
      funcionarios: 'Até 49 (comércio) ou 99 (indústria)',
      regime: 'Simples Nacional, Lucro Presumido ou Lucro Real',
      exemplo: 'Restaurante com várias unidades, rede de farmácias',
      destaque: 'Pode optar pelo Simples Nacional com alíquotas maiores (>12%)',
    },
    {
      nome: 'Médio',
      nomeLongo: 'Empresa de Médio Porte',
      cor: '#10b981',
      faturamento: 'R$ 4,8 mi a R$ 78 milhões/ano',
      funcionarios: '50 a 499 (comércio/serv.)',
      regime: 'Lucro Presumido ou Lucro Real',
      exemplo: 'Rede de supermercados regional, distribuidora de alimentos',
      destaque: 'Fora do Simples — paga IRPJ, CSLL, PIS, COFINS separadamente',
    },
    {
      nome: 'Grande',
      nomeLongo: 'Grande Empresa',
      cor: '#ef4444',
      faturamento: 'Acima de R$ 78 milhões/ano',
      funcionarios: '500+ funcionários',
      regime: 'Lucro Real (obrigatório acima de R$ 78 mi)',
      exemplo: 'Redes nacionais, indústrias, bancos',
      destaque: 'Lucro Real obrigatório — IRPJ e CSLL incidem sobre o lucro real apurado',
    },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/custos')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar para Custos
          </button>
        </div>
        <div className="navbar-brand">
          <Library size={24} /> Lousa do Professor
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Regimes, Tipos e Porte de Empresas no Brasil</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ec4899' }}>
          Resumo: Natureza Jurídica, Regimes Tributários e Porte
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem' }}>
          Para abrir uma empresa no Brasil, o empreendedor toma três decisões cruciais: a forma como a empresa será constituída, como ela pagará seus impostos e qual é o seu porte legal — que determina obrigações, benefícios e limites de crescimento.
        </p>

        {/* GRID: NATUREZA JURÍDICA + REGIMES TRIBUTÁRIOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

          {/* TIPOS DE EMPRESAS */}
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              1. Natureza Jurídica (Tipo de Empresa)
            </h3>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #6366f1' }}>
              <h4 style={{ color: '#818cf8', marginBottom: '0.5rem', fontSize: '1.25rem' }}>MEI (Microempreendedor Individual)</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Ideal para autônomos que estão começando e faturam até R$ 81.000 por ano.</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>Sem sócios e limite de 1 funcionário.</li>
                <li>CNPJ vinculado ao CPF (o patrimônio pessoal responde pelas dívidas).</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#60a5fa', marginBottom: '0.5rem', fontSize: '1.25rem' }}>SLU (Sociedade Limitada Unipessoal)</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>A evolução da antiga EIRELI e do EI. Permite abrir empresa sem sócios, com faturamento livre.</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>Proteção patrimonial (os bens do dono não se misturam com as dívidas da empresa).</li>
                <li>Não exige capital social mínimo.</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#34d399', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Sociedade Empresária Limitada (LTDA)</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Formato clássico para duas ou mais pessoas que querem empreender juntas.</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>O capital é dividido em cotas (cada sócio responde pelo que investiu).</li>
                <li>Proteção do patrimônio pessoal dos sócios.</li>
              </ul>
            </div>
          </div>

          {/* REGIMES TRIBUTÁRIOS */}
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              2. Regimes Tributários (Impostos)
            </h3>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Simples Nacional</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Unifica o pagamento de até 8 impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP) em uma única guia (DAS).</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>Para Microempresas (ME) até R$ 360 mil e Empresas de Pequeno Porte (EPP) até R$ 4,8 milhões/ano.</li>
                <li>A alíquota é progressiva baseada no faturamento médio.</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #f97316' }}>
              <h4 style={{ color: '#fdba74', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Lucro Presumido</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>A Receita Federal "presume" a margem de lucro da empresa baseada na sua atividade (ex: 8% para comércio, 32% para serviços) e tributa o IRPJ e CSLL sobre essa presunção.</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>Limite de faturamento de R$ 78 milhões/ano.</li>
                <li>PIS e COFINS são cobrados separadamente, geralmente de forma cumulativa.</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: '#fca5a5', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Lucro Real</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Os impostos (IRPJ e CSLL) incidem sobre o lucro líquido contábil real, após abater todas as despesas justificáveis.</p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                <li>Obrigatório para instituições financeiras ou empresas que faturam mais de R$ 78 milhões/ano.</li>
                <li>PIS e COFINS são não cumulativos (geram créditos sobre insumos, como visto no exercício anterior).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── SEÇÃO PORTE ─────────────────────────────────────────────── */}
        <div>
          <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            3. Porte da Empresa (Classificação Legal)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            O porte define obrigações legais, acesso a linhas de crédito (Pronampe, BNDES), regime tributário permitido e benefícios fiscais. A classificação oficial usa principalmente o <strong style={{ color: 'var(--text-main)' }}>faturamento anual</strong> como critério principal.
          </p>

          {/* Cards de porte em linha horizontal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {portes.map((p) => (
              <div key={p.nome} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', borderTop: `4px solid ${p.cor}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: p.cor }}>{p.nome}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{p.nomeLongo}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>💰 Faturamento: </span>
                    <strong style={{ color: p.cor }}>{p.faturamento}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>👥 Funcionários: </span>
                    <span style={{ color: 'var(--text-main)' }}>{p.funcionarios}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>📋 Regime: </span>
                    <span style={{ color: 'var(--text-main)' }}>{p.regime}</span>
                  </div>
                  <div style={{ marginTop: '0.25rem', padding: '0.4rem 0.6rem', background: `rgba(${p.cor === '#a855f7' ? '168,85,247' : p.cor === '#6366f1' ? '99,102,241' : p.cor === '#3b82f6' ? '59,130,246' : p.cor === '#10b981' ? '16,185,129' : '239,68,68'}, 0.1)`, borderRadius: '0.4rem', fontSize: '0.75rem', color: p.cor, fontStyle: 'italic' }}>
                    💡 {p.destaque}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Ex: {p.exemplo}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela resumo */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  {['Porte', 'Faturamento Anual', 'Funcionários (comércio)', 'Regime permitido', 'Crédito público'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { porte: 'MEI', cor: '#a855f7', fat: 'Até R$ 81.000', func: '1', regime: 'DAS-MEI', credito: 'Crediamigo, BNB' },
                  { porte: 'ME', cor: '#6366f1', fat: 'Até R$ 360.000', func: 'Até 9', regime: 'Simples Nacional', credito: 'Pronampe, BNDES' },
                  { porte: 'EPP', cor: '#3b82f6', fat: 'Até R$ 4,8 milhões', func: 'Até 49', regime: 'Simples, Presumido, Real', credito: 'Pronampe, Finame' },
                  { porte: 'Médio', cor: '#10b981', fat: 'Até R$ 78 milhões', func: '50 a 499', regime: 'Presumido ou Real', credito: 'BNDES, Finame' },
                  { porte: 'Grande', cor: '#ef4444', fat: 'Acima de R$ 78 mi', func: '500+', regime: 'Lucro Real (obrig.)', credito: 'Mercado de capitais' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: row.cor }}>{row.porte}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{row.fat}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.func}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.regime}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.credito}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nota sobre critérios */}
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(250,204,21,0.06)', borderLeft: '4px solid #facc15', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: '#facc15' }}>⚠️ Atenção: critérios podem variar.</strong>{' '}
            A classificação por faturamento é a mais usada no contexto tributário (Lei Complementar 123/2006 e Lei 11.638/2007). O BNDES usa critério de Receita Operacional Bruta (ROB), que pode diferir levemente. O IBGE usa o número de funcionários para fins estatísticos. Sempre consulte o critério específico da finalidade desejada (crédito, licitação, estatística).
          </div>
        </div>

      </div>
    </div>
  );
}
