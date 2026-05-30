import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Tag, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen } from 'lucide-react';

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Fábrica de Biscoitos', emoji: '🍪', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Biscoitaria Bela produz 5.000 unidades/mês. Na indústria, o markup precisa absorver quebras de produção e custos indiretos.',
    itens: [
      { label: 'Custo variável por biscoito (ingredientes + embalagem)', valor: 'R$ 0,85', destaque: false },
      { label: 'Custo fixo rateado por unidade', valor: 'R$ 0,40', destaque: false },
      { label: 'Custo total unitário', valor: 'R$ 1,25', destaque: false },
      { label: 'Taxa do distribuidor (12% sobre venda)', valor: '12%', destaque: false },
      { label: 'Margem líquida desejada', valor: '18%', destaque: false },
      { label: 'Divisor = 1 − 0,12 − 0,18', valor: '0,70', destaque: true },
      { label: 'Preço ao distribuidor = R$ 1,25 ÷ 0,70', valor: 'R$ 1,79 / unidade', destaque: true },
      { label: 'Preço por caixa (12 unidades)', valor: 'R$ 21,43', destaque: false },
    ],
    conceitos: [
      { termo: 'Canal de Distribuição e Markup', def: 'Quando a fábrica vende para um distribuidor, a comissão do distribuidor é uma dedução sobre o preço — entra no divisor. Se vende direto ao consumidor, essa dedução some e a margem aumenta.' },
      { termo: 'Custo Fixo Rateado', def: 'O aluguel da fábrica e os salários fixos devem ser rateados por unidade produzida. Quanto maior a produção, menor o custo fixo por unidade — incentivo para produzir em escala.' },
      { termo: 'Preço por Lote vs. Unitário', def: 'Biscoitos raramente são vendidos unitariamente. O preço por caixa ou por quilo é mais prático comercialmente. O markup é calculado por unidade e depois multiplicado para o lote.' },
    ],
    alertaProfessor: 'Ponto pedagógico: mostrar como a mesma lógica de markup divisor se aplica mesmo quando o produto é vendido em lotes.',
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Padaria Tradicional', emoji: '🥖', cor: '#eab308', corBg: 'rgba(234,179,8,0.08)',
    descricao: 'A Padaria Pão Quente vende pão francês. No varejo de panificação, a quebra de balcão é variável crítica na precificação.',
    itens: [
      { label: 'Custo por kg de pão (após yield da batelada)', valor: 'R$ 4,20 / kg', destaque: false },
      { label: 'Quebra de balcão estimada (pão amanhecido)', valor: '12%', destaque: false },
      { label: 'Custo corrigido pela quebra = R$4,20 ÷ (1 − 0,12)', valor: 'R$ 4,77 / kg', destaque: true },
      { label: 'Markup sobre custo desejado', valor: '150%', destaque: false },
      { label: 'Preço na lousa = R$4,77 × (1 + 1,50)', valor: 'R$ 11,93 / kg', destaque: true },
      { label: 'Preço arredondado praticado', valor: 'R$ 11,90 / kg', destaque: false },
      { label: 'Preço por pão de 50g', valor: 'R$ 0,60 / unidade', destaque: false },
    ],
    conceitos: [
      { termo: 'Quebra de Balcão como Custo', def: 'O pão que não é vendido no dia é perdido (ou vendido com grande desconto como farinha de rosca). Quem paga por essa perda é o pão fresco do dia seguinte. Ignorar a quebra significa ter lucro menor do que o calculado.' },
      { termo: 'Markup Sobre Custo vs. Divisor', def: 'Na padaria tradicional, muitos usam markup sobre custo (multiplicar por 1+X). Isso é válido quando não há grandes deduções percentuais sobre a venda — como impostos MEI (fixos) e ausência de cartão. Com cartão e iFood, muda para o divisor.' },
      { termo: 'Preço por Peso × Preço por Unidade', def: 'O cliente compra pelo número de pães, mas a padaria precifica por quilo. O preço por unidade de 50g = Preço/kg × 0,050. Um kg a R$ 11,90 = R$ 0,60 por pão — o que parece barato e é fácil para o cliente comprar mais.' },
    ],
    alertaProfessor: 'Debate: por que a quebra de balcão deve ser incluída no custo antes do markup, e não depois? (Resposta: porque é um custo de produção inevitável, não uma despesa administrativa.)',
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Doceria por Encomenda', emoji: '🎂', cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A Doceria da Cris faz bolos personalizados sob encomenda. No serviço por projeto, o custo do tempo e a complexidade precisam entrar no preço.',
    itens: [
      { label: 'Custo dos ingredientes (bolo 2kg)', valor: 'R$ 45,00', destaque: false },
      { label: 'Tempo de preparo: 4h × R$ 25/h', valor: 'R$ 100,00', destaque: false },
      { label: 'Embalagem e decoração', valor: 'R$ 15,00', destaque: false },
      { label: 'Custo total do projeto', valor: 'R$ 160,00', destaque: false },
      { label: 'Taxa de pagamento (Pix isento, cartão 3%)', valor: '0% a 3%', destaque: false },
      { label: 'Margem desejada', valor: '25%', destaque: false },
      { label: 'Divisor (com cartão) = 1 − 0,03 − 0,25', valor: '0,72', destaque: true },
      { label: 'Preço mínimo = R$ 160 ÷ 0,72', valor: 'R$ 222,22', destaque: true },
      { label: 'Preço praticado (arredondado)', valor: 'R$ 230,00', destaque: false },
    ],
    conceitos: [
      { termo: 'Precificação por Projeto', def: 'Em serviços sob encomenda, o preço é calculado por projeto completo, não por unidade. Cada bolo tem custo diferente conforme tamanho, complexidade e tempo de decoração. O markup é aplicado sobre o custo total do projeto.' },
      { termo: 'Precificar o Tempo', def: 'A doceira que gasta 4 horas em um bolo e não cobra pelo seu tempo está trabalhando de graça. Definir um valor-hora (ex: R$ 25/h) e incluí-lo no custo é fundamental para serviços criativos.' },
      { termo: 'Canal de Pagamento e Margem', def: 'Pix não tem taxa — venda no Pix com margem cheia. Cartão de crédito tem taxa de 3% a 5% — informe o cliente que preço à vista (Pix) é diferente do parcelado. Ou já calcule com a taxa no divisor.' },
    ],
    alertaProfessor: 'Reflexão: muitas doceiras cobram o que "acham justo" sem calcular. Mostrar o quanto perdem ao não precificar o tempo é impactante.',
  },
];

const questoes = [
  {
    id: 'q1',
    enunciado: 'Uma padaria tem custo por kg de pão de R$ 4,00 e quebra de balcão de 10%. Qual o custo real por kg após considerar a quebra?',
    opcoes: [
      { id: 'a', texto: 'R$ 4,00 — a quebra não afeta o custo do kg vendido' },
      { id: 'b', texto: 'R$ 4,40 — adiciona 10% de perda ao custo' },
      { id: 'c', texto: 'R$ 4,44 — divide pelo complemento: R$4 ÷ 0,90' },
      { id: 'd', texto: 'R$ 3,60 — desconta os 10% perdidos' },
    ],
    correta: 'c',
    explicacao: 'Se 10% da produção é perdida, apenas 90% é vendida normalmente. O custo de fazer 100% é dividido por 90% das unidades vendidas: R$4,00 ÷ 0,90 = R$4,44/kg. Adicionar 10% (alternativa B) seria R$4,40, um resultado próximo mas matematicamente impreciso.',
  },
  {
    id: 'q2',
    enunciado: 'Uma doceira gasta 3h para decorar um bolo. Seu valor-hora é R$ 20. Os ingredientes custam R$ 60. Qual o custo total correto do projeto?',
    opcoes: [
      { id: 'a', texto: 'R$ 60 — o tempo é trabalho dela, não é custo' },
      { id: 'b', texto: 'R$ 80 — custo dos ingredientes + taxa administrativa' },
      { id: 'c', texto: 'R$ 120 — R$60 ingredientes + R$60 tempo (3h × R$20)' },
      { id: 'd', texto: 'R$ 90 — apenas 1,5h de decoração conta como custo' },
    ],
    correta: 'c',
    explicacao: 'O tempo do prestador de serviço é custo real. 3h × R$20/h = R$60 de custo-tempo. Somado aos R$60 de ingredientes, o custo total é R$120. Não considerar o tempo significa trabalhar de graça — um erro comum em doceiros e artesãos iniciantes.',
  },
  {
    id: 'q3',
    enunciado: 'A padaria vende pão francês a R$ 12,90/kg. O custo corrigido é R$ 4,50/kg. Qual o markup sobre custo praticado?',
    opcoes: [
      { id: 'a', texto: 'Aproximadamente 150%' },
      { id: 'b', texto: 'Aproximadamente 187%' },
      { id: 'c', texto: 'Aproximadamente 200%' },
      { id: 'd', texto: 'Aproximadamente 65%' },
    ],
    correta: 'b',
    explicacao: 'Markup = (Preço − Custo) ÷ Custo × 100 = (R$12,90 − R$4,50) ÷ R$4,50 × 100 = R$8,40 ÷ R$4,50 × 100 ≈ 187%. Padarias tradicionais costumam trabalhar com markup de 150% a 250% no pão francês, pois o produto tem alto volume e baixo custo unitário.',
  },
  {
    id: 'q4',
    enunciado: 'Uma padaria começa a aceitar cartão de crédito (taxa 3%) e iFood (comissão 25%). Como isso deve impactar o preço do pão?',
    opcoes: [
      { id: 'a', texto: 'Não muda — essas taxas são absorvidas pelo volume de vendas' },
      { id: 'b', texto: 'O preço no iFood deve ser maior (markup divisor com 25% a mais no divisor)' },
      { id: 'c', texto: 'O preço deve ser reduzido para competir com outros no marketplace' },
      { id: 'd', texto: 'A taxa é paga pelo cliente diretamente, não afeta o preço' },
    ],
    correta: 'b',
    explicacao: 'Cada canal tem sua estrutura de custo. No iFood, a comissão de 25% entra no divisor: Preço = Custo ÷ (1 − 0,25 − margem). O preço no iFood DEVE ser maior do que na loja física. Muitas padarias perdem dinheiro no delivery por não recalcular o preço para cada canal.',
  },
  {
    id: 'q5',
    enunciado: 'Por que o pão amanhecido de ontem deve influenciar o preço do pão fresco de hoje?',
    opcoes: [
      { id: 'a', texto: 'Não deve — são produtos diferentes com custos diferentes' },
      { id: 'b', texto: 'Porque o custo de produção total (incluindo o perdido) é dividido apenas pelas unidades vendidas normalmente' },
      { id: 'c', texto: 'Porque o cliente de hoje deve pagar pelo desperdício do padeiro de ontem' },
      { id: 'd', texto: 'Porque o pão amanhecido vira farinha de rosca e gera receita extra que compensa' },
    ],
    correta: 'b',
    explicacao: 'A padaria gasta R$100 para produzir 100 pães. Se 10 amanhecem e são perdidos (ou vendidos com grande desconto), o custo de R$100 é recuperado pelos 90 pães vendidos normalmente — custo real por pão = R$100 ÷ 90 = R$1,11, não R$1,00. Quem paga a quebra é o pão fresco.',
  },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const DICAS = {
  q1: {
    titulo: `Markup Divisor - A Formula Correta`,
    formula: `Preco = Custo / (1 - taxas - margem)
Divisor = 1 - imposto% - comissao% - cartao% - margem%
Ex: 1 - 0.03 - 0.05 - 0.02 - 0.25 = 0.65
Preco = R$10 / 0.65 = R$15,38`,
    raciocinio: `Reuna todas as taxas que incidem sobre o PRECO de venda. Subtraia de 1. Divida o custo pelo resultado. Garante matematicamente a margem desejada.`,
  },
  q2: {
    titulo: `+X% no Custo vs Markup Divisor`,
    formula: `Metodo errado: Preco = Custo x (1 + margem) -> margem sobre o custo
Markup divisor: Preco = Custo / (1 - margem) -> margem sobre o preco
Ex custo R$10, margem 30%:
Errado: R$13,00 (margem real = 23%)
Correto: R$14,29 (margem real = 30%)`,
    raciocinio: `Margem sobre o custo nao e igual a margem sobre o preco. No Brasil, a convencao comercial e calcular sobre o preco. O markup divisor garante essa equivalencia.`,
  },
  q3: {
    titulo: `Taxas no Divisor`,
    formula: `Entram NO DIVISOR (incidem sobre o preco):
- Imposto (Simples, ISS)
- Comissao de plataforma
- Taxa de cartao
NAO entram no divisor:
- CMV (ja e o custo base)
- Custos fixos`,
    raciocinio: `O divisor so recebe taxas percentuais descontadas do preco. O CMV ja esta no numerador. Misturar os dois e o erro mais comum de precificacao.`,
  },
  q4: {
    titulo: `Margem de Contribuicao e Preco`,
    formula: `MC% = (Preco - CV) / Preco x 100
Relacao com Markup Divisor:
Se Divisor = 1 - taxas - margem
Entao MC% = margem desejada
PE = CF / MC%
Verifique: MC% x faturamento maior que CF?`,
    raciocinio: `A margem no markup divisor e exatamente a MC%. Apos calcular o preco, verifique se a MC% e suficiente para cobrir os custos fixos.`,
  },
  q5: {
    titulo: `Preco Minimo e Maximo`,
    formula: `Preco minimo = Custo / (1 - taxas obrigatorias) -> MC = 0
Preco ideal = Custo / (1 - taxas - margem desejada)
Preco maximo = determinado pelo mercado
Zona de lucro: entre minimo e maximo`,
    raciocinio: `O preco minimo e onde a MC = 0 (so cobre impostos e CV). Nunca venda abaixo disso. O preco ideal e o calculado pelo markup divisor.`,
  },
};

export default function PadariaConsultoriaPrecificacao() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('industria');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const acertos = enviado ? questoes.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / questoes.length) * 100) : 0;

  const COR = '#eab308';

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/precificacao')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Tag size={22} color={COR} /> Consultoria: Precificação</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(245,158,11,0.08) 100%)', borderColor: 'rgba(234,179,8,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234,179,8,0.2)', color: COR, padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Precificação
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>A Psicologia do Cêntimo e a Quebra de Balcão</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Na padaria, o pão que amanheceu ontem afeta o preço do pão de hoje. Entenda como a <strong style={{ color: 'var(--text-main)' }}>quebra de balcão</strong> e o <strong style={{ color: 'var(--text-main)' }}>custo por peso</strong> definem a precificação do varejo de panificação.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Seu Desafio' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(234,179,8,0.12)' : 'var(--bg-card)', color: secao === s.id ? COR : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Fundamentos da Precificação na Panificação</h2>
            {[
              { titulo: '1. O Custo do Kg: Yield e Quebra', cor: '#f59e0b', emoji: '⚖️', def: 'Na padaria, o custo de produção é apurado por batelada (saco de farinha), não por pão. O Yield (rendimento) é quanto kg de pão pronto sai de cada kg de farinha crua — em média 1,3x o peso (a água na massa aumenta o peso). Mas a Quebra de Balcão reduz as unidades vendáveis.', formula: 'Custo real/kg = Custo batelada ÷ kg vendidos normalmente', exemplos: ['Batelada: 50kg farinha → 65kg pão (yield 130%)', '10% de quebra: 65kg × 90% = 58,5kg vendidos normalmente', 'Custo R$400 ÷ 58,5kg = R$6,84/kg real vs. R$6,15/kg sem quebra', 'Diferença de R$0,69/kg pode corroer toda a margem'], alerta: 'Muitas padarias calculam o custo por kg sem considerar a quebra e ficam surpresas com o resultado mensal no caixa.' },
              { titulo: '2. Markup sobre Custo vs. Markup Divisor', cor: '#6366f1', emoji: '🔢', def: 'Padarias tradicionais costumam usar Markup sobre Custo: Preço = Custo × (1 + X%). Isso funciona quando as deduções são fixas (MEI paga valor fixo, não percentual). Quando entram cartão, iFood e Simples Nacional, o Markup Divisor é obrigatório.', formula: 'Com cartão/iFood: Preço = Custo ÷ (1 − taxas% − margem%)', exemplos: ['Só MEI (taxa fixa): Markup sobre custo funciona', 'Com cartão 3%: Markup Divisor obrigatório', 'No iFood (25% comissão): Markup Divisor com divisor 0,50–0,60', 'Canal direto sempre tem margem maior que marketplace'], alerta: 'O erro mais comum de padarias no delivery: usar o mesmo preço da loja física no iFood, perdendo 25% de comissão que não estava no cálculo.' },
              { titulo: '3. Preço Psicológico e Arredondamento', cor: '#22c55e', emoji: '🧠', def: 'R$ 11,90/kg parece menor que R$ 12,00/kg para o cliente, mesmo sendo diferença de 10 centavos. R$ 0,59/pão parece "barato" e estimula o cliente a comprar mais. O arredondamento estratégico sempre vai para cima — nunca prejudique sua margem arredondando para baixo.', formula: 'Preço final = arredondar para cima até o ,90 ou ,99 mais próximo', exemplos: ['R$11,43 → arredonda para R$11,90 (+0,47 de margem extra)', 'R$0,54/pão → arredonda para R$0,59 (+0,05 de margem por pão)', 'R$11,90/kg × 200kg/dia = R$94/dia extra de margem', 'R$ com ,90 ou ,99 vende mais que ,00 (pesquisa de comportamento)'], alerta: 'O preço psicológico não é enganação — é entender como o cliente percebe valor. Um pão a R$0,60 parece mais "caro" que R$0,59, mesmo sendo 1 centavo de diferença.' },
              { titulo: '4. Precificação por Canal de Venda', cor: '#ec4899', emoji: '📱', def: 'Cada canal de venda tem sua estrutura de custo. A padaria física tem custo de operação diferente do delivery. Ter preços diferentes por canal não é desonestidade — é gestão de margem. O cliente do iFood paga mais porque o serviço de entrega tem custo real.', formula: 'Preço canal = Custo ÷ (1 − comissão canal − margem desejada)', exemplos: ['Balcão físico: menor custo, maior margem', 'WhatsApp próprio: sem comissão, preço intermediário', 'iFood/Rappi: 25–30% comissão, preço mais alto', 'Atacado para restaurantes: volume alto, margem menor aceita'], alerta: 'Padaria com delivery que usa o mesmo preço da loja está essencialmente subsidiando a plataforma com sua margem.' },
            ].map((bloco, idx) => (
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
            <button className="btn-primary" onClick={() => setSecao('exemplos')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none', color: '#000' }}>Ver Exemplos Práticos →</button>
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
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>📊 Formação do Preço — {ex.subtipo}</h3>
            {ex.itens.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: item.destaque ? `rgba(${ex.cor === '#f59e0b' ? '245,158,11' : ex.cor === '#eab308' ? '234,179,8' : '168,85,247'}, 0.1)` : 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: item.destaque ? `1px solid ${ex.cor}` : '1px solid transparent' }}>
                <span style={{ color: item.destaque ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: item.destaque ? 600 : 400 }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.destaque ? ex.cor : 'var(--text-muted)' }}>{item.valor}</span>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: ex.cor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={20} /> Conceitos-chave — {ex.tipo}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {ex.conceitos.map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: `3px solid ${ex.cor}` }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: ex.cor, fontSize: '0.9rem' }}>{c.termo}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.def}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none', color: '#000' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color={COR} /> Desafio: Precificação na Padaria
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Questões sobre quebra de balcão, markup e precificação por canal. Aplique os conceitos aprendidos.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {questoes.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(234,179,8,0.2)', color: COR, borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.enunciado}</p>
                </div>
                          {/* Dica contextual */}
                {DICAS[q.id] && !enviado && (
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
                        <div style={{ fontWeight: 700, color: '#facc15', marginBottom: '0.75rem', fontSize: '0.875rem' }}>🧮 {DICAS[q.id].titulo}</div>
                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '0.4rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fcd34d', whiteSpace: 'pre-wrap', marginBottom: '0.75rem', lineHeight: 1.7 }}>{DICAS[q.id].formula}</pre>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>💬</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{DICAS[q.id].raciocinio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(234,179,8,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? COR : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" />}
                      <strong style={{ minWidth: '1rem' }}>{op.id.toUpperCase()})</strong> {op.texto}
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: COR }}>Explicação: </strong>{q.explicacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!enviado ? (
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', color: '#000', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
              </button>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Perfeito! Domina precificação de padaria!' : nota >= 70 ? 'Muito bom! Revise as explicações acima.' : 'Revise a teoria sobre quebra de balcão e markup por canal.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => { setRespostas({}); setEnviado(false); }} style={{ padding: '0.75rem 1.5rem' }}>Tentar Novamente</button>
                <button className="btn-primary" onClick={() => setSecao('teoria')} style={{ padding: '0.75rem 1.5rem', background: COR, border: 'none', color: '#000' }}>Rever Teoria</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
