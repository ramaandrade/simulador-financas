import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Landmark, Calculator, TrendingDown, Layers, CheckCircle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaFinanciamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Padaria precisa comprar maquinário brutal (Fornos e Amassadeiras Rápidas)
  const [valorFinanciado, setValorFinanciado] = useState(45000); // Forno Lastro
  const [taxaJuros, setTaxaJuros] = useState(1.5);             // 1.5% ao mes BNDES/Pronampe
  const [meses, setMeses] = useState(36);                      // 3 anos

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos SAC (Sistema de Amortização Constante)
  const amortizacaoSAC = valorFinanciado / meses;
  const primeiraParcelaSAC = amortizacaoSAC + (valorFinanciado * (taxaJuros / 100)); // Juro no mes 1 é cheio
  const ultimaParcelaSAC = amortizacaoSAC + (amortizacaoSAC * (taxaJuros / 100));     // Juro no mes final é basico
  
  // Total pago no SAC: (Primeira + Ultima)/2 * n
  const totalPagoSAC = ((primeiraParcelaSAC + ultimaParcelaSAC) / 2) * meses;

  // Cálculos PRICE (Parcelas Fixas - Francesa)
  const i = taxaJuros / 100;
  const parcelaPrice = valorFinanciado * (i * Math.pow(1 + i, meses)) / (Math.pow(1 + i, meses) - 1);
  const totalPagoPrice = parcelaPrice * meses;

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
          <Landmark size={24} color="#f43f5e" /> Expansão BNDES (SAC vs Price)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Landmark size={64} color="#f43f5e" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Fornos Ocupam Espaço e Comem Capital</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Diferente de uma simples sanduicheira, uma Padaria inteira pode custar 1 Milhão de Reais em fornos, ilhas térmicas e fatiadoras frias. Você vai precisar dominar as linhas do Banco Nacional. <br/><br/>
             Qual sistema o dono de padaria experiente escolhe? A Tabela <strong>SAC</strong> (Sufoco inicial, desconto final) ou a <strong>Price</strong> (Estabilidade perigosa)?
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#e11d48', borderColor: '#be123c' }}>
            Abrir Simulação Industrial
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* PAINEL DE CONTRATO (BNDES) */}
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f43f5e' }}>🏦 Parâmetros do Banco</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Valor do Maquinário Principal (R$)</label>
                 <input type="number" className="input-field" value={valorFinanciado} onChange={e => setValorFinanciado(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fecdd3' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--danger)' }}>Taxa Administrativa/Juros (% a.m.)</span>
                   <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{taxaJuros}%</span>
                 </label>
                 <input type="range" min="0.5" max="5" step="0.1" value={taxaJuros} onChange={(e) => setTaxaJuros(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--danger)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981' }}>Tempo de Diluição (Prazo em Meses)</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>{meses} Meses</span>
                 </label>
                 <input type="range" min="6" max="120" step="6" value={meses} onChange={(e) => setMeses(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* SAC */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#10b981', marginBottom: '1rem', textTransform: 'uppercase' }}>Sistema SAC (Amortização Constante)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Mês 01 (Chumbo Grosso):</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{formatCurrency(primeiraParcelaSAC)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Mês Final (Alívio):</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{formatCurrency(ultimaParcelaSAC)}</span>
                   </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                   <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>O Custo Final para a Padaria:</span>
                   <span style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{formatCurrency(totalPagoSAC)}</span>
                </div>
                
                <CheckCircle size={100} color="#10b981" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }} />
             </div>

             {/* PRICE */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ef4444', position: 'relative', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '1rem', textTransform: 'uppercase' }}>Tabela Price (Francesa - Fixa)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Toda e qualquer Parcela:</span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{formatCurrency(parcelaPrice)}</span>
                   </div>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>*O banco mascara a amortização lenta com juros altos escondidos nos primeiros anos.</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                   <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>O Custo Final (A armadilha Média):</span>
                   <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{formatCurrency(totalPagoPrice)}</span>
                </div>
                {totalPagoPrice > totalPagoSAC && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444', fontWeight: 'bold' }}>
                       O Banco lucra {formatCurrency(totalPagoPrice - totalPagoSAC)} a mais de você pela comodidade da parcela fixa.
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
