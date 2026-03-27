import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, ChefHat, Package, DollarSign, Calculator, Info, CheckCircle2 } from 'lucide-react';
import ChatIA from '../components/ChatIA';

const SUGGESTED_DATA = {
  // Variáveis (por marmita)
  arroz: { name: 'Arroz (porção)', value: 1.50, type: 'variable', selected: false, icon: '🍚' },
  feijao: { name: 'Feijão (porção)', value: 1.20, type: 'variable', selected: false, icon: '🫘' },
  carne: { name: 'Carne (porção)', value: 4.50, type: 'variable', selected: false, icon: '🥩' },
  salada: { name: 'Salada', value: 0.80, type: 'variable', selected: false, icon: '🥗' },
  embalagem: { name: 'Embalagem de Alumínio', value: 1.00, type: 'variable', selected: false, icon: '📦' },
  
  // Fixos (Mensais)
  aluguel: { name: 'Aluguel da Cozinha', value: 1200.00, type: 'fixed', selected: false, icon: '🏠' },
  salario: { name: 'Salário Cozinheiro', value: 1800.00, type: 'fixed', selected: false, icon: '👨‍🍳' },
  energia: { name: 'Energia Elétrica', value: 300.00, type: 'fixed', selected: false, icon: '⚡' },
  
  // Despesas (Mensais)
  marketing: { name: 'Instagram Ads', value: 150.00, type: 'expense', selected: false, icon: '📱' },
  contador: { name: 'Assessoria Contábil', value: 250.00, type: 'expense', selected: false, icon: '📊' }
};

export default function Marmitaria() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0: Config, 1: Cozinha, 2: Relatório
  const [mode, setMode] = useState(''); // 'suggested' or 'manual'
  
  const [items, setItems] = useState({});
  const [producaoEstimada, setProducaoEstimada] = useState(1000); // marmitas por mês

  const startSimulation = (selectedMode) => {
    setMode(selectedMode);
    const initialData = JSON.parse(JSON.stringify(SUGGESTED_DATA));
    
    if (selectedMode === 'suggested') {
      // Já marca todos os insumos como selecionados por padrão
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

  const toggleItem = (key) => {
    setItems(prev => ({
      ...prev,
      [key]: { ...prev[key], selected: !prev[key].selected }
    }));
  };

  const updateItemValue = (key, val) => {
    // Mantemos a string bruta digitada para que o React não apague a vírgula imediatamente:
    const parsedVal = parseFloat(val.replace(',', '.')) || 0;
    
    setItems(prev => ({
      ...prev,
      [key]: { 
        ...prev[key], 
        value: val, // Salva o texto exato que o aluno está digitando
        // Auto-seleciona se o valor for numérico > 0
        selected: parsedVal > 0 ? true : prev[key].selected
      }
    }));
  };

  const calculateResults = () => {
    let custosVariaveis = 0; // por unidade
    let custosFixos = 0; // total mensal
    let despesas = 0; // total mensal

    Object.values(items).forEach(item => {
      if (item.selected) {
        // Converte e extrai o valor real seja string do modo manual ou número do modo sugerido
        const numericVal = typeof item.value === 'string' 
            ? (parseFloat(item.value.replace(',', '.')) || 0) 
            : item.value;
            
        if (item.type === 'variable') custosVariaveis += numericVal;
        if (item.type === 'fixed') custosFixos += numericVal;
        if (item.type === 'expense') despesas += numericVal;
      }
    });

    const custoFixoPorUnidade = producaoEstimada > 0 ? custosFixos / producaoEstimada : 0;
    const despesaPorUnidade = producaoEstimada > 0 ? despesas / producaoEstimada : 0;
    const custoTotalUnitario = custosVariaveis + custoFixoPorUnidade + despesaPorUnidade;

    return { custosVariaveis, custosFixos, despesas, custoTotalUnitario };
  };

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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
          <ChefHat size={24} /> Simulador Marmitaria
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: Produção</div>
      </nav>

      {/* STEP 0: Configuração */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Bem-vindo à sua nova Marmitaria!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.125rem' }}>
            Para começarmos a consultoria, como você deseja inserir os dados financeiros dos elementos da sua empresa?
          </p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div 
              className="module-card" 
              style={{ width: '300px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)' }}
              onClick={() => startSimulation('suggested')}
            >
              <div className="module-card-content" style={{ alignItems: 'center', textAlign: 'center' }}>
                <Calculator size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3>Valores Sugeridos</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  O aplicativo preenche automaticamente com valores médios de mercado para facilitar a sua simulação visual.
                </p>
              </div>
            </div>

            <div 
              className="module-card" 
              style={{ width: '300px' }}
              onClick={() => startSimulation('manual')}
            >
              <div className="module-card-content" style={{ alignItems: 'center', textAlign: 'center' }}>
                <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3>Inserção Manual</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  Você pesquisa e digita os valores de cada ingrediente e custo para testar cenários reais locais.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: A Cozinha Visual */}
      {step === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChefHat color="var(--primary)" /> Selecione os Elementos da Marmita e do Negócio
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Clique nos cartões para incluir o elemento na simulação da sua empresa.</p>
              </div>
              
              <div style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <label style={{ fontWeight: 500 }}>Produção Mensal Estimada:</label>
                 <input 
                   type="number" 
                   className="input-field" 
                   style={{ width: '120px', padding: '0.5rem' }} 
                   value={producaoEstimada}
                   onChange={e => setProducaoEstimada(parseInt(e.target.value) || 0)}
                 />
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>marmitas</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(items).map(([key, item]) => (
              <div 
                key={key}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  border: item.selected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: item.selected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onClick={() => toggleItem(key)}
              >
                {item.selected && <CheckCircle2 size={24} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />}
                
                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>{item.icon}</div>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>{item.name}</h4>
                
                <div onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
                  {mode === 'manual' ? (
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
                  ) : (
                    <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--success)', fontSize: '1.1rem' }}>
                      {formatCurrency(item.value)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 400 }}>
                        {item.type === 'variable' ? 'por marmita' : 'por mês'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setStep(2)} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Processar Simulação Visual <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }}/>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Relatório Final */}
      {step === 2 && (
         <div className="animate-fade-in">
           {(() => {
             const results = calculateResults();
             return (
               <>
                 <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                   <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Diagnóstico do Consultor</h2>
                   <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                     Veja como o aplicativo classificou os elementos que você escolheu na cozinha.
                   </p>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Variáveis */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🥑</span> Custos Variáveis
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Gastos que aumentam ou diminuem proporcionalmente ao número de marmitas produzidas. Ocorre "dentro da marmita".
                      </p>
                      <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                        {Object.values(items).filter(i => i.selected && i.type === 'variable').map((i, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                            <span>{i.icon} {i.name}</span>
                            <span style={{ fontWeight: 500 }}>{formatCurrency(i.value)}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.25rem', color: 'var(--warning)' }}>
                        TOTAL: {formatCurrency(results.custosVariaveis)} / uni
                      </div>
                    </div>

                    {/* Fixos */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🏠</span> Custos Fixos
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Gastos para manter a cozinha funcionando, independente se vender 1 ou 1000 marmitas no mês.
                      </p>
                      <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                        {Object.values(items).filter(i => i.selected && i.type === 'fixed').map((i, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                            <span>{i.icon} {i.name}</span>
                            <span style={{ fontWeight: 500 }}>{formatCurrency(i.value)}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        TOTAL: {formatCurrency(results.custosFixos)} / mês
                      </div>
                    </div>

                    {/* Despesas */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>💼</span> Despesas
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Gastos com a parte administrativa/vendas do negócio, que não estão ligados diretamente à montagem da marmita.
                      </p>
                      <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                        {Object.values(items).filter(i => i.selected && i.type === 'expense').map((i, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                            <span>{i.icon} {i.name}</span>
                            <span style={{ fontWeight: 500 }}>{formatCurrency(i.value)}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.25rem', color: 'var(--danger)' }}>
                        TOTAL: {formatCurrency(results.despesas)} / mês
                      </div>
                    </div>
                 </div>

                 {/* Custo de 1 Marmita */}
                 <div className="glass-panel" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'var(--success)', padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Custo Real de 1 Marmita</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                      Baseado na sua produção de {producaoEstimada} marmitas/mês, os gastos fixos e despesas foram diluídos no custo unitário.
                    </p>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--success)', textShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}>
                      {formatCurrency(results.custoTotalUnitario)}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
                         <strong>Variável Direto:</strong> {formatCurrency(results.custosVariaveis)}
                      </div>
                      <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
                         <strong>Fatores Fixos Rateados:</strong> {formatCurrency(results.custoTotalUnitario - results.custosVariaveis)}
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
