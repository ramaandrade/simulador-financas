import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Store, MonitorUp, Zap, ArrowDown } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaFinanciamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Modernizar a estética da loja atrai público Classe A.
  const [valorRef, setValorRef] = useState(85000); // Projeto completo de reforma (Arquitetura, luzes, vitrine).
  const [taxaBanco, setTaxaBanco] = useState(1.8); // Empréstimo Capital de Giro comum (Caro).
  const [meses, setMeses] = useState(48); // 4 anos.

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // SAC
  const amortizacaoSAC = valorRef / meses;
  const primeiraParcelaSAC = amortizacaoSAC + (valorRef * (taxaBanco / 100));
  const ultimaParcelaSAC = amortizacaoSAC + (amortizacaoSAC * (taxaBanco / 100));
  const totalSAC = ((primeiraParcelaSAC + ultimaParcelaSAC) / 2) * meses;

  // PRICE
  const i = taxaBanco / 100;
  const parcelaPrice = valorRef * (i * Math.pow(1 + i, meses)) / (Math.pow(1 + i, meses) - 1);
  const totalPrice = parcelaPrice * meses;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => step > 0 ? setStep(step - 1) : navigate('/moda')} style={{ padding: '0.5rem 1rem' }}>
             <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
             <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <Store size={24} color="#f43f5e" /> Expansão e Reforma Comercial
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Store size={64} color="#f43f5e" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sua vitrine é seu maior vendedor.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Roupas de R$ 300 não vendem em araras escuras. O Varejo Premium exige **Iluminação Direcionada, Manequins de Fibras Lisas e Espelhos de Quinto Plano**.<br/><br/>
             Diferente da padaria que compra fornos no BNDES subsidiado (1.5%), a Reforma Estética da loja pega no seu fluxo livre de caixa a juros mais punitivos. Qual sua estratégia? Aguentar os juros da Tabela SAC caindo ao longo dos anos, ou a perigosa anestesia da Tabela PRICE?
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#e11d48', borderColor: '#be123c' }}>
            Aprovar Projeto Arquitetônico
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f43f5e' }}>🏦 Blueprint do Crédito Privado</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Orçamento da Obra de Modernização (R$)</label>
                 <input type="number" className="input-field" value={valorRef} onChange={e => setValorRef(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fecdd3' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--danger)' }}>Juros do Banco Privado (% a.m.)</span>
                   <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{taxaBanco.toFixed(1)}%</span>
                 </label>
                 <input type="range" min="1.0" max="6.0" step="0.1" value={taxaBanco} onChange={(e) => setTaxaBanco(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--danger)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981' }}>Tempo Preso ao Banco (Meses)</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>{meses} Meses</span>
                 </label>
                 <input type="range" min="12" max="120" step="12" value={meses} onChange={(e) => setMeses(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* SAC */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#10b981', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowDown size={20} /> O Banho Frio (Sistema SAC)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Mês 01 (DóiMuito):</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{formatCurrency(primeiraParcelaSAC)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Mês Final (Leveza):</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{formatCurrency(ultimaParcelaSAC)}</span>
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                   <div>
                       <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>A Obra Inteira Saiu Por:</span>
                   </div>
                   <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{formatCurrency(totalSAC)}</div>
                </div>
             </div>

             {/* PRICE */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MonitorUp size={20} /> Anestesia Francesa (Tabela Price)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cota Fixa Vitalícia:</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{formatCurrency(parcelaPrice)}</span>
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                   <div>
                       <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>A Obra Inteira Saiu Por:</span>
                   </div>
                   <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{formatCurrency(totalPrice)}</div>
                </div>
                
                {totalPrice > totalSAC && (
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#ef4444', fontWeight: 'bold', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                       A covardia de parcelas amenas te custará {formatCurrency(totalPrice - totalSAC)} a mais de Juros Ocultos.
                    </div>
                )}
             </div>

          </div>

        </div>
      )}

      <ChatIA />
    </div>
  );
}
