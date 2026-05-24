import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function MarmitariaExercicios() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/custos')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar para Custos
          </button>
        </div>
        <div className="navbar-brand">
          <BookOpen size={24} /> Lousa do Professor
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Exercícios Resolvidos</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Exercícios Práticos: Entendendo a Recuperação de Impostos
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>
          O que muda o jogo é entender os regimes tributários. A regra de ouro é: <strong>Imposto recuperável não entra no custo. Imposto não recuperável entra no custo.</strong>
        </p>

        {/* Situação 1 */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #6366f1' }}>
           <h3 style={{ color: '#818cf8', marginBottom: '1rem', fontSize: '1.5rem' }}>Situação 1 – Indústria vendendo para Comércio</h3>
           <ul style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>Não é contribuinte de IPI</strong> → IPI <strong>não é recuperável</strong> → entra no custo.</li>
              <li><strong>É contribuinte de ICMS</strong> (regime normal) → ICMS é <strong>recuperável</strong> → não entra no custo.</li>
           </ul>
           <div style={{ fontSize: '1.125rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>M.P (Sem IPI): <span style={{ color: '#fff', fontWeight: 600 }}>R$ 3.000,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>+ IPI (20%): <span style={{ color: '#fff', fontWeight: 600 }}>R$ 600,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total da NF: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 3.600,00</span></div>
                <div style={{ color: 'var(--text-muted)' }}>ICMS Embutido: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 300,00</span></div>
              </div>
              <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Cálculo do Custo de Aquisição:</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                   NF (3.600) - ICMS Recuperável (300) = 3.300
                </div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.5rem' }}>Custo Final: R$ 3.300,00</div>
              </div>
           </div>
        </div>

        {/* Situação 2 */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #14b8a6' }}>
           <h3 style={{ color: '#5eead4', marginBottom: '1rem', fontSize: '1.5rem' }}>Situação 2 – Indústria vendendo para Indústria</h3>
           <ul style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>Contribuinte de IPI</strong> → IPI é <strong>recuperável</strong> → não entra no custo.</li>
              <li><strong>Contribuinte de ICMS</strong> → ICMS é <strong>recuperável</strong> → não entra no custo.</li>
           </ul>
           <div style={{ fontSize: '1.125rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>M.P (Sem IPI): <span style={{ color: '#fff', fontWeight: 600 }}>R$ 3.000,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>+ IPI (20%): <span style={{ color: '#fff', fontWeight: 600 }}>R$ 600,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total da NF: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 3.600,00</span></div>
                <div style={{ color: 'var(--text-muted)' }}>ICMS Embutido: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 300,00</span></div>
              </div>
              <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Cálculo do Custo de Aquisição:</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                   NF (3.600) - ICMS Rec. (300) - IPI Rec. (600) = 2.700
                </div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.5rem' }}>Custo Final: R$ 2.700,00</div>
              </div>
           </div>
        </div>

        {/* Situação 3 */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #f59e0b' }}>
           <h3 style={{ color: '#fcd34d', marginBottom: '1rem', fontSize: '1.5rem' }}>Situação 3 – Aquisição de insumos (Lucro Real)</h3>
           <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Empresa industrial, regime <strong>não cumulativo</strong> de PIS/COFINS. O IPI recuperável <strong>não integra o custo base</strong> para gerar crédito de PIS/COFINS.</p>
           <div style={{ fontSize: '1.125rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Matéria-Prima: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 10.000,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>IPI (Recuperável): <span style={{ color: '#fff', fontWeight: 600 }}>R$ 500,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ICMS Destacado: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 1.700,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PIS a compensar: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 165,00 (1,65%)</span></div>
                <div style={{ color: 'var(--text-muted)' }}>COFINS a compensar: <span style={{ color: '#fff', fontWeight: 600 }}>R$ 760,00 (7,6%)</span></div>
              </div>
              <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Deduções da Matéria-Prima:</div>
                <div style={{ fontFamily: 'monospace', marginBottom: '0.25rem' }}>M.P (10.000)</div>
                <div style={{ fontFamily: 'monospace', marginBottom: '0.25rem' }}>(-) ICMS Rec. (1.700)</div>
                <div style={{ fontFamily: 'monospace', marginBottom: '0.25rem' }}>(-) PIS Rec. (165)</div>
                <div style={{ fontFamily: 'monospace', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>(-) COFINS Rec. (760)</div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.5rem' }}>Custo Efetivo: R$ 7.375,00</div>
              </div>
           </div>
        </div>

        {/* Situação 4 */}
        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '1rem', borderLeft: '4px solid #ef4444' }}>
           <h3 style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '1.5rem' }}>Situação 4 – Custo unitário com rateio de Frete</h3>
           <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>IPI (10%) e ICMS (17%) são <strong>recuperáveis</strong> (ignorados no custo). O <strong>Frete de Compras (R$ 80,00) entra no custo</strong> e deve ser rateado proporcionalmente ao valor das mercadorias.</p>
           <div style={{ fontSize: '1.125rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>Produto A (10 un) = R$ 1.850,00</div>
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem' }}>Produto B (15 un) = R$ 2.230,00</div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Mercadorias = <span style={{ color: '#fff', fontWeight: 600 }}>R$ 4.080,00</span></div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Peso do A: 1.850 / 4.080 = <span style={{ color: '#fff', fontWeight: 600 }}>45,34%</span></div>
                <div style={{ color: 'var(--text-muted)' }}>Peso do B: 2.230 / 4.080 = <span style={{ color: '#fff', fontWeight: 600 }}>54,66%</span></div>
              </div>
              <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Rateio do Frete (R$ 80):</div>
                <div style={{ fontFamily: 'monospace', marginBottom: '0.25rem' }}>Frete A: 80 × 45,34% = R$ 36,27</div>
                <div style={{ fontFamily: 'monospace', marginBottom: '1.5rem' }}>Frete B: 80 × 54,66% = R$ 43,73</div>
                
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Custo Unitário Final:</div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Produto A: (1.850 + 36,27) ÷ 10 = R$ 188,63/un</div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.25rem' }}>Produto B: (2.230 + 43,73) ÷ 15 = R$ 151,58/un</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
