import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Tag, Percent, ArrowDownCircle, Scissors, CheckCircle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaPrecificacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Premissas Custo
  const [cmv, setCmv] = useState(44); // Custo Base (Landed Cost calculado no modulo Custos)
  
  // Markups Selvagens de Moda
  const [markupPercent, setMarkupPercent] = useState(150); // Moda vende a +150% até +300% fácil.

  // Vedações do Varejo
  const [comissaoVendedor, setComissaoVendedor] = useState(4); // 4% para o consultor da loja
  const [taxaCartao, setTaxaCartao] = useState(3.5); // 3.5% maquina de credito 3x sem juros
  const [imposto, setImposto] = useState(6); // 6% DAS do Simples Nacional

  // Simulador de Liquidação Final (Markdown de mudança de coleção)
  const [liquidacaoMarkdown, setLiquidacaoMarkdown] = useState(30); // Desconto agressivo de 30% pra zerar rack

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // MOTOR MATEMÁTICO - A Formação Brutal 
  const precoTeorico = cmv * (1 + (markupPercent / 100)); // Preço base "frio"
  
  // Psicologia do "Final 9" (.90) - Se der 105.42 -> 109.90. Se der 91.22 -> 99.90
  const aplicarPrecoPsicologico = (valor) => {
     let dezenaArredondada = Math.ceil(valor / 10) * 10;
     let precoFinal9 = dezenaArredondada - 0.10;
     // Para não dar desvantagem, se baseamos tudo p/ cima na familia de liquidações da moda
     return precoFinal9;
  };

  const precoVitrine = aplicarPrecoPsicologico(precoTeorico);
  
  // DRE Unitário (Preço Cheio)
  const impostosReais = precoVitrine * (imposto / 100);
  const cartaoReais = precoVitrine * (taxaCartao / 100);
  const comissaoReais = precoVitrine * (comissaoVendedor / 100);
  
  const lucroLiquidoCheio = precoVitrine - cmv - impostosReais - cartaoReais - comissaoReais;
  const margemLiquidaCheia = (lucroLiquidoCheio / precoVitrine) * 100;

  // DRE Unitário (Liquidação Black Friday)
  const precoLiquida = aplicarPrecoPsicologico(precoVitrine * (1 - (liquidacaoMarkdown / 100)));
  
  const impostoLiquida = precoLiquida * (imposto / 100);
  const cartaoLiquida = precoLiquida * (taxaCartao / 100);
  const comissaoLiquida = precoLiquida * (comissaoVendedor / 100);

  const lucroLiquida = precoLiquida - cmv - impostoLiquida - cartaoLiquida - comissaoLiquida;
  const margemLiquidaBaixa = (lucroLiquida / precoLiquida) * 100;

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
          <Tag size={24} color="#fcd34d" /> Markup Mágico e Liquidações
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Tag size={64} color="#fcd34d" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sua gordura é sua sobrevivência.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Ao contrário de alimentos, a Loja de Roupas joga com Margens Irreais no lançamento da coleção, para absorver descontos violentos de 50% "OFF" no final da estação.<br/><br/>
             Nenhuma Blusa T-Shirt custa o que a etiqueta de R$ 119,90 diz. A etiqueta embute o Imposto, a Comissão da Vendedora e a Taxa de Crédito, blindando sua margem. E nós arredondamos tudo com a <strong>Psicologia dos 90 Centavos</strong>.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#eab308', borderColor: '#ca8a04' }}>
            Imprimir Etiquetas Oficiais
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fcd34d' }}>🧮 Máquina de Etiquetas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Custo no Cabide (Seu CMV)</label>
                 <input type="number" className="input-field" value={cmv} onChange={e => setCmv(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef3c7' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>Margem Target (Markup de Moda)</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>+ </span>
                      <input type="number" value={markupPercent} onChange={e => setMarkupPercent(Number(e.target.value) || 0)} style={{ width: '70px', padding: '0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 'bold', textAlign: 'center', borderRadius: '0.25rem', outline: 'none' }} />
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>% Sobre Custo</span>
                   </div>
                 </label>
                 <input type="range" min="50" max="600" step="5" value={markupPercent} onChange={(e) => setMarkupPercent(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981', marginTop: '0.5rem' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O mercado aplica entre 120% a 300% sem piedade.</span>
               </div>
               
               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

               <div>
                 <span style={{ display: 'block', marginBottom: '1rem', color: 'var(--danger)', fontWeight: 'bold' }}>Tarifas Vilãs (Roem a Margem Target)</span>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Imposto (Simples Nacional)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="number" value={imposto} onChange={e => setImposto(Number(e.target.value) || 0)} style={{ width: '60px', padding: '0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', fontWeight: 'bold', textAlign: 'center', borderRadius: '0.25rem' }} />
                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>%</span>
                      </div>
                    </label>

                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Maquininha (Crédito 3x)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="number" value={taxaCartao} onChange={e => setTaxaCartao(Number(e.target.value) || 0)} step="0.1" style={{ width: '60px', padding: '0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', fontWeight: 'bold', textAlign: 'center', borderRadius: '0.25rem' }} />
                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>%</span>
                      </div>
                    </label>

                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Comissão do Vendedor</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input type="number" value={comissaoVendedor} onChange={e => setComissaoVendedor(Number(e.target.value) || 0)} style={{ width: '60px', padding: '0.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', fontWeight: 'bold', textAlign: 'center', borderRadius: '0.25rem' }} />
                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>%</span>
                      </div>
                    </label>
                 </div>
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a855f7' }}>
                   <span><Scissors size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Liquidação Ofensiva Final Markdown</span>
                   <span style={{ fontWeight: 'bold', color: '#a855f7' }}>{liquidacaoMarkdown}% de Desconto OFF</span>
                 </label>
                 <input type="range" min="0" max="80" step="5" value={liquidacaoMarkdown} onChange={(e) => setLiquidacaoMarkdown(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simule o pior cenário: Black Friday ou liquidação de Inverno pra salvar o Caixa de Roupas Encalhadas.</span>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* PAINEL DE VENDA CHEIO */}
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: '#fcd34d', borderWidth: '2px', background: 'rgba(252, 211, 77, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem', textTransform: 'uppercase' }}>Preço Coleção Nova (Lançamento)</h3>
                
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#fcd34d', textShadow: '0 4px 20px rgba(252, 211, 77, 0.3)' }}>
                   {formatCurrency(precoVitrine)}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '1rem', lineHeight: 1.5 }}>
                   Matemática Bruta: {formatCurrency(cmv)} + {markupPercent}% = {formatCurrency(precoTeorico)} <br />
                   Psicológica Comercial: Arredondado no dígito .90 falso.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', marginTop: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} /> Lucro Liquido Real no Bolso</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Já tirando funcionário e maquininha.</div>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
                        {formatCurrency(lucroLiquidoCheio)}
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'normal', fontStyle: 'italic', textAlign: 'right' }}>({margemLiquidaCheia.toFixed(1)}% Margem)</span>
                      </div>
                   </div>
                   
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', textAlign: 'left', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '0.75rem', lineHeight: 1.5 }}>
                      <strong>DRE:</strong> {formatCurrency(precoVitrine)} (Preço) - {formatCurrency(cmv)} (CMV) - {formatCurrency(impostosReais)} ({imposto}% DAS) - {formatCurrency(cartaoReais)} ({taxaCartao}% Cielo) - {formatCurrency(comissaoReais)} ({comissaoVendedor}% Func) = {formatCurrency(lucroLiquidoCheio)} Líquido Central.
                   </div>
                </div>
             </div>

             {/* PAINEL LIQUIDAÇÃO OFF */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.25rem' }}><ArrowDownCircle size={18} style={{ display: 'inline', marginRight: '0.5rem' }} /> Arara de Liquidação {liquidacaoMarkdown}% OFF!</span>
                   <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a855f7' }}>
                      {formatCurrency(precoLiquida)}
                   </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                   <strong>DRE SUICIDA:</strong> {formatCurrency(precoLiquida)} (Preço OFF) - {formatCurrency(cmv)} (CMV) - {formatCurrency(impostoLiquida)} ({imposto}% DAS) - {formatCurrency(cartaoLiquida)} ({taxaCartao}% Cielo) - {formatCurrency(comissaoLiquida)} ({comissaoVendedor}% Func) = {formatCurrency(lucroLiquida)} Líquido Central.
                </div>

                {lucroLiquida > 0 ? (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>Você sobreviveu!</span> Mesmo no desconto suicida, seu caixa fica positivo em <strong>{formatCurrency(lucroLiquida)}</strong> líquidos depositados livre no seu banco. Seu Markup segurou o impacto.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 'bold', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                    Alerta de Falência! O Markup de {markupPercent}% não blindou sua vitrine contra uma Black Friday tão violenta. Você vendeu e tirou do próprio bolso <strong>{formatCurrency(Math.abs(lucroLiquida))} de PREJUÍZO</strong> porque o Custo + Impostos superaram o saldo promocional.
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
