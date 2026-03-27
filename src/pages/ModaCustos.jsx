import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, PackageSearch, Truck, Shirt, ShoppingBag, Receipt } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaCustos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Custos Diretos de Peça Pronta (Landed Cost Fashion)
  const [custoBruto, setCustoBruto] = useState(35); // Custo do Brás/Bom Retiro
  const [freteRateado, setFreteRateado] = useState(3.50); // Custo ônibus de excursão ou correio por peça
  const [sacola, setSacola] = useState(4.00); // Sacola Kraft/Plástica grossa personalizada
  const [tags, setTags] = useState(1.50); // Etiqueta e tag de preço fixa

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const cmv = custoBruto + freteRateado + sacola + tags;

  // Proporções
  const percBruto = (custoBruto / cmv) * 100;
  const percAcessorios = ((sacola + tags) / cmv) * 100;
  const percFrete = (freteRateado / cmv) * 100;

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
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Loja de roupa não fabrica nada. Você compra. Mas o empresário inexperiente acha que o Custo do Produto é o valor que está na nota fiscal do fornecedor.<br/><br/>
             Ele esquece a excursão arriscada para São Paulo, a transportadora, e principalmente o <strong>Unboxing</strong>: A sacola térmica caríssima com sua logomarca que joga o custo da blusa nas alturas. Vamos descobrir quanto te custa pendurar *uma única T-Shirt* na arara.
          </p>

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
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* PAINEL DE CMV FINAL */}
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#ec4899', borderWidth: '2px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Custo Real no Cabide (CMV)</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#ec4899', textShadow: '0 4px 20px rgba(236, 72, 153, 0.3)' }}>
                   {formatCurrency(cmv)}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '1rem', marginBottom: '1rem' }}>
                   Fórmula: {formatCurrency(custoBruto)} (Brás) + {formatCurrency(freteRateado)} (Frete) + {formatCurrency(sacola)} (Sacola) + {formatCurrency(tags)} (Tags) = {formatCurrency(cmv)}
                </div>

                <div style={{ marginTop: '1.5rem', background: 'rgba(236, 72, 153, 0.05)', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.875rem', color: '#ec4899', fontWeight: 'bold', marginBottom: '0.25rem' }}>A Ilusão do Lojista:</span>
                   <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>O produto custa <strong>{formatCurrency(cmv - custoBruto)} a mais</strong> ({((cmv/custoBruto - 1)*100).toFixed(0)}% mais caro) do que você pagou para o fornecedor. Esquecer de somar a sacola ou o frete destrói todo o seu lucro!</span>
                </div>
             </div>

             {/* GRÁFICO DE COMPOSIÇÃO DE CMV */}
             <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Sanguessugas do Estoque</h3>
                
                <div style={{ width: '100%', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', display: 'flex', overflow: 'hidden', marginBottom: '1.5rem' }}>
                   <div style={{ width: `${percBruto}%`, background: '#f472b6' }} title={`O Produto Feio: ${percBruto.toFixed(1)}%`} />
                   <div style={{ width: `${percFrete}%`, background: '#f59e0b' }} title={`Transportadora: ${percFrete.toFixed(1)}%`} />
                   <div style={{ width: `${percAcessorios}%`, background: '#a855f7' }} title={`Experiência Cliente: ${percAcessorios.toFixed(1)}%`} />
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }}></div> Acessórios de Entrega (Branding)</span>
                      <span style={{ fontWeight: 'bold' }}>{percAcessorios.toFixed(1)}%</span>
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
