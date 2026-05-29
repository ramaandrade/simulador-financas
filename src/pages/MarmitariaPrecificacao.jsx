// v3 - botao metodos precificacao
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, Tag, Calculator, Percent, DollarSign, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaPrecificacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução, 1: Calculadora, 2: Diagnóstico
  const [step, setStep] = useState(0);

  // Estados dos inputs
  const [custoBase, setCustoBase] = useState('12,50');
  const [taxas, setTaxas] = useState('8,00');
  const [margem, setMargem] = useState('25,00');
  
  // Estado de aviso matemático
  const [errorMatematico, setErrorMatematico] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatPercent = (val) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(val / 100);

  const calculateMarkup = () => {
    // Conversão de Strings BR (vírgulas) para Float
    const custoStr = typeof custoBase === 'string' ? custoBase : String(custoBase);
    const taxasStr = typeof taxas === 'string' ? taxas : String(taxas);
    const margemStr = typeof margem === 'string' ? margem : String(margem);
    
    const custoF = parseFloat(custoStr.replace(/\./g, '').replace(',', '.')) || 0;
    const taxasF = parseFloat(taxasStr.replace(/\./g, '').replace(',', '.')) || 0;
    const margemF = parseFloat(margemStr.replace(/\./g, '').replace(',', '.')) || 0;

    // Proteção matemática (sem modificar estado aqui)
    if (taxasF + margemF >= 100) {
      return { error: 'Atenção: É matematicamente impossível ter taxas somadas com a margem maiores ou iguais a 100% de um negócio e cobrar um preço viável.' };
    }

    if (custoF <= 0) {
       return { error: 'O Custo Unitário não pode ser zero.' };
    }

    // O Custo Total da Produção representa X% do preço, onde X = 100% - Taxas - Margem
    const porcentagemCustoNoPrecoVenda = 1 - (taxasF / 100) - (margemF / 100);
    const precoVenda = custoF / porcentagemCustoNoPrecoVenda;
    
    // Decomposição exata do preço de venda final
    const valorImposto = precoVenda * (taxasF / 100);
    const lucroLiquidoReal = precoVenda * (margemF / 100);

    return {
      success: true,
      custoBase: custoF,
      taxaPercentual: taxasF,
      margemPercentual: margemF,
      precoVenda,
      valorImposto,
      lucroLiquidoReal
    };
  };

  const handleCompute = () => {
    const engine = calculateMarkup();
    if (engine.error) {
      setErrorMatematico(engine.error);
    } else {
      setErrorMatematico('');
      setStep(2);
    }
  };

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
          <Tag size={24} color="var(--warning)" /> Consultoria de Precificação
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Módulo: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRO */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Tag size={64} color="var(--warning)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Qual o preço justo de venda da Marmita?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             A maioria dos empreendedores iniciantes cometem um erro fatal: eles pegam o custo da marmita (Ex: R$ 10) e <strong>somam +20%</strong> em cima para ter 20% de margem. Mas no fim do mês eles ficam no negativo ao serem cobrados pelas faturas percentuais do iFood/Cartão de Crédito.
             <br /><br />
             Nesta simulação nós vamos usar a fórmula do <strong>Markup Divisor</strong> para proteger completamente o seu Lucro Desejado.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
            Entrar no Laboratório de Preços <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>

          {/* Botão de estudo complementar */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => navigate('/marmitaria/metodos-precificacao')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(245,158,11,0.12)',
                border: '2px solid rgba(245,158,11,0.4)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.75rem',
                color: '#fbbf24',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
            >
              <BookOpen size={18} />
              📚 Estudar os 8 Métodos de Precificação
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Markup, Mercado, Valor Percebido, Psicológico e mais — com exemplos práticos
            </p>
          </div>
        </div>
      )}

      {/* STEP 1: CALCULADORA INTERATIVA */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Parametrizando o Algoritmo</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
              Baseado no Diagnóstico da sua aula de Custos anterior, preencha a base de gasto e exija de forma absoluta quanto você quer de Margem e quanto a maquininha cobra.
            </p>

            {errorMatematico && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <AlertCircle color="var(--danger)" />
                <span style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>{errorMatematico}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* CUSTO BASE */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                       <Calculator size={18} /> Custo Unitário Descoberto (Em Reais)
                     </label>
                     <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Todo o gasto de matéria-prima e custos fixos proporcionais necessários para uma marmita estar pronta na mesa.</p>
                  </div>
                  <div style={{ width: '200px' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>R$</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={{ paddingLeft: '3rem', fontSize: '1.25rem' }}
                        value={custoBase}
                        onChange={(e) => setCustoBase(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TAXAS E IMPOSTOS */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.5rem' }}>
                       <DollarSign size={18} /> Encargos de Venda (Em %)
                     </label>
                     <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Carga tributária indireta + taxa percentual da Maquininha do Cartão e aplicativos de entrega (iFood).</p>
                  </div>
                  <div style={{ width: '200px' }}>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={{ paddingRight: '2.5rem', fontSize: '1.25rem' }}
                        value={taxas}
                        onChange={(e) => setTaxas(e.target.value)}
                      />
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MARGEM DE LUCRO LÍQUIDO */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
                       <Percent size={18} /> Margem de Lucro Desejada (Em %)
                     </label>
                     <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Quanto VOCÊ exige lucrar com toda essa operação no final das contas como recompensa, em percentual estrito ao final.</p>
                  </div>
                  <div style={{ width: '200px' }}>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={{ paddingRight: '2.5rem', fontSize: '1.25rem', borderColor: 'var(--success)' }}
                        value={margem}
                        onChange={(e) => setMargem(e.target.value)}
                      />
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
             <button className="btn-primary" onClick={handleCompute} style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', width: '100%' }}>
               Computar Estrutura de Preço Markup
             </button>
          </div>
        </div>
      )}

      {/* STEP 2: DIAGNÓSTICO E FATIAMENTO */}
      {step === 2 && (
         <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           {(() => {
             const engine = calculateMarkup();
             if (!engine || engine.error) return null; // Fallback se tiver erro gravissimo q passou validacao
             
             return (
               <>
                 <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)' }}>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Sugerido: O Preço Exato a ser Cobrado do Cliente!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                      Só cobrando religiosamente este valor você consegue bancar o Custo Base, pagar o percentual do Cartão e blindar a sua Margem sem furos matemáticos limitando o negócio. 
                    </p>
                    <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--success)', textShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>
                      {formatCurrency(engine.precoVenda)}
                    </div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem 0' }}>
                   <div style={{ background: 'var(--border-color)', height: '1px', flex: 1 }}></div>
                   <div style={{ padding: '0 2rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>A Anatomia Desse Preço</div>
                   <div style={{ background: 'var(--border-color)', height: '1px', flex: 1 }}></div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
                      <div style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>CUSTOS PRODUTIVOS</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatCurrency(engine.custoBase)}</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Isso é o que vai literalmente consumir todo o esforço de insumos, aluguel e pessoal. É seu compromisso passivo fixo na conta total.
                      </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--danger)' }}>
                      <div style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontWeight: 600 }}>TAXAS E MORDIDAS DA VENDA</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatCurrency(engine.valorImposto)}</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Os exatos {formatPercent(engine.taxaPercentual)} levados perfeitamente em cima dos R$ do Preço Final da marmita gerado (iFood, Imposto Simples).
                      </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--success)' }}>
                      <div style={{ color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 600 }}>LUCRO INTACTO NO BOLSO</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatCurrency(engine.lucroLiquidoReal)}</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Os seus valiosos {formatPercent(engine.margemPercentual)} líquidos salvaguardados de impostos (que os amadores deixam vazar da composição).
                      </p>
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                          onClick={() => navigate('/marmitaria/metodos-precificacao')}
                          style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            background: 'rgba(245,158,11,0.15)',
                            border: '2px solid rgba(245,158,11,0.5)',
                            borderRadius: '0.6rem',
                            padding: '0.75rem 1rem',
                            color: '#fbbf24',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}
                        >
                          <BookOpen size={16} />
                          📚 Ver os 8 Métodos de Precificação
                        </button>
                      </div>
                    </div>
                 </div>
               </>
             )
           })()}
         </div>
      )}

      {/* CHAT IA PARA ESCLARECER DÚVIDAS DO ALUNO! */}
      <ChatIA />
    </div>
  );
}
