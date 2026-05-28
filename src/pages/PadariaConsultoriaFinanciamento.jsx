import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Landmark, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase } from 'lucide-react';

const COR = '#f43f5e';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);
const formatBRL2 = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function calcPrice(pv, taxa, n) {
  if (!pv || !n) return { pmt: 0, total: 0, juros: 0, mult: 0 };
  const i = taxa / 100;
  const pmt = pv * (i / (1 - Math.pow(1 + i, -n)));
  const total = pmt * n;
  return { pmt, total, juros: total - pv, mult: total / pv };
}

function calcSAC(pv, taxa, n) {
  if (!pv || !n) return { pmtInicial: 0, pmtFinal: 0, total: 0, juros: 0 };
  const i = taxa / 100;
  const amort = pv / n;
  const pmtInicial = amort + pv * i;
  const pmtFinal = amort + amort * i;
  const total = ((pmtInicial + pmtFinal) / 2) * n;
  return { pmtInicial, pmtFinal, total, juros: total - pv, amort };
}

const blocos = [
  {
    titulo: '1. SAC vs Price: Qual Escolher na Padaria?', cor: '#f59e0b', emoji: '⚖️',
    def: 'Na padaria, o maquinário é caro e financiado por longos prazos. A escolha entre SAC e Price tem impacto real de dezenas de milhares de reais. SAC: parcela decrescente, total menor. Price: parcela fixa, total maior. Para equipamentos que geram receita desde o primeiro mês, SAC é sempre mais eficiente.',
    formula: 'Economia SAC vs Price = Total Price − Total SAC\nQuanto maior o prazo e a taxa, maior a vantagem do SAC',
    exemplos: ['Forno R$45.000 a 1,5% em 36x: Price total R$55.800', 'SAC total: R$51.506 → Economia R$4.294', 'Em 60x: diferença sobe para R$9.000+', 'Regra: taxa > 1,5% e prazo > 24 meses → SAC sempre vence'],
    alerta: 'Banco oferece Price por padrão porque recebe mais juros. Sempre peça para simular o SAC — o banco é obrigado a oferecer a opção quando solicitado.',
  },
  {
    titulo: '2. BNDES e Finame: O Crédito Barato para Equipamentos', cor: '#6366f1', emoji: '🏛️',
    def: 'O BNDES financia máquinas e equipamentos (incluindo fornos, amassadeiras, câmaras frias) via agentes financeiros (bancos). A linha Finame é específica para equipamentos credenciados no BNDES. Taxa de 1,0% a 1,5% a.m. — muito abaixo do mercado.',
    formula: 'Prazo Finame: até 60 meses\nEntrada mínima: geralmente 20%\nGarantia: o próprio equipamento',
    exemplos: ['Forno combinado R$85.000: entrada R$17.000, financiado R$68.000', 'Finame 1,2% em 60x: parcela R$1.600/mês', 'Banco privado 3,5% em 60x: parcela R$2.790/mês', 'Diferença: R$1.190/mês × 60 = R$71.400 economizados'],
    alerta: 'O equipamento precisa estar na lista de credenciados do BNDES. Fornos industriais de marcas conhecidas (Prática, Perfecta, Canol) geralmente estão. Verificar no site do BNDES antes de negociar.',
  },
  {
    titulo: '3. Pronampe: Capital de Giro para a Padaria Crescer', cor: '#22c55e', emoji: '📈',
    def: 'Além do Finame para equipamentos, o Pronampe cobre capital de giro para expansão. Limitado a 30% do faturamento anual. Ideal para pagar mão de obra extra, estoque de insumos para pico de demanda (São João, Natal) e reformas menores.',
    formula: 'Limite Pronampe = Faturamento anual × 30%\nTaxa = SELIC + 6% ao ano ÷ 12',
    exemplos: ['Padaria fatura R$20.000/mês = R$240.000/ano', 'Limite Pronampe: R$72.000', 'Taxa com SELIC a 10,5%: (10,5+6)/12 = 1,375% a.m.', 'R$30.000 em 24x: parcela R$1.466 — muito melhor que banco privado'],
    alerta: 'Pronampe exige CNPJ ativo há pelo menos 1 ano e sem dívidas com o governo (certidão negativa). Padaria que não regularizou o CNPJ perde acesso a essa linha barata.',
  },
  {
    titulo: '4. Análise de Viabilidade do Financiamento', cor: '#ec4899', emoji: '📐',
    def: 'Antes de assinar qualquer contrato, o consultor faz 3 perguntas: (1) A receita adicional cobre a parcela? (2) O negócio tem fluxo de caixa para aguentar os primeiros meses (SAC)? (3) Qual é o payback real do investimento incluindo os juros?',
    formula: 'Payback real = Investimento total (incluindo juros) ÷ Lucro adicional mensal\nViável: Payback ≤ 50% do prazo do financiamento',
    exemplos: ['Forno R$45.000, Total Price R$55.800, lucro extra R$4.000/mês', 'Payback real: R$55.800 ÷ R$4.000 = 14 meses', 'Prazo: 36 meses. Payback = 39% do prazo → ✅ Viável', 'Se lucro extra = R$1.200: payback 46,5 meses > prazo → ❌'],
    alerta: 'Se o payback real supera o prazo do financiamento, o negócio ainda estará pagando o empréstimo quando o equipamento já não tiver se pagado completamente. Renegociar prazo ou valor antes de assinar.',
  },
];

const exemplos = [
  {
    id: 'finame', tipo: 'BNDES Finame', subtipo: 'Forno Industrial', emoji: '🔥',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    pv: 68000, taxaPrice: 1.2, taxaSAC: 1.2, n: 60,
    descricao: 'Padaria quer comprar forno combinado R$85.000. Dá entrada de R$17.000 (20%) e financia R$68.000 pelo Finame a 1,2% a.m. em 60 meses.',
    receitaExtra: 5200,
  },
  {
    id: 'pronampe', tipo: 'Pronampe', subtipo: 'Expansão Capital de Giro', emoji: '🌱',
    cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    pv: 35000, taxaPrice: 1.4, taxaSAC: 1.4, n: 36,
    descricao: 'Padaria fatura R$140.000/ano. Limite Pronampe 30% = R$42.000. Usa R$35.000 para contratar 2 padeiros e aumentar produção noturna.',
    receitaExtra: 3800,
  },
  {
    id: 'privado', tipo: 'Banco Privado', subtipo: 'Reforma da Loja', emoji: '🏦',
    cor: '#ef4444', corBg: 'rgba(239,68,68,0.08)',
    pv: 50000, taxaPrice: 2.8, taxaSAC: 2.8, n: 48,
    descricao: 'Padaria quer reformar a área de café sem usar Finame (não é equipamento credenciado). Banco privado oferece 2,8% a.m. em 48 meses.',
    receitaExtra: 4100,
  },
];

const dossie = {
  empresa: 'Padaria Celeste',
  segmento: 'Padaria e confeitaria — cidade do interior — faturamento R$ 28.000/mês',
  contexto: 'Seu Zé Celeste tem 67 anos e a padaria há 22 anos. Fatura R$28.000/mês e quer comprar uma linha de produção semiautomática (amassadeira + divisora + câmara de fermentação) por R$95.000. Recebeu 3 propostas diferentes. O filho mais novo o aconselhou a contratar consultoria financeira antes de decidir.',
  dados: {
    faturamento: 28000,
    custoFixo: 7800,
    margemContribuicao: 38,
    valorEquipamento: 95000,
    aumentoProducaoPerc: 45,
    receitaExtraEstimada: 12600,
    lucroExtraEstimado: 4788,
    anosCNPJ: 22,
  },
  propostas: [
    { id: 'A', nome: 'BNDES Finame via Bradesco', tipo: 'SAC', taxa: 1.15, n: 60, entrada: 19000, cor: '#22c55e', obs: 'Equipamento credenciado no BNDES. Exige documentação completa.' },
    { id: 'B', nome: 'Pronampe via Caixa', tipo: 'Price', taxa: 1.38, n: 48, entrada: 0, cor: '#6366f1', obs: 'Limite: 30% × R$336.000/ano = R$100.800. Cobre o valor total.' },
    { id: 'C', nome: 'Banco Privado (Capital de Giro)', tipo: 'Price', taxa: 3.1, n: 36, entrada: 0, cor: '#ef4444', obs: 'Aprovação em 2 dias. Sem burocracia de credenciamento.' },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      contexto: 'Proposta A: BNDES Finame, entrada R$19.000, financia R$76.000 em SAC a 1,15%. Calcule a primeira parcela, a última e o total pago. Por que a amortização constante importa?',
      opcoes: [
        { id: 'a', texto: 'Parcela inicial R$2.140, final R$1.281, total R$101.607. SAC reduz juros mês a mês e protege o fluxo futuro' },
        { id: 'b', texto: 'Parcela inicial R$2.000, final R$1.000, total R$90.000 — estimativa razoável' },
        { id: 'c', texto: 'Parcela fixa R$1.730, total R$103.800 — SAC e Price têm o mesmo custo total' },
        { id: 'd', texto: 'Parcela inicial R$3.100, final R$800, total R$115.000 — SAC é mais caro no início' },
      ],
      correta: 'a',
      explicacao: 'SAC: amortização = R$76.000 ÷ 60 = R$1.267/mês. Juros mês 1 = R$76.000 × 1,15% = R$874. Parcela 1 = R$1.267 + R$874 = R$2.141. Juros mês 60 = R$1.267 × 1,15% = R$14,6. Parcela 60 = R$1.267 + R$15 = R$1.282. Total ≈ [(R$2.141 + R$1.282)/2] × 60 = R$102.690. Ainda assim, muito menor que a Proposta C. A amortização constante reduz o saldo devedor mais rápido — se precisar quitar antecipadamente, deve menos ao banco.',
    },
    {
      id: 'c2',
      contexto: 'Proposta B: Pronampe via Caixa, R$95.000 em Price a 1,38% em 48 meses, sem entrada. Qual a parcela e o total? Seu Zé tem limite suficiente no Pronampe?',
      opcoes: [
        { id: 'a', texto: 'Parcela R$2.721, total R$130.608. Limite Pronampe: R$100.800 (30% × R$336.000/ano). Aprovado!' },
        { id: 'b', texto: 'Parcela R$2.800, total R$134.400. Mas Pronampe só financia até R$60.000 por MEI' },
        { id: 'c', texto: 'Parcela R$2.450, total R$117.600. Limite insuficiente — precisaria de 2 contratos' },
        { id: 'd', texto: 'Parcela R$3.100, total R$148.800. Limite OK, mas muito caro para a padaria' },
      ],
      correta: 'a',
      explicacao: 'PMT = R$95.000 × [0,0138 ÷ (1 − 1,0138^−48)] = R$2.721/mês. Total = R$130.608. Juros = R$35.608. Limite Pronampe: faturamento anual R$28.000 × 12 = R$336.000 × 30% = R$100.800 — suficiente para os R$95.000. Seu Zé se qualifica (CNPJ ativo há 22 anos, sem dívidas). A Proposta B é mais cara que a A em total, mas não exige entrada de R$19.000 — o que pode ser relevante dependendo do caixa disponível.',
    },
    {
      id: 'c3',
      contexto: 'Proposta C: Banco privado R$95.000 em Price a 3,1% em 36 meses. Qual o custo real e por que é a pior escolha?',
      opcoes: [
        { id: 'a', texto: 'Parcela R$3.792, total R$136.512. Apesar do prazo menor, taxa 2,7x maior que Finame gera custo exorbitante' },
        { id: 'b', texto: 'Parcela R$3.200, total R$115.200. Prazo menor compensa a taxa maior' },
        { id: 'c', texto: 'Parcela R$4.100, total R$147.600. Ruim, mas a agilidade de 2 dias justifica para negócios urgentes' },
        { id: 'd', texto: 'Parcela R$2.900, total R$104.400. Custo aceitável considerando a rapidez' },
      ],
      correta: 'a',
      explicacao: 'PMT = R$95.000 × [0,031 ÷ (1 − 1,031^−36)] = R$3.792/mês. Total = R$136.512. Juros = R$41.512. Comparação: Proposta A total ≈ R$102.690 + R$19.000 entrada = R$121.690. Proposta C: R$136.512. Diferença: R$14.822 a mais na C. A "conveniência" de 2 dias custa R$14.822 em juros extras. Para um equipamento de R$95.000 que vai durar 15+ anos, esperar 4 semanas pelo Finame é decisão óbvia.',
    },
    {
      id: 'c4',
      contexto: 'A linha de produção aumentará a capacidade em 45% — projeção de R$12.600/mês a mais de receita e R$4.788 de lucro extra (margem 38%). Calcule o payback real da melhor proposta (A) e avalie a viabilidade.',
      opcoes: [
        { id: 'a', texto: 'Payback real: R$121.690 ÷ R$4.788 = 25,4 meses. Com prazo de 60 meses, payback em 42% do prazo → ✅ Muito viável' },
        { id: 'b', texto: 'Payback real: R$95.000 ÷ R$4.788 = 19,8 meses — ignora os juros, análise incompleta' },
        { id: 'c', texto: 'Payback de 30 meses — aceitável mas no limite superior de viabilidade' },
        { id: 'd', texto: 'Não é possível calcular sem dados de depreciação do equipamento' },
      ],
      correta: 'a',
      explicacao: 'Custo total real Proposta A = R$102.690 (financiado) + R$19.000 (entrada) = R$121.690. Lucro extra mensal: R$4.788. Payback real = R$121.690 ÷ R$4.788 = 25,4 meses. Com prazo de 60 meses, o equipamento se paga em 42% do prazo — excelente indicador. Ao final dos 60 meses, Seu Zé terá gerado R$4.788 × 60 = R$287.280 de lucro extra com investimento total de R$121.690 — ROI de 136% em 5 anos. Investimento muito justificado.',
    },
    {
      id: 'c5',
      contexto: 'Recomendação final: Seu Zé deve escolher qual proposta? E como deve estruturar a entrada de R$19.000?',
      opcoes: [
        { id: 'a', texto: 'Proposta A (Finame) — menor taxa, SAC protege o caixa longo prazo. Entrada: usar R$10.000 de reserva + R$9.000 do lucro de junho (São João)' },
        { id: 'b', texto: 'Proposta B (Pronampe) — sem precisar de entrada é mais fácil financeiramente' },
        { id: 'c', texto: 'Proposta C — a agilidade evita perder a oferta do equipamento' },
        { id: 'd', texto: 'Negociar a Proposta A sem entrada — o banco pode ceder para fechar o negócio' },
      ],
      correta: 'a',
      explicacao: 'Proposta A é a recomendação clara: taxa 1,15% vs 1,38% (B) e 3,1% (C); SAC reduz saldo devedor mais rápido; equipamento credenciado BNDES tem garantia de qualidade. Para a entrada de R$19.000: Seu Zé fatura R$28.000/mês com lucro médio de ~R$4.500/mês. Recomendação: acumular R$19.000 em 4 meses (incluindo o São João que gera R$8.000-10.000 de lucro) e pedir ao banco para aguardar 4 meses o desembolso. A economia de R$15.000 em juros vs Proposta C justifica plenamente a espera.',
    },
  ],
};

export default function PadariaConsultoriaFinanciamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [exemploAtivo, setExemploAtivo] = useState('finame');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const price = calcPrice(ex.pv, ex.taxaPrice, ex.n);
  const sac = calcSAC(ex.pv, ex.taxaSAC, ex.n);
  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  const propostasCalc = dossie.propostas.map(p => {
    const pv = p.entrada ? dossie.dados.valorEquipamento - p.entrada : dossie.dados.valorEquipamento;
    const price = calcPrice(pv, p.taxa, p.n);
    const sac = calcSAC(pv, p.taxa, p.n);
    return { ...p, pv, price, sac };
  });

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/financiamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Landmark size={22} color={COR} /> Consultoria: Crédito e Financiamento</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(239,68,68,0.08) 100%)', borderColor: 'rgba(244,63,94,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244,63,94,0.2)', color: '#fda4af', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Crédito e Financiamento
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>BNDES, SAC e a Arte de Financiar sem Quebrar</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Padaria que usa banco privado para comprar forno paga <strong style={{ color: 'var(--text-main)' }}>3x mais juros</strong> do que quem usa BNDES. Saber a fonte certa para cada investimento é o que separa a padaria que cresce da que trabalha para o banco.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(244,63,94,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#fda4af' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Crédito Inteligente para a Padaria</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: bloco.cor, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{bloco.formula}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((e, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e}</span>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <Lightbulb size={16} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{bloco.alerta}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos →</button>
          </div>
        </div>
      )}

      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map(e => (
              <button key={e.id} onClick={() => setExemploAtivo(e.id)} style={{ flex: 1, minWidth: '160px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === e.id ? `2px solid ${e.cor}` : '2px solid var(--border-color)', background: exemploAtivo === e.id ? e.corBg : 'var(--bg-card)', color: exemploAtivo === e.id ? e.cor : 'var(--text-muted)', cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{e.emoji}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.25rem' }}>{e.tipo}</div>
                <div style={{ fontSize: '0.9rem' }}>{e.subtipo}</div>
              </button>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${ex.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{ex.descricao}</p>
          </div>

          {/* Comparativo SAC vs Price */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>⚖️ SAC vs Price — {ex.subtipo}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(245,158,11,0.08)', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '3px solid #f59e0b' }}>
                <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '1rem' }}>📉 SAC</div>
                {[
                  { l: '1ª parcela', v: formatBRL2(sac.pmtInicial) },
                  { l: 'Última parcela', v: formatBRL2(sac.pmtFinal) },
                  { l: 'Total pago', v: formatBRL(sac.total) },
                  { l: 'Juros totais', v: formatBRL(sac.juros) },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(239,68,68,0.08)', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '3px solid #ef4444' }}>
                <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: '1rem' }}>📊 Price</div>
                {[
                  { l: 'Parcela fixa', v: formatBRL2(price.pmt) },
                  { l: 'Parcela fixa', v: formatBRL2(price.pmt) },
                  { l: 'Total pago', v: formatBRL(price.total) },
                  { l: 'Juros totais', v: formatBRL(price.juros) },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', textAlign: 'center' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>💰 Economia SAC vs Price: {formatBRL(price.total - sac.total)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> • ROI mensal: {price.pmt < ex.receitaExtra ? '✅' : '⚠️'} {(((ex.receitaExtra - price.pmt) / price.pmt) * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(244,63,94,0.05)', borderColor: 'rgba(244,63,94,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(244,63,94,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Briefcase size={24} color={COR} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'Faturamento/mês', v: formatBRL(dossie.dados.faturamento), c: '#22c55e' },
                { l: 'Custo Fixo/mês', v: formatBRL(dossie.dados.custoFixo), c: '#ef4444' },
                { l: 'MC%', v: `${dossie.dados.margemContribuicao}%`, c: '#f59e0b' },
                { l: 'Equipamento', v: formatBRL(dossie.dados.valorEquipamento), c: '#6366f1' },
                { l: 'Cap. extra', v: `+${dossie.dados.aumentoProducaoPerc}%`, c: COR },
                { l: 'Lucro extra est.', v: formatBRL(dossie.dados.lucroExtraEstimado), c: '#22c55e' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 3 Propostas Recebidas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {propostasCalc.map(p => {
                const ref = p.tipo === 'SAC' ? p.sac : p.price;
                return (
                  <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: p.cor, fontSize: '1.05rem' }}>Proposta {p.id}</span>
                      <span style={{ background: `rgba(${p.cor === '#22c55e' ? '34,197,94' : p.cor === '#6366f1' ? '99,102,241' : '239,68,68'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>{p.tipo}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{p.nome}</div>
                    {[
                      { l: 'Taxa', v: `${p.taxa}% a.m.` },
                      { l: 'Prazo', v: `${p.n} meses` },
                      { l: 'Entrada', v: p.entrada ? formatBRL(p.entrada) : 'Sem entrada' },
                      { l: p.tipo === 'SAC' ? '1ª parcela est.' : 'Parcela fixa est.', v: `~${formatBRL(p.tipo === 'SAC' ? ref.pmtInicial : ref.pmt)}` },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                        <span style={{ fontWeight: 600 }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.obs}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(244,63,94,0.2)', color: '#fda4af', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(244,63,94,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#fda4af' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#fda4af' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!enviado ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < dossie.perguntasConsultoria.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < dossie.perguntasConsultoria.length ? 0.5 : 1, cursor: Object.keys(respostas).length < dossie.perguntasConsultoria.length ? 'not-allowed' : 'pointer' }}>
                  Entregar Consultoria ({Object.keys(respostas).length}/{dossie.perguntasConsultoria.length})
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertCircle size={18} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#facc15' }}>Dica:</strong> compare o custo total de cada proposta — não só a parcela. O Finame a 1,15% parece menor diferença para 3,1%, mas em R$95.000 por 36-60 meses é uma diferença de R$15.000 ou mais em juros.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Seu Zé vai economizar R$15.000 graças à sua consultoria!' : nota >= 80 ? 'Muito bom! Revise os cálculos dos itens errados.' : 'Revise SAC vs Price e as fontes de crédito disponíveis.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecao('teoria')} style={{ padding: '0.75rem 1.5rem', background: COR, border: 'none' }}>Rever Teoria</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
