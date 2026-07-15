import React, { useState, useRef, useEffect } from 'react';

import { generateClientChat } from '../dataFallback';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### 👋 Welcome to Lost Innovation Assistant!\n\nI am **ReviveAI**, your platform companion. I can help you analyze forgotten patents, research papers, and failed startup models to transform them into active commercial projects.\n\n**Here is what you can ask me:**\n* 🔍 *"How can we revive the Lytro camera today?"*\n* 💡 *"Suggest a unique hackathon project idea for a student team."*\n* 📊 *"What are the main failure bottlenecks of Google Glass?"*\n* 🛠️ *"How do I start building a startup roadmap for an idea?"*`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message
    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
      } else {
        throw new Error("Chat api failed");
      }
    } catch (error) {
      console.warn("Backend chat unreachable. Generating client-side dialogue.");
      const reply = generateClientChat(userText);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `${reply}\n\n*(Active in Offline Local Mode)*`
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }
    setIsLoading(false);
  };

  const selectSuggestion = (text) => {
    setInputValue(text);
  };

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h4 key={i} style={{ color: 'var(--color-secondary)', margin: '0.8rem 0 0.4rem 0', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{trimmed.replace('### ', '')}</h4>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h5 key={i} style={{ color: 'var(--color-primary)', margin: '0.6rem 0 0.3rem 0', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{trimmed.replace('#### ', '')}</h5>;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('➔ ') || trimmed.startsWith('* ➔') || trimmed.startsWith('- ➔')) {
        let cleanLine = trimmed
          .replace(/^(\*\s*➔|\-\s*➔|\*|\-|\➔)\s*/, '');
        
        // Parse bold elements in bullet points
        if (cleanLine.includes('**')) {
          const parts = cleanLine.split('**');
          return (
            <li key={i} style={{ marginLeft: '1rem', listStyleType: 'square', color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
              {parts.map((part, index) => index % 2 === 1 ? <strong key={index} style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{part}</strong> : part)}
            </li>
          );
        }
        return <li key={i} style={{ marginLeft: '1rem', listStyleType: 'square', color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '0.8rem', lineHeight: '1.4' }}>{cleanLine}</li>;
      }
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        return (
          <p key={i} style={{ marginBottom: '0.4rem', lineHeight: '1.4', fontSize: '0.8rem' }}>
            {parts.map((part, index) => index % 2 === 1 ? <strong key={index} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{part}</strong> : part)}
          </p>
        );
      }
      return <p key={i} style={{ marginBottom: '0.4rem', lineHeight: '1.4', fontSize: '0.8rem' }}>{line}</p>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tech-button tech-button-glow"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          padding: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
        }}
      >
        {isOpen ? <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span> : <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>chat</span>}
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '400px',
            height: '550px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(90deg, rgba(15, 19, 29, 0.8), rgba(99, 102, 241, 0.15))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>smart_toy</span>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>ReviveAI Copilot</h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="pulse-indicator" style={{ width: '6px', height: '6px' }}></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'var(--bg-panel)'
          }}>
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexDirection: isAssistant ? 'row' : 'row-reverse',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isAssistant ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    border: `1px solid ${isAssistant ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isAssistant ? <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>smart_toy</span> : <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>person</span>}
                  </div>
                  <div style={{
                    background: isAssistant ? 'rgba(30, 41, 59, 0.5)' : 'rgba(6, 182, 212, 0.15)',
                    border: `1px solid ${isAssistant ? 'var(--border-color)' : 'rgba(6, 182, 212, 0.25)'}`,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    maxWidth: '80%',
                    color: 'var(--text-main)'
                  }}>
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>smart_toy</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="pulse-indicator" style={{ animationDelay: '0s' }}></div>
                  <div className="pulse-indicator" style={{ animationDelay: '0.2s' }}></div>
                  <div className="pulse-indicator" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages[messages.length - 1]?.role === 'assistant' && !isLoading && (
            <div style={{
              padding: '0.5rem 1rem',
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              borderTop: '1px solid var(--border-color)',
              background: 'rgba(15, 19, 29, 0.4)',
              whiteSpace: 'nowrap'
            }}>
              <button 
                onClick={() => selectSuggestion("Revive Lytro Camera")}
                className="tech-button tech-button-outline"
                style={{ fontSize: '0.7rem', padding: '0.35rem 0.6rem', borderRadius: '15px' }}
              >
                Revive Lytro Camera
              </button>
              <button 
                onClick={() => selectSuggestion("Suggest Hackathon Idea")}
                className="tech-button tech-button-outline"
                style={{ fontSize: '0.7rem', padding: '0.35rem 0.6rem', borderRadius: '15px' }}
              >
                Suggest Hackathon Idea
              </button>
              <button 
                onClick={() => selectSuggestion("Google Glass failures")}
                className="tech-button tech-button-outline"
                style={{ fontSize: '0.7rem', padding: '0.35rem 0.6rem', borderRadius: '15px' }}
              >
                Google Glass failures
              </button>
            </div>
          )}

          {/* Footer Input */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-panel-solid)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              className="tech-input"
              placeholder="Ask ReviveAI about any project..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              style={{ borderRadius: '20px' }}
            />
            <button 
              type="submit" 
              className="tech-button"
              disabled={isLoading}
              style={{
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                padding: 0,
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
