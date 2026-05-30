import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, Briefcase } from 'lucide-react';

const COR = '#a855f7';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const blocosTeoría = [
  {
    titulo: '1. Ponto de Pedido e Estoque de Segurança', cor: '#f59e0b', emoji: '📦',
    def: 'Na padaria, ficar sem farinha às 3h da manhã é catastrófico. O Ponto de Pedido é o nível de estoque em que você DEVE fazer o pedido para que a entrega chegue antes de você ficar sem produto. O Estoque de Segurança é uma reserva para absorver atrasos do fornecedor.',
    formula: 'PP = (Consumo Diário × Tempo de Entrega) + Estoque de Segurança',
    exemplos: ['Consumo: 15 sacos/dia, entrega 5 dias, ES=30 sacos', 'PP = (15×5)+30 = 105 sacos', 'Se estoque chegar a 105 sacos → fazer pedido imediatamente', 'Sem ES: uma greve de caminhoneiros quebra a padaria'],
    alerta: 'Muitos padeiros fazem pedido "quando lembram". O Ponto de Pedido é um gatilho automático — não depende de memória, depende de controle de estoque diário.',
  },
  {
    titulo: '2. Planejamento de Compras: Lote Econômico', cor: '#6366f1', emoji: '🧮',
    def: 'Comprar muito de uma vez gera desconto mas imobiliza capital e ocupa espaço. Comprar pouco com frequência é ágil mas perde escala. O Lote Econômico de Compra (LEC) é a quantidade ideal que equilibra custo de pedir e custo de manter estoque.',
    formula: 'LEC = √(2 × Demanda Anual × Custo do Pedido ÷ Custo de Manutenção)',
    exemplos: ['Demanda anual: 5.400 sacos', 'Custo de cada pedido (frete+tempo): R$80', 'Custo de manutenção do estoque: R$2/saco/mês', 'LEC ≈ 424 sacos por pedido'],
    alerta: 'Na prática, o LEC é um ponto de referência — as condições reais (prazo do fornecedor, capacidade de armazenagem) ajustam o número final. O importante é não comprar com base em impulso.',
  },
  {
    titulo: '3. Orçamento de Compras vs. Orçamento de Vendas', cor: '#22c55e', emoji: '📅',
    def: 'O orçamento de compras deve ser derivado do orçamento de vendas. Se você planeja vender 30% a mais no mês seguinte (Páscoa, São João), precisa planejar as compras agora — antes de acabar o mês atual. Planejamento financeiro na padaria é inseparável do planejamento logístico.',
    formula: 'Compras necessárias = (Vendas previstas × CMV%) + Estoque final desejado − Estoque inicial',
    exemplos: ['Receita prevista Junho (São João): R$42.000', 'CMV 55%: matéria-prima necessária R$23.100', 'Mais estoque final desejado: R$3.000', 'Menos estoque atual: R$5.000 → Compras: R$21.100'],
    alerta: 'Padaria que não planeja para São João compra farinha a preço de escassez no mercado local. Antecipação de 45-60 dias garante preço e disponibilidade.',
  },
  {
    titulo: '4. Gestão de Sazonalidade: Reserva e Investimento', cor: '#ec4899', emoji: '📆',
    def: 'Padaria tem sazonalidade intensa: alta em São João, Natal, Páscoa; baixa em Janeiro (pós-festas) e períodos de chuva. Planejar financeiramente significa acumular reserva nos meses bons para sustentar os meses ruins — e investir nos meses de pico para capturar mais receita.',
    formula: 'Reserva mensal = (Lucro do mês − Custo fixo × 1,5) × 20%',
    exemplos: ['Mês bom (Junho): lucro R$8.000 → reserva R$1.600', 'Mês ruim (Janeiro): lucro R$2.000 → usar reserva R$1.400', 'Reserva acumulada: 4 meses bons = R$6.400 de colchão', 'Sem reserva: em Janeiro o proprietário não se paga'],
    alerta: 'O erro mais comum é gastar o excesso dos meses bons e entrar em crise nos meses ruins. A reserva da padaria não é luxo — é a diferença entre o negócio funcionar 12 meses ou fechar em Fevereiro.',
  },
];

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Moinho Regional', emoji: '⚙️',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'O Moinho Serra Verde planeja a produção mensal baseado nos pedidos antecipados das padarias clientes. Veja como o planejamento de demanda impacta toda a cadeia.',
    planejado: { receita: 180000, compras: 108000, custoFixo: 32000 },
    real: { receita: 165000, compras: 99000, custoFixo: 33500 },
    analise: 'Receita 8,3% abaixo (2 padarias grandes reduziram pedido). Compras ajustadas proporcionalmente (modelo de compra variável é inteligente). CF levemente acima (+4,7%) por manutenção não planejada. Resultado: lucro caiu de R$40.000 para R$32.500 — impacto controlado graças ao ajuste de compras.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Padaria com Cafeteria', emoji: '☕',
    cor: '#eab308', corBg: 'rgba(234,179,8,0.08)',
    descricao: 'A Padaria Cantinho do Pão abriu área de cafeteria. O planejamento financeiro precisa separar os dois centros de custo.',
    planejado: { receita: 28000, compras: 14000, custoFixo: 8500 },
    real: { receita: 31200, compras: 16800, custoFixo: 9200 },
    analise: 'Receita +11,4% (cafeteria atraiu mais clientes). Compras +20% (demanda maior que prevista + desperdício de café e bebidas). CF +8,2% (horas extras na cafeteria). Margem planejada: 19,6%. Margem real: 16,7%. Crescimento bom, mas controle de desperdício de café urgente.',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Escola de Panificação', emoji: '👨‍🍳',
    cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A Escola Massa Viva planeja turmas trimestralmente. O planejamento de cursos precisa considerar ocupação mínima de turma.',
    planejado: { receita: 24000, compras: 7200, custoFixo: 9600 },
    real: { receita: 21600, compras: 6480, custoFixo: 9600 },
    analise: 'Receita −10% (2 turmas com 8 alunos ao invés de 10 planejados). Compras caíram proporcionalmente. CF fixo (aluguel + instrutor não mudam com 2 alunos a menos). Resultado: lucro caiu de R$7.200 para R$5.520. Ponto de equilíbrio por turma precisa ser recalculado — talvez turmas menores não sejam viáveis.',
  },
];

const dossie = {
  empresa: 'Padaria São Francisco',
  segmento: 'Padaria de bairro — São João do Cariri-CE',
  contexto: 'Seu Manoel tem a padaria há 12 anos. Vende pão francês, bolos e salgados. Fatura bem em junho (São João) mas "passa mal" em fevereiro. Quer entender se vale a pena comprar um segundo forno para dobrar a produção de bolo, mas não sabe como planejar.',
  dados: {
    faturamentoMedioMensal: 18500,
    custoFixoMensal: 5200,
    custoVariavelPerc: 58,
    consumoDiarioFarinha: 12,
    tempoEntregaFornecedor: 4,
    estoqueSeguranca: 25,
    investimentoForno: 8800,
    aumentoProducaoPerc: 40,
    aumentoCFMensal: 900,
  },
  historico: [
    { mes: 'Jan', receita: 14200, lucro: 1620 },
    { mes: 'Fev', receita: 12800, lucro: 340 },
    { mes: 'Mar', receita: 16400, lucro: 2900 },
    { mes: 'Abr', receita: 17100, lucro: 3180 },
    { mes: 'Mai', receita: 18500, lucro: 3780 },
    { mes: 'Jun', receita: 31200, lucro: 10850 },
    { mes: 'Jul', receita: 19400, lucro: 4180 },
    { mes: 'Ago', receita: 17800, lucro: 3340 },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      dica: { titulo: 'Ponto de Pedido — Gestão de Estoque', formula: 'Ponto de Pedido = Consumo diário × Lead time + Estoque de Segurança\n\nEstoque de Segurança = Consumo diário × Dias de variação\nLead time = prazo de entrega do fornecedor', raciocinio: 'O ponto de pedido é o nível de estoque que sinaliza "hora de pedir". Calcule: consumo diário × dias de entrega + segurança. Quando o estoque atingir esse nível, faça o pedido.' },
      
      contexto: 'Com consumo de 12 sacos/dia de farinha, tempo de entrega de 4 dias e estoque de segurança de 25 sacos, qual o Ponto de Pedido? O que acontece se Seu Manoel ignorar isso?',
      opcoes: [
        { id: 'a', texto: 'PP = 73 sacos. Se ignorar, pode ficar sem farinha em datas críticas como São João' },
        { id: 'b', texto: 'PP = 48 sacos. Risco baixo, a padaria tem histórico de 12 anos sem problema' },
        { id: 'c', texto: 'PP = 25 sacos. O estoque de segurança sozinho é suficiente' },
        { id: 'd', texto: 'PP = 60 sacos. Deve pedir quando tiver exatamente 5 dias de estoque' },
      ],
      correta: 'a',
      explicacao: 'PP = (Consumo × Tempo de entrega) + ES = (12 × 4) + 25 = 73 sacos. Se Seu Manoel só pedir quando estiver "acabando", em Junho (São João) — com vendas dobradas — pode ficar sem farinha num sábado de festa. Negócio parado no pico de vendas do ano é prejuízo irreparável. O PP em Junho precisa ser recalculado com o consumo maior (provavelmente 20-25 sacos/dia).',
    },
    {
      id: 'c2',
      dica: { titulo: 'Sazonalidade e Variação Mensal', formula: 'Variação = (Mês pico − Mês vale) ÷ Média\n\nReserva mínima = CF × meses de variação\n\nIndice de sazonalidade = Mês ÷ Média anual\n→ > 1: acima da média (pico)\n→ < 1: abaixo da média (vale)', raciocinio: 'Calcule a diferença entre o melhor e o pior mês. Essa diferença precisa estar coberta pela reserva de emergência. Negócios com alta sazonalidade precisam de mais reserva.' },
      
      contexto: 'Analisando o histórico de 8 meses, qual a variação entre o melhor e o pior mês e o que isso significa para o planejamento financeiro anual?',
      opcoes: [
        { id: 'a', texto: 'Variação de 144% (Fev R$340 vs Jun R$10.850). Exige reserva robusta para sustentar os meses fracos' },
        { id: 'b', texto: 'Variação de 50%. Normal para qualquer negócio, sem necessidade de reserva específica' },
        { id: 'c', texto: 'Variação de 70%. O problema é operacional — basta melhorar as vendas em Fevereiro' },
        { id: 'd', texto: 'Variação de 144%, mas Junho é exceção. O planejamento deve ignorar meses atípicos' },
      ],
      correta: 'a',
      explicacao: 'Fevereiro lucro R$340, Junho R$10.850 — variação de 3.088%! A sazonalidade é extrema. Um consultor recomendaria: (1) Reserva mensal mínima nos meses bons para cobrir Jan/Fev; (2) Não contratar funcionário fixo para São João — usar temporário; (3) Pré-investir em insumos de Junho em Abril quando os preços estão normais. Ignorar a sazonalidade e gastar o lucro de Junho garantidamente gera crise em Fevereiro.',
    },
    {
      id: 'c3',
      dica: { titulo: 'Viabilidade de Expansão com Novo CF', formula: 'Receita extra = capacidade extra × preço médio\nMC extra = receita extra × MC%\nLucro extra = MC extra − CF adicional\n\nExpansão viável se: Lucro extra > 0\nPayback = CF adicional ÷ Lucro extra', raciocinio: 'Calcule quanto o novo equipamento gera de receita extra. Aplique a margem de contribuição. Subtraia o custo fixo adicional (financiamento + manutenção). Se sobrar lucro, a expansão é viável.' },
      
      contexto: 'O segundo forno custa R$8.800 e aumenta a capacidade em 40% (principalmente bolos). O CF mensal sobe R$900 (energia + manutenção). Com faturamento médio atual de R$18.500, qual o payback do investimento?',
      opcoes: [
        { id: 'a', texto: 'Payback de 6 meses se a receita adicional cobrir o novo CF — mas precisa confirmar demanda antes' },
        { id: 'b', texto: 'Payback de 10 meses — o investimento só se paga após Junho do ano seguinte' },
        { id: 'c', texto: 'Payback imediato — a capacidade extra vai ser usada no primeiro São João' },
        { id: 'd', texto: 'Payback de 18 meses — muito longo, investimento não recomendado' },
      ],
      correta: 'a',
      explicacao: 'Aumento de receita esperado: 40% do faturamento de bolos (estimar ~25% da receita = R$4.625/mês extra se vender tudo). Após pagar CF adicional R$900, lucro extra ≈ R$3.725/mês. Payback = R$8.800 ÷ R$3.725 ≈ 2,4 meses. Mas atenção: o consultor não recomenda comprar antes de ter a demanda confirmada. Sugestão: aceitar encomendas de bolo para São João antecipadamente — se a demanda confirmar, comprar o forno em Abril.',
    },
    {
      id: 'c4',
      dica: { titulo: 'Reserva de Emergência Mínima', formula: 'Reserva mínima = CF × 3 meses\n\nOU\n\nReserva = (Mês pior − Mês médio) × 2\n\nManter em: CDB liquidez diária ou Tesouro Selic', raciocinio: 'A reserva cobre os meses ruins sem precisar de empréstimo emergencial. Se o pior mês gerou quase prejuízo, a reserva precisa cobrir pelo menos o custo fixo por 3 meses.' },
      
      contexto: 'Fevereiro foi quase catastrófico (lucro R$340). Qual reserva mínima Seu Manoel deveria ter constituído nos meses anteriores para atravessar Fevereiro com tranquilidade?',
      opcoes: [
        { id: 'a', texto: 'Reserva de R$5.200 (1 mês de custo fixo) — suficiente para cobrir o pior cenário' },
        { id: 'b', texto: 'Reserva de R$15.600 (3 meses de custo fixo) — padrão recomendado para negócios sazonais' },
        { id: 'c', texto: 'Não precisa de reserva — pode usar cheque especial nos meses ruins' },
        { id: 'd', texto: 'Reserva de R$2.600 (metade de 1 mês) — suficiente para um negócio estabelecido' },
      ],
      correta: 'b',
      explicacao: 'Para negócios sazonais, a reserva recomendada é de 3 meses de custos fixos: 3 × R$5.200 = R$15.600. Em Fevereiro, a padaria quase não gerou caixa (R$340 de lucro vs R$5.200 de CF mensal). Sem reserva, Seu Manoel precisaria de empréstimo emergencial a 8-10% a.m. Com reserva acumulada nos meses bons (especialmente Junho: R$10.850 de lucro), Jan/Fev são absorvidos sem crise. A reserva deve ser separada em conta específica — não misturada com o caixa operacional.',
    },
    {
      id: 'c5',
      dica: { titulo: 'Recomendação Completa de Consultor', formula: 'Estrutura da recomendação:\n1. Diagnóstico atual (PE, reserva, tendência)\n2. Viabilidade da expansão (payback, CF novo)\n3. Pré-requisito: reserva mínima constituída\n4. Sequência: reserva → depois expansão', raciocinio: 'A ordem importa: nunca recomendar expansão antes de constituir reserva. Se a reserva ainda não existe, o plano é: (1) poupar para a reserva, (2) expandir quando estiver coberto.' },
      
      contexto: 'Qual é sua recomendação completa como consultor para Seu Manoel sobre o segundo forno e o planejamento do próximo ano?',
      opcoes: [
        { id: 'a', texto: 'Comprar o forno imediatamente aproveitando o bom momento — Janeiro é hora de investir' },
        { id: 'b', texto: 'Não comprar — a sazonalidade é risco demais para aumentar custos fixos' },
        { id: 'c', texto: 'Plano 3 etapas: (1) Constituir reserva de R$15.600 até Abril; (2) Pré-vender encomendas de bolo para São João; (3) Se demanda confirmar, comprar o forno em Abril pagando com o caixa de Junho' },
        { id: 'd', texto: 'Financiar o forno em 12x e usar o lucro de Junho para quitar — risco controlado' },
      ],
      correta: 'c',
      explicacao: 'Esta é a recomendação de um consultor experiente: baseada em dados, escalonada e que minimiza risco. Etapa 1: reserva elimina a crise de Jan/Fev. Etapa 2: pré-vendas de bolo confirmam a demanda real antes do investimento (evita comprar capacidade que não será usada). Etapa 3: comprar o forno com caixa próprio de Junho é a melhor opção financeira — sem juros, sem risco de endividamento. O financiamento (opção D) a 2-3% a.m. em 12x custa R$1.000-1.500 de juros desnecessários quando o dinheiro estará disponível em 3-4 meses.',
    },
  ],
};

export default function PadariaConsultoriaPlanejamento() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const lucroPlaneado = ex.planejado.receita - ex.planejado.compras - ex.planejado.custoFixo;
  const lucroReal = ex.real.receita - ex.real.compras - ex.real.custoFixo;
  const desvioR = ((ex.real.receita - ex.planejado.receita) / ex.planejado.receita * 100).toFixed(1);
  const desvioC = ((ex.real.compras - ex.planejado.compras) / ex.planejado.compras * 100).toFixed(1);
  const desvioL = ((lucroReal - lucroPlaneado) / Math.abs(lucroPlaneado) * 100).toFixed(1);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/planejamento')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><TrendingUp size={22} color={COR} /> Consultoria: Planejamento Financeiro</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(234,179,8,0.08) 100%)', borderColor: 'rgba(168,85,247,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Planejamento Financeiro
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Logística, Sazonalidade e a Decisão do Segundo Forno</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Na padaria, planejamento financeiro e logístico são inseparáveis. Falta de farinha no São João ou crise de caixa em Fevereiro têm a mesma causa: <strong style={{ color: 'var(--text-main)' }}>falta de planejamento com dados</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(168,85,247,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#c084fc' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Planejamento Financeiro e Logístico na Padaria</h2>
            {blocosTeoría.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : bloco.cor === '#22c55e' ? '34,197,94' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: bloco.cor, marginBottom: '1rem' }}>{bloco.formula}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {bloco.exemplos.map((ex, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ex}</span>)}
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
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Ver Exemplos Práticos →</button>
          </div>
        </div>
      )}

      {secao === 'exemplos' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {exemplos.map(e => (
              <button key={e.id} onClick={() => setExemploAtivo(e.id)} style={{ flex: 1, minWidth: '160px', padding: '1.25rem', borderRadius: '1rem', border: exemploAtivo === e.id ? `2px solid ${e.cor}` : '2px solid var(--border-color)', background: exemploAtivo === e.id ? e.corBg : 'var(--bg-card)', color: exemploAtivo === e.id ? e.cor : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 600 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{e.emoji}</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', opacity: 0.7 }}>{e.tipo}</div>
                <div style={{ fontSize: '0.95rem' }}>{e.subtipo}</div>
              </button>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${ex.cor}` }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{ex.descricao}</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>📊 Planejado vs. Real</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    {['Item', 'Planejado', 'Real', 'Desvio'].map((h, i) => (
                      <th key={i} style={{ padding: '0.75rem 1rem', textAlign: i === 0 ? 'left' : 'right', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'Receita', plan: ex.planejado.receita, real: ex.real.receita, desv: desvioR },
                    { item: 'Compras/Insumos', plan: ex.planejado.compras, real: ex.real.compras, desv: desvioC },
                    { item: 'Custo Fixo', plan: ex.planejado.custoFixo, real: ex.real.custoFixo, desv: ((ex.real.custoFixo - ex.planejado.custoFixo) / ex.planejado.custoFixo * 100).toFixed(1) },
                    { item: 'Lucro', plan: lucroPlaneado, real: lucroReal, desv: desvioL },
                  ].map((row, i) => {
                    const dv = parseFloat(row.desv);
                    const isCusto = row.item !== 'Receita' && row.item !== 'Lucro';
                    const cor = row.item === 'Lucro' ? (dv >= 0 ? '#22c55e' : '#ef4444') : isCusto ? (dv > 5 ? '#ef4444' : '#22c55e') : (dv >= 0 ? '#22c55e' : '#ef4444');
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontWeight: row.item === 'Lucro' ? 700 : 400 }}>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.item}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{formatBRL(row.plan)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{formatBRL(row.real)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: cor, fontWeight: 600 }}>{dv > 0 ? '+' : ''}{row.desv}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '3px solid #facc15' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Lightbulb size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.25rem' }}>Diagnóstico do consultor:</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ex.analise}</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(168,85,247,0.06)', borderColor: 'rgba(168,85,247,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(168,85,247,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Briefcase size={24} color={COR} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Fat. médio/mês', valor: formatBRL(dossie.dados.faturamentoMedioMensal), cor: '#22c55e' },
                { label: 'Custo Fixo/mês', valor: formatBRL(dossie.dados.custoFixoMensal), cor: '#ef4444' },
                { label: 'CV (% receita)', valor: `${dossie.dados.custoVariavelPerc}%`, cor: '#f59e0b' },
                { label: 'Consumo farinha', valor: `${dossie.dados.consumoDiarioFarinha} sacos/dia`, cor: '#6366f1' },
                { label: 'Forno novo', valor: formatBRL(dossie.dados.investimentoForno), cor: COR },
                { label: 'Capacidade extra', valor: `+${dossie.dados.aumentoProducaoPerc}%`, cor: '#22c55e' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.cor}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.cor }}>{k.valor}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📅 Histórico 8 meses (Receita | Lucro)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem' }}>
              {dossie.historico.map((m, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center', borderTop: m.lucro < 1000 ? '2px solid #ef4444' : m.lucro > 8000 ? '2px solid #22c55e' : '2px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{m.mes}</div>
                  <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>{formatBRL(m.receita)}</div>
                  <div style={{ fontSize: '0.7rem', color: m.lucro < 1000 ? '#ef4444' : m.lucro > 8000 ? '#22c55e' : COR, fontWeight: 700 }}>{formatBRL(m.lucro)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#22c55e' }}>■ Receita / Lucro alto</span>
              <span style={{ color: '#ef4444' }}>■ Lucro crítico (&lt; R$1.000)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pergunta da Consultoria</div>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
                  </div>
                </div>
                                {/* Dica contextual */}
                {q.dica && !enviado && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <button
                      onClick={() => setDicasAbertas(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: dicasAbertas[q.id] ? 'rgba(250,204,21,0.12)' : 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '0.4rem', padding: '0.35rem 0.75rem', color: '#facc15', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      <Lightbulb size={13} />
                      {dicasAbertas[q.id] ? 'Ocultar dica' : '💡 Ver fórmula e raciocínio'}
                    </button>
                    {dicasAbertas[q.id] && (
                      <div style={{ marginTop: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '0.6rem' }}>
                        <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>🧮 {q.dica.titulo}</div>
                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '0.4rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fcd34d', whiteSpace: 'pre-wrap', marginBottom: '0.75rem', lineHeight: 1.7 }}>{q.dica.formula}</pre>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>💬</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{q.dica.raciocinio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(168,85,247,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#c084fc' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#c084fc' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
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
                  <strong style={{ color: '#facc15' }}>Dica do consultor:</strong> olhe o histórico com atenção antes de recomendar. O mês de Fevereiro e o de Junho contam histórias completamente diferentes sobre o mesmo negócio.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : nota >= 60 ? '📊' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Você faria uma consultoria excelente para Seu Manoel!' : nota >= 80 ? 'Muito bom! Revise os raciocínios dos itens errados.' : 'Releia o dossiê — especialmente o histórico e os dados de sazonalidade.'}
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
