import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, PieChart, Activity, ShoppingCart, Percent, Target, AlertCircle, CheckCircle, Crosshair } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaIndicadores() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Vendas de Padaria são compostas do Pão (Que atrai cliente) e da Mortadela/Refri (Que dá Lucro)
  const [vendasPao, setVendasPao] = useState(40000); // Faturamento Bruto de Pão Francês Mensal
  const [vendasEstrela, setVendasEstrela] = useState(35000); // Frios, Doces Finos, Torradas, Refrigerante

  const [custoPao, setCustoPao] = useState(25000); // Farinha e energia são caros
  const [custoEstrela, setCustoEstrela] = useState(15000); // Frios comprados fatiados já

  const [custosFixos, setCustosFixos] = useState(20000); // Aluguel da Esquina + CAIXA
  const [clientesMensais, setClientesMensais] = useState(6500); // Fluxo de Catraca

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Motor Matemático do MIX DE VENDAS
  const kpis = useMemo(() => {
     const fatTotal = vendasPao + vendasEstrela;
     
     const margemContPao = vendasPao - custoPao;
     const margemContEstrela = vendasEstrela - custoEstrela;
     
     const margemContTotalReais = margemContPao + margemContEstrela;
     const margemContTotalPerc = fatTotal > 0 ? (margemContTotalReais / fatTotal) * 100 : 0;

     const lucroLiquido = margemContTotalReais - custosFixos;
     const margemLiquidaReal = fatTotal > 0 ? (lucroLiquido / fatTotal) * 100 : 0;
     
     const ticketMedio = clientesMensais > 0 ? (fatTotal / clientesMensais) : 0;
     
     const pontoEquilibrio = margemContTotalPerc > 0 ? (custosFixos / (margemContTotalPerc / 100)) : Infinity;

     return {
        fatTotal,
        margemContPao,
        margemContEstrela,
        margemContTotalReais,
        margemContTotalPerc,
        lucroLiquido,
        margemLiquidaReal,
        ticketMedio,
        pontoEquilibrio
     };
  }, [vendasPao, vendasEstrela, custoPao, custoEstrela, custosFixos, clientesMensais]);

  const pMisto = kpis.margemContPao < kpis.margemContEstrela;

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
          <PieChart size={24} color="#eab308" /> Mix de Vendas e Ticket de Balcão
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <PieChart size={64} color="#eab308" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>A Ilusão do "Produto que mais vende"</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             O <strong>Pão Francês</strong> é o que lota a padaria... Mas é ele quem te enriquece?
             <br /><br />
             Muitos empresários quebram porque olham apenas para a prateleira que esvazia mais rápido. No Dashboard Operacional Final, você aprenderá o conceito sagrado de "Produto Isca" contra "Produto Estrela" (Grelhados Frios).
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#ca8a04', borderColor: '#a16207' }}>
            Auditar a Máquina Registradora
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '4px solid #eab308' }}>
             <h3 style={{ width: '100%', fontSize: '1.25rem', color: '#eab308', marginBottom: '0.5rem' }}>Fechamento Z (Mensal) - Caixa 1</h3>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>Faturamento do Pão (Isca)</label>
               <input type="number" className="input-field" value={vendasPao} onChange={e => setVendasPao(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Custo Deste Pão Mensal:</div>
               <input type="number" className="input-field" value={custoPao} onChange={e => setCustoPao(Number(e.target.value) || 0)} style={{ fontSize: '1rem', marginTop: '0.25rem', color: '#ef4444' }} />
             </div>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>Fat. Frios/Doces/Cigarro (Estrela)</label>
               <input type="number" className="input-field" value={vendasEstrela} onChange={e => setVendasEstrela(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Custo Dessa Categoria Mensal:</div>
               <input type="number" className="input-field" value={custoEstrela} onChange={e => setCustoEstrela(Number(e.target.value) || 0)} style={{ fontSize: '1rem', marginTop: '0.25rem', color: '#ef4444' }} />
             </div>
             
             <div style={{ flex: '1 1 200px', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Custos Fixos Monstro (Aluguel, Luz)</label>
               <input type="number" className="input-field" value={custosFixos} onChange={e => setCustosFixos(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }} />
             </div>

             <div style={{ flex: '1 1 120px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Clientes na Grade (Roleta)</label>
               <input type="number" className="input-field" value={clientesMensais} onChange={e => setClientesMensais(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             
             {/* K1: ANALISE DO LADO NEGRO DO PAO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Activity size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>O que realmente "Banca" a loja?</h4>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', zIndex: 2 }}>
                   <div>
                      <span style={{ display: 'block' }}>Margem Entregue pelo Pão:</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{formatCurrency(kpis.margemContPao)}</strong>
                   </div>
                   <div>
                      <span style={{ display: 'block' }}>Margem Entregue pelos Adicionais (Frios/Doces):</span>
                      <strong style={{ fontSize: '1.5rem', color: '#10b981' }}>{formatCurrency(kpis.margemContEstrela)}</strong>
                   </div>
                </div>
                
                {pMisto ? (
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        <CheckCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> O Mix Perfeito: O pão atrai, o salame dá o lucro e paga a conta da padaria.
                    </div>
                ) : (
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> PERIGO: Os clientes estão levando só pão francês! Sua vitrine de Estrelas está abandonada e a padaria não se paga com pão francês!
                    </div>
                )}
             </div>

             {/* K2: TICKET MÉDIO (O REI DO VAREJO) */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <ShoppingCart size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Ticket Médio Dinâmico</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6', marginBottom: '0.25rem', zIndex: 2 }}>
                   {formatCurrency(kpis.ticketMedio)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ Pessoa</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Faturamento Bruto ({formatCurrency(kpis.fatTotal)}) ÷ {clientesMensais} Pessoas</div>
             </div>

             {/* K3: PONTO DE EQUILÍBRIO DA PADARIA MISTURADO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Crosshair size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Ponto de Equilíbrio Geral</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.pontoEquilibrio === Infinity ? 'Prejuízo Absoluto' : formatCurrency(kpis.pontoEquilibrio)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>
                    Margem Contábil Mixta da Loja: {kpis.margemContTotalPerc.toFixed(1)}% <br/>
                    (Ou seja, precisa faturar isso para empatar 0 a 0)
                </div>
             </div>

          </div>

          <div className="glass-panel" style={{ marginTop: '1rem', padding: '1.5rem', background: kpis.lucroLiquido > 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: '1rem', borderTop: kpis.lucroLiquido > 0 ? '2px solid #10b981' : '2px solid #ef4444' }}>
             <Target color={kpis.lucroLiquido > 0 ? "#10b981" : "#ef4444"} size={48} />
             <div>
               <strong style={{ display: 'block', color: kpis.lucroLiquido > 0 ? "#10b981" : "#ef4444", marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                   Fechamento Operacional Definitivo: Lucro Pós-Mix de {formatCurrency(kpis.lucroLiquido)}
               </strong>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                 Baseado na quantidade de pessoas que entraram, você pagou seu sacrifício? Sua rentabilidade liquida final na conta bancaria do dono foi de <strong>{kpis.margemLiquidaReal.toFixed(2)}%</strong> sobre todo o Faturamento da loja ({formatCurrency(kpis.fatTotal)}). 
               </p>
             </div>
          </div>

        </div>
      )}

      {/* CHAT IA PARA AVALIAÇÃO DO DIRETOR */}
      <ChatIA />
    </div>
  );
}
