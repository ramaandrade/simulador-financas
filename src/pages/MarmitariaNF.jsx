import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function MarmitariaNF() {
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
          <FileText size={24} /> Lousa do Professor
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Exemplo de Apuração (Créditos/Débitos)</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Esquema Tributário: Notas Fiscais
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Dinâmica de incidência de ICMS e IPI na Compra e Venda.
        </p>

        <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'inline-block', maxWidth: '100%' }}>
          <img src="/exemplo-impostos.png" alt="Resolução do Exercício de Impostos" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '900px' }} />
        </div>
      </div>
    </div>
  );
}
