import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useFlowStore } from '../store/useFlowStore';
import { cn } from '../lib/cn';
import { 
  MessageSquare, Plus, Image as ImageIcon, 
  Smile, Type, Filter, Zap, Shield, Sparkles, Globe, Terminal, User, ArrowRight, Database, Trash, CheckCircle, XCircle 
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
    value: string;
  }>;
  jsonResponseConfig?: {
    enabled: boolean;
    variableName: string;
    displayField: string;
    valueField: string;
  };
  status?: 'active' | 'draft';
}

export const MessageNode = memo(({ data, selected, id }: NodeProps<MessageNodeData>) => {
  const nodeId = id || data?.id || 'MSG';
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const deleteNode = useFlowStore((state) => state.deleteNode);

  const updateMessage = (index: number, content: string) => {
    const newMessages = [...data.messages];
    newMessages[index] = { ...newMessages[index], content };
    updateNodeData(nodeId, { messages: newMessages });
  };

  const updateButton = (index: number, key: 'label' | 'value', value: string) => {
    const newButtons = [...data.buttons];
    newButtons[index] = { ...newButtons[index], [key]: value };
    updateNodeData(nodeId, { buttons: newButtons });
  };

  const removeButton = (index: number) => {
    const newButtons = data.buttons.filter((_: any, i: number) => i !== index);
    updateNodeData(nodeId, { buttons: newButtons });
  };

  const addButton = () => {
    const newButtons = [...data.buttons, { id: `b-${Date.now()}`, label: 'Nuevo Botón', value: '' }];
    updateNodeData(nodeId, { buttons: newButtons });
  };

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
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar nodo"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3 bg-white">
        {data.messages.map((msg, index) => (
          <div key={msg.id} className="relative group/msg">
            <div className="bg-surface-bg rounded-xl p-3 text-sm text-text-primary leading-relaxed border border-border-light group-hover/msg:border-brand-200 transition-colors">
              <textarea
                value={msg.content}
                onChange={(e) => updateMessage(index, e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
          </div>
        ))}

        <div className="space-y-1.5 pt-2">
          {data.buttons.map((btn, index) => (
            <div key={btn.id} className="relative space-y-1">
              <div className="flex gap-1 items-center">
                <input
                  type="text"
                  value={btn.label}
                  onChange={(e) => updateButton(index, 'label', e.target.value)}
                  className="flex-1 py-2.5 px-3 bg-white border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-all shadow-sm"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={btn.value}
                  onChange={(e) => updateButton(index, 'value', e.target.value)}
                  className="w-16 py-2.5 px-2 bg-white border border-brand-200 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-50 transition-all shadow-sm"
                  placeholder="Valor"
                />
                <button
                  onClick={() => removeButton(index)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar botón"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={btn.id}
                className="!w-3 !h-3 !-right-1.5 !bg-brand-500 !border-2 !border-white"
              />
            </div>
          ))}
          
          <button 
            onClick={addButton}
            className="w-full py-2 border border-dashed border-border-strong text-text-muted text-[10px] font-bold uppercase rounded-xl hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Añadir Botón
          </button>
        </div>

        {data.jsonResponseConfig?.enabled && (
          <div className="space-y-2 pt-2 border-t border-border-light">
            <label className="text-[10px] font-bold text-text-muted uppercase">Variable de Respuesta JSON</label>
            <input
              type="text"
              value={data.jsonResponseConfig.variableName}
              onChange={(e) => updateNodeData(nodeId, { jsonResponseConfig: { ...data.jsonResponseConfig!, variableName: e.target.value } })}
              className="w-full px-2 py-1.5 bg-surface-bg border border-border-light rounded-lg text-xs font-mono text-teal-700 focus:ring-1 focus:ring-teal-500"
              placeholder="nombre_variable"
            />
            <div className="grid grid-cols-2 gap-1">
              <input
                type="text"
                value={data.jsonResponseConfig.displayField}
                onChange={(e) => updateNodeData(nodeId, { jsonResponseConfig: { ...data.jsonResponseConfig!, displayField: e.target.value } })}
                className="px-2 py-1.5 bg-surface-bg border border-border-light rounded-lg text-xs font-mono text-text-primary focus:ring-1 focus:ring-teal-500"
                placeholder="Campo visible (name)"
              />
              <input
                type="text"
                value={data.jsonResponseConfig.valueField}
                onChange={(e) => updateNodeData(nodeId, { jsonResponseConfig: { ...data.jsonResponseConfig!, valueField: e.target.value } })}
                className="px-2 py-1.5 bg-surface-bg border border-border-light rounded-lg text-xs font-mono text-text-primary focus:ring-1 focus:ring-teal-500"
                placeholder="Campo valor (id)"
              />
            </div>
            <div className="p-2 bg-surface-panel rounded-lg border border-border-light">
              <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Vista previa de lista:</p>
              {data.jsonResponseConfig.displayField && data.jsonResponseConfig.valueField ? (
                <div className="space-y-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-primary">
                      <span className="text-[10px] font-bold text-text-muted w-4">{i}.</span>
                      <span className="font-medium">{data.jsonResponseConfig!.displayField}</span>
                      <span className="text-[10px] text-text-muted">→ valor: {data.jsonResponseConfig!.valueField}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-text-muted">Configura los campos para ver la vista previa</p>
              )}
            </div>
          </div>
        )}
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
  const deleteNode = useFlowStore((state) => state.deleteNode);

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
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar nodo"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4 bg-white space-y-3">
        <div className="text-xs font-semibold text-text-primary px-3 py-2 bg-surface-bg rounded-lg border border-border-light">
          {data.condition || 'Añade una lógica de condición...'}
        </div>
        <div className="space-y-2">
          <div className="relative flex items-center justify-between px-3 py-2 bg-status-successBg rounded-lg border border-status-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-status-success" />
              <span className="text-[10px] font-bold text-status-success uppercase">Sí</span>
            </div>
            <Handle type="source" position={Position.Right} id="true" className="!w-3 !h-3 !-right-1.5 !bg-status-success !border-2 !border-white" />
          </div>
          <div className="relative flex items-center justify-between px-3 py-2 bg-status-dangerBg rounded-lg border border-status-danger/20">
            <div className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-status-danger" />
              <span className="text-[10px] font-bold text-status-danger uppercase">No</span>
            </div>
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
  const deleteNode = useFlowStore((state) => state.deleteNode);
  
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
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar nodo"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
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

/* ─── UserInputNode ─── */
export interface UserInputNodeData {
  id?: string;
  label?: string;
  question: string;
  variableName: string;
  variableType: 'string' | 'number' | 'boolean';
  status?: 'active' | 'draft';
}

export const UserInputNode = memo(({ data, selected, id }: NodeProps<UserInputNodeData>) => {
  const nodeId = id || data?.id || 'INP';
  const deleteNode = useFlowStore((state) => state.deleteNode);

  return (
    <div className={cn(
      'card-base w-[280px] overflow-hidden group border-2 transition-all',
      selected ? 'border-purple-500 shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
            Respuesta Usuario
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar nodo"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3 bg-white">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase">Pregunta</label>
          <div className="text-xs font-semibold text-text-primary px-3 py-2 bg-surface-bg rounded-lg border border-border-light">
            {data.question || '¿Cuál es tu nombre?'}
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase">Guardar en variable</label>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-xs font-mono text-purple-700">{data.variableName || 'variable_name'}</span>
            <span className="text-[10px] text-purple-500">({data.variableType || 'string'})</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 bg-purple-50 border-t flex items-center justify-between">
        <div className="flex gap-2">
          <User className="w-3.5 h-3.5 text-purple-400" />
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <span className="text-[9px] font-bold text-purple-400">#{nodeId.slice(0, 6)}</span>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !-left-1.5 !bg-purple-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !-right-1.5 !bg-purple-500 !border-2 !border-white" />
    </div>
  );
});

UserInputNode.displayName = 'UserInputNode';

export interface ResourceVariable {
  id: string;
  name: string;
  type: 'string' | 'json' | 'string[]' | 'json[]';
  value: string;
  description: string;
}

export interface ResourceNodeData {
  id?: string;
  label?: string;
  variables: ResourceVariable[];
  status?: 'active' | 'draft';
}

export const ResourceNode = memo(({ data, selected, id }: NodeProps<ResourceNodeData>) => {
  const nodeId = id || data?.id || 'RES';
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const deleteNode = useFlowStore((state) => state.deleteNode);

  const addVariable = () => {
    const newVars = [...(data.variables || []), { id: `rv-${Date.now()}`, name: '', type: 'string' as const, value: '', description: '' }];
    updateNodeData(nodeId, { variables: newVars });
  };

  const removeVariable = (index: number) => {
    const newVars = data.variables.filter((_: any, i: number) => i !== index);
    updateNodeData(nodeId, { variables: newVars });
  };

  const updateVariable = (index: number, key: keyof ResourceVariable, value: string) => {
    const newVars = [...data.variables];
    newVars[index] = { ...newVars[index], [key]: value };
    updateNodeData(nodeId, { variables: newVars });
  };

  return (
    <div className={cn(
      'card-base w-[300px] overflow-hidden group border-2 transition-all',
      selected ? 'border-teal-500 shadow-card-lg scale-[1.02]' : 'border-transparent'
    )}>
      <div className="px-4 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center text-white">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
            Recurso / Variables
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Eliminar nodo"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2 bg-white max-h-[300px] overflow-y-auto">
        {data.variables?.map((v: ResourceVariable, index: number) => (
          <div key={v.id} className="p-2 bg-surface-bg rounded-lg border border-border-light space-y-1.5">
            <div className="flex gap-1 items-center">
              <input
                type="text"
                value={v.name}
                onChange={(e) => updateVariable(index, 'name', e.target.value)}
                className="flex-1 px-2 py-1 bg-white border border-border-light rounded text-xs font-mono text-teal-700 focus:ring-1 focus:ring-teal-500"
                placeholder="nombre_variable"
              />
              <select
                value={v.type}
                onChange={(e) => updateVariable(index, 'type', e.target.value)}
                className="px-1 py-1 bg-white border border-border-light rounded text-[10px] font-bold text-teal-600 focus:ring-1 focus:ring-teal-500"
              >
                <option value="string">String</option>
                <option value="json">JSON</option>
                <option value="string[]">String[]</option>
                <option value="json[]">JSON[]</option>
              </select>
              <button
                onClick={() => removeVariable(index)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
            {v.type === 'string' && (
              <input
                type="text"
                value={v.value}
                onChange={(e) => updateVariable(index, 'value', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border-light rounded text-xs text-text-primary focus:ring-1 focus:ring-teal-500"
                placeholder="Valor..."
              />
            )}
            {(v.type === 'json' || v.type === 'json[]') && (
              <textarea
                value={v.value}
                onChange={(e) => updateVariable(index, 'value', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border-light rounded text-[10px] font-mono text-text-primary focus:ring-1 focus:ring-teal-500 resize-none"
                rows={3}
                placeholder='{"key": "value"} o [{"id":"1","name":"a"}]'
              />
            )}
            {v.type === 'string[]' && (
              <input
                type="text"
                value={v.value}
                onChange={(e) => updateVariable(index, 'value', e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border-light rounded text-xs text-text-primary focus:ring-1 focus:ring-teal-500"
                placeholder="valor1, valor2, valor3..."
              />
            )}
            <input
              type="text"
              value={v.description}
              onChange={(e) => updateVariable(index, 'description', e.target.value)}
              className="w-full px-2 py-1 bg-white border border-border-light rounded text-[10px] text-text-muted focus:ring-1 focus:ring-teal-500"
              placeholder="Descripción (opcional)"
            />
          </div>
        ))}

        <button 
          onClick={addVariable}
          className="w-full py-2 border border-dashed border-border-strong text-text-muted text-[10px] font-bold uppercase rounded-xl hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-3 h-3" />
          Añadir Variable
        </button>
      </div>

      <div className="px-3 py-2 bg-teal-50 border-t flex items-center justify-between">
        <div className="flex gap-2">
          <Database className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[10px] text-teal-500 font-bold">{data.variables?.length || 0} variables</span>
        </div>
        <span className="text-[9px] font-bold text-teal-400">#{nodeId.slice(0, 6)}</span>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !-left-1.5 !bg-teal-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !-right-1.5 !bg-teal-500 !border-2 !border-white" />
    </div>
  );
});

ResourceNode.displayName = 'ResourceNode';
