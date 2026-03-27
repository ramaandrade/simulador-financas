import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Landmark, Calculator, AlertCircle, Percent, Calendar, ArrowRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaFinanciamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução Teórica, 1: Laboratório de Amortização
  const [step, setStep] = useState(0);

  // Estados Base
  const [valorBem, setValorBem] = useState(35000);   // Valor do Fogão / Moto de Entrega
  const [entrada, setEntrada] = useState(5000);      // Valor dado à vista
  
  // Sliders Dinâmicos
  const [meses, setMeses] = useState(48);            // Prazo (N)
  const [juros, setJuros] = useState(3.5);           // Taxa ao Mês (i)

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Tabela Price: Cálculo de Parcela Uniforme e Custo Efetivo
  const priceData = useMemo(() => {
    let capitalFinanciado = typeof valorBem === 'number' ? valorBem : (Number(valorBem) || 0);
    let pgtoEntrada = typeof entrada === 'number' ? entrada : (Number(entrada) || 0);

    capitalFinanciado = Math.max(0, capitalFinanciado - pgtoEntrada);
    
    // Tratamento de segurança: Se os juros foram Zero, a parcela é apenas Capital/Meses.
    if (juros === 0 || meses === 0) {
       const pmtZero = meses === 0 ? capitalFinanciado : (capitalFinanciado / meses);
       return {
         capital: capitalFinanciado,
         parcela: pmtZero,
         totalJuros: 0,
         totalBanco: capitalFinanciado,
         multiplicador: 1
       };
    }

    const i = juros / 100;
    // Tabela Price: PMT = PV * [ i / (1 - (1+i)^-n) ]
    const pmt = capitalFinanciado * (i / (1 - Math.pow(1 + i, -meses)));
    
    const totalBanco = pmt * meses;
    const totalJuros = totalBanco - capitalFinanciado;
    
    // Quantas vezes comprou a máquina? (Ex: 1.5x)
    const multiplicador = capitalFinanciado > 0 ? (totalBanco / capitalFinanciado) : 0;

    return {
      capital: capitalFinanciado,
      parcela: pmt,
      totalJuros,
      totalBanco,
      multiplicador
    };
  }, [valorBem, entrada, meses, juros]);

  // Alturas CSS pra Escala Gráfica
  const maxBarValue = priceData.totalBanco;
  const heightCapital = maxBarValue > 0 ? (priceData.capital / maxBarValue) * 100 : 0;
  const heightJuros = maxBarValue > 0 ? (priceData.totalJuros / maxBarValue) * 100 : 0;

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
          <Landmark size={24} color="#f43f5e" /> Consultoria de Crédito (Tabela Price)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRODUÇÃO */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Landmark size={64} color="#f43f5e" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>A Faca de Dois Gumes do Empréstimo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Sua Marmitaria Gourmet faturou recordes e você precisa expandir! Você ligou para o banco pedindo R$ 35.000 para comprar Motos de Entrega e um Forno Combinado.
             <br /><br />
             O gerente do banco (muito sorridente) te disse que a Moto sai por **apenas 48 parcelinhas de R$ 1.500**. Parece fácil no bolso, não é? O que o gerente omitiu é o valor **oculto formidável** dos juros compostos cobrados nas costas dessa máquina a longo prazo.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#e11d48', borderColor: '#be123c' }}>
            Desmascarar o Contrato do Banco <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {/* STEP 1: CALCULADORA PRICE E BALANÇA */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* HEADER DA OFERTA (INPUTS) */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #f43f5e' }}>
             
             <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
               {/* Valor do Bem */}
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Valor do Equipamento / Bem (R$)</label>
                 <input 
                   type="number" 
                   className="input-field" 
                   value={valorBem}
                   onChange={e => setValorBem(Number(e.target.value) || 0)}
                   style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 600 }}
                 />
               </div>

               {/* Entrada (Dinheiro R$) */}
               <div style={{ flex: 1 }}>
                 <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Valor de Entrada (R$ do Caixa)</label>
                 <input 
                   type="number" 
                   className="input-field" 
                   value={entrada}
                   onChange={e => setEntrada(Number(e.target.value) || 0)}
                   style={{ fontSize: '1.5rem', color: 'var(--success)', fontWeight: 600 }}
                 />
               </div>
             </div>

             <div style={{ textAlign: 'right', minWidth: '200px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>O Banco Financia:</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
                   {formatCurrency(priceData.capital)}
                </div>
             </div>

          </div>

          {/* ÁREA CENTRAL: SLIDERS & GRÁFICOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1fr)', gap: '2rem' }}>
             
             {/* LEFT: CAIXA DE FERRAMENTAS DO BANCO (SLIDERS) */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>O Contrato Bancário</h3>
                
                {/* PRAZO (MESES) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                      <Calendar size={20} /> Prazo a Pagar (Meses)
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{meses} Meses</span>
                  </div>
                  <input type="range" min="1" max="120" value={meses} onChange={e => setMeses(Number(e.target.value))} style={{ width: '100%' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>O número de vezes que você dividiu a tortura. No Brasil variam de 12 a 120x.</p>
                </div>

                {/* TAXA DE JUROS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontWeight: 600 }}>
                      <Percent size={20} /> Taxa de Juros (%) ao Mês
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{juros.toFixed(1)}%</span>
                  </div>
                  <input type="range" min="0" max="15" step="0.1" value={juros} onChange={e => setJuros(Number(e.target.value))} style={{ width: '100%', accentColor: '#f43f5e' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Taxa Subsidiada por Governo (~1%). Taxa Bancária Empresarial Comercial (~3% a 6%).</p>
                </div>

                {/* BOLETO RESULTANTE */}
                <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed #f43f5e' }}>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>O Boleto Mensal (PMT) cobrado pela Marmitaria:</p>
                   <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f43f5e' }}>
                     {formatCurrency(priceData.parcela)}
                   </div>
                   {priceData.parcela > faturamentoDiarioSimulado && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffedd5', background: '#ea580c', padding: '0.5rem 1rem', borderRadius: '0.5rem', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <AlertCircle size={16} /> A parcela ultrapassa o seu lucro operacional projetado!
                      </div>
                   )}
                </div>
             </div>

             {/* RIGHT: TERMÔMETRO DA EXPLORAÇÃO (CSS GRAPHS) E DIAGNÓSTICO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '2rem' }}>Radiografia da Dívida a Longo Prazo</h3>
                
                {/* GRAFICO LATERAL */}
                <div style={{ display: 'flex', height: '200px', width: '100%', marginBottom: '2rem', gap: '4px', borderRadius: '8px', overflow: 'hidden' }}>
                   {/* BARRA DO EQUIPAMENTO (CAPITAL) */}
                   <div style={{ height: '100%', width: `${heightCapital}%`, background: 'var(--primary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'width 0.3s' }}>
                      <span style={{ position: 'absolute', fontWeight: 900, color: '#0f172a', zIndex: 10, fontSize: '0.875rem' }}>{formatCurrency(priceData.capital)}</span>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
                   </div>
                   
                   {/* BARRA DOS JUROS (O BANCO) */}
                   <div style={{ height: '100%', width: `${heightJuros}%`, background: '#be123c', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'width 0.3s' }}>
                      <span style={{ position: 'absolute', fontWeight: 900, color: '#fff', zIndex: 10, fontSize: '0.875rem' }}>{formatCurrency(priceData.totalJuros)}</span>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }}></div>
                   </div>
                </div>

                {/* LEGENDAS E IMPACTO */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '1.5rem' }}>
                   
                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '4px', marginTop: '0.25rem' }}></div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-main)' }}>O Bem Físico (O que sobrou pra você)</strong>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>O valor honesto da moto ou forno que passou a gerar comida pra sua empresa.</span>
                      </div>
                   </div>

                   <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ width: '16px', height: '16px', background: '#be123c', borderRadius: '4px', marginTop: '0.25rem' }}></div>
                      <div>
                        <strong style={{ display: 'block', color: '#be123c' }}>A Conta do Tempo (O que ficou no Banco)</strong>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ao todo, ao final de {meses} dolorosos meses, o banco arrancou <strong>{formatCurrency(priceData.totalJuros)}</strong> puros só de juros das suas contas de trabalho sem te fabricar uma marmita sequer.</span>
                      </div>
                   </div>
                   
                   {/* SHOCK VALUE CARD */}
                   <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', padding: '1rem', borderRadius: '0.5rem', marginTop: 'auto' }}>
                      <p style={{ color: '#f43f5e', margin: 0, fontWeight: 600 }}>
                        EFEITO REVERSO: Você pagou na verdade {priceData.multiplicador.toFixed(2)}x o valor do Equipamento com esta taxa! {priceData.multiplicador > 2 ? 'Deu pra comprar duas motos pro banqueiro com esse contrato!' : ''}
                      </p>
                   </div>
                   
                </div>
             </div>
             
          </div>

        </div>
      )}

      {/* CHAT IA PARA ASSESSORIA FINANCEIRA DO ALUNO! */}
      <ChatIA />
    </div>
  );
}

// Simulador fake de limite p/ erro
const faturamentoDiarioSimulado = 500 * 30 * 0.2; // 20% do faturamento mês = limite p/ parcela
