import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Tag, ShoppingBag, Scale, Coffee, AlertTriangle } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function PadariaPrecificacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(0);

  // Premissas que vêm da outra tela (aqui o user pode reescrever rápido)
  const [custoKg, setCustoKg] = useState(4.20);     // Custo unitário de extrair o kilo de Pão Francês

  // Markup Comercial (Padaria trabalha com markups pesados no frances +100 a +250%)
  const [markupDesejado, setMarkupDesejado] = useState(150); // % de lucro sobre o custo base

  // Desperdício / Quebra de Balcão (Pão que vira farinha de rosca depois de 2 dias e perde valor)
  const [quebraBalcao, setQuebraBalcao] = useState(10); // 10% do que é feito não é vendido ao preço normal

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos de Precificação do Varejo
  const custoComQuebra = custoKg * (1 + (quebraBalcao / 100));     // Se quebra, o custo de fazer os que sobreviveram é maior
  const precoSugerido = custoComQuebra * (1 + (markupDesejado / 100)); // O que vai pra lousa da padaria
  const lucroPorKg = precoSugerido - custoComQuebra;

  // Como o cliente compra
  const pesoPaoUnidade = 0.050; // 50 gramas por pão
  const precoUnidade = precoSugerido * pesoPaoUnidade;

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
          <Tag size={24} color="#f59e0b" /> Precificação (Tabela da Lousa)
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Tag size={64} color="#f59e0b" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>A Psicologia do Cêntimo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Na padaria, nós precificamos o "Kilo", mas o cliente pesa apenas 5 ou 6 pães na sacola. A padaria fatura moedas de 50 centavos infinitas vezes ao dia. 
             <br /><br />
             Outra coisa que o marmiteiro não tem, e o padadeiro sofre: **"A Quebra de Balcão"**. O pão amanhecido murcha e perde seu valor prime. Portanto, quem paga a conta do pão murcho de ontem é o cliente que compra o pão fresco de hoje.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#d97706', borderColor: '#b45309' }}>
            Formar Preço do Kg na Balança
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#f59e0b' }}>⚖️ Ajustes de Vitrine</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Custo Padrão do KG Sido Assado (R$)</label>
                 <input type="number" className="input-field" value={custoKg} onChange={e => setCustoKg(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef3c7' }} />
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Sem quebra do balcão, a unidade básica de {pesoPaoUnidade * 1000}g sai por: {formatCurrency(custoKg * pesoPaoUnidade)}
                 </div>
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: 'var(--danger)' }}><AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Quebra/Desperdício de Balcão</span>
                   <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{quebraBalcao}% da fornada vai p lixo/torrada</span>
                 </label>
                 <input type="range" min="0" max="30" value={quebraBalcao} onChange={(e) => setQuebraBalcao(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--danger)' }} />
               </div>

               <div>
                 <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ color: '#10b981' }}><ShoppingBag size={16} style={{ display: 'inline', marginRight: '0.5rem' }}/> Margem Target (Markup sobre Custo % )</span>
                   <span style={{ fontWeight: 'bold', color: '#10b981' }}>+ {markupDesejado}%</span>
                 </label>
                 <input type="range" min="50" max="400" step="10" value={markupDesejado} onChange={(e) => setMarkupDesejado(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             
             <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(245, 158, 11, 0.05)', border: '2px solid rgba(245, 158, 11, 0.2)' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Preço de Venda Oficial (Placa da Parede)</h3>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#f59e0b', textShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}>
                   {formatCurrency(precoSugerido)}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/ Kg</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                   Passo 1: {formatCurrency(custoKg)} (Custo Base) + {quebraBalcao}% (Fator Quebra) = {formatCurrency(custoComQuebra)} Custo Agravado<br />
                   Passo 2: {formatCurrency(custoComQuebra)} + {markupDesejado}% (Markup Alvo) = {formatCurrency(precoSugerido)}
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #ef4444' }}>
                <div>
                   <span style={{ color: '#ef4444', fontWeight: 'bold' }}><ShoppingBag size={18} style={{ display: 'inline' }} /> Custo Real de 1 Pão (50g)</span>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sangramento por unidade assada</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                      Fórmula: {formatCurrency(custoComQuebra)} ÷ 1000g × 50g
                   </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444' }}>
                   {formatCurrency((custoComQuebra / 1000) * pesoPaoUnidade * 1000)}
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}><Scale size={18} style={{ display: 'inline' }} /> 1 Unidade Pão Francês (50g)</span>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Média pesada no balcão</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                      Fórmula: {formatCurrency(precoSugerido)} ÷ 1000g × 50g
                   </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>
                   {formatCurrency(precoUnidade)}
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <span style={{ color: '#10b981', fontWeight: 'bold' }}><Coffee size={18} style={{ display: 'inline' }} /> Lucro Puro por Kilo Vendido</span>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Capital para o dono</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                      Fórmula: Preço Final - Custo da Produção Agravado
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>
                      +{formatCurrency(lucroPorKg)}
                   </div>
                   <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold', marginTop: '0.25rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                      (+ {formatCurrency(lucroPorKg * pesoPaoUnidade)} na Unidade)
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
