import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Tag, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen } from 'lucide-react';

const COR = '#ec4899';
const COR_BG = 'rgba(236,72,153,0.08)';

const exemplos = [
  {
    id: 'industria', tipo: 'Indústria', subtipo: 'Confecção Feminina', emoji: '🧵', cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    descricao: 'A Confecção Bella produz blusas e vende para lojistas. Na indústria têxtil, o preço de atacado precisa garantir margem mesmo com desconto dado ao varejo.',
    itens: [
      { label: 'Custo de produção por blusa (tecido + costura + aviamentos)', valor: 'R$ 28,00', destaque: false },
      { label: 'Embalagem e etiqueta', valor: 'R$ 2,50', destaque: false },
      { label: 'Custo total por peça', valor: 'R$ 30,50', destaque: false },
      { label: 'Margem de atacado desejada (35%)', valor: '35%', destaque: false },
      { label: 'Impostos sobre venda Simples (4%)', valor: '4%', destaque: false },
      { label: 'Divisor = 1 − 0,04 − 0,35', valor: '0,61', destaque: true },
      { label: 'Preço de atacado = R$ 30,50 ÷ 0,61', valor: 'R$ 50,00', destaque: true },
      { label: 'Markup sugerido ao varejista (100%)', valor: 'Venda sugerida: R$ 99,90', destaque: false },
    ],
    conceitos: [
      { termo: 'Preço de Atacado vs. Varejo', def: 'A confecção vende no atacado ao lojista, que revende no varejo ao consumidor. O preço de atacado (R$50) tem margem da fábrica. O preço de varejo (R$99,90) tem margem do lojista. A fábrica não controla o preço final, mas sugere o markup para que o lojista tenha competitividade.' },
      { termo: 'Política de Preço Sugerido', def: 'Confecções bem geridas sugerem o preço de varejo ao lojista para manter a percepção de valor da marca. Se um lojista vende a R$60 e outro a R$99,90, o consumidor vê a peça como "barata demais" e perde confiança na marca.' },
      { termo: 'Escala e Custo Unitário', def: 'Produzir 100 blusas ou 1.000 blusas muda completamente o custo unitário (os custos fixos da fábrica se diluem). A confecção que consegue volume pode baixar o custo e aumentar a margem sem mexer no preço de atacado.' },
    ],
  },
  {
    id: 'comercio', tipo: 'Comércio', subtipo: 'Loja de Moda Jovem', emoji: '👗', cor: COR, corBg: COR_BG,
    descricao: 'A Boutique Trend compra no Brás e revende. No varejo de moda, o markup precisa absorver encalhes, liquidações e comissões do vendedor.',
    itens: [
      { label: 'CMV (custo da peça + frete da compra)', valor: 'R$ 44,00', destaque: false },
      { label: 'Markup desejado sobre custo (150%)', valor: '150%', destaque: false },
      { label: 'Preço teórico = R$ 44 × (1 + 1,50)', valor: 'R$ 110,00', destaque: false },
      { label: 'Ajuste psicológico (final ,90)', valor: 'R$ 109,90', destaque: false },
      { label: 'Imposto Simples 6% sobre venda', valor: 'R$ 6,59', destaque: false },
      { label: 'Comissão vendedora 4% sobre venda', valor: 'R$ 4,40', destaque: false },
      { label: 'Taxa cartão 3,5%', valor: 'R$ 3,85', destaque: false },
      { label: 'Lucro líquido real por peça', valor: 'R$ 51,06 (46,5%)', destaque: true },
      { label: 'Se entrar em liquidação (−40%): preço R$ 65,90', valor: 'Lucro: R$ 6,32 (9,6%)', destaque: true },
    ],
    conceitos: [
      { termo: 'Margem para Liquidação', def: 'Markup de 150% não é ganância — é necessidade. Se a loja precisar liquidar 30% do estoque a −40%, as peças que giram no preço cheio precisam ter margem suficiente para compensar. O markup alto é o "seguro" contra o encalhe.' },
      { termo: 'Preço Psicológico Final ,90', def: 'R$ 109,90 converte melhor que R$ 110,00 porque o cérebro registra a centena (100) primeiro. É um centavo a menos de diferença real, mas percepção de valor completamente diferente. Moda é o setor onde mais se usa esse recurso.' },
      { termo: 'DRE Unitário por Peça', def: 'Toda peça vendida gera uma mini-DRE: receita − CMV − impostos − comissão − cartão = lucro. Saber o lucro por peça permite calcular quantas peças precisam vender para pagar os custos fixos da loja (ponto de equilíbrio).' },
    ],
  },
  {
    id: 'servico', tipo: 'Serviço', subtipo: 'Personal Stylist', emoji: '✨', cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)',
    descricao: 'A personal stylist Carol cobra por consultoria de imagem. No serviço criativo, a precificação envolve o valor percebido, não apenas o custo.',
    itens: [
      { label: 'Tempo de atendimento por cliente (3h)', valor: '3h', destaque: false },
      { label: 'Valor-hora desejado da profissional', valor: 'R$ 80/h', destaque: false },
      { label: 'Custo do tempo: 3h × R$80', valor: 'R$ 240,00', destaque: false },
      { label: 'Material: moodboard + transporte', valor: 'R$ 35,00', destaque: false },
      { label: 'Custo total por cliente', valor: 'R$ 275,00', destaque: false },
      { label: 'Margem desejada (30%)', valor: '30%', destaque: false },
      { label: 'Taxa cartão (3%)', valor: '3%', destaque: false },
      { label: 'Divisor = 1 − 0,03 − 0,30', valor: '0,67', destaque: true },
      { label: 'Preço mínimo = R$ 275 ÷ 0,67', valor: 'R$ 410,45', destaque: true },
      { label: 'Preço praticado (valor percebido + posicionamento)', valor: 'R$ 450,00', destaque: false },
    ],
    conceitos: [
      { termo: 'Preço Mínimo vs. Preço de Posicionamento', def: 'O markup divisor calcula o preço mínimo para não ter prejuízo. Mas em serviços criativos, o preço comunica posicionamento. Uma consultora que cobra R$150/h é percebida como mais qualificada do que uma que cobra R$50/h — mesmo com qualidade idêntica. O preço é parte do produto.' },
      { termo: 'Escassez Artificial e Alta Demanda', def: 'Se uma personal stylist tem agenda lotada com 3 semanas de espera, é sinal de que o preço está baixo. Aumentar o preço reduz a demanda para um nível sustentável e aumenta a receita com menos horas trabalhadas.' },
      { termo: 'Pacotes vs. Hora Avulsa', def: 'Vender pacotes (ex: 3 consultorias por R$1.200 em vez de R$450 cada) cria previsibilidade de receita e fideliza o cliente. O desconto percebido (R$150 vs pagar avulso) é atraente, mas a receita garantida compensa a margem menor.' },
    ],
  },
];

const questoes = [
  {
    id: 'q1',
    dica: { titulo: 'Markup Divisor — A Fórmula Correta', formula: 'Preço = Custo ÷ (1 − taxas − margem)\n\nDivisor = 1 − imposto% − comissão% − cartão% − margem%\n\nEx: 1 − 0,03 − 0,05 − 0,02 − 0,25 = 0,65\nPreço = R$10 ÷ 0,65 = R$15,38', raciocinio: 'Junte todas as taxas que incidem sobre o PREÇO de venda. Subtraia de 1. Divida o custo por esse número. O resultado garante matematicamente a margem desejada.' },
    enunciado: 'Uma loja compra blusas por R$ 35,00 (landed cost completo). Aplica markup de 120%. Qual o preço de vitrine antes do ajuste psicológico?',
    opcoes: [
      { id: 'a', texto: 'R$ 77,00' },
      { id: 'b', texto: 'R$ 70,00' },
      { id: 'c', texto: 'R$ 42,00' },
      { id: 'd', texto: 'R$ 56,00' },
    ],
    correta: 'a',
    explicacao: 'Markup sobre custo: R$35 × (1 + 1,20) = R$35 × 2,20 = R$77,00. No varejo de moda, o markup é aplicado sobre o custo (CMV + frete + todos os custos de aquisição). O ajuste psicológico posterior seria R$76,90 ou R$79,90 conforme estratégia.',
  },
  {
    id: 'q2',
    dica: { titulo: '+X% no Custo vs Markup Divisor', formula: 'Método errado: Preço = Custo × (1 + margem%)\n→ A margem calculada é SOBRE O CUSTO\n\nMarkup divisor: Preço = Custo ÷ (1 − margem%)\n→ A margem é SOBRE O PREÇO\n\nEx: custo R$10, margem 30%:\nErrado: R$13,00 (margem real = 23%)\nCorreto: R$14,29 (margem real = 30%)', raciocinio: 'Margem sobre o custo ≠ margem sobre o preço. No Brasil, a convenção comercial é calcular margem sobre o preço de venda. O markup divisor garante essa equivalência.' },
    enunciado: 'A loja precisa liquidar 40% do estoque encalhado com desconto de 50%. O custo médio das peças é R$ 40. O preço de vitrine é R$ 99,90. Qual o resultado na liquidação?',
    opcoes: [
      { id: 'a', texto: 'Prejuízo de R$ 10,05 por peça' },
      { id: 'b', texto: 'Lucro de R$ 9,95 por peça' },
      { id: 'c', texto: 'Prejuízo de R$ 5,00 por peça' },
      { id: 'd', texto: 'Lucro de R$ 49,95 por peça' },
    ],
    correta: 'b',
    explicacao: 'Preço na liquidação: R$99,90 × 50% = R$49,95. Lucro bruto = R$49,95 − R$40 = R$9,95 por peça. Ainda positivo! Por isso o markup alto (R$99,90 sobre custo R$40) existe — para garantir que mesmo na liquidação a peça não gera prejuízo. Se o markup fosse menor (ex: preço R$60), liquidação a 50% seria R$30, abaixo do custo.',
  },
  {
    id: 'q3',
    dica: { titulo: 'Incluindo Taxas no Divisor', formula: 'Taxas que entram NO DIVISOR\n(incidem sobre o preço de venda):\n• Imposto (Simples, ISS)\n• Comissão de plataforma (iFood, Rappi)\n• Taxa de cartão\n• Comissão de vendedor\n\nNÃO entram no divisor:\n• CMV (já é o custo base)\n• Custos fixos', raciocinio: 'O divisor só recebe taxas percentuais que são descontadas do preço de venda. O CMV já está no numerador. Misturar os dois é o erro mais comum de precificação.' },
    enunciado: 'Por que o varejo de moda pratica markups de 150% a 300% sobre o custo, enquanto supermercados praticam 20% a 40%?',
    opcoes: [
      { id: 'a', texto: 'Porque roupas têm custo de produção maior que alimentos' },
      { id: 'b', texto: 'Para compensar encalhe, sazonalidade, liquidações e percepção de valor mais subjetiva' },
      { id: 'c', texto: 'Porque os consumidores de moda são mais ricos e aceitam pagar mais' },
      { id: 'd', texto: 'Porque os custos fixos das lojas de moda são maiores que os de supermercados' },
    ],
    correta: 'b',
    explicacao: 'Supermercados têm giro altíssimo (produto vendido em dias) e perdas baixas. Moda tem giro baixo (peça pode ficar meses na arara), encalhe frequente, sazonalidade intensa (coleção de inverno não vende no verão) e precisa de liquidações. Além disso, o valor percebido de uma roupa é subjetivo — o cliente paga pelo estilo e marca, não apenas pelo tecido.',
  },
  {
    id: 'q4',
    dica: { titulo: 'Margem de Contribuição e Preço', formula: 'MC% = (Preço − CV) ÷ Preço × 100\nMC$ = Preço × MC%\n\nRelação com Markup Divisor:\nSe Divisor = 1 − taxas − margem\nEntão MC% = margem\n\nPE = CF ÷ MC%\nVerifique: MC% × faturamento > CF?', raciocinio: 'A margem no markup divisor é exatamente a MC%. Depois de calcular o preço, verifique se a MC% gerada é suficiente para cobrir os custos fixos.' },
    enunciado: 'Uma personal stylist cobra R$ 300 por atendimento. Calcula que seu custo (tempo + material) é R$ 200. Ela acha que tem 33% de margem. Considerando 5% de taxa de cartão, qual a margem real?',
    opcoes: [
      { id: 'a', texto: '28% — subtrai a taxa da margem percebida' },
      { id: 'b', texto: '30% — a taxa é pequena e não muda muito' },
      { id: 'c', texto: '28,3% — (R$300 − R$200 − R$15) ÷ R$300' },
      { id: 'd', texto: '33% — a taxa é paga pelo cliente no parcelamento' },
    ],
    correta: 'c',
    explicacao: 'Taxa cartão = R$300 × 5% = R$15. Lucro real = R$300 − R$200 − R$15 = R$85. Margem real = R$85 ÷ R$300 = 28,3%. A margem "percebida" de 33% (R$100 ÷ R$300) ignora que a taxa incide sobre o preço de venda. A diferença de 4,7 pontos percentuais parece pequena, mas em escala (ex: 20 clientes/mês) representa R$300/mês a menos.',
  },
  {
    id: 'q5',
    dica: { titulo: 'Preço Mínimo e Preço Máximo', formula: 'Preço mínimo = Custo ÷ (1 − taxas obrigatórias)\n→ MC% = 0 (não tem lucro, mas não perde)\n\nPreço ideal = Custo ÷ (1 − taxas − margem desejada)\n\nPreço máximo = determinado pelo mercado\n\nZona de lucro: entre mínimo e máximo', raciocinio: 'O preço mínimo é onde a MC = 0 (só cobre impostos e CV). Nunca venda abaixo disso. O preço ideal é o calculado pelo markup divisor. O preço máximo é o que o cliente aceita pagar.' },
    enunciado: 'Qual das afirmações abaixo sobre precificação em moda é INCORRETA?',
    opcoes: [
      { id: 'a', texto: 'O markup alto é parcialmente uma reserva para cobrir futuras liquidações' },
      { id: 'b', texto: 'Preço R$ 99,90 converte melhor que R$ 100,00 por razões psicológicas' },
      { id: 'c', texto: 'O preço do canal iFood/marketplace deve ser igual ao preço da loja física' },
      { id: 'd', texto: 'O custo do frete da viagem de compra no atacado deve entrar no CMV da peça' },
    ],
    correta: 'c',
    explicacao: 'A afirmação incorreta é a C. O preço no marketplace DEVE ser maior que na loja física, pois plataformas cobram comissões de 10% a 30% sobre a venda. Usar o mesmo preço significa ceder essa comissão de dentro da sua margem. As demais afirmações estão corretas: markup absorve liquidações (A), preço psicológico funciona (B), e frete de compra é parte do CMV (D).',
  },
];

export default function ModaConsultoriaPrecificacao() {
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

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/moda/precificacao')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Tag size={22} color={COR} /> Consultoria: Precificação</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Moda · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.08) 100%)', borderColor: 'rgba(236,72,153,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Precificação
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Markup Selvagem, Preço Psicológico e Liquidação</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          No varejo de moda, markup de 150% não é luxo — é sobrevivência. Entenda por que o encalhe, a sazonalidade e as plataformas digitais exigem margens altas para um negócio sustentável.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Seu Desafio' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? COR_BG : 'var(--bg-card)', color: secao === s.id ? COR : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Fundamentos da Precificação no Varejo de Moda</h2>
            {[
              { titulo: '1. Por que Markup Alto em Moda?', cor: '#ec4899', emoji: '🎯', def: 'Supermercado vende arroz em 3 dias — não sobra estoque. Loja de roupa pode ter uma blusa parada 4 meses. O markup alto é a reserva financeira para cobrir: encalhe (peças não vendidas), sazonalidade (inverno não vende em novembro), liquidações necessárias e custo de capital imobilizado no estoque.', formula: 'Markup mínimo = 1 ÷ (1 − % encalhe estimado − % margem desejada − % deduções)', exemplos: ['30% do estoque pode encalhar em cada coleção', 'Liquidação de −40% precisa ainda cobrir o CMV', 'Capital preso 4 meses no estoque tem custo financeiro', 'Markup 150% garante margem mesmo vendendo a −40%'], alerta: 'Uma loja que liquida a −50% e ainda tem lucro provavelmente praticou markup de 200%+. Não é absurdo — é planejamento.' },
              { titulo: '2. Preço Psicológico e Final ,90', cor: '#f59e0b', emoji: '🧠', def: 'O preço ,90 ou ,99 explora a forma como o cérebro processa números. R$99,90 é percebido como "na casa dos 90" enquanto R$100,00 é "três dígitos". Em moda jovem, onde o público é sensível a preço mas não quer parecer "barato", o final ,90 equilibra percepção de acessibilidade com imagem de valor.', formula: 'Preço final = ceil(preço calculado / 10) × 10 − 0,10', exemplos: ['Preço calculado R$97,50 → arredonda para R$99,90', 'R$113,20 → R$119,90 (próxima dezena − 0,10)', 'Nunca arredonde para baixo da dezena (R$89,90 para R$87,90)', 'R$49,90 converte melhor que R$50,00 em pesquisas'], alerta: 'O arredondamento sempre vai para cima — nunca prejudique sua margem para ter um número "bonito". R$99,90 é sempre melhor que R$98,00.' },
              { titulo: '3. DRE Unitário: O Lucro Real por Peça', cor: '#6366f1', emoji: '📊', def: 'Cada peça vendida tem sua própria Demonstração de Resultado: receita − CMV − impostos − comissão − taxa de cartão = lucro por peça. Conhecer esse número permite calcular quantas peças precisam ser vendidas por dia para pagar o aluguel, os salários e ainda ter sobra.', formula: 'Lucro/peça = Preço − CMV − Impostos − Comissão − Taxa cartão', exemplos: ['Preço R$109,90, CMV R$44, imposto R$6,59, comissão R$4,40, cartão R$3,85', 'Lucro = R$109,90 − R$44 − R$6,59 − R$4,40 − R$3,85 = R$51,06', 'Aluguel R$3.000 ÷ R$51,06/peça = 59 peças para pagar o aluguel', 'Saber isso permite definir meta diária de vendas'], alerta: 'Donos de loja que não calculam o DRE unitário não sabem quantas peças precisam vender por dia para ser lucrativo. Operam no escuro.' },
              { titulo: '4. Precificação por Canal', cor: '#22c55e', emoji: '📱', def: 'Preço da loja física ≠ preço no Instagram ≠ preço no marketplace. Cada canal tem custo diferente. No marketplace (Shein, Shopee, Instagram Shopping), comissões de 12% a 25% precisam ser absorvidas no preço. Canal próprio (WhatsApp, loja física) tem margem cheia.', formula: 'Preço canal = CMV ÷ (1 − comissão canal − impostos − margem)', exemplos: ['Loja física: sem comissão de canal, maior margem', 'Instagram Direct: sem taxa de plataforma, usar preço da loja', 'Shopee: 14% comissão + 3,5% cartão → divisor menor', 'Atacado para revendedoras: volume alto, aceitar margem menor'], alerta: 'Precificar igual em todos os canais é presentear as plataformas com sua margem. Cada canal exige sua própria planilha de preço.' },
            ].map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#ec4899' ? '236,72,153' : bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#6366f1' ? '99,102,241' : '34,197,94'}, 0.06)`, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setExpandido(p => ({ ...p, [idx]: !p[idx] }))}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: bloco.cor }}><span>{bloco.emoji}</span> {bloco.titulo}</h3>
                  {expandido[idx] ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
                {expandido[idx] && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.7 }}>{bloco.def}</p>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: bloco.cor, marginBottom: '1rem' }}>{bloco.formula}</div>
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
            <h3 style={{ marginBottom: '1.5rem', color: ex.cor }}>📊 Formação do Preço — {ex.subtipo}</h3>
            {ex.itens.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', marginBottom: '0.5rem', background: item.destaque ? `rgba(${ex.cor === '#f59e0b' ? '245,158,11' : ex.cor === '#ec4899' ? '236,72,153' : '168,85,247'}, 0.1)` : 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: item.destaque ? `1px solid ${ex.cor}` : '1px solid transparent' }}>
                <span style={{ color: item.destaque ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: item.destaque ? 600 : 400 }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.destaque ? ex.cor : 'var(--text-muted)' }}>{item.valor}</span>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: ex.cor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={20} /> Conceitos-chave</h3>
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
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para o Desafio 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(236,72,153,0.06)', borderColor: 'rgba(236,72,153,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} color={COR} /> Desafio: Precificação no Varejo de Moda
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Markup, liquidação, preço psicológico e precificação por canal — aplique tudo que aprendeu.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {questoes.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.enunciado}</p>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.opcoes.map(op => (
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(236,72,153,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? COR : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <button className="btn-primary" onClick={() => setEnviado(true)} disabled={Object.keys(respostas).length < questoes.length} style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: COR, border: 'none', opacity: Object.keys(respostas).length < questoes.length ? 0.5 : 1, cursor: Object.keys(respostas).length < questoes.length ? 'not-allowed' : 'pointer' }}>
                Enviar Respostas ({Object.keys(respostas).length}/{questoes.length})
              </button>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 70 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {questoes.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Excelente! Você domina precificação no varejo de moda!' : nota >= 70 ? 'Muito bom! Releia as explicações dos erros.' : 'Revise a teoria sobre markup e liquidação em moda.'}
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
