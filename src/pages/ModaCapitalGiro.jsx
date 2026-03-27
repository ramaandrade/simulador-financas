import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, RefreshCcw, HandCoins, CreditCard, LayoutTemplate, AlertTriangle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaCapitalGiro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Varejo de Moda é a PIOR indústria para Capital de Giro.
  // Você não ganha dinheiro de graça como na Padaria. Você queima dinheiro antes de vender.
  const [pmp, setPmp] = useState(30); // O fornecedor de SP dá no máximo 30 dias pra lojista.
  const [pme, setPme] = useState(120); // A blusa fica em média 3 a 4 meses na arara (120 dias PME).
  const [pmr, setPmr] = useState(30);  // O cliente parcela no cartão em 3x (O dono demora a receber 30 dias médio).

  // Ciclo financeiro longo e destruidor
  const cicloOperacional = pme + pmr;
  const cicloFinanceiro = cicloOperacional - pmp;

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
          <RefreshCcw size={24} color="#ef4444" /> O Abismo de Caixa
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <RefreshCcw size={64} color="#ef4444" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sua loja não é um banco. Mas age como um.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Por que a Margem de Roupa precisa ser esmagadora (+200%) enquanto a marmita sobrevive com 30%? Porque o negócio de roupas fica <strong>meses no vermelho</strong> esperando a coleção inteira girar.<br/><br/>
             Você paga a confecção em 30 dias. Mas a jaqueta espera o frio no cabide por 90 dias, e a Madame compra parcelado em 3x sem juros (demorando mais dias pra cair). O buraco do ciclo financeiro quebra os logistas amadores.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#dc2626', borderColor: '#b91c1c' }}>
            Simular Hemorragia de Estoque
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#ef4444' }}>⏳ Válvulas do Fluxo Corrosivo</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                   <span style={{ fontWeight: 'bold' }}><HandCoins size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Prazo do Confeccecionista (Boleto PMP)</span>
                   <span style={{ fontWeight: 'bold' }}>{pmp} Dias folga</span>
                 </label>
                 <input type="range" min="15" max="90" value={pmp} onChange={(e) => setPmp(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span style={{ fontWeight: 'bold' }}><LayoutTemplate size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Tempo de Arara/Cabide (Encalhe PME)</span>
                   <span style={{ fontWeight: 'bold' }}>{pme} Dias de espera</span>
                 </label>
                 <input type="range" min="15" max="180" value={pme} onChange={(e) => setPme(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#3b82f6' }}>
                   <span style={{ fontWeight: 'bold' }}><CreditCard size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Recebimento do Cartão Visa/Master (PMR)</span>
                   <span style={{ fontWeight: 'bold' }}>{pmr} Dias Segurados</span>
                 </label>
                 <input type="range" min="2" max="60" value={pmr} onChange={(e) => setPmr(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
               </div>

             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: cicloFinanceiro > 0 ? '#ef4444' : '#10b981', borderWidth: '2px', background: cicloFinanceiro > 0 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Abismo Financeiro (Déficit do Lojista)</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: cicloFinanceiro > 0 ? '#ef4444' : '#10b981', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                   {cicloFinanceiro} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Dias sem Dinheiro</span>
                </div>
                
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1rem', marginTop: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--text-main)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <div><strong>1. Ciclo Operacional:</strong> {pme} dias (Arara) + {pmr} dias (Cartão) = <strong>{cicloOperacional} Dias</strong> <span style={{color: 'var(--text-muted)'}}>(Tempo até a grana entrar na conta do banco)</span></div>
                   <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}><strong>2. Ciclo Financeiro Final:</strong> {cicloOperacional} dias (Operacional) - {pmp} dias (Boleto Fábrica) = <span style={{color: cicloFinanceiro > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '1rem'}}>{cicloFinanceiro} Dias de Rombo</span></div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   {cicloFinanceiro > 0 ? (
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Você pagou a fábrica e a roupa nem foi vendida. Durante {cicloFinanceiro} dias inteiros, você tem que tirar dinheiro do próprio cofre para sobreviver.</span>
                   ) : (
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>Quebras de recorde! Você vende tão rápido que o cliente te paga antes do boleto da fábrica vencer. Um Milagre.</span>
                   )}
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '2rem' }}>
               <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Mapa da Seca de Capital</h4>
               
               {/* Gráfico Temporal Lento da Moda */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#10b981' }}>Alívio Fornecedor</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pmp / 210) * 100)}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#f59e0b' }}>Tempo na Arara Crua</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pme / 210) * 100)}%`, height: '100%', background: '#f59e0b', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '150px', fontSize: '0.875rem', color: '#3b82f6' }}>Trava do Cartão (Receber)</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
                       <div style={{ width: `${Math.min(100, (pmr / 210) * 100)}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s ease' }} />
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
