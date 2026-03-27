import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Briefcase, PiggyBank, Rocket, Scale, Calendar, Percent, ArrowRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaInvestimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução Teórica, 1: Laboratório de Custo de Oportunidade
  const [step, setStep] = useState(0);

  // Estados Base
  const [capitalInicial, setCapitalInicial] = useState(15000);   // Lucro Retido Livre
  
  // Sliders Dinâmicos
  const [meses, setMeses] = useState(24);              // Prazo de Simulação (N)
  const [taxaBanco, setTaxaBanco] = useState(0.9);     // Taxa Renda Fixa ao Mês (i)
  const [taxaNegocio, setTaxaNegocio] = useState(4.5); // ROI de Reinvestimento ao Mês (j)

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatCurrencyCompact = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // Motor Duplo Estático de Juros Compostos
  const invData = useMemo(() => {
    let principal = typeof capitalInicial === 'number' ? capitalInicial : (Number(capitalInicial) || 0);

    const iBanco = taxaBanco / 100;
    const iNegocio = taxaNegocio / 100;
    
    // M = C * (1 + i)^n
    const mBanco = principal * Math.pow(1 + iBanco, meses);
    const mNegocio = principal * Math.pow(1 + iNegocio, meses);
    
    const lucroBanco = mBanco - principal;
    const lucroNegocio = mNegocio - principal;
    
    // Custo de Oportunidade: A diferença de ter escolhido a opção mais segura
    const custoOportunidade = mNegocio - mBanco;

    return {
      principal,
      mBanco,
      mNegocio,
      lucroBanco,
      lucroNegocio,
      custoOportunidade
    };
  }, [capitalInicial, meses, taxaBanco, taxaNegocio]);

  // Max value to scale the CSS race track (typically mNegocio will blow mBanco out of the water)
  const maxValue = Math.max(invData.mBanco, invData.mNegocio, invData.principal || 1);
  const widthBanco = (invData.mBanco / maxValue) * 100;
  const widthNegocio = (invData.mNegocio / maxValue) * 100;

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
          <Briefcase size={24} color="#0ea5e9" /> Gestão de Investimentos
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRODUÇÃO */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Briefcase size={64} color="#0ea5e9" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Trabalho Duro vs Especulação</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Você atingiu o sonho! A Marmitaria lucrou livremente **R$ 15.000,00**. Agora, sua família aconselha você a *"Colocar na Poupança ou no Nubank pra render, é mais seguro"*.
             <br /><br />
             O conceito mais ignorado por quem nunca teve empresa é o famoso **Custo de Oportunidade**. Se a sua empresa consegue fazer 1 kg de arroz (R$ 5) virar 5 marmitas (R$ 75), qual o sentido de dar o seu dinheiro pra um banco render míseros 1% ao mês quando você gera 5%, 8% ao mês de retorno re-injetando no seu maquinário?
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#0284c7', borderColor: '#0369a1' }}>
            Abrir Relógio de Oportunidades <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {/* STEP 1: CALCULADORA DE ECONOMIA REAL */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* PAINEL DE COMANDO (INPUTS) */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', borderTop: '4px solid #0ea5e9' }}>
             
             {/* DINHEIRO CRU */}
             <div>
               <label style={{ display: 'block', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>Lucro Inicial Acumulado (R$ Livre)</label>
               <input 
                 type="number" 
                 className="input-field" 
                 value={capitalInicial}
                 onChange={e => setCapitalInicial(Number(e.target.value) || 0)}
                 style={{ fontSize: '2rem', color: '#0ea5e9', fontWeight: 800, padding: '1rem', borderRadius: '0.5rem' }}
               />
               <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Dinheiro que sobrou após pagar todos os custos e impostos da Marmitaria.</p>
             </div>

             {/* PARÂMETROS UNIVERSAIS */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* PRAZO DA SIMULAÇÃO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                      <Calendar size={18} /> O Tempo da Projeção
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>{meses} Meses</span>
                  </div>
                  <input type="range" min="1" max="60" value={meses} onChange={e => setMeses(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>

                {/* TAXA DA RENDA FIXA (BANCO) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontWeight: 600 }}>
                      <PiggyBank size={18} /> Taxa Limpa do Banco (CDI/CDB)
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>{taxaBanco.toFixed(1)}% / mês</span>
                  </div>
                  <input type="range" min="0.1" max="2.0" step="0.1" value={taxaBanco} onChange={e => setTaxaBanco(Number(e.target.value))} style={{ width: '100%', accentColor: '#0ea5e9' }} />
                </div>

                {/* TAXA DA MARMITARIA (EMPRESA) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 600 }}>
                      <Rocket size={18} /> Ponto de Crescimento Interno (ROI)
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f59e0b' }}>{taxaNegocio.toFixed(1)}% / mês</span>
                  </div>
                  <input type="range" min="1.0" max="20.0" step="0.1" value={taxaNegocio} onChange={e => setTaxaNegocio(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
                </div>
             </div>

          </div>

          {/* ÁREA DA PISTA DE CORRIDA (CSS RACE BARS) E RESULTADOS */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             <div>
               <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.5rem' }}>A Corrida do Dinheiro ao Fim de {meses} Meses</h3>
               <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Evolução partindo de um Lucro Inicial de <strong>{formatCurrency(invData.principal)}</strong></p>
             </div>
             
             {/* PISTA 1: A Renda Fixa (Banco) */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ color: '#0ea5e9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <PiggyBank size={18} /> Aplicação no Tesouro Básico
                   </span>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatCurrencyCompact(invData.principal)} Iniciais + {formatCurrencyCompact(invData.lucroBanco)} de Lucro</div>
                     <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e0f2fe' }}>Total {formatCurrency(invData.mBanco)}</span>
                   </div>
                </div>
                
                {/* BARRA BANCO */}
                <div style={{ width: '100%', height: '40px', background: 'rgba(2, 6, 23, 0.5)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${widthBanco}%`, background: '#0ea5e9', display: 'flex', alignItems: 'center', padding: '0 1rem', transition: 'width 0.4s ease-out' }}>
                      <span style={{ color: '#082f49', fontWeight: 900 }}>+{formatCurrencyCompact(invData.lucroBanco)} de Juros Ganhos</span>
                   </div>
                </div>
             </div>

             {/* PISTA 2: O Suor (Sua Empresa) */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <Rocket size={18} /> Reinvestindo na Estrutura da Marmitaria
                   </span>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatCurrencyCompact(invData.principal)} Iniciais + {formatCurrencyCompact(invData.lucroNegocio)} de Lucro Retornado</div>
                     <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef3c7' }}>Total {formatCurrency(invData.mNegocio)}</span>
                   </div>
                </div>
                
                {/* BARRA EMPRESA */}
                <div style={{ width: '100%', height: '40px', background: 'rgba(2, 6, 23, 0.5)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${widthNegocio}%`, background: '#f59e0b', display: 'flex', alignItems: 'center', padding: '0 1rem', transition: 'width 0.4s ease-out' }}>
                      <span style={{ color: '#451a03', fontWeight: 900 }}>+{formatCurrencyCompact(invData.lucroNegocio)} de Juros Ganhos</span>
                   </div>
                </div>
             </div>

             {/* CUSTO DE OPORTUNIDADE (O SANGRAMENTO SILENCIOSO) */}
             {invData.custoOportunidade > 0 && (
               <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                  <div style={{ flex: 1.5 }}>
                     <h4 style={{ fontSize: '1.25rem', color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Scale size={20} /> Entendendo a Matemática da Oportunidade
                     </h4>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                       Este é o dinheiro exato que você <strong>DEIXOU NA MESA</strong>. <br/><br/>
                       Se você vender a ideia de construir a empresa (R$ {formatCurrencyCompact(invData.mNegocio)}) e escolher a segurança do banco (R$ {formatCurrencyCompact(invData.mBanco)}), você perde a diferença entre os dois.
                     </p>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px dashed rgba(245, 158, 11, 0.2)', paddingLeft: '2rem' }}>
                     <span style={{ display: 'block', Math: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        Diferença Pura Extrapolada:
                     </span>
                     <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', textShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                        {formatCurrency(Math.abs(invData.custoOportunidade))}
                     </span>
                  </div>
               </div>
             )}
             
             {invData.custoOportunidade <= 0 && (
               <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '1rem', border: '1px solid rgba(14, 165, 233, 0.3)', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.25rem', color: '#0ea5e9', marginBottom: '0.5rem' }}>Você bateu Mercado Tático!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Neste atual cenário onde o Banco rende mais do que o esforço da empresa (ROI negativo p/ Empresa), sacar o lucro e deixar render é financeiramente a salvação do cofre familiar.</p>
               </div>
             )}

          </div>
        </div>
      )}

      {/* CHAT IA PARA ASSESSORIA FINANCEIRA DO ALUNO! */}
      <ChatIA />
    </div>
  );
}
