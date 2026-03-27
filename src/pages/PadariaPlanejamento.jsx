import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, TrendingUp, Archive, Clock, Bell, AlertTriangle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaPlanejamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Varejo Massivo Exige Ponto de Reposição exato
  const [vendaDiaria, setVendaDiaria] = useState(15);    // Saída de 15 sacos de 50kg por dia
  const [tempoEspera, setTempoEspera] = useState(5);     // Caminhão leva 5 dias para vir trazer mais
  const [estoqueSeguranca, setEstoqueSeguranca] = useState(30); // Prevenção de emergência (greve de caminhões)

  // O momento exato de puxar o gatilho da compra
  const pontoPedido = (vendaDiaria * tempoEspera) + estoqueSeguranca;
  
  // Estoque atual simulado (pode ser o que restou na expedição)
  const [estoqueFisico, setEstoqueFisico] = useState(120);

  const diasRestantes = estoqueFisico / vendaDiaria;
  const triggerAtivado = estoqueFisico <= pontoPedido;

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
          <TrendingUp size={24} color="#a855f7" /> Planejamento Logístico e Compras
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Archive size={64} color="#a855f7" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Se a farinha acaba, a loja fecha.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Ao contrário de muitos serviços, a cadeia de suprimentos da Padaria é militar. Se o trigo faltar no siló das 4 da manhã, não há pão às 6 horas, e o cliente que entra é perdido para o concorrente.<br/><br/>
             A regra do jogo é o <strong>Ponto de Pedido Automático</strong>. Você precisa de inteligência logística para nunca pisar no Estoque de Segurança da sua caldeira.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#9333ea', borderColor: '#7e22ce' }}>
            Acessar Prancheta Logística
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#a855f7' }}>📅 Válvulas de Calibração Trigo</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                   <span style={{ fontWeight: 'bold' }}>Sacos Gastos por Dia (Saída)</span>
                   <span style={{ fontWeight: 'bold' }}>{vendaDiaria} Sacos</span>
                 </label>
                 <input type="range" min="1" max="100" value={vendaDiaria} onChange={(e) => setVendaDiaria(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--text-main)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span style={{ fontWeight: 'bold' }}><Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Tempo do Fornecedor Entregar</span>
                   <span style={{ fontWeight: 'bold' }}>{tempoEspera} Dias Rodando</span>
                 </label>
                 <input type="range" min="1" max="30" value={tempoEspera} onChange={(e) => setTempoEspera(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#3b82f6' }}>
                   <span style={{ fontWeight: 'bold' }}><Archive size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Respeito Estratégico (Estoque Segurança)</span>
                   <span style={{ fontWeight: 'bold' }}>{estoqueSeguranca} Sacos Bloqueados</span>
                 </label>
                 <input type="range" min="0" max="100" value={estoqueSeguranca} onChange={(e) => setEstoqueSeguranca(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
               </div>
               
               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
               
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                   <span style={{ fontWeight: 'bold' }}>Estoque Físico na Padaria (Siló)</span>
                   <span style={{ fontWeight: 'bold' }}>{estoqueFisico} Sacos</span>
                 </label>
                 <input type="range" min="0" max="300" value={estoqueFisico} onChange={(e) => setEstoqueFisico(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mova este slider para simular os dias passando na vida real...</p>
               </div>

             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* PAINEL DE TRIGGER (PONTO DE PEDIDO) */}
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: triggerAtivado ? 'rgba(239, 68, 68, 0.4)' : '#a855f7', borderWidth: '2px', position: 'relative', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem', zIndex: 2 }}>Gatilho do Ponto de Compras</h3>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: triggerAtivado ? '#ef4444' : '#a855f7', textShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 2 }}>
                   {pontoPedido} <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Sacos</span>
                </div>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '1rem', zIndex: 2, lineHeight: '1.5' }}>
                   Fórmula: ({vendaDiaria} Sacos/Dia × {tempoEspera} Dias Rodando) + {estoqueSeguranca} de Segurança = {pontoPedido} Sacos Alvo
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', zIndex: 2 }}>
                   {triggerAtivado ? (
                      <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <AlertTriangle /> O Estoque quebrou a barreira. Pedir caminhão IMEDIATAMENTE!
                      </span>
                   ) : (
                      <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Fique calmo. Ninguém pega no telefone enquanto não chegar aos {pontoPedido}.</span>
                   )}
                </div>
                
                {triggerAtivado && (
                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239, 68, 68, 0.05)', zIndex: 0, pointerEvents: 'none' }} />
                )}
             </div>

             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}><Clock size={18} style={{ display: 'inline' }} /> Sobrevivência Total (Dias de Trigo Máximo)</span>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Até acabar toda a segurança técnica e bater zero</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                      Fórmula: {estoqueFisico} (Total no Silo) ÷ {vendaDiaria} (Gastos por Dia) = {diasRestantes.toFixed(1)} dias
                   </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: diasRestantes < tempoEspera ? '#ef4444' : '#10b981' }}>
                   {diasRestantes.toFixed(1)} <span style={{ fontSize: '1rem' }}>dias</span>
                </div>
             </div>

          </div>

        </div>
      )}

      <ChatIA />
    </div>
  );
}
