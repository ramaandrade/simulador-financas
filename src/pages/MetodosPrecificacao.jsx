import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, ChevronDown, ChevronUp, Tag, TrendingUp, Target, Lightbulb, Award, BarChart4, Zap } from 'lucide-react';

const COR = '#f59e0b';

// ─── DADOS DOS MÉTODOS ──────────────────────────────────────────────────────
const metodos = [
  {
    id: 'markup',
    numero: '01',
    nome: 'Markup Divisor',
    subtitulo: 'O método matematicamente correto',
    emoji: '🧮',
    cor: '#6366f1',
    corBg: 'rgba(99,102,241,0.08)',
    nivel: 'Técnico',
    uso: 'Recomendado para todos os pequenos negócios',
    quando: 'Sempre que houver taxas percentuais incidindo sobre o preço de venda (iFood, cartão, Simples Nacional)',
    formula: 'Preço = Custo ÷ (1 − taxas% − margem%)',
    como: 'Subtraia de 1 todos os percentuais que incidem sobre o preço de venda (impostos, comissões, margem desejada). Divida o custo por esse resultado.',
    vantagem: 'Garante matematicamente que a margem desejada chegará ao caixa. Impermeável a impostos e taxas.',
    risco: 'Exige conhecimento das taxas. Parece contraintuitivo no início.',
    exemplos: [
      {
        setor: '🍱 Marmitaria',
        dados: 'Custo da marmita: R$ 12,50 | Taxa iFood: 5% | Simples Nacional: 3% | Margem desejada: 25%',
        calculo: 'Divisor = 1 − 0,05 − 0,03 − 0,25 = 0,67\nPreço = R$ 12,50 ÷ 0,67 = R$ 18,66',
        resultado: 'Preço: R$ 18,66 — margem garantida: exatos R$ 4,66 (25%) após todas as deduções',
        insight: 'Se cobrar R$ 15,63 (método errado: +25%), o lucro real cai para ~14%, não 25%.',
      },
      {
        setor: '🥖 Padaria',
        dados: 'Custo do kg de pão: R$ 5,20 | Taxa cartão: 2,5% | Simples 4%: | Margem: 35%',
        calculo: 'Divisor = 1 − 0,025 − 0,04 − 0,35 = 0,585\nPreço = R$ 5,20 ÷ 0,585 = R$ 8,89/kg',
        resultado: 'Preço: R$ 8,89/kg — arredondado para R$ 8,90/kg com margem de 35% real',
        insight: 'Cobrar R$ 7,02/kg (+35% no custo) renderia ~23% de margem, não 35%.',
      },
      {
        setor: '👗 Loja de Moda',
        dados: 'Custo da blusa (CMV): R$ 42,00 | Cartão 3%: | Simples 6%: | Margem: 40%',
        calculo: 'Divisor = 1 − 0,03 − 0,06 − 0,40 = 0,51\nPreço = R$ 42,00 ÷ 0,51 = R$ 82,35',
        resultado: 'Preço: R$ 82,35 — arredondado para R$ 79,90 (psicológico), margem: 38,5%',
        insight: 'Cobrar R$ 58,80 (+40% no custo) renderia ~27% de margem, não 40%.',
      },
    ],
  },
  {
    id: 'experimental',
    numero: '02',
    nome: 'Método Experimental (+X%)',
    subtitulo: 'Simples, mas perigoso sem ajuste',
    emoji: '⚠️',
    cor: '#f59e0b',
    corBg: 'rgba(245,158,11,0.08)',
    nivel: 'Informal',
    uso: 'Muito usado na prática, mas exige correção para taxas',
    quando: 'Quando não há impostos ou taxas percentuais sobre a venda (ex: vendas diretas em dinheiro, sem iFood)',
    formula: 'Preço = Custo × (1 + X%)',
    como: 'Multiplica o custo por um fator fixo. Ex: custo × 1,40 para 40% de margem. ATENÇÃO: essa margem é sobre o custo, não sobre o preço — o que significa margem real menor.',
    vantagem: 'Intuitivo e rápido. Fácil de ensinar e aplicar.',
    risco: 'Se há taxas sobre o preço de venda (cartão, iFood, impostos), a margem real será menor que a esperada.',
    exemplos: [
      {
        setor: '🍱 Marmitaria — Venda Direta (Pix, sem iFood)',
        dados: 'Custo: R$ 12,50 | Sem iFood | Sem cartão | Margem desejada: 25% sobre o custo',
        calculo: 'Preço = R$ 12,50 × (1 + 0,25) = R$ 15,63',
        resultado: 'Preço: R$ 15,63 — OK apenas se não houver taxas. Margem nominal: 25%.',
        insight: 'Funciona bem para venda direta (Pix). Deixa de funcionar ao aceitar cartão (2,5%): margem real cai para 22,5%.',
      },
      {
        setor: '🥖 Padaria — Venda no Balcão',
        dados: 'Custo do pão: R$ 5,20 | Clientes pagam em dinheiro e Pix | Margem desejada: 40%',
        calculo: 'Preço = R$ 5,20 × 1,40 = R$ 7,28/kg → R$ 7,30/kg',
        resultado: 'Preço: R$ 7,30/kg — para venda 100% no balcão sem taxas, é matematicamente correto.',
        insight: 'Ao aceitar cartão (3%), a margem sobre o preço cai de ~28,6% para ~25,6%. Precisa recalcular.',
      },
      {
        setor: '👗 Loja de Moda — Atacado',
        dados: 'Custo da peça: R$ 25,00 | Venda para revendedoras (boleto, sem taxa) | Margem: 30%',
        calculo: 'Preço de atacado = R$ 25,00 × 1,30 = R$ 32,50',
        resultado: 'Preço: R$ 32,50 — para transação direta sem intermediários, método válido.',
        insight: 'Em operações B2B sem plataformas e sem imposto proporcional, +30% sobre o custo é aceitável.',
      },
    ],
  },
  {
    id: 'convencao',
    numero: '03',
    nome: 'Convenção do Setor (2×, 3×...)',
    subtitulo: '"Aqui sempre foi assim"',
    emoji: '🔄',
    cor: '#ec4899',
    corBg: 'rgba(236,72,153,0.08)',
    nivel: 'Empírico',
    uso: 'Setores informais, mercados com poucos concorrentes',
    quando: 'Quando a tradição do setor define um fator amplamente aceito e o mercado sustenta esse preço',
    formula: 'Preço = Custo × fator (2, 3, 5...)',
    como: '"Custo × 2" = dobra o custo. "200% em cima" = custo × 3 (custo + 200% do custo). ATENÇÃO: 200% sobre o custo é markup 3,0 — não markup 2,0.',
    vantagem: 'Rápido, alinhado ao mercado, fácil de comunicar.',
    risco: 'Não é markup. Não garante cobertura de despesas fixas. Pode parecer muito mas ser pouco após impostos.',
    exemplos: [
      {
        setor: '🍱 Marmitaria — Setor Informal',
        dados: '"Aqui a gente dobra o custo." Custo: R$ 12,50',
        calculo: 'Preço = R$ 12,50 × 2 = R$ 25,00\nIsso NÃO é markup de 100%. É markup de 2,0.',
        resultado: 'Preço: R$ 25,00 — parece ótimo (50% de margem sobre o preço), mas com iFood 25% + imposto 3%: margem real = 22%.',
        insight: '"Dobrar o custo" na prática pode ser correto, mas o empreendedor precisa verificar se as taxas cabem nessa margem.',
      },
      {
        setor: '🏠 Revenda de Produtos',
        dados: '"Ponho 200% em cima." Produto comprado a R$ 20,00.',
        calculo: 'Preço = R$ 20 + 200% × R$ 20 = R$ 20 + R$ 40 = R$ 60\nMarkup divisor equivalente = R$ 60 ÷ R$ 20 = 3,0',
        resultado: 'Margem bruta sobre o preço: 66,7%. Parece alta, mas impostos + frete podem consumir 20-25%.',
        insight: '200% sobre o custo ≠ markup 200%. O markup real (sobre o preço) é 66,7%. Muitos empreendedores confundem os dois.',
      },
      {
        setor: '👗 Loja de Moda',
        dados: '"Peça que comprei por R$ 50, vendo por R$ 150 — três vezes." ',
        calculo: 'Preço = R$ 50 × 3 = R$ 150\nMargem sobre o preço = (R$ 150 − R$ 50) ÷ R$ 150 = 66,7%',
        resultado: 'Com impostos 6% + cartão 3% + liquidação 20%: margem real ≈ 37,7% — ainda saudável.',
        insight: 'Na moda, "3×" ou "triplicar" é um padrão razoável justamente porque absorve liquidações e taxas.',
      },
    ],
  },
  {
    id: 'mercado',
    numero: '04',
    nome: 'Precificação pelo Mercado',
    subtitulo: 'O preço que o cliente já aceita pagar',
    emoji: '🔍',
    cor: '#22c55e',
    corBg: 'rgba(34,197,94,0.08)',
    nivel: 'Estratégico',
    uso: 'Produtos comoditizados, mercados competitivos, varejo',
    quando: 'Quando o mercado já tem um preço de referência estabelecido e o cliente compara facilmente',
    formula: 'Preço = Preço de mercado ± diferencial',
    como: 'Pesquise o preço médio dos concorrentes. Se sua qualidade/serviço é equivalente, pratique preço similar. Se é superior, pode cobrar a mais. Se está entrando no mercado, pode cobrar um pouco menos.',
    vantagem: 'Aderência ao mercado. Menos resistência do cliente. Útil para novos negócios.',
    risco: 'O preço de mercado pode não cobrir seus custos. Seguir o concorrente sem calcular o próprio custo é fatal.',
    exemplos: [
      {
        setor: '🍱 Marmitaria — Análise Competitiva',
        dados: 'Marmitas na região: R$ 15,00 a R$ 20,00. Custo próprio: R$ 12,50. Taxa 8%.',
        calculo: 'Média do mercado: R$ 17,50\nMarkup divisor necessário para cobrir custo: R$ 12,50 ÷ 0,67 = R$ 18,66\nPreço de mercado (R$ 17,50) < Preço mínimo calculado (R$ 18,66)',
        resultado: 'ALERTA: o mercado paga menos do que o mínimo viável com 25% de margem. Alternativas: reduzir custo, reduzir margem ou diferenciar.',
        insight: 'Seguir o preço do concorrente sem calcular o próprio custo pode significar operar no prejuízo todo mês.',
      },
      {
        setor: '🥖 Padaria — Preço Regional',
        dados: 'Pão francês na cidade: R$ 1,50 cada. Custo: R$ 0,45. Taxa cartão: 2,5%.',
        calculo: 'Preço de mercado: R$ 1,50\nMarkup sobre o custo = R$ 1,50 ÷ R$ 0,45 = 3,33× — excelente!\nMargem real: (R$ 1,50 − R$ 0,45) ÷ R$ 1,50 − 2,5% = 67,5%',
        resultado: 'O preço de mercado (R$ 1,50) é muito acima do mínimo calculado. Padaria pode cobrar o preço de mercado e ter margem excelente.',
        insight: 'Quando o preço de mercado supera em muito o mínimo calculado, o negócio tem gordura — pode competir por qualidade.',
      },
      {
        setor: '👗 Moda — Pesquisa de Concorrência',
        dados: 'Camiseta básica similar: R$ 59,90 a R$ 89,90 no mercado. Custo: R$ 22,00.',
        calculo: 'Preço mínimo viável (markup divisor, 35% margem, 9% taxas): R$ 22 ÷ 0,56 = R$ 39,28\nMercado aceita R$ 59,90 a R$ 89,90 — muito acima do mínimo.',
        resultado: 'Há espaço de precificação entre R$ 39,28 (mínimo) e R$ 89,90 (máximo de mercado). Posicionamento define o preço.',
        insight: 'Na moda, o preço de mercado é uma oportunidade, não um teto. Posicionar corretamente pode capturar margem acima.',
      },
    ],
  },
  {
    id: 'valor',
    numero: '05',
    nome: 'Precificação por Valor Percebido',
    subtitulo: 'O cliente paga pelo que acredita valer',
    emoji: '💎',
    cor: '#a855f7',
    corBg: 'rgba(168,85,247,0.08)',
    nivel: 'Avançado',
    uso: 'Serviços especializados, produtos premium, marcas com posicionamento forte',
    quando: 'Quando o cliente paga pelo resultado, pela experiência ou pelo status — não pelo insumo',
    formula: 'Preço = Valor percebido pelo cliente (independe do custo)',
    como: 'Identifique o problema que você resolve. Quanto vale para o cliente resolver esse problema? Esse é o seu teto de preço. O custo define se você lucra — não o preço.',
    vantagem: 'Maiores margens. Menos concorrência por preço. Fidelização por valor.',
    risco: 'Exige marca, reputação ou diferencial claro. Difícil no início.',
    exemplos: [
      {
        setor: '🍱 Marmita Premium / Fitness',
        dados: 'Custo da marmita fit: R$ 16,00. Mercado cobra R$ 20-25. Mas a proposta é "nutricionista + delivery + app".',
        calculo: 'Valor percebido: R$ 45,00 (plano nutricional + marmita diária + acompanhamento)\nMarkup real = R$ 45 ÷ R$ 16 = 2,8×\nMargem real (após 8% taxas): ~56,4%',
        resultado: 'Cobrando R$ 45,00 por marmita "nutricional personalizada", a margem é mais que o dobro da marmita comum.',
        insight: 'O mesmo ingrediente custa R$ 16 e pode ser vendido por R$ 20 (commodity) ou R$ 45 (valor percebido). A diferença é o posicionamento.',
      },
      {
        setor: '🥖 Padaria Artesanal / Sourdough',
        dados: 'Custo do pão fermentação natural (sourdough): R$ 4,50. Pão normal: R$ 0,45.',
        calculo: 'Pão normal: R$ 1,50/unidade (mercado)\nPão sourdough artesanal: R$ 18,00/unidade (valor percebido)\nMarkup sourdough: R$ 18 ÷ R$ 4,50 = 4,0×',
        resultado: 'O pão artesanal tem custo 10× maior que o convencional, mas cobra 12× mais. Margem superior.',
        insight: '"Fermentação natural, 72 horas, sem conservantes" não descreve o processo — descreve o valor para o cliente que compra experiência e saúde.',
      },
      {
        setor: '👗 Moda Autoral / Personal Stylist',
        dados: 'Roupa de marca local desconhecida: R$ 80. Mesma peça com colaboração de influencer: R$ 280.',
        calculo: 'Custo idêntico: R$ 42,00\nSem valor percebido: R$ 80 → margem 47,5%\nCom valor percebido (collab): R$ 280 → margem 85%',
        resultado: 'O valor percebido (a associação com o influencer) multiplicou o preço por 3,5× sem alterar o custo.',
        insight: 'Na moda, a marca é o produto. Construir valor percebido é o investimento com maior ROI no setor.',
      },
    ],
  },
  {
    id: 'psicologico',
    numero: '06',
    nome: 'Preço Psicológico',
    subtitulo: 'Como o cérebro lê o preço',
    emoji: '🧠',
    cor: '#06b6d4',
    corBg: 'rgba(6,182,212,0.08)',
    nivel: 'Complementar',
    uso: 'Todo varejo e serviço ao consumidor final',
    quando: 'Sempre que o preço final é comunicado diretamente ao consumidor',
    formula: 'Preço = Preço calculado → ajustado para .90, .99 ou número âncora',
    como: 'Após calcular o preço técnico, ajuste para terminar em ,90 ou ,99. Use ancoragem (mostrar o preço "de" antes do "por"). Crie preços de entrada para converter o primeiro cliente.',
    vantagem: 'Aumenta conversão sem mudar o produto. ROI altíssimo.',
    risco: 'Não cria valor sozinho. Precisa de base técnica antes.',
    exemplos: [
      {
        setor: '🍱 Marmitaria',
        dados: 'Preço calculado pelo markup divisor: R$ 18,66.',
        calculo: 'Opções de ajuste psicológico:\n• R$ 18,90 (+R$ 0,24, margem extra)\n• R$ 19,90 (faixa dos 19, não dos 20)\n• "De R$ 22,00 por R$ 18,90" (ancoragem)',
        resultado: 'R$ 18,90 vs R$ 19,00: diferença de R$ 0,10 para o empreendedor, mas o cliente lê "ainda nos 18".',
        insight: 'Ancoragem: mostrar um preço mais alto antes do real faz o cliente perceber o preço praticado como uma oferta.',
      },
      {
        setor: '🥖 Padaria',
        dados: 'Coxinha calculada: R$ 5,23.',
        calculo: 'Opções:\n• R$ 5,50 (+R$ 0,27 de margem extra)\n• Combo "3 por R$ 14,90" (unitário percebido: R$ 4,97)\n• "Quentinha do dia: pão + coxinha + café = R$ 9,90"',
        resultado: 'O combo com café (custo R$ 4,50 total) a R$ 9,90 gera MC de 54,5% e faz o cliente sentir que ganhou.',
        insight: 'Combos psicológicos aumentam o ticket e a MC simultaneamente — o cliente "economiza" e a padaria lucra mais por atendimento.',
      },
      {
        setor: '👗 Moda',
        dados: 'Blusa calculada: R$ 82,35.',
        calculo: 'Ajuste psicológico:\n• R$ 79,90 (abaixo dos 80 — faixa dos "setenta e tantos")\n• Tag original: R$ 120,00 → Preço: R$ 79,90 (ancoragem)\n• "Leve 2 por R$ 149,90" (R$ 74,95 unitário percebido)',
        resultado: 'Baixar de R$ 82,35 para R$ 79,90 reduz a margem em apenas R$ 2,45 mas aumenta significativamente a conversão.',
        insight: 'Na moda, a diferença entre R$ 79,90 e R$ 80,00 é psicológica mas real: clientes treinam o cérebro para ler o primeiro dígito.',
      },
    ],
  },
  {
    id: 'mc',
    numero: '07',
    nome: 'Precificação pela Margem de Contribuição',
    subtitulo: 'Para decisões estratégicas de mix e promoções',
    emoji: '📊',
    cor: '#10b981',
    corBg: 'rgba(16,185,129,0.08)',
    nivel: 'Analítico',
    uso: 'Promoções, combos, análise de mix, decisões de descontar ou não',
    quando: 'Quando precisa decidir se vale a pena fazer uma promoção, lançar um produto ou aceitar um pedido especial',
    formula: 'MC = Preço − Custos Variáveis (por unidade)',
    como: 'Calcule a MC de cada produto. Todo produto com MC positiva contribui para pagar os custos fixos. Preço mínimo = custo variável + R$ 0,01 (no curtíssimo prazo).',
    vantagem: 'Clareza em decisões de promoção. Identifica quais produtos merecer impulso.',
    risco: 'Não pode ser o único critério — precisa cobrir os fixos no longo prazo.',
    exemplos: [
      {
        setor: '🍱 Marmitaria — Promoção Especial',
        dados: 'CV unitário: R$ 8,50. Preço normal: R$ 18,66. MC normal: R$ 10,16.',
        calculo: 'Promoção de segunda: R$ 14,00\nMC na promoção = R$ 14,00 − R$ 8,50 = R$ 5,50\nAinda positivo — a promoção contribui para cobrir os fixos.',
        resultado: 'Promocionar a R$ 14 ainda gera R$ 5,50 de MC por marmita. Desde que cubra os fixos no mês, é viável.',
        insight: 'A promoção faz sentido se o volume extra compensar a MC menor. 10 marmitas extras × R$ 5,50 = R$ 55 de contribuição adicional.',
      },
      {
        setor: '🥖 Padaria — Produto Âncora',
        dados: 'Pão francês: CV R$ 0,40, preço R$ 1,50, MC R$ 1,10. Café: CV R$ 0,50, preço R$ 6,00, MC R$ 5,50.',
        calculo: 'MC% pão = R$ 1,10 ÷ R$ 1,50 = 73,3%\nMC% café = R$ 5,50 ÷ R$ 6,00 = 91,7%\nRatio: o café gera 5× mais MC que o pão.',
        resultado: 'O pão atrai o cliente — o café paga as contas. Toda estratégia de oferecer pão como isca para vender café aumenta a rentabilidade.',
        insight: 'Análise de MC revela que vender 5 pães extras gera a mesma MC que vender 1 café a mais. Foco na promoção certa.',
      },
      {
        setor: '👗 Moda — Liquidação',
        dados: 'Blusa parada há 3 meses. CV: R$ 42,00. Preço normal: R$ 79,90. Liquidação: 40% off.',
        calculo: 'Preço na liquidação: R$ 79,90 × 0,60 = R$ 47,94\nMC na liquidação = R$ 47,94 − R$ 42,00 = R$ 5,94 (ainda positiva!)\nAlternativa: não vender = MC = R$ 0 e capital imobilizado.',
        resultado: 'Vender em liquidação a R$ 47,94 ainda gera R$ 5,94 de MC e libera capital de giro. Melhor que deixar encalhar.',
        insight: 'A análise de MC mostra que qualquer preço acima de R$ 42,00 contribui. Liquidar é sempre melhor que estocar indefinidamente.',
      },
    ],
  },
  {
    id: 'dinamico',
    numero: '08',
    nome: 'Preço Dinâmico',
    subtitulo: 'Preço que acompanha a demanda em tempo real',
    emoji: '⚡',
    cor: '#f97316',
    corBg: 'rgba(249,115,22,0.08)',
    nivel: 'Avançado',
    uso: 'Negócios com demanda variável por horário, dia ou sazonalidade',
    quando: 'Quando a demanda é previsível e varia significativamente (almoço vs jantar, semana vs fim de semana)',
    formula: 'Preço (t) = Preço base × fator demanda (t)',
    como: 'Identifique os horários/dias de pico e os de baixa. No pico, preço mais alto. Na baixa, promoção para atrair volume. O objetivo é maximizar a receita total, não o preço unitário.',
    vantagem: 'Maximiza receita total. Rentabiliza o pico sem perder a base.',
    risco: 'Pode irritar clientes se mal comunicado. Exige sistema ou disciplina operacional.',
    exemplos: [
      {
        setor: '🍱 Marmitaria — Horário',
        dados: 'Pico: 11h-13h (fila). Baixa: 14h-15h (sobras). Preço normal: R$ 18,90.',
        calculo: 'Pico: R$ 18,90 (preço cheio)\nMeia hora antes do fechamento: "Última marmita por R$ 12,00"\nMC restante: R$ 12,00 − R$ 8,50 = R$ 3,50 (vs R$ 0 se jogar fora)',
        resultado: 'Vender a R$ 12,00 no fim ainda gera R$ 3,50 de MC e evita o desperdício. O preço dinâmico no final do dia é economicamente racional.',
        insight: 'Apps como iFood permitem cupons de desconto horários. Configurar promoção das 14h às 15h aumenta vendas sem prejudicar o preço cheio do almoço.',
      },
      {
        setor: '🥖 Padaria — Dia a Dia',
        dados: 'Sábado: fila do lado de fora. Segunda: movimento 40% menor.',
        calculo: 'Segunda: "Combo da Segunda — pão + café + bolo R$ 12,90"\nSábado: preço normal, sem combo, foco em vender tudo pelo preço cheio\nReceita sábado: 200 clientes × R$ 18 ticket = R$ 3.600\nReceita segunda c/ combo: 120 clientes × R$ 12,90 = R$ 1.548 vs R$ 1.080 sem promoção',
        resultado: 'O combo de segunda gerou +43,3% de receita no dia mais fraco, sem reduzir o preço do sábado.',
        insight: 'Preço dinâmico não é cobrar mais caro no pico — é não desperdiçar capacidade nos dias fracos.',
      },
      {
        setor: '👗 Moda — Sazonalidade',
        dados: 'Janeiro: pós-Natal, movimento baixo. Junho: Dia dos Namorados, movimento alto.',
        calculo: 'Janeiro: "Queima de estoque" — itens selecionados 30-50% off\nJunho: sem desconto, lançamento de novidades, preço cheio\nMeta: receita anual estável, não esperar só por julho e dezembro',
        resultado: 'Lojas que usam preço dinâmico sazonal têm receita 25-35% mais estável ao longo do ano, reduzindo crises de caixa em janeiro.',
        insight: 'Liquidação de janeiro não é fraqueza — é estratégia para girar estoque, gerar caixa e liberar capital para a coleção de inverno.',
      },
    ],
  },
];

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function MetodosPrecificacao() {
  const navigate = useNavigate();
  const [ativo, setAtivo] = useState(null);
  const [exemploAtivo, setExemploAtivo] = useState({});

  const toggle = (id) => setAtivo(prev => prev === id ? null : id);
  const toggleEx = (metId, exIdx) => setExemploAtivo(prev => ({
    ...prev,
    [metId]: prev[metId] === exIdx ? null : exIdx,
  }));

  const nivelCor = { Técnico: '#6366f1', Informal: '#f59e0b', Empírico: '#ec4899', Estratégico: '#22c55e', Avançado: '#a855f7', Complementar: '#06b6d4', Analítico: '#10b981' };

  return (
    <div className="container">
      {/* NAV */}
      <nav className="navbar" style={{ borderRadius: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/marmitaria/precificacao')} style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}>
            <Home size={16} /> Início
          </button>
        </div>
        <div className="navbar-brand"><BookOpen size={22} color={COR} /> Métodos de Precificação</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>8 abordagens com exemplos práticos</div>
      </nav>

      {/* HERO */}
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(249,115,22,0.08) 100%)', borderColor: 'rgba(245,158,11,0.3)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <Tag size={14} /> Estudo Avançado de Precificação
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Como as Empresas Realmente Formam Preços</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 1.5rem auto', lineHeight: 1.7 }}>
          Existem 8 maneiras diferentes de precificar — cada uma com lógica, vantagens e riscos próprios. Um empreendedor inteligente <strong style={{ color: 'var(--text-main)' }}>combina métodos</strong>: começa pelo Markup Divisor, ajusta pelo mercado, aplica psicologia e usa MC para promoções.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          {[
            { emoji: '🧮', label: 'Markup Divisor', desc: 'Matematicamente correto' },
            { emoji: '📊', label: 'Mercado', desc: 'Validação externa' },
            { emoji: '💎', label: 'Valor Percebido', desc: 'Maior margem' },
            { emoji: '🧠', label: 'Psicológico', desc: 'Maior conversão' },
          ].map((k, i) => (
            <div key={i} style={{ background: 'rgba(245,158,11,0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{k.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.8rem' }}>{k.label}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{k.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABELA RESUMO */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: COR }}>📋 Visão Geral dos 8 Métodos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                {['Método', 'Base do Preço', 'Vantagem', 'Risco', 'Nível'].map((h, i) => (
                  <th key={i} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metodos.map((m, i) => (
                <tr key={m.id} onClick={() => { toggle(m.id); setTimeout(() => document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }}
                  style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: m.cor }}>{m.emoji} {m.nome}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>{m.formula.split('\n')[0].replace('Preço = ', '')}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{m.vantagem.split('.')[0]}</td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', maxWidth: '180px' }}>{m.risco.split('.')[0]}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span style={{ background: `${nivelCor[m.nivel]}20`, color: nivelCor[m.nivel], padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>{m.nivel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>💡 Clique em qualquer linha para expandir o método completo com exemplos práticos.</p>
      </div>

      {/* CARDS DETALHADOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {metodos.map(m => (
          <div key={m.id} id={m.id} className="glass-panel" style={{ overflow: 'hidden', borderLeft: `4px solid ${m.cor}`, background: ativo === m.id ? m.corBg : 'var(--bg-card)' }}>
            {/* CABEÇALHO CLICÁVEL */}
            <div onClick={() => toggle(m.id)} style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: m.cor, opacity: 0.6, fontFamily: 'monospace' }}>{m.numero}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{m.emoji}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: m.cor }}>{m.nome}</h3>
                    <span style={{ background: `${nivelCor[m.nivel]}20`, color: nivelCor[m.nivel], padding: '0.15rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 600 }}>{m.nivel}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{m.subtitulo}</p>
                </div>
              </div>
              {ativo === m.id ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
            </div>

            {/* CONTEÚDO EXPANDIDO */}
            {ativo === m.id && (
              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                {/* Info rápida */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { l: '📌 Quando usar', v: m.quando },
                    { l: '✅ Vantagem', v: m.vantagem },
                    { l: '⚠️ Risco', v: m.risco },
                    { l: '🔧 Como aplicar', v: m.como },
                  ].map((k, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: m.cor, marginBottom: '0.3rem' }}>{k.l}</div>
                      <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{k.v}</p>
                    </div>
                  ))}
                </div>

                {/* Fórmula */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.875rem 1.25rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: m.cor, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                  {m.formula}
                </div>

                {/* Exemplos práticos */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📚 Exemplos Práticos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {m.exemplos.map((ex, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <div onClick={() => toggleEx(m.id, idx)}
                        style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: m.cor, fontSize: '0.9rem' }}>{ex.setor}</span>
                        {exemploAtivo[m.id] === idx ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                      </div>
                      {exemploAtivo[m.id] === idx && (
                        <div style={{ padding: '0 1.25rem 1.25rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>📋 Dados</div>
                              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{ex.dados}</p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>🧮 Cálculo</div>
                              <pre style={{ color: m.cor, lineHeight: 1.6, fontFamily: 'monospace', fontSize: '0.78rem', margin: 0, whiteSpace: 'pre-wrap' }}>{ex.calculo}</pre>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                              <div style={{ color: '#22c55e', marginBottom: '0.3rem', fontWeight: 600 }}>✅ Resultado</div>
                              <p style={{ color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500 }}>{ex.resultado}</p>
                            </div>
                          </div>
                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(250,204,21,0.07)', borderRadius: '0.5rem', borderLeft: '3px solid #facc15', display: 'flex', gap: '0.5rem' }}>
                            <Lightbulb size={14} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{ex.insight}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RODAPÉ — Como combinar os métodos */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(99,102,241,0.08) 100%)', borderColor: 'rgba(245,158,11,0.25)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: COR, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} /> Como Combinar os Métodos na Prática
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { titulo: '1ª — Base técnica', texto: 'Calcule pelo Markup Divisor. Esse é o seu preço mínimo viável com a margem desejada garantida.', cor: '#6366f1', emoji: '🧮' },
            { titulo: '2ª — Validação de mercado', texto: 'Compare com concorrentes. Se o mercado paga mais, aumente. Se paga menos, revise seus custos ou diferencie.', cor: '#22c55e', emoji: '🔍' },
            { titulo: '3ª — Ajuste psicológico', texto: 'Termine em ,90 ou ,99. Crie âncoras. Empacote em combos. Esses ajustes custam zero e aumentam conversão.', cor: '#06b6d4', emoji: '🧠' },
            { titulo: '4ª — MC para promoções', texto: 'Antes de dar desconto, calcule a MC mínima. Qualquer preço acima do CV contribui — mas precisa cobrir os fixos.', cor: '#10b981', emoji: '📊' },
          ].map((k, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', borderTop: `3px solid ${k.cor}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{k.emoji}</div>
              <div style={{ fontWeight: 700, color: k.cor, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{k.titulo}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{k.texto}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/marmitaria/precificacao')}
            style={{ padding: '0.875rem 2rem', background: COR, border: 'none', fontWeight: 700 }}>
            Voltar para a Simulação de Preço →
          </button>
        </div>
      </div>
    </div>
  );
}
