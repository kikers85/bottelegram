import { useState, useRef, useEffect } from 'react';
import { useAppStore, type ChatMessage } from '../store/useAppStore';
import { cn } from '../lib/cn';
import { Send, X, Bot, User, RefreshCw } from 'lucide-react';

export function TestChat() {
  const { chatMessages, addChatMessage, clearChat, showTestChat, setShowTestChat, bots } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    addChatMessage({ role: 'user', content: input });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'bot',
        content: getBotResponse(input),
        timestamp: new Date().toISOString(),
      };
      set((state: { chatMessages: ChatMessage[] }) => ({
        chatMessages: [...state.chatMessages, botResponse],
      }));
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const publishedBot = bots.find(b => b.status === 'published');
    if (publishedBot) {
      if (userInput.toLowerCase().includes('help')) {
        return 'Here are the available commands:\n\n📋 View Features - See our features\n❓ Contact Support - Get help\n\nHow can I assist you?';
      }
      if (userInput.toLowerCase().includes('feature')) {
        return 'Our SecureBot Lab offers:\n\n🔒 Advanced security\n🤖 AI-powered automation\n📊 Analytics dashboard\n\nWould you like to know more?';
      }
    }
    return 'Thanks for your message! This is a test response from your bot. Configure your flow to customize responses.';
  };

  const set = (updater: (state: { chatMessages: ChatMessage[] }) => { chatMessages: ChatMessage[] }) => {
    const store = useAppStore.getState();
    const currentMessages = store.chatMessages;
    const newState = updater({ chatMessages: currentMessages });
    useAppStore.setState({ chatMessages: newState.chatMessages });
  };

  if (!showTestChat) return null;

  return (
    <div className="w-[360px] h-full bg-white border-l border-border-light flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <h2 className="text-sm font-bold text-white">Test Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4 text-white/80" />
          </button>
          <button
            onClick={() => setShowTestChat(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bot Info */}
      <div className="px-4 py-2 bg-indigo-50 border-b flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-indigo-700">
          {bots.find(b => b.status === 'published')?.name || 'No published bot'}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bg">
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Bot className="w-12 h-12 text-indigo-300 mb-3" />
            <p className="text-sm font-medium text-text-secondary">Start testing your bot</p>
            <p className="text-xs text-text-muted mt-1">Send a message to see the bot's response</p>
          </div>
        )}
        
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
              msg.role === 'user' ? 'bg-brand-500' : 'bg-indigo-600'
            )}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={cn(
              'max-w-[75%] p-3 rounded-2xl text-sm',
              msg.role === 'user'
                ? 'bg-brand-500 text-white rounded-br-md'
                : 'bg-white border border-border-light text-text-primary rounded-bl-md'
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border-light p-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
