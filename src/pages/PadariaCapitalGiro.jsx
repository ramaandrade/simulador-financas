import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, RefreshCcw, Truck, Store, CircleDollarSign, AlertCircle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaCapitalGiro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Padarias têm giro violento e compram a prazo de indústrias grandes 
  const [pmp, setPmp] = useState(28); // Prazo Médio de Pagamento (Farinha do Moinho)
  const [pme, setPme] = useState(10); // Prazo Médio de Estoque (Quanto tempo o saco fica na dispensa)
  const [pmr, setPmr] = useState(2);  // Prazo Médio de Recebimento (98% pix e débito = cai rápido)

  // O ciclo financeiro determina o oxigênio / folga da empresa
  const cicloOperacional = pme + pmr;
  const cicloFinanceiro = cicloOperacional - pmp;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => step > 0 ? setStep(step - 1) : navigate('/padaria')} style={{ padding: '0.5rem 1rem' }}>
             <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
             <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <RefreshCcw size={24} color="#10b981" /> Capital de Giro (Segredo do Moinho)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <RefreshCcw size={64} color="#10b981" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>O Segredo Milionário das Padarias</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Por que a Panificadora não quebra com a facilidade de outros negócios? **O Poder do OPM** (Other People's Money).
             <br /><br />
             A Marmitaria precisa investir o dinheiro hoje para lucrar mês que vem. A Padaria, não. O Moinho de trigo financia a carga em 30 dias (Boleto), você bate a massa, vende de manhã para o cliente de Pix, e o dinheiro já está na sua mão... antes sequer de ter pago o boleto do fornecedor!
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#059669', borderColor: '#047857' }}>
            Explorar Ciclo de Caixa
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#10b981' }}>⏳ Relógios de Caixa</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--danger)' }}>
                   <span style={{ fontWeight: 'bold' }}><Truck size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Prazo do Moinho (Boleto PMP)</span>
                   <span style={{ fontWeight: 'bold' }}>{pmp} Dias</span>
                 </label>
                 <input type="range" min="0" max="90" value={pmp} onChange={(e) => setPmp(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--danger)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span style={{ fontWeight: 'bold' }}><Store size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Giro da Despensa (PME)</span>
                   <span style={{ fontWeight: 'bold' }}>{pme} Dias parado</span>
                 </label>
                 <input type="range" min="1" max="45" value={pme} onChange={(e) => setPme(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#3b82f6' }}>
                   <span style={{ fontWeight: 'bold' }}><CircleDollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Velocidade das Vendas (Pix/Cartão PMR)</span>
                   <span style={{ fontWeight: 'bold' }}>{pmr} Dias</span>
                 </label>
                 <input type="range" min="0" max="30" value={pmr} onChange={(e) => setPmr(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
               </div>

             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: cicloFinanceiro > 0 ? 'rgba(239, 68, 68, 0.5)' : '#10b981', borderWidth: '2px', background: cicloFinanceiro > 0 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Necessidade de Fôlego Financeiro</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: cicloFinanceiro > 0 ? '#ef4444' : '#10b981', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                   {cicloFinanceiro} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Dias</span>
                </div>
                
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   {cicloFinanceiro > 0 ? (
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Déficit: Você paga a farinha {cicloFinanceiro} dias antes de bater a meta no balcão. Precisa pegar Caixa do banco.</span>
                   ) : (
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>Superávit de Sorte: A Farinha não está paga, mas o dinheiro do cliente já está no SEU BOLSO girando.</span>
                   )}
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '2rem' }}>
               <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Mapa do Conflito do Tempo</h4>
               
               {/* Gráfico Simplificado Temporal */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#f59e0b' }}>Armazenagem</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pme / 60) * 100)}%`, height: '100%', background: '#f59e0b', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#3b82f6' }}>Recebimento Varejo</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pmr / 60) * 100)}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#ef4444' }}>Pagamento do Moinho</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pmp / 60) * 100)}%`, height: '100%', background: '#ef4444', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>
                  
               </div>

             </div>

          </div>

        </div>
      )}

      <ChatIA />
    </div>
  );
}
