import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, CalendarHeart, Zap, Shield, ChevronRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function ModaPlanejamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Composição da Compra Fashion: Você compra Básicos vs "Trend" Sazonal (Coleção)
  const [percBasicos, setPercBasicos] = useState(40); // 40% T-Shirt preta lisa/Jeans standard
  // O resto é Sazonalidade (cores neons do verão, lã do inverno) que apodrecem

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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
          <CalendarHeart size={24} color="#a855f7" /> Sazonalidade (O Risco da Tendência)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <CalendarHeart size={64} color="#a855f7" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Comprando Neve num Sol de 30°C</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Roupas de "Modinha/Coleção" vencem igual leite. Se Janeiro acabar e você tiver lotado a loja de roupa Neon de Réveillon, você perdeu seu capital investido nelas. <br/><br/>
             Qual a % do seu dinheiro no mês deve ser injetada em <strong>Peças Básicas de Risco Zero</strong> e o quanto deve estar exposto às perigosas (mas lucrativas) <strong>Roupas de Tendência (Trend)</strong>?
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#9333ea', borderColor: '#7e22ce' }}>
            Acessar Prancheta Curva ABC
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#a855f7' }}>📊 Divisão de Capital de Compra</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                   <span style={{ fontWeight: 'bold' }}><Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Tráfego Seguro (Básicos)</span>
                   <span style={{ fontWeight: 'bold' }}>{percBasicos}% do Cofre</span>
                 </label>
                 <input type="range" min="10" max="90" value={percBasicos} onChange={(e) => setPercBasicos(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Básicos vendem o ano inteiro, não precisam de liquidação. Margem e giro baixos porém constantes.</p>
               </div>

               <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f59e0b' }}>
                   <span style={{ fontWeight: 'bold' }}><Zap size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Risco Selvagem (Coleção/Estação)</span>
                   <span style={{ fontWeight: 'bold' }}>{100 - percBasicos}% do Cofre</span>
                 </label>
                 <input type="range" min="10" max="90" value={100 - percBasicos} readOnly style={{ width: '100%', accentColor: '#f59e0b', opacity: 0.6 }} />
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gera Desejo MÁXIMO, atrai o cliente na vitrine. Mas se o influenciador achar feio amanhã, você se queima liquidando no custo.</p>
               </div>

             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: percBasicos < 25 ? 'rgba(239, 68, 68, 0.4)' : (percBasicos > 70 ? 'rgba(59, 130, 246, 0.4)' : '#a855f7'), borderWidth: '2px', position: 'relative', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem', zIndex: 2 }}>Diagnóstico Colecional</h3>
                
                {percBasicos < 25 ? (
                   <div style={{ color: '#ef4444', animation: 'fade-in 0.3s' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Especulador Suicida</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Você amarrou mais de {(100 - percBasicos)}% do caixa em modinhas. Um mês de erro do estilista e você está quebrado e lotado de encalhe.</p>
                   </div>
                ) : percBasicos > 70 ? (
                   <div style={{ color: '#3b82f6', animation: 'fade-in 0.3s' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>O Tédio Varejista</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sua loja é um mar de camisetas brancas. {percBasicos}% estão seguros, mas sua vitrine é monótona. Ninguém para na frente da loja por "impulso emocional".</p>
                   </div>
                ) : (
                   <div style={{ color: '#10b981', animation: 'fade-in 0.3s' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Portfólio Milionário</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Os {(100 - percBasicos)}% atraem os olhos gritando na vitrine, e os fortes {percBasicos}% de básicos garantem a sobrevivência fria pagando as contas. Parabéns!</p>
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
