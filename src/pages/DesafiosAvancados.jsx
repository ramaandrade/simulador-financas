import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Target, CheckCircle2, XCircle,
  AlertCircle, Award, Star, Trophy, RotateCcw
} from 'lucide-react';

const desafios = [
  {
    id: 'farmacia',
    titulo: 'Farmácia Popular',
    emoji: '💊',
    cor: '#22c55e',
    corBg: 'rgba(34,197,94,0.08)',
    descricao: 'A Farmácia Saúde & Vida atende a comunidade com medicamentos, dermocosméticos e produtos de higiene. O dono contratou você como consultor.',
    contexto: 'Faturamento mensal: R$ 22.000 | Funcionários: 2 farmacêuticos + 1 caixa',
    itens: [
      { id: 'a', desc: 'Custo dos medicamentos comprados para revenda (CMV)', correto: 'variavel' },
      { id: 'b', desc: 'Aluguel do ponto farmacêutico', correto: 'fixo' },
      { id: 'c', desc: 'Sacola e embalagem por venda realizada', correto: 'variavel' },
      { id: 'd', desc: 'Salário fixo do farmacêutico responsável técnico', correto: 'fixo' },
      { id: 'e', desc: 'Desconto concedido na venda (por unidade vendida)', correto: 'variavel' },
      { id: 'f', desc: 'Software de gestão farmacêutica (assinatura mensal)', correto: 'despesa' },
      { id: 'g', desc: 'Câmara fria para medicamentos termolábeis (energia fixa)', correto: 'fixo' },
      { id: 'h', desc: 'Propaganda no jornal de bairro (mensal)', correto: 'despesa' },
      { id: 'i', desc: 'Taxa de alvará sanitário (anual, rateada mensalmente)', correto: 'fixo' },
      { id: 'j', desc: 'Perdas por medicamentos vencidos no estoque', correto: 'variavel' },
      { id: 'k', desc: 'Contador responsável pela escrita fiscal', correto: 'despesa' },
      { id: 'l', desc: 'Frete para entrega de medicamentos a domicílio (por entrega)', correto: 'variavel' },
    ],
    dica: 'Na farmácia, atenção às perdas por vencimento — são custos variáveis invisíveis que podem comprometer a margem. O alvará sanitário, apesar de anual, deve ser rateado mensalmente como custo fixo.',
  },
  {
    id: 'barbearia',
    titulo: 'Barbearia Moderna',
    emoji: '✂️',
    cor: '#6366f1',
    corBg: 'rgba(99,102,241,0.08)',
    descricao: 'A Barbearia Estilo Certo atende 150 clientes/mês com cortes, barbas, pigmentação e tratamentos capilares.',
    contexto: 'Ticket médio: R$ 60 | Faturamento: R$ 9.000/mês | 2 barbeiros + 1 recepcionista',
    itens: [
      { id: 'a', desc: 'Produto de barba consumido por atendimento (gel, cera, óleo)', correto: 'variavel' },
      { id: 'b', desc: 'Aluguel da sala da barbearia', correto: 'fixo' },
      { id: 'c', desc: 'Toalha descartável usada por cliente', correto: 'variavel' },
      { id: 'd', desc: 'Salário fixo do recepcionista', correto: 'fixo' },
      { id: 'e', desc: 'Comissão do barbeiro (% sobre cada corte realizado)', correto: 'variavel' },
      { id: 'f', desc: 'Sistema de agendamento online (assinatura mensal)', correto: 'despesa' },
      { id: 'g', desc: 'Energia elétrica — valor fixo mensal do estabelecimento', correto: 'fixo' },
      { id: 'h', desc: 'Campanha no Instagram para divulgar promoção', correto: 'despesa' },
      { id: 'i', desc: 'Depreciação das cadeiras de barbeiro (mensal)', correto: 'fixo' },
      { id: 'j', desc: 'Lâminas de barbear descartáveis (por atendimento)', correto: 'variavel' },
      { id: 'k', desc: 'Treinamento e curso de atualização do barbeiro', correto: 'despesa' },
      { id: 'l', desc: 'Pigmento/tintura para coloração capilar (por procedimento)', correto: 'variavel' },
    ],
    dica: 'Na barbearia, o modelo de remuneração dos barbeiros define a estrutura de custos: barbeiro com salário fixo é custo fixo; barbeiro que recebe por comissão é custo variável. Muitas barbearias usam os dois modelos juntos.',
  },
  {
    id: 'restaurante',
    titulo: 'Restaurante Self-Service',
    emoji: '🍽️',
    cor: '#f97316',
    corBg: 'rgba(249,115,22,0.08)',
    descricao: 'O Restaurante Sabor do Cariri é um self-service que atende no almoço, com média de 80 refeições/dia, de segunda a sábado.',
    contexto: 'Preço médio por kg: R$ 42 | Consumo médio: 350g/pessoa | ~80 clientes/dia',
    itens: [
      { id: 'a', desc: 'Ingredientes do cardápio (carnes, legumes, grãos) por dia', correto: 'variavel' },
      { id: 'b', desc: 'Aluguel do salão e cozinha do restaurante', correto: 'fixo' },
      { id: 'c', desc: 'Embalagem para delivery (por pedido)', correto: 'variavel' },
      { id: 'd', desc: 'Salário fixo da cozinheira-chefe', correto: 'fixo' },
      { id: 'e', desc: 'Gás de cozinha (proporcional ao volume cozinhado)', correto: 'variavel' },
      { id: 'f', desc: 'Sistema de gestão de delivery (iFood/comissão por pedido)', correto: 'despesa' },
      { id: 'g', desc: 'Energia elétrica — refrigeração e climatização do salão', correto: 'fixo' },
      { id: 'h', desc: 'Publicidade no Instagram e Google', correto: 'despesa' },
      { id: 'i', desc: 'Manutenção dos equipamentos de cozinha (mensal)', correto: 'fixo' },
      { id: 'j', desc: 'Sobras e desperdício de alimentos do buffet', correto: 'variavel' },
      { id: 'k', desc: 'Contador e serviço de folha de pagamento', correto: 'despesa' },
      { id: 'l', desc: 'Material de limpeza e higiene da cozinha (mensal)', correto: 'fixo' },
    ],
    dica: 'No restaurante, o desperdício do buffet é custo variável crítico: alimento preparado que não foi consumido ainda gerou custo. Controlar o desperdício é tão importante quanto precificar bem. O gás é variável porque aumenta nos dias de muito movimento.',
  },
];

const opcoes = [
  { valor: 'variavel', label: 'Custo Variável', cor: '#f59e0b' },
  { valor: 'fixo', label: 'Custo Fixo', cor: '#6366f1' },
  { valor: 'despesa', label: 'Despesa', cor: '#ef4444' },
];

export default function DesafiosAvancados() {
  const navigate = useNavigate();
  const [desafioAtivo, setDesafioAtivo] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [historico, setHistorico] = useState({}); // { farmacia: 80, barbearia: 60, ... }

  const desafio = desafioAtivo ? desafios.find((d) => d.id === desafioAtivo) : null;

  const acertos = desafio && enviado
    ? desafio.itens.filter((i) => respostas[i.id] === i.correto).length
    : 0;
  const nota = desafio && enviado ? Math.round((acertos / desafio.itens.length) * 100) : 0;

  const iniciarDesafio = (id) => {
    // Navegar para a consultoria completa
    if (id === 'farmacia') { navigate('/desafios-avancados/farmacia'); return; }
    if (id === 'barbearia') { navigate('/desafios-avancados/barbearia'); return; }
    if (id === 'restaurante') { navigate('/desafios-avancados/restaurante'); return; }
    setDesafioAtivo(id);
    setRespostas({});
    setEnviado(false);
  };

  const encerrarDesafio = (notaFinal) => {
    setHistorico((prev) => ({ ...prev, [desafioAtivo]: notaFinal }));
  };

  const totalConcluidos = Object.keys(historico).length;
  const mediaGeral = totalConcluidos > 0
    ? Math.round(Object.values(historico).reduce((a, b) => a + b, 0) / totalConcluidos)
    : 0;

  // TELA INICIAL
  if (!desafioAtivo) {
    return (
      <div className="container">
        <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem' }}>
              <Home size={16} /> Início
            </button>
          </div>
          <div className="navbar-brand">
            <Trophy size={22} /> Desafios Avançados de Consultoria
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>URCA · Educação Financeira</div>
        </nav>

        {/* HERO */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)', borderColor: 'rgba(99,102,241,0.3)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <Star size={14} /> Nível Avançado
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Desafios de Consultoria</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.7 }}>
            Você já praticou com marmitaria, padaria e loja de moda. Agora é hora de expandir sua visão como consultor financeiro. Escolha um setor e prove que domina a classificação de custos em qualquer negócio.
          </p>

          {/* Placar geral */}
          {totalConcluidos > 0 && (
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1rem 2rem', background: 'rgba(34,197,94,0.1)', borderColor: '#22c55e' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Desafios concluídos</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{totalConcluidos}/{desafios.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1rem 2rem', background: 'rgba(99,102,241,0.1)', borderColor: '#6366f1' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Média geral</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1' }}>{mediaGeral}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Cards dos desafios */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {desafios.map((d) => {
            const concluido = historico[d.id] !== undefined;
            const notaAnterior = historico[d.id];
            return (
              <div key={d.id} className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${d.cor}`, background: d.corBg, position: 'relative', overflow: 'hidden' }}>
                {concluido && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: notaAnterior >= 70 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: notaAnterior >= 70 ? '#22c55e' : '#ef4444', padding: '0.25rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700 }}>
                    {notaAnterior}% ✓
                  </div>
                )}
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{d.emoji}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: d.cor }}>{d.titulo}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>{d.descricao}</p>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  📊 {d.contexto}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.itens.length} itens para classificar</span>
                  <button
                    className="btn-primary"
                    onClick={() => iniciarDesafio(d.id)}
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', background: d.cor, border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {concluido ? <><RotateCcw size={14} /> Refazer</> : <><Target size={14} /> Iniciar</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalConcluidos === desafios.length && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', marginTop: '2rem', background: 'rgba(34,197,94,0.08)', borderColor: '#22c55e' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <h2 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>Todos os desafios concluídos!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Você completou todos os setores. Média geral: <strong style={{ color: '#22c55e' }}>{mediaGeral}%</strong>. Parabéns, consultor!</p>
          </div>
        )}
      </div>
    );
  }

  // TELA DO DESAFIO ATIVO
  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => { setDesafioAtivo(null); setRespostas({}); setEnviado(false); }} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand">
          <span style={{ fontSize: '1.2rem' }}>{desafio.emoji}</span> {desafio.titulo}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Desafio Avançado</div>
      </nav>

      {/* Header do desafio */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: `4px solid ${desafio.cor}`, background: desafio.corBg }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={24} color={desafio.cor} /> Sua Consultoria: {desafio.titulo}
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.75rem' }}>{desafio.descricao}</p>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-block' }}>
          📊 {desafio.contexto}
        </div>
      </div>

      {/* Itens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {desafio.itens.map((item, idx) => (
          <div key={item.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: enviado ? respostas[item.id] === item.correto ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
              <span style={{ background: `rgba(${desafio.cor === '#22c55e' ? '34,197,94' : desafio.cor === '#6366f1' ? '99,102,241' : '249,115,22'}, 0.2)`, color: desafio.cor, borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
              <span style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{item.desc}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {opcoes.map((op) => (
                <button key={op.valor} disabled={enviado} onClick={() => setRespostas((prev) => ({ ...prev, [item.id]: op.valor }))} style={{ padding: '0.4rem 0.9rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, cursor: enviado ? 'default' : 'pointer', border: respostas[item.id] === op.valor ? `2px solid ${op.cor}` : '2px solid var(--border-color)', background: respostas[item.id] === op.valor ? `rgba(${op.valor === 'variavel' ? '245,158,11' : op.valor === 'fixo' ? '99,102,241' : '239,68,68'}, 0.2)` : 'transparent', color: respostas[item.id] === op.valor ? op.cor : 'var(--text-muted)', transition: 'all 0.15s' }}>{op.label}</button>
              ))}
            </div>
            {enviado && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', minWidth: '120px' }}>
                {respostas[item.id] === item.correto
                  ? <><CheckCircle2 size={18} color="#22c55e" /><span style={{ color: '#22c55e', fontWeight: 600 }}>Correto!</span></>
                  : <><XCircle size={18} color="#ef4444" /><span style={{ color: '#ef4444', fontWeight: 600 }}>{opcoes.find(o => o.valor === item.correto)?.label}</span></>}
              </div>
            )}
          </div>
        ))}
      </div>

      {!enviado && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button className="btn-primary" onClick={() => { setEnviado(true); encerrarDesafio(Math.round((desafio.itens.filter(i => respostas[i.id] === i.correto).length / desafio.itens.length) * 100)); }} disabled={Object.keys(respostas).length < desafio.itens.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: desafio.cor, border: 'none', opacity: Object.keys(respostas).length < desafio.itens.length ? 0.5 : 1, cursor: Object.keys(respostas).length < desafio.itens.length ? 'not-allowed' : 'pointer' }}>
              Enviar Consultoria ({Object.keys(respostas).length}/{desafio.itens.length} respondidos)
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
            <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: '#facc15' }}>Dica do setor:</strong> {desafio.dica}
            </p>
          </div>
        </>
      )}

      {enviado && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : nota >= 50 ? '📚' : '💡'}</div>
          <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>
            {acertos} de {desafio.itens.length} corretas — {nota}%
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {nota === 100 ? `Perfeito! Você domina custos na ${desafio.titulo}!` : nota >= 70 ? 'Muito bom! Revise os itens marcados em vermelho.' : 'Revise a dica do setor e tente novamente.'}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'inline-block', minWidth: '200px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>💡 Lembre-se:</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desafio.dica}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={16} /> Tentar Novamente
            </button>
            <button className="btn-primary" onClick={() => { setDesafioAtivo(null); setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem', background: desafio.cor, border: 'none' }}>
              Ver Outros Desafios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
