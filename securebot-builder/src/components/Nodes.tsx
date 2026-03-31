import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { cn } from '../lib/cn';
import { 
  MessageSquare, MoreVertical, Plus, Image as ImageIcon, 
  Smile, Type, Filter, Zap, Shield, Sparkles, Globe, Terminal 
} from 'lucide-react';

/* ─── MessageNode ─── */
export interface MessageNodeData {
  id?: string;
  label?: string;
  messages: Array<{
    id: string;
    type: 'text' | 'image' | 'video';
    content: string;
  }>;
  buttons: Array<{
    id: string;
    label: string;
  }>;
  status?: 'active' | 'draft';
}

export const MessageNode = memo(({ data, selected, id }: NodeProps<MessageNodeData>) => {
  const nodeId = id || data?.id || 'MSG';
  return (
    <div className={cn(
      'card-base w-[280px] overflow-hidden group border-2 transition-all',
      selected ? 'border-brand-500 shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2.5 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-white">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-900">
            Enviar Mensaje
          </span>
        </div>
        <MoreVertical className="w-4 h-4 text-brand-400 cursor-pointer hover:text-brand-600 transition-colors" />
      </div>

      <div className="p-3 space-y-3 bg-white">
        {data.messages.map((msg) => (
          <div key={msg.id} className="relative group/msg">
            <div className="bg-surface-bg rounded-xl p-3 text-sm text-text-primary leading-relaxed border border-border-light group-hover/msg:border-brand-200 transition-colors">
              {msg.type === 'text' ? (
                <p>{msg.content || 'Escribe tu mensaje aquí...'}</p>
              ) : (
                <div className="flex items-center justify-center h-20 bg-surface-hover rounded-lg border-2 border-dashed border-border-light">
                  <ImageIcon className="w-6 h-6 text-text-muted" />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="space-y-1.5 pt-2">
          {data.buttons.map((btn) => (
            <div key={btn.id} className="relative">
              <button className="w-full py-2.5 px-4 bg-white border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-all shadow-sm flex items-center justify-center">
                {btn.label}
              </button>
              <Handle
                type="source"
                position={Position.Right}
                id={btn.id}
                className="!w-3 !h-3 !-right-1.5 !bg-brand-500 !border-2 !border-white"
              />
            </div>
          ))}
          
          <button className="w-full py-2 border border-dashed border-border-strong text-text-muted text-[10px] font-bold uppercase rounded-xl hover:bg-surface-hover transition-colors flex items-center justify-center gap-2">
            <Plus className="w-3 h-3" />
            Añadir Botón
          </button>
        </div>
      </div>

      <div className="px-3 py-2 bg-surface-panel border-t flex items-center justify-between">
        <div className="flex gap-2">
          <Type className="w-3.5 h-3.5 text-text-muted" />
          <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
          <Smile className="w-3.5 h-3.5 text-text-muted" />
        </div>
        <span className="text-[9px] font-bold text-text-muted">#{nodeId.slice(0, 6)}</span>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !-left-1.5 !bg-brand-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !-right-1.5 !bg-brand-500 !border-2 !border-white" />
    </div>
  );
});

/* ─── ConditionNode ─── */
export const ConditionNode = memo(({ data, selected, id }: NodeProps<{ id?: string; condition: string }>) => {
  const nodeId = id || data?.id || 'COND';
  return (
    <div className={cn(
      'card-base w-[260px] overflow-hidden group border-2 transition-all',
      selected ? 'border-status-warning shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2 bg-status-warningBg border-b border-status-warning/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-status-warning flex items-center justify-center text-white">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-status-warning">
            Condición
          </span>
        </div>
      </div>
      <div className="p-4 bg-white space-y-3">
        <div className="text-xs font-semibold text-text-primary px-3 py-2 bg-surface-bg rounded-lg border border-border-light">
          {data.condition || 'Añade una lógica de condición...'}
        </div>
        <div className="space-y-2">
          <div className="relative flex items-center justify-between px-3 py-2 bg-status-successBg rounded-lg border border-status-success/20">
            <span className="text-[10px] font-bold text-status-success uppercase">Verdadero</span>
            <Handle type="source" position={Position.Right} id="true" className="!w-3 !h-3 !-right-1.5 !bg-status-success !border-2 !border-white" />
          </div>
          <div className="relative flex items-center justify-between px-3 py-2 bg-status-dangerBg rounded-lg border border-status-danger/20">
            <span className="text-[10px] font-bold text-status-danger uppercase">Falso</span>
            <Handle type="source" position={Position.Right} id="false" className="!w-3 !h-3 !-right-1.5 !bg-status-danger !border-2 !border-white" />
          </div>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-surface-panel border-t flex items-center justify-end">
        <span className="text-[9px] font-bold text-text-muted">#{nodeId.slice(0, 6)}</span>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !-left-1.5 !bg-brand-500 !border-2 !border-white" />
    </div>
  );
});

/* ─── External API Action Config ─── */
export interface ExternalAPIAction {
  name: string;
  url: string;
  response_type: 'string' | 'string[]' | 'object';
  response_variable: string;
  method: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'CREATE';
  body_JSON?: string;
}

/* ─── ActionNode ─── */
export interface ActionNodeData {
  id?: string;
  action: string;
  externalApi?: ExternalAPIAction;
  status?: 'active' | 'draft';
}

export const ActionNode = memo(({ data, selected, id }: NodeProps<ActionNodeData>) => {
  const nodeId = id || data?.id || 'ACT';
  const isExternalApi = data.action === 'External API';
  
  return (
    <div className={cn(
      'card-base w-[280px] overflow-hidden group border-2 transition-all',
      selected ? 'border-brand-500 shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-900">
            Acción
          </span>
        </div>
        {isExternalApi && (
          <Globe className="w-3.5 h-3.5 text-brand-500" />
        )}
      </div>
      <div className="p-4 bg-white">
        {isExternalApi && data.externalApi ? (
          <div className="space-y-2">
            <div className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-500" />
              {data.externalApi.name || 'API Externa'}
            </div>
            <div className="text-xs text-text-secondary bg-surface-bg p-2 rounded-lg border border-border-light">
              <span className="font-semibold">{data.externalApi.method}</span>
              <span className="ml-2 truncate">{data.externalApi.url || 'Sin URL configurada'}</span>
            </div>
            {data.externalApi.response_variable && (
              <div className="text-[10px] text-text-muted">
                → {data.externalApi.response_variable}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 text-sm font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-500" />
            {data.action || 'Asignar Etiqueta...'}
          </div>
        )}
      </div>
      <div className="px-3 py-1.5 bg-surface-panel border-t flex items-center justify-end">
        <span className="text-[9px] font-bold text-text-muted">#{nodeId.slice(0, 6)}</span>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !-left-1.5 !bg-brand-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !-right-1.5 !bg-brand-500 !border-2 !border-white" />
    </div>
  );
});

/* ─── TriggerNode ─── */
export const TriggerNode = memo(({ data, selected, id }: NodeProps<{ id?: string; label: string; description: string }>) => {
  const nodeId = id || data?.id || 'TRIG';
  return (
    <div className={cn(
      'card-base w-[260px] overflow-hidden group border-2 transition-all',
      selected ? 'border-indigo-600 shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2.5 bg-indigo-900 border-b border-indigo-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">
            Disparador
          </span>
        </div>
        <div className="flex gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="text-sm font-bold text-text-primary">
          {data.label || 'Unido al Grupo'}
        </div>
        <div className="mt-1 text-xs text-text-secondary leading-snug">
          {data.description || 'La automatización inicia cuando...'}
        </div>
      </div>
      <div className="px-3 py-1.5 bg-indigo-50 border-t flex items-center justify-end">
        <span className="text-[9px] font-bold text-indigo-400">#{nodeId.slice(0, 6)}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !-right-1.5 !bg-indigo-600 !border-2 !border-white" />
    </div>
  );
});

MessageNode.displayName = 'MessageNode';
ConditionNode.displayName = 'ConditionNode';
ActionNode.displayName = 'ActionNode';
TriggerNode.displayName = 'TriggerNode';
