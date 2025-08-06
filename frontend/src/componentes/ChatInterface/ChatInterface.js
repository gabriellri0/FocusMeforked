import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const location = useLocation();

  const getInitialMessages = () => {
    // Verifica se recebeu dados da página de formulário
    if (location.state && location.state.cronograma_output) {
      const { estudoData, cronograma_output } = location.state;
      
      // Limpa o estado da navegação para não ser reutilizado se o usuário recarregar a página
      window.history.replaceState({}, document.title);
      
      // Se receber dados, o estado inicial já será o cronograma
      return [
        { 
          role: 'user', 
          content: `Ok, por favor, gere um cronograma para as seguintes matérias: ${estudoData.disciplinas}.`, 
          timestamp: new Date() 
        },
        { 
          role: 'assistant', 
          content: cronograma_output, 
          timestamp: new Date() 
        }
      ];
    }
    
    // Se não receber nenhum dado, o estado inicial será a mensagem padrão
    return [
      { 
        role: 'assistant', 
        content: 'Olá! Sou o assistente do FocusMe. Como posso te ajudar a organizar seus estudos hoje?',
        timestamp: new Date() 
      }
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages);

  const [inputValue, setInputValue] = useState('');
  const messageAreaRef = useRef(null);


  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]); 

  const handleSendMessage = async (e) => {
    e.preventDefault(); 
    if (!inputValue.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: inputValue, 
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: userMessage.content }), 
      });

      if (!response.ok) {
        throw new Error('A resposta do servidor não foi OK');
      }

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.resposta,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = { 
        role: 'assistant', 
        content: "Desculpe, ocorreu um erro ao me comunicar com o servidor. Por favor, tente novamente mais tarde.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.messageArea} ref={messageAreaRef}>
        {messages.map((msg, index) => {
          const showDateSeparator = 
            index === 0 || 
            new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

          return (
            <React.Fragment key={index}>
              {showDateSeparator && (
                <div className={styles.dateSeparator}>
                  <span>
                    {new Date(msg.timestamp).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className={`${styles.message} ${styles[msg.role]}`}>
                <p>{msg.content}</p>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;