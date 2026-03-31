import { useState, useRef, useEffect } from 'react';
import { useAppStore, type ChatMessage } from '../store/useAppStore';
import { useFlowStore } from '../store/useFlowStore';
import { cn } from '../lib/cn';
import { useFlowExecutor, type FlowLogEntry } from '../services/FlowExecutor';
import { useFlows } from '../hooks/queries/useFlows';
import { Send, X, Bot, User, RefreshCw, Activity, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

export function TestChat() {
  const { chatMessages, addChatMessage, clearChat, showTestChat, setShowTestChat, selectedFlowId } = useAppStore();
  const { nodes: storeNodes } = useFlowStore();
  const { flows } = useFlows();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<FlowLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [lastButtons, setLastButtons] = useState<Array<{ id: string; label: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const currentFlow = flows.find((f: any) => f.id === selectedFlowId);
  const flowNodes = currentFlow?.nodes?.length ? currentFlow.nodes : storeNodes;
  const flowEdges = currentFlow?.edges?.length ? currentFlow.edges : [];
  const { executeFlow } = useFlowExecutor(flowNodes, flowEdges);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollLogsToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (showLogs) {
      scrollLogsToBottom();
    }
  }, [executionLogs, showLogs]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    addChatMessage({ role: 'user', content: userMessage });
    setInput('');
    setIsTyping(true);
    setExecutionLogs([]);
    setLastButtons([]);

    const hasNodes = flowNodes.length > 0;
    const hasTrigger = flowNodes.some((n: any) => n.type === 'triggerNode');

    if (!hasNodes) {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'bot',
        content: 'No hay nodos configurados en el flujo. Por favor añade nodos al flujo primero.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage({ role: 'bot', content: botResponse.content });
      return;
    }

    if (!hasTrigger) {
      setIsTyping(false);
      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'bot',
        content: 'El flujo no tiene un nodo de trigger configurado. Añade un disparador para iniciar el flujo.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage({ role: 'bot', content: botResponse.content });
      return;
    }

    try {
      const result = await executeFlow(userMessage);
      setExecutionLogs(result.logs);

      if (result.buttons && result.buttons.length > 0) {
        setLastButtons(result.buttons);
        const buttonLabels = result.buttons.map(b => b.label).join(', ');
        const botResponse: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'bot',
          content: `${result.response}\n\n📋 Opciones: ${buttonLabels}`,
          timestamp: new Date().toISOString(),
        };
        addChatMessage({ role: 'bot', content: botResponse.content });
      } else {
        addChatMessage({ role: 'bot', content: result.response });
      }
    } catch (error) {
      console.error('Error executing flow:', error);
      addChatMessage({ role: 'bot', content: 'Hubo un error al ejecutar el flujo. Por favor verifica la configuración.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleButtonClick = async (buttonLabel: string) => {
    addChatMessage({ role: 'user', content: buttonLabel });
    setIsTyping(true);

    try {
      const result = await executeFlow(buttonLabel);
      setExecutionLogs(prev => [...prev, ...result.logs]);

      if (result.buttons && result.buttons.length > 0) {
        setLastButtons(result.buttons);
        const buttonLabels = result.buttons.map(b => b.label).join(', ');
        addChatMessage({ role: 'bot', content: `${result.response}\n\n📋 Opciones: ${buttonLabels}` });
      } else {
        addChatMessage({ role: 'bot', content: result.response });
      }
    } catch (error) {
      addChatMessage({ role: 'bot', content: 'Error al procesar la opción seleccionada.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    clearChat();
    setExecutionLogs([]);
    setLastButtons([]);
  };

  if (!showTestChat) return null;

  const getLogIcon = (status: FlowLogEntry['status']) => {
    switch (status) {
      case 'executing':
        return <Clock className="w-3 h-3 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getLogStatusColor = (status: FlowLogEntry['status']) => {
    switch (status) {
      case 'executing':
        return 'bg-amber-50 border-amber-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-[400px] h-full bg-white border-l border-border-light flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <h2 className="text-sm font-bold text-white">Chat de Prueba</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              showLogs ? "bg-white/30 text-white" : "hover:bg-white/20 text-white/80"
            )}
            title={showLogs ? "Ocultar logs" : "Ver logs de ejecución"}
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            title="Limpiar chat"
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

      {/* Flow Status */}
      <div className="px-4 py-2 bg-indigo-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-indigo-700">
            {flowNodes.length > 0 ? `Flujo con ${flowNodes.length} nodos` : 'Sin flujo cargado'}
          </span>
        </div>
        {executionLogs.length > 0 && (
          <span className="text-[10px] text-indigo-500">
            {executionLogs.filter(l => l.status === 'success').length} / {executionLogs.length} pasos
          </span>
        )}
      </div>

      {/* Logs Panel */}
      {showLogs && (
        <div className="h-32 border-b bg-gray-900 overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Logs de Ejecución en Tiempo Real</div>
          {executionLogs.map((log, index) => (
            <div key={index} className={cn("flex items-center gap-2 px-2 py-1 rounded text-xs", getLogStatusColor(log.status))}>
              {getLogIcon(log.status)}
              <span className="text-[9px] text-gray-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="font-semibold text-gray-700">
                [{log.nodeType}]
              </span>
              <span className="text-gray-600">{log.action}:</span>
              <span className="text-gray-500 truncate flex-1">{log.details}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bg">
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Bot className="w-12 h-12 text-indigo-300 mb-3" />
            <p className="text-sm font-medium text-text-secondary">Empieza a probar tu flujo</p>
            <p className="text-xs text-text-muted mt-1">Envía un mensaje para ejecutar el flujo</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-text-muted">
              <Play className="w-3 h-3" />
              <span>{flowNodes.length} nodos cargados</span>
            </div>
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

        {lastButtons.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {lastButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleButtonClick(btn.label)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

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
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
