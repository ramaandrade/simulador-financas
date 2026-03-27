import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, TrendingUp, Target, DollarSign, Activity, ArrowRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaPlanejamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução, 1: Laboratório Gráfico
  const [step, setStep] = useState(0);

  // Estados Financeiros do Aluno
  const [receitaBase, setReceitaBase] = useState(15000);
  const [custoBase, setCustoBase] = useState(11000);
  
  // Metas de Modulação (%)
  const [metaCrescimento, setMetaCrescimento] = useState(10); // Crescimento de faturamento ao mês
  const [inflacaoCustos, setInflacaoCustos] = useState(3); // Aumento de custos ao mês
  const [variacaoDolar, setVariacaoDolar] = useState(0); // Projeção da variação cambial ao mês

  const formatCurrencyCompact = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Lógica Matemática de Projeção de 6 Meses (Juros Compostos)
  const projection = useMemo(() => {
    let currentReceita = typeof receitaBase === 'number' ? receitaBase : (Number(receitaBase) || 0);
    let currentCusto = typeof custoBase === 'number' ? custoBase : (Number(custoBase) || 0);
    
    const maxMeses = 6;
    let saldos = [];
    
    let maxValue = currentReceita; // Para dimensionar a altura do CSS Graph

    for (let i = 1; i <= maxMeses; i++) {
       // O mês 1 é o que ele acabou de fechar, já com a aplicação do 1º crescimento esperado
       const fatorCustoTotal = (inflacaoCustos / 100) + (variacaoDolar / 100);
       
       currentReceita = currentReceita * (1 + (metaCrescimento / 100));
       currentCusto = currentCusto * (1 + fatorCustoTotal);
       
       const lucro = currentReceita - currentCusto;

       if (currentReceita > maxValue) maxValue = currentReceita;
       if (currentCusto > maxValue) maxValue = currentCusto;

       saldos.push({
         mes: `Mês ${i}`,
         receita: currentReceita,
         custo: currentCusto,
         lucro: lucro
       });
    }

    // Calcula Acumulado Total do Semestre
    const lucroAcumulado = saldos.reduce((acc, curr) => acc + curr.lucro, 0);

    return { saldos, maxValue, lucroAcumulado };
  }, [receitaBase, custoBase, metaCrescimento, inflacaoCustos, variacaoDolar]);

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
          <TrendingUp size={24} color="#a855f7" /> Consultoria de Planejamento de Metas
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRODUÇÃO TEÓRICA */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Target size={64} color="#a855f7" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Como dobrar o tamanho da sua marmitaria?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Até agora nós estivemos apagando incêndios analisando o Presente da sua empresa. Mas para um negócio se sustentar, o dono precisa criar uma meta agressiva e traçar um orçamento para o semestre.
             <br /><br />
             Se você crescer suas vendas em <strong>15% ao mês</strong> (agregando clientes fixos), qual será o impacto nos seus custos e ingredientes? Nós vamos criar um Raio-X matemático de orçamentos calculando os <strong>Juros Compostos da sua gestão</strong> nos próximos 6 meses.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#a855f7', borderColor: '#9333ea' }}>
            Iniciar Simulador de Futuro <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {/* STEP 1: CALCULADORA ORÇAMENTÁRIA + GRÁFICO DINÂMICO CSS */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* CONTROLES TOP BAR */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Realidade Atual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid var(--border-color)', paddingRight: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>1. O Seu Presente</h3>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Faturamento Atual do Mês (R$)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={receitaBase} 
                  onChange={e => setReceitaBase(Number(e.target.value) || 0)}
                  style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Gasto Atual do Mês (Fixos + Insumos)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={custoBase} 
                  onChange={e => setCustoBase(Number(e.target.value) || 0)}
                  style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--danger)' }}
                />
              </div>
            </div>

            {/* O Futuro (Target) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. A Sua Tática de Expansão</h3>
              
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#a855f7', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span>Meta Tática de Crescimento (%) ao Mês</span>
                  <span>{metaCrescimento}%</span>
                </label>
                <input type="range" min="-10" max="50" value={metaCrescimento} onChange={e => setMetaCrescimento(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Quantos novos clientes você vai captar religiosamente a cada ciclo de 30 dias.</p>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--warning)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span>Inflação Externa dos Custos (%) ao Mês</span>
                  <span>{inflacaoCustos}%</span>
                </label>
                <input type="range" min="0" max="25" value={inflacaoCustos} onChange={e => setInflacaoCustos(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--warning)' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Aumentos sistêmicos de Aluguel, Feira, Gás e etc na sua área.</p>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span>Alta do Dólar / Câmbio (%) ao Mês</span>
                  <span>{variacaoDolar}%</span>
                </label>
                <input type="range" min="-10" max="30" value={variacaoDolar} onChange={e => setVariacaoDolar(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>O Brasil depende de insumos atrelados ao Câmbio (Trigo, Combustível). Esmaga a sua margem em cascata.</p>
              </div>
            </div>

          </div>

          {/* ÁREA GRÁFICA INFERIOR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
             
             {/* PURE CSS CHART */}
             <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={20} color="#a855f7" /> Mapa do Acúmulo Semestral
                </h2>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
                  
                  {projection.saldos.map((mesProj, index) => {
                    // Calculando proporção em %. Se maxValue for <= 0 previne NaN
                    const minGraphAllowed = projection.maxValue <= 0 ? 1 : projection.maxValue;
                    
                    const heightReceita = Math.max((mesProj.receita / minGraphAllowed) * 100, 0);
                    const heightCusto = Math.max((mesProj.custo / minGraphAllowed) * 100, 0);

                    return (
                       <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                         
                         {/* Barras do Mês (Overlaid) */}
                         <div style={{ width: '100%', height: '240px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                           
                           {/* A barra que for maior fica por trás para a outra não sumir */}
                           <div style={{ 
                             position: 'absolute', 
                             bottom: 0, 
                             width: '60%', 
                             height: `${heightReceita}%`, 
                             background: 'rgba(56, 189, 248, 0.4)', // Azul claro para receita
                             borderTop: '2px solid #38bdf8',
                             borderTopLeftRadius: '4px',
                             borderTopRightRadius: '4px',
                             transition: 'height 0.3s ease-out',
                             zIndex: mesProj.receita >= mesProj.custo ? 1 : 2
                           }} title={`Receita Projetada: ${formatCurrency(mesProj.receita)}`} />
                           
                           <div style={{ 
                             position: 'absolute', 
                             bottom: 0, 
                             width: '40%', 
                             height: `${heightCusto}%`, 
                             background: 'rgba(239, 68, 68, 0.6)', // Vermelho para custo
                             borderTop: '2px solid #ef4444',
                             borderTopLeftRadius: '4px',
                             borderTopRightRadius: '4px',
                             transition: 'height 0.3s ease-out',
                             zIndex: mesProj.custo >= mesProj.receita ? 1 : 2
                           }} title={`Custo Projetado: ${formatCurrency(mesProj.custo)}`} />

                         </div>

                         <div style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{mesProj.mes}</div>
                         <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: mesProj.lucro >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 800 }}>
                           {mesProj.lucro >= 0 ? '+' : ''}{formatCurrencyCompact(mesProj.lucro)}
                         </div>
                       </div>
                    );
                  })}
                  
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#38bdf8' }}></div> Faturamento Crescente</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#ef4444' }}></div> Inflação de Custos</span>
                </div>
             </div>

             {/* CAIXA DE IMPACTO EXTREMO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '400px' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Saldo Líquido Retido ao Final da Jornada</h3>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <div style={{ padding: '1.5rem', background: 'var(--bg-darker)', borderRadius: '1rem', borderLeft: `6px solid ${projection.lucroAcumulado >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>O Acúmulo de Lucro em 180 Dias:</p>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: projection.lucroAcumulado >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatCurrency(projection.lucroAcumulado)}
                      </div>
                   </div>

                   <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.6 }}>
                      {projection.lucroAcumulado >= 0 
                      ? 'Neste cenário, sua meta cobre o aumento inflacionário do feijão/carne e ainda empilha capital formidável no caixa da empresa pra você poder investir no lugar de sacar.'
                      : 'CENÁRIO CRÍTICO: Percebeu que nesse ritmo de gestão os encargos sobem mais rápido que as suas vendas? Neste ritmo, a marmitaria faliu no semestre e você levou essa dívida enorme pra casa.'}
                   </p>
                </div>
             </div>
             
          </div>

        </div>
      )}

      {/* CHAT IA PARA ESTRUTURA DE METAS! */}
      <ChatIA />
    </div>
  );
}
