import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Target, Users, PieChart, Shirt, CheckCircle, Crosshair } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaIndicadores() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // KPis de Loja Física e E-commerce mesclados
  const [entradaPessoas, setEntradaPessoas] = useState(1500); // Pessoas que bateram catraca/sensor ou cliques via Linktree (Visitantes Mensal).
  const [vendasFechadas, setVendasFechadas] = useState(120);  // Visitas ao "Caixa/Carrinho concluido"
  
  const [faturamentoBruto, setFaturamentoBruto] = useState(55000); // O quanto passou na Maquininha
  
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Kpis
  const kpis = useMemo(() => {
     // A terrível métrica do Varejo Mudo: Taxa de Conversão do Provador / Site E-commerce
     const taxaConversao = entradaPessoas > 0 ? (vendasFechadas / entradaPessoas) * 100 : 0;
     
     // O Poder de Fogo (Gasto do Cliente Fechador) -> UPT e Ticket Médio sacola
     const ticketMedioCerto = vendasFechadas > 0 ? (faturamentoBruto / vendasFechadas) : 0;

     return {
        taxaConversao,
        ticketMedioCerto
     };
  }, [entradaPessoas, vendasFechadas, faturamentoBruto]);

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
          <Target size={24} color="#eab308" /> KPIs Analíticos do Varejo
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Target size={64} color="#eab308" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sua Loja é um Funil Furado.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Por trás dos manequins iluminados, a matemática do Shopping Center é brutal. Eles alugam espaços caríssimos porque te trazem "Fluxo de Pessoas". Mas de nada adianta entrarem 1000 formiguinhas na loja, se a vendedora mal treinada e o vestiário abafado afugentam 990 antes de encostarem na maquininha.
             <br /><br />
             Seu sucesso não é "O quanto vendeu". É o Diagnóstico de "Quantas pessoas vazaram" com a mão vazia.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#ca8a04', borderColor: '#a16207' }}>
            Auditar Funil Visita → Sacola
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '4px solid #eab308' }}>
             <h3 style={{ width: '100%', fontSize: '1.25rem', color: '#eab308', marginBottom: '0.5rem' }}>Fechamento Z Logístico (Monitor de Catraca/Mês)</h3>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>(Máfia do Visor) Visitas Totais Fechadas (Transeuntes/Loja/Site)</label>
               <input type="number" className="input-field" value={entradaPessoas} onChange={e => setEntradaPessoas(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>"Soh to dando uminha olhadinha moça!"</div>
             </div>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>Tiros Certeiros (Passaram Cartão)</label>
               <input type="number" className="input-field" value={vendasFechadas} onChange={e => setVendasFechadas(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }} />
             </div>
             
             <div style={{ flex: '1 1 200px', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: '#eab308', marginBottom: '0.5rem', fontWeight: 600 }}>Faturamento Desse Fluxo (Bruto Retido R$)</label>
               <input type="number" className="input-field" value={faturamentoBruto} onChange={e => setFaturamentoBruto(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308' }} />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             
             {/* K1: TAXA CONVERSAO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: kpis.taxaConversao > 5 ? '4px solid #10b981' : '4px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Users size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Retenção de Catraca % (T.Conversão)</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: kpis.taxaConversao > 5 ? '#10b981' : '#ef4444', marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.taxaConversao.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>% Compraram.</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: {vendasFechadas} (Compraram) ÷ {entradaPessoas} (Entraram no LojaLink) × 100 = {kpis.taxaConversao.toFixed(1)}%</div>
                
                {kpis.taxaConversao <= 5 ? (
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Alarme Soando! Os clientes fogem de você em escala apocalíptica! A vitrine atrai, mas quando o cliente toca a roupa ou vê a cara do recepcionista, 95% ou mais vão embora correndo!
                    </div>
                ) : (
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Eletrizante! Sua conversão segura nas médias do Varejo Saudável de Moda Física (&gt;5%).
                    </div>
                )}
             </div>

             {/* K2: TICKET MÉDIO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Shirt size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Milagre do Ticket de Sacola</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6', marginBottom: '0.25rem', zIndex: 2 }}>
                   {formatCurrency(kpis.ticketMedioCerto)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ Boleto Médio Emitido</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: {formatCurrency(faturamentoBruto)} (No Bolso) ÷ {vendasFechadas} Fechadores Únicos Constantes.</div>
                
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                    A Tática Mestra (UPT - Unidades por Ticket) significa que, o vendedor perfeito pega o consumidor que ia comprar UMA camiseta de R$ 50... e empurra O CONJUNTO por + R$ 150. Ticket eleva.
                </div>
             </div>

          </div>

        </div>
      )}

      {/* CHAT IA PARA AVALIAÇÃO DO DIRETOR */}
      <ChatIA />
    </div>
  );
}
