import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, RefreshCcw, ShoppingCart, Wallet, Banknote, CalendarDays, ArrowRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaCapitalGiro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução, 1: Laboratório
  const [step, setStep] = useState(0);

  // Estados Base
  const [faturamentoDiario, setFaturamentoDiario] = useState(500);
  const [pme, setPme] = useState(3); // Prazo Médio de Estoque (dias)
  const [pmr, setPmr] = useState(30); // Prazo Médio de Recebimento (dias - iFood/Cartão)
  const [pmp, setPmp] = useState(7); // Prazo Médio de Pagamento (dias - Feira/Fornecedor)

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Matemática Corporativa
  const cicloOperacional = pme + pmr;
  const cicloFinanceiro = cicloOperacional - pmp;
  const ncg = cicloFinanceiro * faturamentoDiario;

  const isDificil = ncg > 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => step > 0 ? setStep(step - 1) : navigate('/marmitaria')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <RefreshCcw size={24} color="var(--success)" /> Consultoria de Capital de Giro
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRODUÇÃO TEÓRICA */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <RefreshCcw size={64} color="var(--success)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Por que o caixa sempre fica vazio no dia 15?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             O maior cemitério de marmitarias que vendem muito no iFood se deve ao fenômeno invisível do <strong>Descasamento de Caixa</strong>.<br /><br />
             Se você compra verduras no cartão de débito hoje (Pagamento Imediato), mas o aplicativo de delivery só te repassa o dinheiro da venda daquela comida daqui a 30 dias (Recebimento Atrasado), <strong>quem vai pagar as contas da sua vida nesses 30 dias se o dinheiro está preso?</strong>
             <br /><br />
             Nesse laboratório, vamos calcular a <strong>NCG (Necessidade de Capital de Giro)</strong>.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
            Entrar no Laboratório de Giros <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {/* STEP 1: CALCULADORA COM SLIDERS */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'var(--bg-darker)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
             <div>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Receita do Negócio</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Em média, quanto a marmitaria fatura por dia?</p>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>R$</span>
               <input 
                  type="number"
                  className="input-field"
                  value={faturamentoDiario}
                  onChange={(e) => setFaturamentoDiario(Number(e.target.value) || 0)}
                  style={{ fontSize: '1.5rem', width: '150px', fontWeight: 600 }}
               />
               <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ dia</span>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
             
             {/* LEFT SIDE: SLIDERS */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Prazos (Descasamento)</h2>
                
                {/* ESTOQUE */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontWeight: 600 }}>
                      <ShoppingCart size={20} /> Prazo de Estoque (PME)
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pme} Dias</span>
                  </div>
                  <input type="range" min="0" max="30" value={pme} onChange={e => setPme(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tempo médio que a carne e os grãos ficam congelados/guardados antes de virarem marmita e serem entregues.</p>
                </div>

                {/* RECEBIMENTO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
                      <Wallet size={20} /> Prazo de Recebimento (PMR)
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pmr} Dias</span>
                  </div>
                  <input type="range" min="0" max="60" value={pmr} onChange={e => setPmr(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--success)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tempo que o aplicativo (ou maquininha) escraviza seu dinheiro antes de faturar na sua conta bancária.</p>
                </div>

                {/* PAGAMENTO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontWeight: 600 }}>
                      <Banknote size={20} /> Prazo de Pagamento (PMP)
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pmp} Dias</span>
                  </div>
                  <input type="range" min="0" max="60" value={pmp} onChange={e => setPmp(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--warning)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Seu poder de negociação: Comprou a carne hoje para pagar pro matadouro só daqui a X dias.</p>
                </div>
             </div>

             {/* RIGHT SIDE: MATEMATICA E DIAGNOSTICO */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Seu Ciclo Financeiro</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <CalendarDays size={32} color={cicloFinanceiro > 0 ? 'var(--danger)' : 'var(--success)'} />
                    <span style={{ fontSize: '4rem', fontWeight: 900, color: cicloFinanceiro > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {cicloFinanceiro}
                    </span>
                    <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>dias</span>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                    {cicloFinanceiro > 0 
                      ? `Você tira dinheiro do próprio bolso para bancar a operação por dolorosos ${cicloFinanceiro} dias consecutivos até receber o seu dinheiro das vendas!` 
                      : `Fantástico! Você trabalha com o dinheiro dos outros. Quando chega a hora de pagar o fornecedor, o lucro do cliente já está na sua mão há ${Math.abs(cicloFinanceiro)} dias.`}
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', background: isDificil ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${isDificil ? 'var(--danger)' : 'var(--success)'}` }}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: isDificil ? 'var(--danger)' : 'var(--success)' }}>
                        {isDificil ? 'Faltará na sua Conta:' : 'Folga no seu Caixa:'}
                      </span>
                   </div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isDificil ? 'var(--danger)' : 'var(--success)' }}>
                      {formatCurrency(Math.abs(ncg))}
                   </div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                     {isDificil 
                       ? `Esta é a Necessidade de Capital de Giro. Como você banca a firma R$ ${faturamentoDiario} por dia pelo seu ciclo financeiro, esse é o valor EXATO que você precisa ter "sobrando" no cofre para a marmitaria não falir no 1º mês.` 
                       : 'Sua empresa se autofinancia. Operar assim garante o crescimento e protege seu bolso pessoal.'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* CHAT IA PARA ESCLARECER DÚVIDAS DO ALUNO! */}
      <ChatIA />
    </div>
  );
}
