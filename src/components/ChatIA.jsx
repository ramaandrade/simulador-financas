import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function ChatIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Olá! Sou seu Consultor de Finanças habilitado com Inteligência Artificial Integrada. Pode me fazer qualquer pergunta sobre as simulações, finanças de pequenos negócios, ou pedir ajuda para entender um conceito complexo!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const callGeminiAPI = async (userPrompt, chatHistory) => {
    if (!GEMINI_API_KEY) {
      throw new Error("Chave de API do Gemini ausente. Configure o arquivo .env com VITE_GEMINI_API_KEY=sua_chave.");
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // Mapeando histórico para o formato do Gemini
    // O primeiro item (apresentação do Model) nós não passamos, a menos que ele saiba lidar com isso
    // Vamos passar todo o histórico relevante que não foi falha
    const contents = chatHistory
      .filter(msg => msg.role !== 'systemError')
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Adiciona a nova mensagem do usuário
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "Você é um Consultor de Finanças amigável, educacional e acadêmico de um aplicativo para alunos universitários de Administração. Seu trabalho é ensinar passo-a-passo sobre Custos Fixos, Variáveis e Despesas. Use parágrafos curtos. Dê exemplos ligados à marmitaria (alimentos). Se perguntarem algo completamente fora de finanças corporativas ou pequenas empresas, educadamente volte o foco."
          }]
        },
        contents
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erro desconhecido ao chamar a API.");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);
    setHasError(false);

    try {
      // Pass the current messages to maintain context
      const reply = await callGeminiAPI(userText, messages);
      // Remove double asterisks that Gemini adds for bold for a cleaner look if we don't use a Markdown parser
      const cleanReply = reply.replace(/\*\*/g, '');
      setMessages(prev => [...prev, { role: 'model', text: cleanReply }]);
    } catch (err) {
      console.error(err);
      setHasError(true);
      setMessages(prev => [...prev, { 
        role: 'systemError', 
        text: `Falha de Conexão: ${err.message}. Para voltar ao Bot Simulado, remova o arquivo .env ou adicione uma Chave válida clicando neste link: https://aistudio.google.com/app/apikey` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          padding: 0,
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
          zIndex: 100
        }}
        title="Falar com a IA Genuína"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '380px',
        height: '550px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'var(--primary)',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '1rem',
        borderTopRightRadius: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'white', padding: '0.25rem', borderRadius: '50%' }}>
            <Bot color="var(--primary)" size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontWeight: 600, color: 'white' }}>Consultor Integrado (IA)</span>
             <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                {GEMINI_API_KEY ? '✔ Conectado à API' : '⚠ Chave Ausente'}
             </span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ color: 'white', padding: '0.25rem' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: 'rgba(2, 6, 23, 0.4)'
      }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isError = msg.role === 'systemError';

          return (
            <div 
              key={idx} 
              style={{ 
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.25rem',
                justifyContent: isUser ? 'flex-end' : 'flex-start'
              }}>
                <span style={{ fontSize: '0.75rem', color: isError ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {isUser ? 'Você' : (isError ? 'Erro do Sistema' : 'IA Consultora')}
                </span>
              </div>
              <div style={{
                background: isUser ? 'var(--primary)' : (isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
                color: isError ? '#f87171' : 'white',
                border: isError ? '1px solid var(--danger)' : 'none',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderTopRightRadius: isUser ? 0 : '1rem',
                borderTopLeftRadius: !isUser ? 0 : '1rem',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap' // Important for API line breaks
              }}>
                {msg.text}
              </div>
            </div>
          )
        })}
        {isTyping && (
           <div style={{ alignSelf: 'flex-start' }}>
             <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                borderTopLeftRadius: 0,
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
             }}>
               Analisando finanças...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSend}
        style={{
          padding: '1rem',
          display: 'flex',
          gap: '0.5rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-card)'
        }}
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tire suas dúvidas financeiras..."
          disabled={isTyping}
          className="input-field"
          style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '2rem' }}
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="btn-primary"
          style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
