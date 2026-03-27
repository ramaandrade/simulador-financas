import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, MonitorPlay, TrendingUp, Handshake, ShieldAlert } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaInvestimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Combate de Retorno: Fundo de Investimento (Governo) vs Meta Ads (Zuckerberg)
  const [capitalAcumulado, setCapitalAcumulado] = useState(15000); // 15 Mil em Caixa Livre.

  // Rentabilidade Selic 
  const [taxaSelic, setTaxaSelic] = useState(10.50); // 10.5% a.a CDI

  // Tráfego Pago / Influencer
  const [cpac, setCpac] = useState(45); // Custo Mínimo para fazer 1 pessoa vir na loja E COMPRAR (Custo Aquisição MetaAds/Influencer)
  const [lucroPorPecaMedia, setLucroPorPecaMedia] = useState(65); // Após tirar imposto e cmv, sobra R$65 livre de cada cliente que converte.
  
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // CENÁRIO 1: CDB/Tesouro por 12 meses
  const aplicacaoSeguraDoAno = capitalAcumulado * (1 + (taxaSelic / 100));
  const lucroSelic = aplicacaoSeguraDoAno - capitalAcumulado;

  // CENÁRIO 2: Torrar os 15 Mil num mês injetado no Instagram/Blogueira
  const clientesComprados = Math.floor(capitalAcumulado / cpac);
  const vplMarketing = clientesComprados * lucroPorPecaMedia; // O Lucro financeiro bruto trazido pelos influenciados
  const lucroCampanha = vplMarketing - capitalAcumulado; // Subtraindo o que foi gasto com Mark pra calcular a margem livre da campanha
  const rombo = lucroCampanha < 0 ? Math.abs(lucroCampanha) : 0;

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
          <MonitorPlay size={24} color="#0ea5e9" /> Tráfego Pago vs Tesouro (ROI)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <MonitorPlay size={64} color="#0ea5e9" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>O Abismo do Instagram.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Sua Loja acumulou dinheiro do último fim de ano. Seus concorrentes fecharam "parcerias" com influenciadores e estão injetando Tráfego Pago no Facebook.<br/><br/>
             Qual a hora de parar? Se cada visualização gerada que converte em venda (CAC) custar MAIS CARO que o Lucro da Peça que o cara compra, você acabou de ativar **A Máquina de Queimar Dinheiro**. E acredite: as vezes o título da Poupança ganha de lavada dos melhores marqueteiros.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#0284c7', borderColor: '#0369a1' }}>
            Simular Performance de Marketing
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0ea5e9' }}>🚀 Console de Alocação de Caixa</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Renda Livre em Caixa (R$)</label>
                 <input type="number" className="input-field" value={capitalAcumulado} onChange={e => setCapitalAcumulado(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e0f2fe' }} />
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--danger)' }}>CAC (Custo Pago pra 1 Cliente Comprar de Fato)</span>
                   <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{formatCurrency(cpac)} Mídia</span>
                 </label>
                 <input type="range" min="10" max="150" value={cpac} onChange={(e) => setCpac(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--danger)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981' }}>Lucro Frio da Peça Que Ele Comprou</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(lucroPorPecaMedia)} Venda</span>
                 </label>
                 <input type="range" min="10" max="300" value={lucroPorPecaMedia} onChange={(e) => setLucroPorPecaMedia(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cálculo do CAC x Lucro da Peça de Entrada (T-Shirt Branca).</p>
               </div>
               
               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#f59e0b' }}>Taxa Anual Governo (Selic/Renda Fixa CDI a.a)</span>
                   <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{taxaSelic.toFixed(2)}%</span>
                 </label>
                 <input type="range" min="2" max="15" step="0.25" value={taxaSelic} onChange={(e) => setTaxaSelic(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Veredito Financeiro Direto:</h3>
             
             {/* Renda Fixa */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: lucroCampanha < lucroSelic ? '4px solid #f59e0b' : '4px solid var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                   <h3 style={{ fontSize: '1.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={20} /> Fugir para a SELIC Segura</h3>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.25rem' }}>
                   +{formatCurrency(lucroSelic)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Lucrados Fáceis</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Fórmula Anual: {formatCurrency(capitalAcumulado)} × {taxaSelic}% Juros Compostos Ao Ano Sem Mexer Um Dedo.</div>
             </div>

             {/* Meta ADS */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: lucroCampanha > lucroSelic ? '4px solid #10b981' : (lucroCampanha < 0 ? '4px solid #ef4444' : '4px solid var(--text-muted)') }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                   <h3 style={{ fontSize: '1.25rem', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Handshake size={20} /> Empreender Digital: Campanha Agressiva</h3>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: lucroCampanha > 0 ? '#10b981' : '#ef4444', marginBottom: '0.25rem' }}>
                   {lucroCampanha > 0 ? '+' : '-'}{formatCurrency(Math.abs(lucroCampanha))} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Livres no Bolso Imediato</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                   <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                      <strong style={{ color: '#0ea5e9', display: 'block', marginBottom: '0.25rem' }}>Passo 1: Compras de Clientes (O Poder de Fogo)</strong>
                      Se você joga <strong>{formatCurrency(capitalAcumulado)}</strong> na mão do Instagram, e ele te cobra o CAC de <strong>{formatCurrency(cpac)}</strong> para convencer UMA única pessoa a comprar na sua loja...<br/>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '0.25rem', display: 'block' }}>
                         Conta Rápida: {formatCurrency(capitalAcumulado)} ÷ {formatCurrency(cpac)} = <strong>{clientesComprados} Pessoas reais entraram na loja e pagaram.</strong>
                      </span>
                   </div>
                   
                   <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                      <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.25rem' }}>Passo 2: A Renda Gerada (LTV / Retorno)</strong>
                      Se essas <strong>{clientesComprados} pessoas</strong> compraram suas roupas, e cada peça livre de custo te deixa <strong>{formatCurrency(lucroPorPecaMedia)}</strong> de lucro pingando no Pix...<br/>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '0.25rem', display: 'block' }}>
                         Conta Rápida: {clientesComprados} Clientes × {formatCurrency(lucroPorPecaMedia)} (Lucro da Peça) = <strong>{formatCurrency(vplMarketing)} faturados livres!</strong>
                      </span>
                   </div>
                </div>

                {rombo > 0 && (
                   <div style={{ marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                      CATASTRÓFE COMPROVADA! O marqueteiro queimou mais do que a margem rende. Você torrou {formatCurrency(capitalAcumulado)} na campanha, para vender blusas que te renderam míseros {formatCurrency(vplMarketing)} de lucro da peça. Você DESTRUIU seu capital investido acumulando um buraco de {formatCurrency(rombo)}. DESSA FORMA É MIL VEZES MELHOR LARGAR TUDO NO BANCO!
                   </div>
                )}
                {lucroCampanha > lucroSelic && (
                   <div style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                      VITÓRIA ABSOLUTA DO EMPREENDEDORISMO! Com CAC baixo assim, sua "Máquina Impressora Zuckerberg" humilha as taxas letárgicas do Banco Central. Acelere e torça pra aguentar a escala das entregas KAnguru do correio!
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
