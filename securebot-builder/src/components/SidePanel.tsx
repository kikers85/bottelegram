import { useFlowStore } from '../store/useFlowStore';
import { useAppStore } from '../store/useAppStore';
import { useTags } from '../hooks/queries/useTags';
import { useVariables } from '../hooks/queries/useVariables';
import { cn } from '../lib/cn';
import { 
  MessageSquare, Filter, Zap, 
  Save, Trash2, Settings, Globe, Tag, Variable, User,
  PanelRightClose, PanelRightOpen, Database, Trash
} from 'lucide-react';

interface ExternalAPIAction {
  name: string;
  url: string;
  response_type: 'string' | 'string[]' | 'object';
  response_variable: string;
  method: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'CREATE';
  body_JSON?: string;
}

/**
 * SidePanel Component
 * Dynamic property editor for the selected node in the flow.
 */
export function SidePanel() {
  const { selectedBotId } = useAppStore();
  const { nodes, selectedNodeId, updateNodeData } = useFlowStore();
  const { isSidePanelDrawerOpen, setIsSidePanelDrawerOpen } = useAppStore();
  const { tags } = useTags(selectedBotId!);
  const { variables: globalVariables } = useVariables(selectedBotId!);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!isSidePanelDrawerOpen) {
    return (
      <button 
        onClick={() => setIsSidePanelDrawerOpen(true)}
        className="w-11 h-11 rounded-btn bg-white border border-border-light flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-300 shadow-sm transition-all absolute right-4 top-20 z-30"
        title="Mostrar Propiedades"
      >
        <PanelRightOpen className="w-5 h-5" />
      </button>
    );
  }

  const handleActionTypeChange = (actionType: string) => {
    const baseData: Record<string, unknown> = { action: actionType };
    
    if (actionType === 'External API') {
      baseData.externalApi = {
        name: '',
        url: '',
        response_type: 'string',
        response_variable: '',
        method: 'GET',
        body_JSON: ''
      };
    } else if (actionType === 'Assign Variable' || actionType === 'Remove Variable') {
      baseData.variableAction = {
        variableName: '',
        variableValue: '',
        variableType: 'string'
      };
    }
    
    updateNodeData(selectedNodeId!, baseData);
  };

  if (!selectedNode) {
    return (
      <div className="w-[360px] h-full bg-white border-l border-border-light shadow-2xl flex flex-col flex-shrink-0 relative z-10">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-panel/30">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Propiedades del Nodo
            </h2>
          </div>
          <button 
            onClick={() => setIsSidePanelDrawerOpen(false)}
            className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
            title="Ocultar Panel"
          >
            <PanelRightClose className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-sm text-text-muted text-center">
            Selecciona un nodo para ver sus propiedades
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[360px] h-full bg-white border-l border-border-light shadow-2xl flex flex-col flex-shrink-0 relative z-10">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-panel/30">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Propiedades del Nodo
          </h2>
        </div>
        <button 
          onClick={() => setIsSidePanelDrawerOpen(false)}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
          title="Ocultar Panel"
        >
          <PanelRightClose className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <>
          {/* Type Identifier */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
              selectedNode.type === 'messageNode' && "bg-brand-500",
              selectedNode.type === 'conditionNode' && "bg-amber-500",
              selectedNode.type === 'actionNode' && "bg-indigo-600",
              selectedNode.type === 'triggerNode' && "bg-indigo-900",
              selectedNode.type === 'userInputNode' && "bg-purple-500",
              selectedNode.type === 'resourceNode' && "bg-teal-500"
            )}>
              {selectedNode.type === 'messageNode' && <MessageSquare className="w-6 h-6" />}
              {selectedNode.type === 'conditionNode' && <Filter className="w-6 h-6" />}
              {selectedNode.type === 'actionNode' && <Zap className="w-6 h-6" />}
              {selectedNode.type === 'triggerNode' && <Zap className="w-6 h-6" />}
              {selectedNode.type === 'userInputNode' && <User className="w-6 h-6" />}
              {selectedNode.type === 'resourceNode' && <Database className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary capitalize">
                Paso de {selectedNode.type === 'triggerNode' ? 'Disparador' : selectedNode.type === 'userInputNode' ? 'Respuesta' : selectedNode.type === 'resourceNode' ? 'Recurso' : selectedNode.type?.replace('Node', '').replace('message', 'Mensaje').replace('condition', 'Condición').replace('action', 'Acción')}
              </h3>
              <p className="text-xs text-text-muted font-medium">ID del Nodo: {selectedNode.id}</p>
            </div>
          </div>

          {/* Editing Section */}
          <div className="space-y-6 animate-fade-in">
            {selectedNode.type === 'messageNode' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Mensajes
                  </label>
                  {selectedNode.data.messages?.map((msg: any, idx: number) => (
                    <div key={msg.id} className="p-3 bg-surface-bg rounded-xl border border-border-light space-y-2">
                      <textarea 
                        className="w-full min-h-[80px] p-2 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500 transition-all"
                        value={msg.content}
                        onChange={(e) => {
                          const newMessages = [...selectedNode.data.messages];
                          newMessages[idx] = { ...newMessages[idx], content: e.target.value };
                          updateNodeData(selectedNode.id, { messages: newMessages });
                        }}
                        placeholder="Escribe el mensaje..."
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Botones
                  </label>
                  {selectedNode.data.buttons?.map((btn: any, idx: number) => (
                    <div key={btn.id} className="p-3 bg-surface-bg rounded-xl border border-border-light space-y-2">
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border border-border-light bg-white text-sm"
                        value={btn.label}
                        onChange={(e) => {
                          const newButtons = [...selectedNode.data.buttons];
                          newButtons[idx] = { ...newButtons[idx], label: e.target.value };
                          updateNodeData(selectedNode.id, { buttons: newButtons });
                        }}
                        placeholder="Etiqueta del botón"
                      />
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border border-border-light bg-white text-sm"
                        value={btn.value}
                        onChange={(e) => {
                          const newButtons = [...selectedNode.data.buttons];
                          newButtons[idx] = { ...newButtons[idx], value: e.target.value };
                          updateNodeData(selectedNode.id, { buttons: newButtons });
                        }}
                        placeholder="Valor de respuesta"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newButtons = [...(selectedNode.data.buttons || []), { id: `b-${Date.now()}`, label: 'Nuevo Botón', value: '' }];
                      updateNodeData(selectedNode.id, { buttons: newButtons });
                    }}
                    className="w-full py-2 border border-dashed border-border-strong text-text-muted text-xs font-bold rounded-xl hover:bg-surface-hover transition-colors"
                  >
                    + Añadir Botón
                  </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-border-light">
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNode.data.jsonResponseConfig?.enabled || false}
                      onChange={(e) => {
                        const config = e.target.checked
                          ? { enabled: true, variableName: '', displayField: 'name', valueField: 'id' }
                          : { enabled: false, variableName: '', displayField: '', valueField: '' };
                        updateNodeData(selectedNode.id, { jsonResponseConfig: config });
                      }}
                      className="rounded border-border-light text-teal-500 focus:ring-teal-500"
                    />
                    <Database className="w-3.5 h-3.5 text-teal-500" />
                    Respuesta con Variable JSON/Array
                  </label>
                  {selectedNode.data.jsonResponseConfig?.enabled && (
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-3">
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border border-teal-200 bg-white text-sm font-mono"
                        value={selectedNode.data.jsonResponseConfig?.variableName || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { jsonResponseConfig: { ...selectedNode.data.jsonResponseConfig!, variableName: e.target.value } })}
                        placeholder="nombre_variable"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-text-muted uppercase">Campo visible</label>
                          <input
                            type="text"
                            className="w-full p-2 rounded-lg border border-teal-200 bg-white text-xs font-mono"
                            value={selectedNode.data.jsonResponseConfig?.displayField || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { jsonResponseConfig: { ...selectedNode.data.jsonResponseConfig!, displayField: e.target.value } })}
                            placeholder="name"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-text-muted uppercase">Campo valor</label>
                          <input
                            type="text"
                            className="w-full p-2 rounded-lg border border-teal-200 bg-white text-xs font-mono"
                            value={selectedNode.data.jsonResponseConfig?.valueField || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { jsonResponseConfig: { ...selectedNode.data.jsonResponseConfig!, valueField: e.target.value } })}
                            placeholder="id"
                          />
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-teal-200">
                        <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Vista previa de lista:</p>
                        {selectedNode.data.jsonResponseConfig?.displayField && selectedNode.data.jsonResponseConfig?.valueField ? (
                          <div className="space-y-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-text-primary">
                                <span className="text-[10px] font-bold text-text-muted w-4">{i}.</span>
                                <span className="font-medium">{selectedNode.data.jsonResponseConfig!.displayField}</span>
                                <span className="text-[10px] text-text-muted">→ {selectedNode.data.jsonResponseConfig!.valueField}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-text-muted">Configura los campos para ver la vista previa</p>
                        )}
                      </div>
                      <p className="text-[10px] text-teal-600">
                        Al ejecutar, se generará una lista enumerada mostrando el campo <strong>{selectedNode.data.jsonResponseConfig.displayField || 'display'}</strong>. 
                        La respuesta capturada será el valor del campo <strong>{selectedNode.data.jsonResponseConfig.valueField || 'value'}</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedNode.type === 'triggerNode' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Etiqueta del Disparador
                </label>
                <input 
                  type="text"
                  className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-indigo-500"
                  value={selectedNode.data.label || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  placeholder="Ej. Nuevo suscriptor"
                />
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Descripción
                </label>
                <textarea 
                  className="w-full min-h-[80px] p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-indigo-500"
                  value={selectedNode.data.description || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                  placeholder="La automatización inicia cuando..."
                />
              </div>
            )}

            {selectedNode.type === 'conditionNode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Lógica de Ejecución
                  </label>
                  <input 
                    type="text"
                    className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-brand-500"
                    value={selectedNode.data.condition || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
                    placeholder="ej. usuario.status === 'premium'"
                  />
                  <div className="p-3 bg-surface-panel rounded-xl border border-border-light text-[10px] text-text-muted leading-relaxed">
                    La ramificación evaluará esta lógica y avanzará por el camino de Éxito (True) o Fallo (False).
                  </div>
                </div>
            )}

            {selectedNode.type === 'userInputNode' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Pregunta para el Usuario
                </label>
                <textarea 
                  className="w-full min-h-[80px] p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={selectedNode.data.question || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { question: e.target.value })}
                  placeholder="¿Cuál es tu nombre?"
                />

                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Nombre de Variable
                </label>
                <input 
                  type="text"
                  className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-purple-500"
                  value={selectedNode.data.variableName || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, { variableName: e.target.value })}
                  placeholder="user_name"
                />

                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Tipo de Dato
                </label>
                <select 
                  className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-purple-500"
                  value={selectedNode.data.variableType || 'string'}
                  onChange={(e) => updateNodeData(selectedNode.id, { variableType: e.target.value })}
                >
                  <option value="string">Texto</option>
                  <option value="number">Número</option>
                  <option value="boolean">Verdadero/Falso</option>
                </select>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[10px] text-purple-700">
                  La respuesta del usuario se almacenará en la variable <strong>{selectedNode.data.variableName || 'variable_name'}</strong>
                </div>
              </div>
            )}

            {selectedNode.type === 'resourceNode' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Variables del Recurso
                </label>
                {selectedNode.data.variables?.map((v: any, idx: number) => (
                    <div key={v.id} className="p-3 bg-surface-bg rounded-xl border border-border-light space-y-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="flex-1 p-2 rounded-lg border border-border-light bg-white text-sm font-mono"
                          value={v.name}
                          onChange={(e) => {
                            const newVars = [...selectedNode.data.variables];
                            newVars[idx] = { ...newVars[idx], name: e.target.value };
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                          placeholder="nombre_variable"
                        />
                        <select
                          className="p-2 rounded-lg border border-border-light bg-white text-xs font-bold"
                          value={v.type}
                          onChange={(e) => {
                            const newVars = [...selectedNode.data.variables];
                            newVars[idx] = { ...newVars[idx], type: e.target.value };
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                        >
                          <option value="string">String</option>
                          <option value="json">JSON</option>
                          <option value="string[]">String[]</option>
                          <option value="json[]">JSON[]</option>
                        </select>
                        <button
                          onClick={() => {
                            const newVars = selectedNode.data.variables.filter((_: any, i: number) => i !== idx);
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                      {v.type === 'string' && (
                        <input
                          type="text"
                          className="w-full p-2 rounded-lg border border-border-light bg-white text-sm"
                          value={v.value}
                          onChange={(e) => {
                            const newVars = [...selectedNode.data.variables];
                            newVars[idx] = { ...newVars[idx], value: e.target.value };
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                          placeholder="Valor..."
                        />
                      )}
                      {(v.type === 'json' || v.type === 'json[]') && (
                        <textarea
                          className="w-full p-2 rounded-lg border border-border-light bg-white text-xs font-mono resize-none"
                          rows={3}
                          value={v.value}
                          onChange={(e) => {
                            const newVars = [...selectedNode.data.variables];
                            newVars[idx] = { ...newVars[idx], value: e.target.value };
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                          placeholder='{"key": "value"} o [{"id":"1","name":"a"}]'
                        />
                      )}
                      {v.type === 'string[]' && (
                        <input
                          type="text"
                          className="w-full p-2 rounded-lg border border-border-light bg-white text-sm"
                          value={v.value}
                          onChange={(e) => {
                            const newVars = [...selectedNode.data.variables];
                            newVars[idx] = { ...newVars[idx], value: e.target.value };
                            updateNodeData(selectedNode.id, { variables: newVars });
                          }}
                          placeholder="valor1, valor2, valor3..."
                        />
                      )}
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg border border-border-light bg-white text-xs text-text-muted"
                        value={v.description || ''}
                        onChange={(e) => {
                          const newVars = [...selectedNode.data.variables];
                          newVars[idx] = { ...newVars[idx], description: e.target.value };
                          updateNodeData(selectedNode.id, { variables: newVars });
                        }}
                        placeholder="Descripción (opcional)"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newVars = [...(selectedNode.data.variables || []), { id: `rv-${Date.now()}`, name: '', type: 'string', value: '', description: '' }];
                      updateNodeData(selectedNode.id, { variables: newVars });
                    }}
                    className="w-full py-2 border border-dashed border-border-strong text-text-muted text-xs font-bold rounded-xl hover:bg-surface-hover transition-colors"
                  >
                    + Añadir Variable
                  </button>
                </div>
              )}

              {selectedNode.type === 'actionNode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Tipo de Acción
                  </label>
                  <select 
                    className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-brand-500"
                    value={selectedNode.data.action || ''}
                    onChange={(e) => handleActionTypeChange(e.target.value)}
                  >
                    <option value="">Selecciona una acción...</option>
                    <option value="Assign Tag">Asignar Etiqueta</option>
                  <option value="Remove Tag">Remover Etiqueta</option>
                  <option value="Assign Variable">Asignar Variable</option>
                  <option value="Remove Variable">Remover Variable</option>
                  <option value="External Webhook">Webhook Externo</option>
                  <option value="External API">API Externa</option>
                  <option value="Notify Admin">Notificar Admin</option>
                </select>

                {/* Assign/Remove Tag Name Field */}
                {(selectedNode.data.action === 'Assign Tag' || selectedNode.data.action === 'Remove Tag') && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <Tag className="w-3 h-3 inline mr-1" />
                      Nombre de Etiqueta
                    </label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                      value={selectedNode.data.tagName || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { tagName: e.target.value })}
                    >
                      <option value="">Selecciona una etiqueta...</option>
                      {tags.map((tag: any) => (
                        <option key={tag.id} value={tag.name}>{tag.name}</option>
                      ))}
                    </select>
                    <input 
                      type="text"
                      className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                      value={selectedNode.data.tagName || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { tagName: e.target.value })}
                      placeholder="O escribe el nombre..."
                    />
                  </div>
                )}

                {/* Assign/Remove Variable Fields */}
                {(selectedNode.data.action === 'Assign Variable' || selectedNode.data.action === 'Remove Variable') && (
                  <div className="space-y-3 p-4 bg-surface-bg rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-border-light">
                      <Variable className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-text-secondary uppercase">
                        Configuración de Variable
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Nombre de Variable
                      </label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                        value={selectedNode.data.variableAction?.variableName || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { 
                          variableAction: { ...selectedNode.data.variableAction!, variableName: e.target.value }
                        })}
                      >
                        <option value="">Selecciona una variable...</option>
                        {globalVariables.map((v: any) => (
                          <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        Tipo de Variable
                      </label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                        value={selectedNode.data.variableAction?.variableType || 'string'}
                        onChange={(e) => updateNodeData(selectedNode.id, { 
                          variableAction: { ...selectedNode.data.variableAction!, variableType: e.target.value }
                        })}
                      >
                        <option value="string">Cadena (String)</option>
                        <option value="string[]">Lista (String Array)</option>
                      </select>
                    </div>

                    {selectedNode.data.action === 'Assign Variable' && (
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Valor
                        </label>
                        {selectedNode.data.variableAction?.variableType === 'string[]' ? (
                          <input 
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                            value={(selectedNode.data.variableAction?.variableValue as string[]) || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { 
                              variableAction: { ...selectedNode.data.variableAction!, variableValue: e.target.value.split(',').map(s => s.trim()) }
                            })}
                            placeholder="valor1, valor2, valor3..."
                          />
                        ) : (
                          <input 
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                            value={selectedNode.data.variableAction?.variableValue || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { 
                              variableAction: { ...selectedNode.data.variableAction!, variableValue: e.target.value }
                            })}
                            placeholder="Ingresar valor..."
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.data.action === 'External API' && (
                  <div className="space-y-4 p-4 bg-surface-bg rounded-xl border border-brand-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-border-light">
                      <Globe className="w-4 h-4 text-brand-500" />
                      <span className="text-xs font-bold text-text-secondary uppercase">
                        Configuración de API Externa
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Nombre de Acción
                        </label>
                        <input 
                          type="text"
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.externalApi?.name || ''}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            externalApi: { ...selectedNode.data.externalApi!, name: e.target.value }
                          })}
                          placeholder="ej., Obtener datos de usuario"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Método HTTP
                        </label>
                        <select 
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.externalApi?.method || 'GET'}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            externalApi: { ...selectedNode.data.externalApi!, method: e.target.value as ExternalAPIAction['method'] }
                          })}
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="CREATE">CREATE</option>
                          <option value="UPDATE">UPDATE</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          URL
                        </label>
                        <input 
                          type="url"
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.externalApi?.url || ''}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            externalApi: { ...selectedNode.data.externalApi!, url: e.target.value }
                          })}
                          placeholder="https://api.example.com/endpoint"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Tipo de Respuesta
                        </label>
                        <select 
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.externalApi?.response_type || 'string'}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            externalApi: { ...selectedNode.data.externalApi!, response_type: e.target.value as ExternalAPIAction['response_type'] }
                          })}
                        >
                          <option value="string">String</option>
                          <option value="string[]">String Array</option>
                          <option value="object">Object</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Nombre de Variable de Respuesta
                        </label>
                        <input 
                          type="text"
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.externalApi?.response_variable || ''}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            externalApi: { ...selectedNode.data.externalApi!, response_variable: e.target.value }
                          })}
                          placeholder="ej., datosUsuario, respuestaApi"
                        />
                      </div>

                      {(selectedNode.data.externalApi?.method === 'POST' || 
                        selectedNode.data.externalApi?.method === 'CREATE' || 
                        selectedNode.data.externalApi?.method === 'UPDATE') && (
                        <div>
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                            Cuerpo de la Solicitud (JSON)
                          </label>
                          <textarea 
                            className="w-full min-h-[100px] p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500 font-mono"
                            value={selectedNode.data.externalApi?.body_JSON || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { 
                              externalApi: { ...selectedNode.data.externalApi!, body_JSON: e.target.value }
                            })}
                            placeholder='{"key": "value"}'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t bg-surface-panel/30 flex items-center gap-3">
        <button className="flex-1 btn-primary gap-2 h-11">
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
        <button className="w-11 h-11 rounded-btn border border-status-danger/20 flex items-center justify-center text-status-danger hover:bg-status-dangerBg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
