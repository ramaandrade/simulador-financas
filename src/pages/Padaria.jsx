import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Wheat, Package, DollarSign, Calculator, Info, CheckCircle2, TrendingUp } from 'lucide-react';
import ChatIA from '../components/ChatIA';

const SUGGESTED_DATA = {
  // Variáveis (por unidade/pãozinho assumido num lote, ou totais diluídos)
  // Como a padaria faz 10.000 pães, vamos colocar os Valores Mensais Sugeridos Totais, igual na Marmitaria
  farinha: { name: 'Farinha de Trigo (Kg)', type: 'variable', value: 3500, selected: false, help: 'O trigo é o coração do pão. Mais pães vendidos = mais trigo comprado.' },
  fermento: { name: 'Fermento (Massa)', type: 'variable', value: 800, selected: false, help: 'Aumenta junto com a farinha na mesma proporção da produção.' },
  acucar: { name: 'Açúcar, Sal e Óleo', type: 'variable', value: 600, selected: false, help: 'Ingredientes marginais que flutuam com a batelada.' },
  embalagem: { name: 'Sacos de Papel Pardo', type: 'variable', value: 400, selected: false, help: 'Saco de pão entregue ao cliente. Custo direto por venda.' },
  
  // Fixos (mensal)
  aluguel: { name: 'Aluguel do Ponto comercial', type: 'fixed', value: 3500, selected: false, help: 'Valor inalterável quer venda 1 pão ou 10 mil pães.' },
  salarioPadeiro: { name: 'Salário do Mestre Padeiro', type: 'fixed', value: 3200, selected: false, help: 'A mão de obra essencial para abrir o forno pela manhã.' },
  energia: { name: 'Energia Elétrica (Fornos)', type: 'fixed', value: 1800, selected: false, help: 'Na panificação, a energia dos fornos lastro frequentemente estabiliza num platô como custo estrutural.' },
  
  // Despesas (mensal)
  marketing: { name: 'Marketing (Folhetos)', type: 'expense', value: 600, selected: false, help: 'Despesa para trazer pessoas à padaria, não pra assar o pão.' },
  contador: { name: 'Contabilidade', type: 'expense', value: 450, selected: false, help: 'Despesa administrativa obrigatória.' }
};

export default function Padaria() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0 = Setup, 1 = Cozinha/Forno, 2 = Relatório Final
  const [step, setStep] = useState(0);
  const [items, setItems] = useState({});
  const [producaoEstimada, setProducaoEstimada] = useState(10000); // 10.000 pães por mês (aprox. 330 pães/dia)
  const [mode, setMode] = useState(null); // 'suggested' ou 'manual'

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const updateItemValue = (key, val) => {
    const parsedVal = parseFloat(val.replace(',', '.')) || 0;
    
    setItems(prev => ({
      ...prev,
      [key]: { 
        ...prev[key], 
        value: val,
        selected: parsedVal > 0 ? true : prev[key].selected
      }
    }));
  };

  const toggleItem = (key) => {
    setItems(prev => ({
      ...prev,
      [key]: { ...prev[key], selected: !prev[key].selected }
    }));
  };

  const beginSimulation = (selectedMode) => {
    setMode(selectedMode);
    const initialData = JSON.parse(JSON.stringify(SUGGESTED_DATA));
    
    if (selectedMode === 'suggested') {
      // Já marca todos os insumos como selecionados por padrão no modo Sugerido 
      Object.keys(initialData).forEach(k => initialData[k].selected = true);
      setItems(initialData);
    } else {
      Object.keys(initialData).forEach(k => {
        initialData[k].value = 0;
        initialData[k].selected = false;
      });
      setItems(initialData);
    }
    setStep(1);
  };

  const calculateResults = () => {
    let custosVariaveis = 0; 
    let custosFixos = 0; 
    let despesas = 0; 

    Object.values(items).forEach(item => {
      if (item.selected) {
        const numericVal = typeof item.value === 'string' 
            ? (parseFloat(item.value.replace(',', '.')) || 0) 
            : item.value;
            
        if (item.type === 'variable') custosVariaveis += numericVal;
        if (item.type === 'fixed') custosFixos += numericVal;
        if (item.type === 'expense') despesas += numericVal;
      }
    });

    // Como são definidos mensalmente no objeto, o custo unitário é diluído na produção
    const customUnitarioRateado = (custosVariaveis + custosFixos + despesas) / producaoEstimada;
    
    return {
      variavelPorPao: custosVariaveis / producaoEstimada, // Apenas material direto
      fixoMensal: custosFixos,
      despesaMensal: despesas,
      custoUnitarioTotal: customUnitarioRateado
    };
  };

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
          <Wheat size={24} /> Padaria da Esquina
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <label htmlFor="producao" style={{ fontSize: '0.875rem' }}>Produção mensal (pães):</label>
          <input 
            id="producao"
            type="number"
            min="1"
            value={producaoEstimada}
            onChange={(e) => setProducaoEstimada(Number(e.target.value) || 1)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid var(--border-color)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem',
              width: '100px',
              textAlign: 'right'
            }}
            title="Altere a produção para ver como afeta a diluição dos custos fixos"
          />
        </div>
      </nav>

      {step === 0 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
          <Wheat size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Parametrização Inicial da Padaria</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', textAlign: 'center' }}>
            Nesta simulação vamos calcular o verdadeiro custo de cada pãozinho francês saindo do forno num lote de 10 mil unidades. Você deseja utilizar nossos dados regionais ou usar pesquisa própria?
          </p>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
             <div className="module-card glass-panel" style={{ width: '300px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => beginSimulation('suggested')}>
                <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                  <TrendingUp size={32} color="var(--success)" />
                </div>
                <h3>Dados Reais Sugeridos</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Usar custos médios de ingredientes (farinha por R$ 3.500/mês) e aluguéis baseados na sua região acadêmica.
                </p>
             </div>

             <div className="module-card glass-panel" style={{ width: '300px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => beginSimulation('manual')}>
                <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                  <Calculator size={32} color="var(--primary)" />
                </div>
                <h3>Pesquisa de Campo Própria</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Você irá inserir manualmente o preço de cada saco de trigo, salário e aluguel baseado na sua própria pesquisa.
                </p>
             </div>
          </div>
        </div>
      )}

      {step === 1 && (
         <div className="animate-fade-in">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Os Bastidores da Panificação</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                  No modo <strong>{mode === 'manual' ? 'Manual' : 'Sugerido'}</strong>, clique nos insumos operacionais que desejar para adquirir (marcar item) e simular a produção no final do mês.
                </p>
             </div>
             <button className="btn-primary" onClick={() => setStep(2)}>
               Assar Pães & Calcular <ArrowLeft size={16} style={{ rotate: '180deg' }} />
             </button>
           </div>

           <div className="card-grid">
             {Object.entries(items).map(([key, item]) => (
                <div 
                  key={key}
                  className="glass-panel"
                  style={{ 
                    padding: '1.5rem', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: item.selected ? '2px solid var(--primary)' : '2px solid transparent',
                    background: item.selected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)'
                  }}
                  onClick={() => toggleItem(key)}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <div style={{ padding: '0.75rem', background: 'var(--bg-darker)', borderRadius: '1rem' }}>
                       {item.type === 'variable' && <Package size={24} color="var(--success)" />}
                       {item.type === 'fixed' && <Home size={24} color="var(--primary)" />}
                       {item.type === 'expense' && <DollarSign size={24} color="var(--warning)" />}
                     </div>
                     {item.selected ? <CheckCircle2 size={24} color="var(--primary)" /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-color)' }}></div>}
                   </div>

                   <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                   
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem', minHeight: '40px' }}>
                     {item.help}
                   </p>

                   {mode === 'manual' ? (
                     <div onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
                       <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Gasto (Mensal):</label>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <span style={{ color: 'var(--text-muted)' }}>R$</span>
                         <input 
                           type="text" 
                           className="input-field"
                           style={{ padding: '0.5rem', textAlign: 'right' }}
                           value={(item.value === 0 || item.value === '0') ? '' : item.value}
                           onChange={e => updateItemValue(key, e.target.value)}
                           placeholder="0,00"
                         />
                       </div>
                     </div>
                   ) : (
                     <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--primary)', fontSize: '1.1rem' }}>
                       {formatCurrency(item.value)} / mês
                     </div>
                   )}
                </div>
             ))}
           </div>
         </div>
      )}

      {step === 2 && (
         <div className="animate-fade-in glass-panel" style={{ padding: '3rem' }}>
           <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: 'var(--primary)' }}>Diagnóstico Final do Pãozinho</h2>
           <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.125rem' }}>
             O algoritmo da Inteligência Acadêmica processou todos os custos selecionados da padaria.
           </p>

           {(() => {
             const { variavelPorPao, fixoMensal, despesaMensal, custoUnitarioTotal } = calculateResults();
             
             return (
               <>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                   {/* Card Variável */}
                   <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--success)' }}>
                     <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                       <Package color="var(--success)" /> Custos Variáveis
                     </h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                       Trigo, fermento, sacos. Diluídos na batelada.
                     </p>
                     <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: 'auto' }}>
                       CUSTO: {formatCurrency(variavelPorPao)} / unidade
                     </div>
                   </div>

                   {/* Card Fixos */}
                   <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                     <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                       <Home color="var(--primary)" /> Custos Fixos
                     </h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                       Gastos para manter o forno ligado (aluguel, salário).
                     </p>
                     <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: 'auto' }}>
                       CUSTO: {formatCurrency(fixoMensal)} / mês
                     </div>
                   </div>

                   {/* Card Despesas */}
                   <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--danger)' }}>
                     <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                       <DollarSign color="var(--danger)" /> Despesas
                     </h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                       Apoio aos negócios, como o contador do balcão.
                     </p>
                     <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)', marginTop: 'auto' }}>
                       CUSTO: {formatCurrency(despesaMensal)} / mês
                     </div>
                   </div>
                 </div>

                 {/* Ultimate Custo Unitário */}
                 <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '1rem', padding: '3rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Custo Real Diluído de 1 Pão Francês</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                      Baseado na sua produção de {new Intl.NumberFormat('pt-BR').format(producaoEstimada)} pães/mês, se todos os fatores fixos estruturais recaírem sobre eles:
                    </p>
                    <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--success)', textShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
                      {formatCurrency(custoUnitarioTotal)}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                       <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', borderRadius: '2rem', fontSize: '0.875rem' }}>
                         Ingredientes do Pão: {formatCurrency(variavelPorPao)}
                       </div>
                       <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', borderRadius: '2rem', fontSize: '0.875rem' }}>
                         Rateio Estrutural: {formatCurrency(custoUnitarioTotal - variavelPorPao)}
                       </div>
                    </div>
                 </div>
               </>
             )
           })()}
         </div>
      )}

      {/* Agent Chat Widget */}
      <ChatIA />
    </div>
  );
}
