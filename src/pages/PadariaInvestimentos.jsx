import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Briefcase, TrendingUp, Building2, Flame } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaInvestimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Padaria tem caixas fartos. Dono quer comprar Refrigerador ou Pagar Banco.
  const [capitalAcumulado, setCapitalAcumulado] = useState(25000); 

  // Rentabilidade Banco (CDB 100% CDI Mensalizado Conservador)
  const [taxaBanco, setTaxaBanco] = useState(0.85); // 0.85% ao mes (aprox CDI base)

  // Lucro Potencial Físico: Comprar Expositor de Tortas Frias por R$ 25.000 gera R$ 2000 extra puro/mês
  const [lucroExtraProjeto, setLucroExtraProjeto] = useState(2500); 

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos no tempo Mágico de 12 Meses
  const retornoBanco = capitalAcumulado * Math.pow(1 + (taxaBanco / 100), 12);
  const lucroBanco = retornoBanco - capitalAcumulado;

  // Rentabilidade da "Máquina Padaria"
  // ROI do projeto ao mes:
  const roiMensalPadaria = (lucroExtraProjeto / capitalAcumulado) * 100;
  // Rentabilidade em 12 meses (Reinvestindo o lucro do expositor? Não, simplificando como Caixa Fixo)
  const retornoPadariaTotal = lucroExtraProjeto * 12;

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
          <Briefcase size={24} color="#0ea5e9" /> Expansão vs Custo de Oportunidade
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Briefcase size={64} color="#0ea5e9" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sua Padaria Deu Lucro. E agora?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Sobrou uma "Caixa Gorda" no final de ano. A tentação do empreendedor inexperiente é torrar na primeira reforma de piso que ver pela frente. <br/><br/>
             Você deve aprender o limite. Expandir o negócio compensa apenas se o Retorno deste novo capital enterrado lá dentro <strong>superar e esmagar a taxa de Juros Livre de Risco do Governo (Tesouro)</strong>. Assuma o banco dos Diretores.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#0284c7', borderColor: '#0369a1' }}>
            Analisar Projetos do Franquiado
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0ea5e9' }}>💼 Balcão de Negociatas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Capital Acumulado em Caixa Livre (R$)</label>
                 <input type="number" className="input-field" value={capitalAcumulado} onChange={e => setCapitalAcumulado(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e0f2fe' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disponível para aplicações pesadas.</span>
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}/>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#f59e0b' }}>Projeto: Vitrine Fria para Tortas Gourmet</span>
                   <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{formatCurrency(lucroExtraProjeto)} / Mês extra</span>
                 </label>
                 <input type="range" min="100" max="6000" step="100" value={lucroExtraProjeto} onChange={(e) => setLucroExtraProjeto(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mude quanto comprar a vitrine adicionará à venda diária e lucro da empresa.</span>
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981' }}>Taxa do Mercado Bancário (CDB/Mês)</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>{taxaBanco.toFixed(2)}% de Juros Composto</span>
                 </label>
                 <input type="range" min="0.1" max="2.5" step="0.05" value={taxaBanco} onChange={(e) => setTaxaBanco(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ringue de Batalha de 12 Meses (1 Ano):</h3>
             
             {/* INVESTIR NA PADARIA (RISCO ALCANCADO) */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: retornoPadariaTotal > lucroBanco ? '4px solid #f59e0b' : '4px solid var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h3 style={{ fontSize: '1.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building2 size={20} /> Empreender na Vitrine (Micro-Projeto)</h3>
                   <span style={{ background: '#f59e0b', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>ROI Bruto: {roiMensalPadaria.toFixed(1)}% ao mês</span>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.25rem' }}>
                   +{formatCurrency(retornoPadariaTotal)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Gerados em 1 Ano</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>O equipamento se paga (Payback) em {(capitalAcumulado / lucroExtraProjeto).toFixed(1)} meses de operação.</p>
             </div>

             {/* DEIXAR NO BANCO (RISCO ZERO) */}
             <div className="glass-panel" style={{ padding: '2rem', borderLeft: lucroBanco >= retornoPadariaTotal ? '4px solid #10b981' : '4px solid var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h3 style={{ fontSize: '1.25rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={20} /> CDB Tesouro (Juro Composto Certo)</h3>
                   <span style={{ background: '#10b981', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Risco Zero Estatal</span>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '0.25rem' }}>
                   +{formatCurrency(lucroBanco)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Lucro Real em 1 Ano</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ao final dos trâmites, você sacará bruto: {formatCurrency(retornoBanco)}.</p>
             </div>

             {/* O VEREDITO */}
             {retornoPadariaTotal > lucroBanco ? (
                 <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Flame size={32} />
                    <div>
                      <strong>Oportunidade Brilhante!</strong><br/>
                      Empreender na vitrine nova destrói a rentabilidade bancária da Selic em {formatCurrency(retornoPadariaTotal - lucroBanco)}. Compre!
                    </div>
                 </div>
             ) : (
                 <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <TrendingDown size={32} />
                    <div>
                      <strong>Armadilha Tóxica!</strong><br/>
                      Pare a reforma! Colocar {formatCurrency(capitalAcumulado)} em vitrine rende absurdamente MENOS que o tesouro confortável. Essa ideia queima Caixa.
                    </div>
                 </div>
             )}

          </div>

        </div>
      )}

      <ChatIA />
    </div>
  );
}
