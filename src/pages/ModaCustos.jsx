import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, PackageSearch, Truck, Shirt, ShoppingBag, Receipt, BookOpen, Lock } from 'lucide-react';
import ChatIA from '../components/ChatIA';
import { useSettings } from '../hooks/useSettings';

export default function ModaCustos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const settings = useSettings();
  const consultoraLiberada = user?.role === 'admin' || settings?.consultoria_moda === true;

  const [step, setStep] = useState(0);

  // Custos Diretos de Peça Pronta (Landed Cost Fashion)
  const [custoBruto, setCustoBruto] = useState(35); // Custo do Brás/Bom Retiro
  const [freteRateado, setFreteRateado] = useState(3.50); // Custo ônibus de excursão ou correio por peça
  const [sacola, setSacola] = useState(4.00); // Sacola Kraft/Plástica grossa personalizada
  const [tags, setTags] = useState(1.50); // Etiqueta e tag de preço fixa
  
  const [outrosDescricao, setOutrosDescricao] = useState('');
  const [outrosValor, setOutrosValor] = useState(0);

  // Custos Fixos (Rateados por Peça para composição de preço cheio)
  const [aluguelRateado, setAluguelRateado] = useState(10);
  const [salarioRateado, setSalarioRateado] = useState(8);

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalVariaveis = custoBruto + freteRateado + sacola + tags + outrosValor;
  const totalFixos = aluguelRateado + salarioRateado;
  const custoTotal = totalVariaveis + totalFixos;

  // Proporções
  const percBruto = custoTotal > 0 ? (custoBruto / custoTotal) * 100 : 0;
  const percAcessorios = custoTotal > 0 ? ((sacola + tags) / custoTotal) * 100 : 0;
  const percFrete = custoTotal > 0 ? (freteRateado / custoTotal) * 100 : 0;
  const percFixos = custoTotal > 0 ? (totalFixos / custoTotal) * 100 : 0;
  const percOutros = custoTotal > 0 ? (outrosValor / custoTotal) * 100 : 0;

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
          <PackageSearch size={24} color="#f472b6" /> Custos de Aquisição (CMV)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Shirt size={64} color="#f472b6" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>O Segredo do Landed Cost</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
             Loja de roupa não fabrica nada. Você compra. Mas o empresário inexperiente acha que o Custo do Produto é o valor que está na nota fiscal do fornecedor.<br/><br/>
             Ele esquece a excursão arriscada para São Paulo, a transportadora, e principalmente o <strong>Unboxing</strong>: A sacola térmica caríssima com sua logomarca que joga o custo da blusa nas alturas. Vamos descobrir quanto te custa pendurar *uma única T-Shirt* na arara.
          </p>

          {/* BOTÃO CONSULTORIA */}
          <div style={{ background: consultoraLiberada ? 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.08) 100%)' : 'rgba(255,255,255,0.03)', border: consultoraLiberada ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', textAlign: 'left', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ background: consultoraLiberada ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '0.75rem', flexShrink: 0 }}>
                {consultoraLiberada ? <BookOpen size={24} color="#ec4899" /> : <Lock size={24} color="var(--text-muted)" />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: consultoraLiberada ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {consultoraLiberada ? 'Aprenda antes de simular' : 'Consultoria de Custos e Despesas'}
                  </span>
                  {consultoraLiberada
                    ? <span style={{ background: '#ec4899', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2rem' }}>NOVO</span>
                    : <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2rem' }}>🔒 BLOQUEADO</span>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {consultoraLiberada ? 'Veja exemplos de Confecção, Varejo de Moda e Personal Stylist e resolva seu desafio.' : 'Será liberado pelo professor no momento oportuno da disciplina.'}
                </p>
              </div>
            </div>
            <button className={consultoraLiberada ? 'btn-primary' : 'btn-secondary'} onClick={() => consultoraLiberada && navigate('/moda/consultoria-custos')} disabled={!consultoraLiberada} style={{ padding: '0.75rem 1.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', background: consultoraLiberada ? '#ec4899' : undefined, border: 'none', color: consultoraLiberada ? 'white' : undefined, opacity: consultoraLiberada ? 1 : 0.5, cursor: consultoraLiberada ? 'pointer' : 'not-allowed' }}>
              {consultoraLiberada ? 'Acessar Consultoria →' : <><Lock size={14} /> Bloqueado</>}
            </button>
          </div>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#ec4899', borderColor: '#db2777' }}>
            Abrir Caixa da Confecção
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f472b6' }}>📦 Desmontando o "CMV" na Arara</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span><Shirt size={16} style={{ display: 'inline' }} /> Custo Bruto no Fornecedor (Brás)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(custoBruto)}</span>
                 </label>
                 <input type="range" min="15" max="250" value={custoBruto} onChange={(e) => setCustoBruto(Number(e.target.value))} style={{ width: '100%', accentColor: '#f472b6' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span><Truck size={16} style={{ display: 'inline' }} /> Frete ou Excursão (Rateado por Peça)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(freteRateado)}</span>
                 </label>
                 <input type="range" min="0.5" max="30" step="0.5" value={freteRateado} onChange={(e) => setFreteRateado(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a855f7' }}>
                   <span><ShoppingBag size={16} style={{ display: 'inline' }} /> Sacola Premium Personalizada</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(sacola)}</span>
                 </label>
                 <input type="range" min="0.5" max="15" step="0.5" value={sacola} onChange={(e) => setSacola(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
               </div>

                <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                   <span><Receipt size={16} style={{ display: 'inline' }} /> Etiquetas Fixas Tradicionais e Tag de Marca</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(tags)}</span>
                 </label>
                 <input type="range" min="0.1" max="5" step="0.1" value={tags} onChange={(e) => setTags(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--text-muted)' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                   <span>🏪 Aluguel e Energia (Rateio Fixo)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(aluguelRateado)}</span>
                 </label>
                 <input type="range" min="2" max="50" step="1" value={aluguelRateado} onChange={(e) => setAluguelRateado(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#3b82f6' }}>
                   <span>👩‍💼 Salário da Vendedora (Rateio Fixo)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(salarioRateado)}</span>
                 </label>
                 <input type="range" min="2" max="30" step="1" value={salarioRateado} onChange={(e) => setSalarioRateado(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a855f7' }}>
                   <span>➕ Outros Custos (Descrição e Valor)</span>
                   <span style={{ fontWeight: 'bold' }}>{formatCurrency(outrosValor)}</span>
                 </label>
                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input type="text" placeholder="Ex: Impostos, Presente..." className="input-field" value={outrosDescricao} onChange={(e) => setOutrosDescricao(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }} />
                    <input type="number" min="0" className="input-field" value={outrosValor} onChange={(e) => setOutrosValor(Number(e.target.value))} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }} />
                 </div>
                 <input type="range" min="0" max="100" value={outrosValor} onChange={(e) => setOutrosValor(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* PAINEL DE CMV FINAL */}
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#ec4899', borderWidth: '2px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Custo Total da Peça na Arara</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#ec4899', textShadow: '0 4px 20px rgba(236, 72, 153, 0.3)' }}>
                   {formatCurrency(custoTotal)}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '1rem', marginBottom: '1rem' }}>
                   Fórmula: {formatCurrency(totalVariaveis)} (Variável/CMV) + {formatCurrency(totalFixos)} (Fixo) = {formatCurrency(custoTotal)}
                </div>

                <div style={{ marginTop: '1.5rem', background: 'rgba(236, 72, 153, 0.05)', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.875rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '0.25rem' }}>A Ilusão do Lojista:</span>
                   <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>O produto custa <strong>{formatCurrency(custoTotal - custoBruto)} a mais</strong> ({((custoTotal/custoBruto - 1)*100).toFixed(0)}% mais caro) do que você pagou no fornecedor. Esquecer de somar os fixos rateados ou a sacola destrói todo o seu lucro!</span>
                </div>
             </div>

             {/* GRÁFICO DE COMPOSIÇÃO DE CMV */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Sanguessugas do Estoque</h3>
                
                <div style={{ width: '100%', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', display: 'flex', overflow: 'hidden', marginBottom: '1.5rem' }}>
                   <div style={{ width: `${percBruto}%`, background: '#f472b6' }} title={`O Produto Feio: ${percBruto.toFixed(1)}%`} />
                   <div style={{ width: `${percFrete}%`, background: '#f59e0b' }} title={`Transportadora: ${percFrete.toFixed(1)}%`} />
                   <div style={{ width: `${percAcessorios}%`, background: '#10b981' }} title={`Experiência Cliente: ${percAcessorios.toFixed(1)}%`} />
                   {percOutros > 0 && <div style={{ width: `${percOutros}%`, background: '#a855f7' }} title={`Outros: ${percOutros.toFixed(1)}%`} />}
                   <div style={{ width: `${percFixos}%`, background: '#3b82f6' }} title={`Rateio Fixo: ${percFixos.toFixed(1)}%`} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f472b6' }}></div> Roupa em Si (Sua principal compra)</span>
                      <span style={{ fontWeight: 'bold' }}>{percBruto.toFixed(1)}%</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div> Transportadora e Pedágios</span>
                      <span style={{ fontWeight: 'bold' }}>{percFrete.toFixed(1)}%</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div> Acessórios de Entrega (Branding)</span>
                      <span style={{ fontWeight: 'bold' }}>{percAcessorios.toFixed(1)}%</span>
                   </div>
                   {percOutros > 0 && (
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }}></div> {outrosDescricao || 'Outros Custos'}</span>
                        <span style={{ fontWeight: 'bold' }}>{percOutros.toFixed(1)}%</span>
                     </div>
                   )}
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div> Custos Fixos (Rateados)</span>
                      <span style={{ fontWeight: 'bold' }}>{percFixos.toFixed(1)}%</span>
                   </div>
                </div>
             </div>

             {/* CÁLCULO DETALHADO */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Demonstrativo de Separação de Custos</h3>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   
                   <div style={{ color: '#eab308', fontWeight: 'bold', marginBottom: '0.25rem', borderBottom: '1px solid rgba(234, 179, 8, 0.3)', paddingBottom: '0.25rem' }}>CUSTOS VARIÁVEIS</div>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Custo Bruto (Fornecedor)</span> <span>{formatCurrency(custoBruto)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Frete e Excursão</span> <span>{formatCurrency(freteRateado)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sacola Personalizada</span> <span>{formatCurrency(sacola)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Etiquetas e Tags</span> <span>{formatCurrency(tags)}</span></p>
                   {outrosValor > 0 && <p style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7' }}><span>Outros ({outrosDescricao || 'Não especificado'})</span> <span>{formatCurrency(outrosValor)}</span></p>}
                   <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}><span>Subtotal Variável</span> <span>{formatCurrency(totalVariaveis)}</span></p>

                   <div style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.25rem', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '0.25rem' }}>CUSTOS FIXOS (Rateados na Peça)</div>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Aluguel e Energia</span> <span>{formatCurrency(aluguelRateado)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Salário Vendedora</span> <span>{formatCurrency(salarioRateado)}</span></p>
                   <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}><span>Subtotal Fixo</span> <span>{formatCurrency(totalFixos)}</span></p>

                   <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0 0.5rem 0' }}/>
                   <p style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                      <span>SOMA TOTAL POR PEÇA</span> <span>{formatCurrency(custoTotal)}</span>
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
