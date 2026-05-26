import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Calculator, Wheat, Zap, Flame, DollarSign, Package, AlertCircle, BookOpen, Lock } from 'lucide-react';
import ChatIA from '../components/ChatIA';
import { useSettings } from '../hooks/useSettings';

export default function PadariaCustos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const settings = useSettings();
  const consultoraLiberada = user?.role === 'admin' || settings?.consultoria_padaria === true;

  const [step, setStep] = useState(0);

  // Custos Variáveis (Para 1 Saco de 50kg de Farinha)
  const [farinha, setFarinha] = useState(120);    // Preço do saco de 50kg
  const [fermento, setFermento] = useState(20);   // Fermento, Sal, Melhorador
  const [embalagens, setEmbalagens] = useState(15); // Sacos de papel Kraft

  // Custos Fixos Semanais/Mensais (rateados para a batelada)
  const [energiaForno, setEnergiaForno] = useState(30); // Eletricidade/Lenha por batelada
  const [padeiro, setPadeiro] = useState(40);           // Custo homem-hora por batelada
  const [outrosDescricao, setOutrosDescricao] = useState(''); // Descricao do custo
  const [outrosValor, setOutrosValor] = useState(0);          // Valor do custo extra
  
  // Rendimento
  const [rendimentoKp, setRendimentoKp] = useState(65); // Quantos Kg de pão pronto um Saco de 50kg de farinha crua gera (Devido a água)

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos da Batelada
  const totalVariaveis = farinha + fermento + embalagens;
  const totalFixos = energiaForno + padeiro;
  const custoTotalBatelada = totalVariaveis + totalFixos + outrosValor;
  
  const custoKg = rendimentoKp > 0 ? (custoTotalBatelada / rendimentoKp) : 0;
  
  // Proporções
  const percFarinha = custoTotalBatelada > 0 ? (farinha / custoTotalBatelada) * 100 : 0;
  const percApoio = custoTotalBatelada > 0 ? ((fermento + embalagens) / custoTotalBatelada) * 100 : 0;
  const percProducao = custoTotalBatelada > 0 ? (totalFixos / custoTotalBatelada) * 100 : 0;
  const percOutros = custoTotalBatelada > 0 ? (outrosValor / custoTotalBatelada) * 100 : 0;

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
          <Calculator size={24} color="#3b82f6" /> Custos de Batelada (Pão Francês)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Wheat size={64} color="#eab308" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>A Ciência da Farinha e o Fogo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
             Na Padaria, não custeamos um pão isolado. Nós custeamos a <strong>Batelada</strong> (A quantidade de massa que sai de um Saco de 50kg de Farinha). Aqui a água aumenta o peso do produto final (yield), mas os fornos elétricos devoram a conta de energia. Vamos descobrir exatamente quanto custa tirar 1 Kg de Pão Francês.
          </p>

          {/* BOTÃO CONSULTORIA */}
          <div style={{ background: consultoraLiberada ? 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(245,158,11,0.08) 100%)' : 'rgba(255,255,255,0.03)', border: consultoraLiberada ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', textAlign: 'left', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ background: consultoraLiberada ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '0.75rem', flexShrink: 0 }}>
                {consultoraLiberada ? <BookOpen size={24} color="#eab308" /> : <Lock size={24} color="var(--text-muted)" />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: consultoraLiberada ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {consultoraLiberada ? 'Aprenda antes de simular' : 'Consultoria de Custos e Despesas'}
                  </span>
                  {consultoraLiberada
                    ? <span style={{ background: '#eab308', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2rem' }}>NOVO</span>
                    : <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2rem' }}>🔒 BLOQUEADO</span>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {consultoraLiberada ? 'Veja exemplos reais de Indústria, Comércio e Serviço e resolva um desafio de consultoria.' : 'Será liberado pelo professor no momento oportuno da disciplina.'}
                </p>
              </div>
            </div>
            <button className={consultoraLiberada ? 'btn-primary' : 'btn-secondary'} onClick={() => consultoraLiberada && navigate('/padaria/consultoria-custos')} disabled={!consultoraLiberada} style={{ padding: '0.75rem 1.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', background: consultoraLiberada ? '#eab308' : undefined, border: 'none', color: consultoraLiberada ? '#000' : undefined, opacity: consultoraLiberada ? 1 : 0.5, cursor: consultoraLiberada ? 'pointer' : 'not-allowed' }}>
              {consultoraLiberada ? 'Acessar Consultoria →' : <><Lock size={14} /> Bloqueado</>}
            </button>
          </div>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
            Abrir Amassadeira de Custos
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>📋 Custo da Batelada (Por Saco de 50kg)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span>Saco de Trigo (50kg)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(farinha)}</span>
                 </label>
                 <input type="range" min="80" max="250" value={farinha} onChange={(e) => setFarinha(Number(e.target.value))} style={{ width: '100%', accentColor: '#eab308' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span>Aditivos (Fermento, Melhorador, Sal)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(fermento)}</span>
                 </label>
                 <input type="range" min="5" max="60" value={fermento} onChange={(e) => setFermento(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--text-muted)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span>Sacos Kraft e Bobinas Plásticas</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(embalagens)}</span>
                 </label>
                 <input type="range" min="5" max="50" value={embalagens} onChange={(e) => setEmbalagens(Number(e.target.value))} style={{ width: '100%' }} />
               </div>
               
               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span>🔥 Energia do Forno Elétrico</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(energiaForno)}</span>
                 </label>
                 <input type="range" min="10" max="150" value={energiaForno} onChange={(e) => setEnergiaForno(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#3b82f6' }}>
                   <span>👨‍🍳 Hora do Padeiro Mestre</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(padeiro)}</span>
                 </label>
                 <input type="range" min="15" max="100" value={padeiro} onChange={(e) => setPadeiro(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a855f7' }}>
                   <span>➕ Outros Custos (Descrição e Valor)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(outrosValor)}</span>
                 </label>
                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input type="text" placeholder="Ex: Água, Frete Extra..." className="input-field" value={outrosDescricao} onChange={(e) => setOutrosDescricao(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }} />
                    <input type="number" min="0" className="input-field" value={outrosValor} onChange={(e) => setOutrosValor(Number(e.target.value))} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }} />
                 </div>
                 <input type="range" min="0" max="200" value={outrosValor} onChange={(e) => setOutrosValor(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                   <span>⚖️ Rendimento Final de Pão Assado (Água aumenta o peso)</span>
                   <span style={{ fontWeight: 'bold' }}>{rendimentoKp} Kg</span>
                 </label>
                 <input type="range" min="45" max="90" value={rendimentoKp} onChange={(e) => setRendimentoKp(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>*Lembre-se: O pão não é 100% trigo. A água gera peso no produto final!</span>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* PAINEL DE YIELD (PREÇO DO KG) */}
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#10b981', borderWidth: '2px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Custo Padrão de 1 Kg de Pão Assado</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#10b981', textShadow: '0 4px 20px rgba(16, 185, 129, 0.3)' }}>
                   {formatCurrency(custoKg)}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                   ({formatCurrency(custoTotalBatelada)} Custo Total da Batelada ÷ {rendimentoKp} Kg Renderizados)
                </p>

                <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Custo Base de 1 Pão (50g)</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                           Fórmula: {formatCurrency(custoKg)} ÷ 1000g × 50g
                        </div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', textShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                        {formatCurrency(custoKg * 0.050)}
                    </div>
                </div>
             </div>

             {/* GRÁFICO DE COMPOSIÇÃO DE BATELADA */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Radiografia da Amassadeira</h3>
                
                <div style={{ width: '100%', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', display: 'flex', overflow: 'hidden', marginBottom: '1.5rem' }}>
                   <div style={{ width: `${percFarinha}%`, background: '#eab308' }} title={`Farinha: ${percFarinha.toFixed(1)}%`} />
                   <div style={{ width: `${percApoio}%`, background: 'var(--text-muted)' }} title={`Aditivos: ${percApoio.toFixed(1)}%`} />
                   <div style={{ width: `${percProducao}%`, background: '#3b82f6' }} title={`Fabricação (Fogo/Mão): ${percProducao.toFixed(1)}%`} />
                   {percOutros > 0 && <div style={{ width: `${percOutros}%`, background: '#a855f7' }} title={`Outros: ${percOutros.toFixed(1)}%`} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div> O Trigo Bruto</span>
                      <span style={{ fontWeight: 'bold' }}>{percFarinha.toFixed(1)}%</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)' }}></div> Aditivos e Sacos Kraft</span>
                      <span style={{ fontWeight: 'bold' }}>{percApoio.toFixed(1)}%</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div> Fogo & Força Padeiro</span>
                      <span style={{ fontWeight: 'bold' }}>{percProducao.toFixed(1)}%</span>
                   </div>
                   {percOutros > 0 && (
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }}></div> {outrosDescricao || 'Outros Custos'}</span>
                        <span style={{ fontWeight: 'bold' }}>{percOutros.toFixed(1)}%</span>
                     </div>
                   )}
                </div>
             </div>

             {/* CÁLCULO DETALHADO */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Demonstrativo de Separação de Custos</h3>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   
                   <div style={{ color: '#eab308', fontWeight: 'bold', marginBottom: '0.25rem', borderBottom: '1px solid rgba(234, 179, 8, 0.3)', paddingBottom: '0.25rem' }}>CUSTOS VARIÁVEIS</div>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Farinha de Trigo</span> <span>{formatCurrency(farinha)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Aditivos (Fermento, Melhorador, Sal)</span> <span>{formatCurrency(fermento)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Embalagens (Sacos Kraft e Bobinas)</span> <span>{formatCurrency(embalagens)}</span></p>
                   {outrosValor > 0 && <p style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7' }}><span>Outros ({outrosDescricao || 'Não especificado'})</span> <span>{formatCurrency(outrosValor)}</span></p>}
                   <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}><span>Subtotal Variável</span> <span>{formatCurrency(totalVariaveis + outrosValor)}</span></p>

                   <div style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.25rem', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '0.25rem' }}>CUSTOS FIXOS (Rateados)</div>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Energia / Lenha do Forno</span> <span>{formatCurrency(energiaForno)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mão de Obra do Padeiro</span> <span>{formatCurrency(padeiro)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}><span>Subtotal Fixo</span> <span>{formatCurrency(totalFixos)}</span></p>

                   <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0 0.5rem 0' }}/>
                   <p style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                      <span>SOMA TOTAL DA BATELADA</span> <span>{formatCurrency(custoTotalBatelada)}</span>
                   </p>
                </div>
             </div>
             
             
          </div>

        </div>
      )}

      <ChatIA />
    </div>
  );
}
