import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Briefcase, ChevronDown, ChevronUp, CheckCircle2, XCircle, Target, Lightbulb, Award, AlertCircle, BookOpen, TrendingUp } from 'lucide-react';

const COR = '#0ea5e9';
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

function jurosCompostos(pv, taxaMensal, meses) { return pv * Math.pow(1 + taxaMensal / 100, meses); }

const blocos = [
  {
    titulo: '1. Reinvestimento no Negócio vs Tesouro: A Régua Certa', cor: '#f59e0b', emoji: '📏',
    def: 'Para justificar reinvestir no negócio em vez do Tesouro Selic, o ROI mensal do projeto precisa superar a taxa livre de risco (CDI/Selic) mais um prêmio de risco pelo esforço operacional. Para pequenas empresas, o mínimo aceitável é CDI + 3% a.m.',
    formula: 'TMA (Taxa Mínima de Atratividade) = CDI + prêmio de risco\nProjeto viável: ROI mensal > TMA\nROI mensal = Lucro adicional / Investimento × 100',
    exemplos: ['CDI ~0,85%/mês + prêmio risco 3% = TMA 3,85%/mês', 'Projeto com ROI 5%/mês → supera TMA, viável ✅', 'Projeto com ROI 2%/mês → abaixo da TMA, melhor Tesouro ❌', 'Expositor R$25.000 / lucro R$2.500/mês = ROI 10%/mês ✅✅'],
    alerta: 'Se o ROI do projeto não superar a TMA por pelo menos 2-3 pontos percentuais, o trabalho e o risco do projeto não compensam. Deixe no Tesouro e invista no pessoal.',
  },
  {
    titulo: '2. VPL na Padaria: Quando o Projeto Cria Valor', cor: '#22c55e', emoji: '📊',
    def: 'O Valor Presente Líquido (VPL) desconta todos os fluxos de caixa futuros para o presente usando a TMA. VPL positivo: projeto supera a taxa mínima e cria valor. VPL negativo: melhor deixar no Tesouro.',
    formula: 'VPL = −Investimento + FC₁/(1+TMA) + FC₂/(1+TMA)² + ... + FCn/(1+TMA)ⁿ\nSe fluxo constante: VPL = −Inv + FC × [(1−(1+TMA)^−n)/TMA]',
    exemplos: ['Expositor R$25.000, FC R$2.500/mês, TMA 1%/mês, 12 meses', 'Fator anuidade = [1−(1,01)^−12]/0,01 = 11,26', 'VP fluxos = R$2.500 × 11,26 = R$28.143', 'VPL = R$28.143 − R$25.000 = R$3.143 → ✅ Cria valor'],
    alerta: 'VPL positivo de R$3.143 significa que o projeto é R$3.143 melhor do que deixar os R$25.000 no Tesouro ao mesmo prazo. Quanto maior o VPL positivo, mais atraente o projeto.',
  },
  {
    titulo: '3. TIR: A Taxa Real do Projeto', cor: '#6366f1', emoji: '📈',
    def: 'A Taxa Interna de Retorno (TIR) é a taxa mensal que torna o VPL igual a zero — ou seja, a rentabilidade real do projeto. Compara diretamente com o CDI: se TIR > CDI, o projeto bate o Tesouro. Se TIR < CDI, melhor deixar no banco.',
    formula: 'TIR: taxa tal que VPL = 0\nAproximação: TIR ≈ FC mensal / Investimento (quando FC é constante)\nDecisão: TIR > TMA → aceitar; TIR < TMA → rejeitar',
    exemplos: ['Câmara fria R$18.000, FC R$2.200/mês: TIR ≈ 12,2%/mês', 'Reforma estética R$30.000, FC R$800/mês: TIR ≈ 2,7%/mês', 'TMA = 1%/mês: câmara aceitar ✅, reforma rejeitar ❌', 'TIR da câmara é 14× maior que o Tesouro'],
    alerta: 'Reforma e decoração raramente têm TIR suficiente para superar a TMA. Investimentos produtivos (equipamentos que geram receita direta) quase sempre têm TIR alta. Saber a diferença evita gastos camuflados como "investimento".',
  },
  {
    titulo: '4. Projetos Excludentes e Projetos Complementares', cor: '#ec4899', emoji: '🔗',
    def: 'Projetos excludentes competem pelo mesmo capital — só um pode ser feito. Projetos complementares se potencializam mutuamente — fazer um melhora o retorno do outro. Na padaria, câmara fria + expositor de frios são complementares: a câmara permite estocar mais para o expositor oferecer mais variedade.',
    formula: 'Projetos complementares: VPL conjunto > VPL(A) + VPL(B)\nProjetos excludentes: escolher o maior VPL',
    exemplos: ['Câmara fria (A) + Expositor de tortas (B): complementares', 'Sem câmara: expositor tem só 4 tipos de torta', 'Com câmara: expositor tem 12 tipos → vende 3× mais', 'VPL conjunto > VPL(A) + VPL(B) individualmente'],
    alerta: 'Analisar projetos individualmente pode levar à rejeição de combinações que criam muito mais valor. O consultor sempre pergunta: "Como esses projetos se relacionam entre si?"',
  },
];

const exemplos = [
  {
    id: 'expositor', tipo: 'Projeto Físico', subtipo: 'Expositor de Frios', emoji: '🧊',
    cor: '#22c55e', corBg: 'rgba(34,197,94,0.08)',
    investimento: 25000, lucroMensal: 2500, meses: 24, tma: 1.0,
    descricao: 'A padaria quer comprar um expositor de tortas frias e salgados resfriados. Investimento R$25.000. Estima-se R$2.500/mês de lucro extra.',
    vplCalc: () => {
      const fc = 2500, inv = 25000, tma = 0.01, n = 24;
      const fator = (1 - Math.pow(1 + tma, -n)) / tma;
      return fc * fator - inv;
    },
  },
  {
    id: 'camara', tipo: 'Infraestrutura', subtipo: 'Câmara Fria Industrial', emoji: '❄️',
    cor: '#6366f1', corBg: 'rgba(99,102,241,0.08)',
    investimento: 18000, lucroMensal: 2200, meses: 36, tma: 1.0,
    descricao: 'Câmara fria permite comprar ingredientes em maior volume com desconto de atacado, reduzindo o CMV. Lucro extra: R$2.200/mês por redução de custo.',
    vplCalc: () => {
      const fc = 2200, inv = 18000, tma = 0.01, n = 36;
      const fator = (1 - Math.pow(1 + tma, -n)) / tma;
      return fc * fator - inv;
    },
  },
  {
    id: 'reforma', tipo: 'Intangível', subtipo: 'Reforma Estética', emoji: '🎨',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)',
    investimento: 30000, lucroMensal: 800, meses: 36, tma: 1.0,
    descricao: 'Reforma da fachada e salão. Difícil quantificar o retorno — estimativa conservadora de +R$800/mês em clientes atraídos pela aparência.',
    vplCalc: () => {
      const fc = 800, inv = 30000, tma = 0.01, n = 36;
      const fator = (1 - Math.pow(1 + tma, -n)) / tma;
      return fc * fator - inv;
    },
  },
];

const dossie = {
  empresa: 'Padaria Estrela do Norte',
  segmento: 'Padaria e confeitaria — bairro residencial — faturamento R$ 32.000/mês',
  contexto: 'Dona Fátima tem a padaria há 14 anos. Acumulou R$42.000 ao longo de 2 anos de gestão rigorosa. Tem 4 projetos em avaliação simultânea. O filho (administrador) preparou uma análise que Dona Fátima não entendeu completamente. Você foi chamado para traduzir os números e dar a recomendação final.',
  capital: 42000,
  tma: 1.0,
  projetos: [
    {
      id: 'A', nome: 'Linha de Bolos Personalizados',
      valor: 8000, lucroMensal: 2800, prazoAnos: 3,
      risco: 'baixo', cor: '#22c55e',
      descricao: 'Formas de silicone + impressora de papel arroz + curso online de confeitaria fina. Bolo personalizado vende por R$180-350. Margem estimada R$2.800/mês extra.',
      obs: 'Mercado de nicho com alta demanda em datas comemorativas.',
    },
    {
      id: 'B', nome: 'Expositor Refrigerado de Tortas',
      valor: 22000, lucroMensal: 2200, prazoAnos: 5,
      risco: 'baixo', cor: '#6366f1',
      descricao: 'Expositor 4 metros. Permite oferecer tortas frias, salgados gelados e sobremesas. Complementa a linha de bolos. R$2.200/mês de lucro extra.',
      obs: 'Projeto complementar ao Projeto A — juntos têm sinergia de cardápio.',
    },
    {
      id: 'C', nome: 'Tesouro Selic (Reserva)',
      valor: 12000, lucroMensal: 102, prazoAnos: 1,
      risco: 'nulo', cor: '#a855f7',
      descricao: 'Reserva de emergência em Tesouro Selic. Liquidez diária. Rende 0,85%/mês. Cobre 3 meses de custos fixos (R$9.800/mês × 3 = R$29.400 — mas R$12.000 já é significativo).',
      obs: 'Não é investimento produtivo — é proteção do negócio.',
    },
    {
      id: 'D', nome: 'Franquia de Gelato Italiano',
      valor: 35000, lucroMensal: 3800, prazoAnos: 5,
      risco: 'alto', cor: '#ef4444',
      descricao: 'Taxa de franquia + equipamentos + treinamento. Royalties de 8% sobre faturamento. Projeção de lucro líquido após royalties: R$3.800/mês. Mas exige espaço físico extra (R$600/mês de aluguel já incluso).',
      obs: 'Maior retorno absoluto mas exige quase todo o capital disponível e tem risco operacional elevado (novo segmento).',
    },
  ],
  perguntasConsultoria: [
    {
      id: 'c1',
      dica: { titulo: 'ROI e Payback — Eficiência do Capital', formula: 'ROI mensal = Lucro adicional ÷ Investimento × 100\nPayback = Investimento ÷ Lucro adicional mensal\n\nReferência:\nROI > 3%/mês: excelente vs Tesouro (0,85%)\nPayback < 12 meses: projeto rápido\nPayback > 24 meses: exige análise cuidadosa', raciocinio: 'Calcule ROI e Payback para cada projeto. O projeto com maior ROI mensal é o mais eficiente por real investido. Payback curto significa recuperar o capital rapidamente.' },
      
      contexto: 'Calcule o ROI mensal e o Payback do Projeto A (linha de bolos R$8.000 / R$2.800/mês) e compare com o Tesouro Selic (0,85%/mês). Qual o custo de oportunidade de não fazer o Projeto A?',
      opcoes: [
        { id: 'a', texto: 'ROI Projeto A: 35%/mês. Payback: 2,9 meses. Custo de oportunidade em 12 meses: R$33.600 (projeto) − R$680 (RF) = R$32.920 deixados de ganhar' },
        { id: 'b', texto: 'ROI Projeto A: 20%/mês. Payback: 5 meses. Custo de oportunidade pequeno — RF é mais segura' },
        { id: 'c', texto: 'ROI Projeto A: 35%/mês. Payback: 2,9 meses. Custo de oportunidade irrelevante pois os projetos têm riscos diferentes' },
        { id: 'd', texto: 'ROI Projeto A: 15%/mês. Payback: 6,7 meses. Custo de oportunidade de R$10.000 em 12 meses' },
      ],
      correta: 'a',
      explicacao: 'ROI = R$2.800 ÷ R$8.000 = 35%/mês. Payback = R$8.000 ÷ R$2.800 = 2,86 meses. Em 12 meses, lucro extra = R$2.800 × 12 = R$33.600. Tesouro com R$8.000: R$8.000 × (1,0085^12 − 1) = R$680. Custo de oportunidade = R$32.920. O Projeto A é 49,4× mais rentável que o Tesouro. Não fazer o Projeto A por "segurança" custa R$32.920 em 12 meses.',
    },
    {
      id: 'c2',
      dica: { titulo: 'Projetos Complementares vs Excludentes', formula: 'Projetos excludentes: só um pode ser feito\n→ escolher o maior VPL\n\nProjetos complementares: se potencializam\n→ VPL conjunto > soma dos VPLs individuais\n→ Implementar em sequência lógica\n\nSinergia: o resultado conjunto é maior que as partes', raciocinio: 'Pergunte: "O projeto A muda o resultado do projeto B?" Se sim, são complementares. Analise o VPL dos dois juntos, não separadamente. A sinergia pode mudar completamente a decisão.' },
      
      contexto: 'O Projeto A (bolos) e o Projeto B (expositor) são apontados como complementares. O que isso significa e como avaliá-los?',
      opcoes: [
        { id: 'a', texto: 'São excludentes — usar o dinheiro de A impede B. Escolher apenas o de maior ROI' },
        { id: 'b', texto: 'São complementares — bolo personalizado + tortas frias no expositor cria uma "oferta completa de confeitaria" que potencializa ambos. VPL conjunto provavelmente supera a soma dos VPLs individuais' },
        { id: 'c', texto: 'São independentes — não há relação entre vender bolo personalizado e ter expositor' },
        { id: 'd', texto: 'São complementares, mas devem ser implementados em sequência com 12 meses de intervalo' },
      ],
      correta: 'b',
      explicacao: 'Projetos A e B se potencializam: com bolos personalizados e tortas frias no expositor, a padaria vira referência em confeitaria no bairro. A cliente que encomenda bolo de aniversário também leva torta fria para o almoço. A sinergia aumenta o ticket médio por cliente e a frequência de visitas. VPL conjunto deve ser calculado assumindo que B aumenta em 20-30% o retorno de A (mais encomendas por ser reconhecida em confeitaria). Implementar A primeiro (R$8.000) e 3 meses depois B (R$22.000) é a sequência ideal.',
    },
    {
      id: 'c3',
      dica: { titulo: 'Concentração de Capital e Risco', formula: 'Regra geral: nenhum projeto único deve consumir\nmais de 70-80% do capital disponível\n\nCapital remanescente mínimo:\n= 3 meses de custo fixo\n\nSe projeto consome > 80% capital:\n→ Verificar se reserva ainda está adequada', raciocinio: 'Um projeto com retorno alto mas que consome quase todo o capital deixa o negócio vulnerável. Calcule o capital remanescente após o investimento e verifique se cobre 3 meses de operação.' },
      
      contexto: 'O Projeto D (franquia de gelato) tem o maior retorno absoluto (R$3.800/mês) mas exige R$35.000 (83% do capital). Por que ele pode ser a pior escolha apesar do maior lucro?',
      opcoes: [
        { id: 'a', texto: 'Porque ROI de 10,9%/mês é inferior ao do Projeto A (35%/mês) — mesmo gerando mais reais, é menos eficiente por real investido' },
        { id: 'b', texto: 'Porque a franquia deixa apenas R$7.000 de capital remanescente — sem reserva de emergência, um mês ruim pode comprometer a operação da padaria principal' },
        { id: 'c', texto: 'Porque gelato é um segmento diferente que Dona Fátima não conhece — o risco operacional é desproporcional ao retorno' },
        { id: 'd', texto: 'Todas as anteriores estão corretas — ROI inferior, concentração de capital e risco operacional novo' },
      ],
      correta: 'd',
      explicacao: 'O Projeto D tem três problemas simultâneos: (1) ROI 10,9%/mês inferior ao A (35%/mês) — menos eficiente por R$ investido; (2) Consome R$35.000 de R$42.000, deixando apenas R$7.000 sem reserva adequada (custo fixo da padaria é R$9.800/mês — menos de 1 mês de reserva); (3) Franquia de gelato é segmento novo com curva de aprendizado — Dona Fátima tem expertise em panificação, não em gelato italiano. O risco de não atingir a projeção de R$3.800/mês é alto. Concentrar 83% do capital em um projeto de risco elevado e novo segmento é o oposto de gestão prudente.',
    },
    {
      id: 'c4',
      dica: { titulo: 'Por que Tesouro não compete com Projetos Produtivos', formula: 'Reserva de emergência: função = proteção\nProjeto produtivo: função = crescimento\n\nComparação correta:\nSem reserva + crise: empréstimo a 8%/mês\nCom reserva (0,85%): evita custo de 8%\n\nROI real da reserva = custo evitado', raciocinio: 'A reserva não é comparada pelo retorno — é comparada pelo custo de não tê-la. Se uma crise forçar empréstimo emergencial, o custo mensal (8%) elimina meses de lucro. A reserva é um seguro.' },
      
      contexto: 'Por que o Projeto C (Tesouro R$12.000) não deve ser comparado com os outros projetos pelo ROI?',
      opcoes: [
        { id: 'a', texto: 'Porque o Tesouro tem retorno garantido enquanto os outros não — a comparação seria injusta' },
        { id: 'b', texto: 'Porque são objetivos diferentes: projetos A, B, D maximizam retorno; Projeto C protege a operação. Misturar os dois critérios leva a decisões erradas' },
        { id: 'c', texto: 'Porque o Tesouro só rende bem em prazos acima de 5 anos — no curto prazo não vale' },
        { id: 'd', texto: 'Porque Dona Fátima já tem reserva suficiente em conta corrente' },
      ],
      correta: 'b',
      explicacao: 'A reserva de emergência e os projetos produtivos têm funções radicalmente diferentes. A reserva não existe para maximizar retorno — existe para garantir que a padaria continue operando em crises. Se o forno principal quebrar (R$8.000 de conserto), sem reserva Dona Fátima precisaria de empréstimo emergencial a 8%/mês. Com R$12.000 no Tesouro, absorve o choque sem custo adicional. Comparar ROI de 0,85% (Tesouro) com ROI de 35% (bolos) e concluir que "Tesouro é ruim" é confundir as funções. A pergunta certa é: "A reserva está adequada para o tamanho da operação?" — não "Qual rende mais?"',
    },
    {
      id: 'c5',
      dica: { titulo: 'Sequência de Alocação com Sinergia', formula: 'Sequência inteligente:\n1. Projeto de melhor ROI primeiro\n2. Esperar payback parcial (2-3 meses)\n3. Usar lucro extra para financiar projeto complementar\n\nBenefício: projeto B é parcialmente financiado\npelo lucro extra gerado pelo projeto A', raciocinio: 'Implementar o projeto de maior ROI primeiro gera caixa que financia o próximo. Isso evita comprometer todo o capital de uma vez e permite validar cada projeto antes de avançar.' },
      
      contexto: 'Qual a alocação ideal dos R$42.000 de Dona Fátima, considerando ROI, risco, sinergia entre projetos e reserva de emergência?',
      opcoes: [
        { id: 'a', texto: 'R$35.000 Projeto D + R$7.000 reserva — maximizar o maior retorno absoluto' },
        { id: 'b', texto: 'R$8.000 Projeto A + R$12.000 Projeto C + R$22.000 Projeto B (em 3 meses) — sequência inteligente que preserva reserva e aproveita sinergia A+B' },
        { id: 'c', texto: 'R$8.000 Projeto A + R$22.000 Projeto B + R$12.000 Projeto C — todos simultaneamente' },
        { id: 'd', texto: 'R$42.000 todos no Tesouro — segurança total enquanto avalia melhor' },
      ],
      correta: 'b',
      explicacao: 'A sequência recomendada: Fase 1 (agora): R$8.000 Projeto A + R$12.000 Projeto C (reserva). Total: R$20.000 — sobram R$22.000 em conta. Fase 2 (3 meses depois, quando bolos já geram caixa): usar R$22.000 para o Projeto B. Lógica: Projeto A tem melhor ROI (35%/mês) e payback de 3 meses — já gerará R$8.400 de lucro extra antes de iniciar o Projeto B, parcialmente financiando o expositor com lucro próprio. A reserva de R$12.000 protege a operação. Projeto D fica descartado: concentra demais o capital, ROI inferior ao A, e risco operacional de segmento novo. Em 12 meses, a padaria terá A+B operando em sinergia e reserva intacta.',
    },
  ],
};

export default function PadariaConsultoriaInvestimentos() {
  const navigate = useNavigate();
  const [secao, setSecao] = useState('teoria');
  const [dicasAbertas, setDicasAbertas] = useState({});
  const [exemploAtivo, setExemploAtivo] = useState('expositor');
  const [expandido, setExpandido] = useState({});
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const ex = exemplos.find(e => e.id === exemploAtivo);
  const vpl = ex.vplCalc();
  const roiMes = (ex.lucroMensal / ex.investimento * 100).toFixed(1);
  const pbk = (ex.investimento / ex.lucroMensal).toFixed(1);
  const retornoRF = jurosCompostos(ex.investimento, 0.85, ex.meses);

  const acertos = enviado ? dossie.perguntasConsultoria.filter(q => respostas[q.id] === q.correta).length : 0;
  const nota = enviado ? Math.round((acertos / dossie.perguntasConsultoria.length) * 100) : 0;

  return (
    <div className="container">
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/padaria/investimentos')} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={16} /> Voltar</button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}><Home size={16} /> Início</button>
        </div>
        <div className="navbar-brand"><Briefcase size={22} color={COR} /> Consultoria: Gestão de Investimentos</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Padaria · URCA</div>
      </nav>

      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(234,179,8,0.08) 100%)', borderColor: 'rgba(14,165,233,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Award size={14} /> Consultoria de Gestão de Investimentos
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>VPL, TIR e a Arte de Alocar Bem o Lucro da Padaria</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
          Dona Fátima acumulou R$42.000 com muito trabalho. A decisão de como alocar esse capital <strong style={{ color: 'var(--text-main)' }}>vai definir os próximos 5 anos da padaria</strong>. No desafio, você dá a recomendação.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'teoria', label: '📚 Teoria' }, { id: 'exemplos', label: '🏢 Exemplos Reais' }, { id: 'desafio', label: '🎯 Consultoria Real' }].map(s => (
          <button key={s.id} onClick={() => setSecao(s.id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem', border: secao === s.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: secao === s.id ? 'rgba(14,165,233,0.12)' : 'var(--bg-card)', color: secao === s.id ? '#7dd3fc' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>

      {secao === 'teoria' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={22} color={COR} /> Investimentos na Padaria: Rigor Analítico</h2>
            {blocos.map((bloco, idx) => (
              <div key={idx} className="glass-panel" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${bloco.cor}`, background: `rgba(${bloco.cor === '#f59e0b' ? '245,158,11' : bloco.cor === '#22c55e' ? '34,197,94' : bloco.cor === '#6366f1' ? '99,102,241' : '236,72,153'}, 0.06)`, overflow: 'hidden' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { l: 'Investimento', v: formatBRL(ex.investimento), c: '#6366f1' },
              { l: 'Lucro extra/mês', v: formatBRL(ex.lucroMensal), c: '#22c55e' },
              { l: 'ROI mensal', v: `${roiMes}%`, c: roiMes > 3.85 ? '#22c55e' : '#ef4444' },
              { l: 'Payback', v: `${pbk} meses`, c: COR },
              { l: `VPL (TMA 1%/${ex.meses}m)`, v: formatBRL(vpl), c: vpl > 0 ? '#22c55e' : '#ef4444' },
              { l: 'VPL positivo?', v: vpl > 0 ? '✅ Cria valor' : '❌ Destrói valor', c: vpl > 0 ? '#22c55e' : '#ef4444' },
              { l: `RF ${ex.meses}m`, v: formatBRL(retornoRF - ex.investimento), c: '#f59e0b' },
              { l: 'Vantagem vs RF', v: `${((ex.lucroMensal / ex.investimento) / 0.0085).toFixed(1)}×`, c: '#22c55e' },
            ].map((k, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="btn-primary" onClick={() => setSecao('desafio')} style={{ padding: '0.875rem 2rem', background: COR, border: 'none' }}>Partir para a Consultoria Real 🎯</button>
          </div>
        </div>
      )}

      {secao === 'desafio' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'rgba(14,165,233,0.05)', borderColor: 'rgba(14,165,233,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(14,165,233,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}><Briefcase size={24} color={COR} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossiê da Empresa</div>
                <h2 style={{ fontSize: '1.5rem', color: COR }}>{dossie.empresa}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dossie.segmento}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{dossie.contexto}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'Capital disponível', v: formatBRL(dossie.capital), c: '#22c55e' },
                { l: 'Faturamento/mês', v: 'R$ 32.000', c: COR },
                { l: 'Custo fixo/mês', v: 'R$ 9.800', c: '#ef4444' },
                { l: 'TMA adotada', v: '1%/mês', c: '#6366f1' },
              ].map((k, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem', borderLeft: `3px solid ${k.c}` }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{k.l}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 4 Projetos em Análise</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {dossie.projetos.map(p => {
                const roiP = (p.lucroMensal / p.valor * 100).toFixed(1);
                const pbkP = (p.valor / p.lucroMensal).toFixed(1);
                const n = p.prazoAnos * 12;
                const fator = (1 - Math.pow(1.01, -n)) / 0.01;
                const vplP = p.lucroMensal * fator - p.valor;
                return (
                  <div key={p.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${p.cor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: p.cor }}>Projeto {p.id}</span>
                      <span style={{ background: `rgba(${p.risco === 'nulo' ? '168,85,247' : p.risco === 'baixo' ? '34,197,94' : p.risco === 'médio' ? '245,158,11' : '239,68,68'}, 0.2)`, color: p.cor, padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 600 }}>risco {p.risco}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{p.nome}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.descricao}</p>
                    {[
                      { l: 'Investimento', v: formatBRL(p.valor) },
                      { l: 'Lucro extra/mês', v: formatBRL(p.lucroMensal) },
                      { l: 'ROI mensal', v: `${roiP}%` },
                      { l: 'Payback', v: `${pbkP} meses` },
                      { l: `VPL (${p.prazoAnos}a TMA 1%)`, v: `${vplP >= 0 ? '+' : ''}${formatBRL(vplP)}` },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.25rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.l}</span>
                        <span style={{ fontWeight: 600, color: r.l.includes('VPL') ? (vplP >= 0 ? '#22c55e' : '#ef4444') : p.cor }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.obs}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {dossie.perguntasConsultoria.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: enviado ? respostas[q.id] === q.correta ? '4px solid #22c55e' : '4px solid #ef4444' : '4px solid var(--border-color)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>Q{idx + 1}</span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.contexto}</p>
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
                    <button key={op.id} disabled={enviado} onClick={() => setRespostas(p => ({ ...p, [q.id]: op.id }))} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem', cursor: enviado ? 'default' : 'pointer', border: respostas[q.id] === op.id ? `2px solid ${COR}` : '2px solid var(--border-color)', background: enviado ? op.id === q.correta ? 'rgba(34,197,94,0.1)' : respostas[q.id] === op.id ? 'rgba(239,68,68,0.1)' : 'transparent' : respostas[q.id] === op.id ? 'rgba(14,165,233,0.1)' : 'transparent', color: enviado ? op.id === q.correta ? '#22c55e' : respostas[q.id] === op.id ? '#ef4444' : 'var(--text-muted)' : respostas[q.id] === op.id ? '#7dd3fc' : 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      {enviado && op.id === q.correta && <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      {enviado && respostas[q.id] === op.id && op.id !== q.correta && <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                      <span><strong>{op.id.toUpperCase()})</strong> {op.texto}</span>
                    </button>
                  ))}
                </div>
                {enviado && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', borderLeft: `3px solid ${COR}` }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: '#7dd3fc' }}>Raciocínio do consultor: </strong>{q.explicacao}</p>
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
                  <strong style={{ color: '#facc15' }}>Dica:</strong> observe o VPL calculado para cada projeto — ele já desconta a TMA de 1%/mês e mostra o valor criado acima do Tesouro. VPL negativo = melhor deixar no banco. E lembre-se: projetos A e B têm sinergia — avalie o conjunto, não só os indivíduos.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', background: nota >= 70 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderColor: nota >= 70 ? '#22c55e' : '#ef4444' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{nota === 100 ? '🏆' : nota >= 80 ? '🎓' : '📚'}</div>
              <h2 style={{ fontSize: '2rem', color: nota >= 70 ? '#22c55e' : '#ef4444', marginBottom: '0.5rem' }}>{acertos} de {dossie.perguntasConsultoria.length} corretas — {nota}%</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {nota === 100 ? 'Dona Fátima vai crescer com sabedoria graças à sua consultoria!' : nota >= 80 ? 'Muito bom! Revise os projetos dos itens errados.' : 'Releia o dossiê com foco no VPL e na sinergia entre projetos.'}
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
