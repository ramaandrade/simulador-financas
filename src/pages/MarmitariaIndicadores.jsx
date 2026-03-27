import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, BarChart4, Wallet, Activity, Package, Target, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Percent, Crosshair, PieChart, ArrowRight } from 'lucide-react';
import ChatIA from '../components/ChatIA';

export default function MarmitariaIndicadores() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 0: Introdução, 1: Painel do CEO
  const [step, setStep] = useState(0);

  // Estados Base (Inputs do Fechamento Mensal Divididos)
  const [faturamento, setFaturamento] = useState(55000);       // Receita Bruta Total
  const [custosVariaveis, setCustosVariaveis] = useState(27000); // Custos Dinâmicos (Arroz, Ifood, Embalagem)
  const [custosFixos, setCustosFixos] = useState(15000);         // Despesas Duras (Aluguel, Salário, Internet)
  const [entregas, setEntregas] = useState(1500);              // Quantidade de Vendas
  const [investimento, setInvestimento] = useState(80000);     // Patrimônio enterrado lá (Reforma + Equipamentos)

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Motor Matemático Avançado de Indicadores (DRE)
  const kpis = useMemo(() => {
    let fat = typeof faturamento === 'number' ? faturamento : (Number(faturamento) || 0);
    let cv = typeof custosVariaveis === 'number' ? custosVariaveis : (Number(custosVariaveis) || 0);
    let cf = typeof custosFixos === 'number' ? custosFixos : (Number(custosFixos) || 0);
    let ent = typeof entregas === 'number' ? entregas : (Number(entregas) || 0);
    let inv = typeof investimento === 'number' ? investimento : (Number(investimento) || 0);

    // K3: Margem de Contribuição (A força bruta de pagar os boletos do fim do mês)
    const mcReais = fat - cv;
    const mcPerc = fat > 0 ? (mcReais / fat) * 100 : 0;
    
    // K4: Ponto de Equilíbrio em R$ (O quanto precisa vender para empatar o mês 0x0)
    // PE = Custos Fixos / Índice de Margem de Contribuição
    const pontoEquilibrio = (mcPerc > 0) ? (cf / (mcPerc / 100)) : Infinity;

    // K1: Lucro Líquido
    const lucro = mcReais - cf;
    
    // K2: Margem Líquida (%)
    const margem = fat > 0 ? (lucro / fat) * 100 : 0;
    
    // K5: Ticket Médio Institucional
    const ticket = ent > 0 ? (fat / ent) : 0;
    
    // K6: ROIC Mensalizado (%) - Return on Invested Capital
    const roic = inv > 0 ? (lucro / inv) * 100 : 0;

    return {
      lucro,
      margem,
      mcPerc,
      mcReais,
      pontoEquilibrio,
      ticket,
      roic,
      fat
    };
  }, [faturamento, custosVariaveis, custosFixos, entregas, investimento]);

  // Função para retornar Status e Cor dos Badges Baseado no Mercado de Restaurantes
  const getBadge = (metric, value, contextObj = null) => {
    if (metric === 'margem') {
       if (value < 5) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Crítico: Quase no Zero a Zero', icon: <AlertCircle size={16} /> };
       if (value >= 5 && value < 15) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'Atenção: Margem Padrão de iFood', icon: <Activity size={16} /> };
       return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Excelente: Altamente Lucrativo', icon: <CheckCircle size={16} /> };
    }
    
    if (metric === 'roic') {
       if (value < 1) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Péssimo Atrativo para Sócios', icon: <TrendingDown size={16} /> };
       if (value >= 1 && value < 3.5) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'Saudável: Batendo a Renda Fixa', icon: <TrendingUp size={16} /> };
       return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Excepcional: Retorno Rápido', icon: <CheckCircle size={16} /> };
    }

    if (metric === 'lucro') {
       if (value < 0) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Operando no Prejuízo', icon: <TrendingDown size={16} /> };
       return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Acumulando Caixa', icon: <TrendingUp size={16} /> };
    }

    if (metric === 'ticket') {
       if (value < 20) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Ticket Popular (Baixo)', icon: <Activity size={16} /> };
       if (value >= 20 && value < 45) return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', text: 'Ticket Médio de Mercado', icon: <Activity size={16} /> };
       return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', text: 'Ticket Premium (Gourmet)', icon: <Target size={16} /> };
    }
    
    if (metric === 'mc') {
       if (value < 30) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Baixa Força (Custo Var. Muito Alto)', icon: <AlertCircle size={16} /> };
       if (value >= 30 && value < 50) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'Padrão Restaurante Físico', icon: <Activity size={16} /> };
       return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Alto Valor Agregado Bruto', icon: <CheckCircle size={16} /> };
    }

    if (metric === 'pe') {
       if (value === Infinity || contextObj?.fat === 0) return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', text: 'Indefinido', icon: <Activity size={16} /> };
       if (value >= contextObj?.fat) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Ameaça de Falência Tática Mínima', icon: <AlertCircle size={16} /> };
       return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Sobrevivência Operacional Atingida', icon: <CheckCircle size={16} /> };
    }

    return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', text: 'Neutro', icon: <Activity size={16} /> };
  };

  const margemStyle = getBadge('margem', kpis.margem);
  const roicStyle = getBadge('roic', kpis.roic);
  const lucroStyle = getBadge('lucro', kpis.lucro);
  const ticketStyle = getBadge('ticket', kpis.ticket);
  const mcStyle = getBadge('mc', kpis.mcPerc);
  const peStyle = getBadge('pe', kpis.pontoEquilibrio, kpis);

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
          <BarChart4 size={24} color="#f59e0b" /> Painel Executivo Expandido
        </div>
        <div style={{ color: 'var(--text-muted)' }}>CEO: {user?.name}</div>
      </nav>

      {/* STEP 0: INTRODUÇÃO TEÓRICA */}
      {step === 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <BarChart4 size={64} color="#f59e0b" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>DRE e Alta Gestão em Tempo Real</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
             Nesta fase final, você atuará como Engenheiro Corporativo. A aplicação agora não foca mais apenas no Lucro solto. Nós vamos abrir a **Caixa de Custos**.
             <br /><br />
             Se você me disser quanto da sua conta é *Custo Variável (Feijão/Arroz)* e quanto é *Custo Fixo (Aluguel/Contador)*, eu vou conseguir projetar na sua frente a **Margem de Contribuição** do seu pacote de Frango, e o famoso **Ponto de Equilíbrio** onde a sua empresa para de queimar dinheiro todo mês.
          </p>

          <button className="btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: '#d97706', borderColor: '#b45309' }}>
            Abrir Relatório Expandido de DRE <ArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {/* STEP 1: COCKPIT DO CEO - EXPANDIDO */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Lançamentos do Mês (Top Bar Inputs) EXCLUSIVOS */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '4px solid #f59e0b' }}>
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Faturamento Bruto (R$)</label>
               <input type="number" className="input-field" value={faturamento} onChange={e => setFaturamento(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>*Tudo que os clientes passaram de cartão.</div>
             </div>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Custos de Produção/Variáveis (R$)</label>
               <input type="number" className="input-field" value={custosVariaveis} onChange={e => setCustosVariaveis(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }} />
               <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>*Gás, Ifood, Arroz (Se não vender, o custo é Zero).</div>
             </div>
             
             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Despesas e Custos Fixos (R$)</label>
               <input type="number" className="input-field" value={custosFixos} onChange={e => setCustosFixos(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem' }}>*Aluguel, Salários Clt, Internet, Limpeza.</div>
             </div>

             <div style={{ flex: '1 1 120px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Nº Vendas</label>
               <input type="number" className="input-field" value={entregas} onChange={e => setEntregas(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
             </div>

             <div style={{ flex: '1 1 200px' }}>
               <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Capital Preso no Negócio (R$)</label>
               <input type="number" className="input-field" value={investimento} onChange={e => setInvestimento(Number(e.target.value) || 0)} style={{ fontSize: '1.5rem', fontWeight: 'bold' }} />
               <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>*Dinheiro afundado na Estrutura Física base.</div>
             </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '1rem' }}>Big 6: Dashboard do Consultor</h3>

          {/* GRID DE INDICADORES (6 TILES) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             
             {/* K1: MARGEM DE CONTRIBUIÇÃO (%) e (R$) */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: mcStyle.bg, color: mcStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <PieChart size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Margem de Contribuição</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: mcStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.mcPerc.toFixed(2)}% <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>({formatCurrency(kpis.mcReais)})</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: Rec. Bruta - Custo Variável</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: mcStyle.bg, color: mcStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {mcStyle.icon} {mcStyle.text}
                </div>
             </div>

             {/* K2: PONTO DE EQUILÍBRIO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: peStyle.bg, color: peStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Crosshair size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Ponto de Equilíbrio Contábil</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: peStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.pontoEquilibrio === Infinity ? 'Sem Margem' : formatCurrency(kpis.pontoEquilibrio)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: Custos Fixos ÷ (%M. Contribuição)</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: peStyle.bg, color: peStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {peStyle.icon} {peStyle.text}
                </div>
             </div>

             {/* K3: LUCRO LÍQUIDO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: lucroStyle.bg, color: lucroStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Wallet size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Lucro Líquido Real</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: lucroStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {formatCurrency(kpis.lucro)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: M. Contribuição(R$) - Custos Fixos</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: lucroStyle.bg, color: lucroStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {lucroStyle.icon} {lucroStyle.text}
                </div>
             </div>

             {/* K4: MARGEM LÍQUIDA */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: margemStyle.bg, color: margemStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Percent size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Margem Líquida</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: margemStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.margem.toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: (Lucro Líquido ÷ Faturamento) x 100</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: margemStyle.bg, color: margemStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {margemStyle.icon} {margemStyle.text}
                </div>
             </div>

             {/* K5: TICKET MÉDIO */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: ticketStyle.bg, color: ticketStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Package size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Ticket Médio</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: ticketStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {formatCurrency(kpis.ticket)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: Faturamento ÷ Entregas</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: ticketStyle.bg, color: ticketStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {ticketStyle.icon} {ticketStyle.text}
                </div>
             </div>

             {/* K6: ROIC */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', zIndex: 2 }}>
                   <div style={{ backgroundColor: roicStyle.bg, color: roicStyle.color, padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <Target size={24} />
                   </div>
                   <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>ROIC Mensal Bruto</h4>
                </div>
                
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: roicStyle.color, marginBottom: '0.25rem', zIndex: 2 }}>
                   {kpis.roic.toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>Fórmula: (Lucro Líquido ÷ Capital Preso) x 100</div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: roicStyle.bg, color: roicStyle.color, fontSize: '0.875rem', fontWeight: 600, width: 'fit-content', zIndex: 2 }}>
                   {roicStyle.icon} {roicStyle.text}
                </div>
             </div>
             
          </div>

          <div className="glass-panel" style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', gap: '1rem' }}>
             <Activity color="#38bdf8" size={32} />
             <div>
               <strong style={{ display: 'block', color: '#38bdf8', marginBottom: '0.5rem' }}>Leitura Estratégica da Margem de Contribuição:</strong>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                 Você notou que sua Margem de Contribuição gera {formatCurrency(kpis.mcReais)}? Com esse bolo na mesa, a sua operação precisa faturar perfeitamente R$ {formatCurrency(kpis.pontoEquilibrio)} apenas para começar a zerar o aluguel mensar (Ponto de Equilíbrio). A cada real acima dessa faixa milagrosa, é que a empresa finalmente vira uma máquina de lucros.
               </p>
             </div>
          </div>

        </div>
      )}

      {/* CHAT IA PARA AVALIAÇÃO DO DIRETOR */}
      <ChatIA />
    </div>
  );
}
