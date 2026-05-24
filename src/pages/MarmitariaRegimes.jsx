import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Library } from 'lucide-react';

export default function MarmitariaRegimes() {
  const navigate = useNavigate();

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
        <div style={{ color: 'var(--text-muted)' }}>Regimes e Tipos de Empresas no Brasil</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Resumo: Natureza Jurídica e Regimes Tributários
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem' }}>
          Para abrir uma empresa no Brasil, o empreendedor toma duas decisões cruciais: a forma como a empresa será constituída (Tipos) e como ela pagará seus impostos (Regimes).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* TIPOS DE EMPRESAS */}
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              1. Natureza Jurídica (Tipo de Empresa)
            </h3>
            
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #6366f1' }}>
               <h4 style={{ color: '#818cf8', marginBottom: '0.5rem', fontSize: '1.25rem' }}>MEI (Microempreendedor Individual)</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Ideal para autônomos que estão começando e faturam até R$ 81.000 por ano.</p>
               <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                 <li>Sem sócios e limite de 1 funcionário.</li>
                 <li>CNPJ vinculado ao CPF (o patrimônio pessoal responde pelas dívidas).</li>
               </ul>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #3b82f6' }}>
               <h4 style={{ color: '#60a5fa', marginBottom: '0.5rem', fontSize: '1.25rem' }}>SLU (Sociedade Limitada Unipessoal)</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>A evolução da antiga EIRELI e do EI. Permite abrir empresa sem sócios, com faturamento livre.</p>
               <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                 <li>Proteção patrimonial (os bens do dono não se misturam com as dívidas da empresa).</li>
                 <li>Não exige capital social mínimo.</li>
               </ul>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #10b981' }}>
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
            
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #f59e0b' }}>
               <h4 style={{ color: '#fcd34d', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Simples Nacional</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Unifica o pagamento de até 8 impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP) em uma única guia (DAS).</p>
               <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                 <li>Para Microempresas (ME) até R$ 360 mil e Empresas de Pequeno Porte (EPP) até R$ 4,8 milhões/ano.</li>
                 <li>A alíquota é progressiva baseada no faturamento médio.</li>
               </ul>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #f97316' }}>
               <h4 style={{ color: '#fdba74', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Lucro Presumido</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>A Receita Federal "presume" a margem de lucro da empresa baseada na sua atividade (ex: 8% para comércio, 32% para serviços) e tributa o IRPJ e CSLL sobre essa presunção.</p>
               <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                 <li>Limite de faturamento de R$ 78 milhões/ano.</li>
                 <li>PIS e COFINS são cobrados separadamente, geralmente de forma cumulativa.</li>
               </ul>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #ef4444' }}>
               <h4 style={{ color: '#fca5a5', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Lucro Real</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Os impostos (IRPJ e CSLL) incidem sobre o lucro líquido contábil real, após abater todas as despesas justificáveis.</p>
               <ul style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '1.5rem' }}>
                 <li>Obrigatório para instituições financeiras ou empresas que faturam mais de R$ 78 milhões/ano.</li>
                 <li>PIS e COFINS são não cumulativos (geram créditos sobre insumos, como visto no exercício anterior).</li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
