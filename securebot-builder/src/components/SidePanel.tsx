import { useFlowStore } from '../store/useFlowStore';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/cn';
import { 
  X, MessageSquare, Filter, Zap, 
  Save, Trash2, Settings, Globe, Tag, Variable
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
  const { nodes, selectedNodeId, updateNodeData, setSelectedNodeId } = useFlowStore();
  const { tags, globalVariables } = useAppStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

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

  if (!selectedNodeId || !selectedNode) return null;

  return (
    <div className="w-[360px] h-full bg-white border-l border-border-light shadow-2xl flex flex-col animate-slide-in-right relative z-10">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-panel/30">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Node Properties
          </h2>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
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
              selectedNode.type === 'triggerNode' && "bg-indigo-900"
            )}>
              {selectedNode.type === 'messageNode' && <MessageSquare className="w-6 h-6" />}
              {selectedNode.type === 'conditionNode' && <Filter className="w-6 h-6" />}
              {selectedNode.type === 'actionNode' && <Zap className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary capitalize">
                {selectedNode.type?.replace('Node', '')} Step
              </h3>
              <p className="text-xs text-text-muted font-medium">Node ID: {selectedNode.id}</p>
            </div>
          </div>

          {/* Editing Section */}
          <div className="space-y-6 animate-fade-in">
            {selectedNode.type === 'messageNode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Message Text
                  </label>
                  <textarea 
                    className="w-full min-h-[120px] p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    value={selectedNode.data.messages?.[0]?.content || ''}
                    onChange={(e) => {
                      const msgs = selectedNode.data.messages || [];
                      const newMessages = msgs.length > 0 
                        ? [...msgs, { id: `m-${Date.now()}`, type: 'text', content: e.target.value }]
                        : [{ id: `m-${Date.now()}`, type: 'text', content: e.target.value }];
                      updateNodeData(selectedNode.id, { messages: newMessages });
                    }}
                    placeholder="Enter your bot message..."
                  />
                </div>
              )}

              {selectedNode.type === 'conditionNode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Execution Logic
                  </label>
                  <input 
                    type="text"
                    className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-brand-500"
                    value={selectedNode.data.condition || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
                    placeholder="e.g. user.status === 'premium'"
                  />
                  <div className="p-3 bg-surface-panel rounded-xl border border-border-light text-[10px] text-text-muted leading-relaxed">
                    Condition branching will evaluate this logic and traverse via the Success (True) or Failure (False) handle.
                  </div>
                </div>
              )}

              {selectedNode.type === 'actionNode' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Action Type
                  </label>
                  <select 
                    className="w-full p-3 rounded-xl border border-border-light bg-surface-bg text-sm focus:ring-2 focus:ring-brand-500"
                    value={selectedNode.data.action || ''}
                    onChange={(e) => handleActionTypeChange(e.target.value)}
                  >
                    <option value="">Select an action...</option>
                    <option value="Assign Tag">Assign Tag</option>
                    <option value="Remove Tag">Remove Tag</option>
                    <option value="Assign Variable">Assign Variable</option>
                    <option value="Remove Variable">Remove Variable</option>
                    <option value="External Webhook">External Webhook</option>
                    <option value="External API">External API</option>
                    <option value="Notify Admin">Notify Admin</option>
                  </select>

                  {/* Assign/Remove Tag Name Field */}
                  {(selectedNode.data.action === 'Assign Tag' || selectedNode.data.action === 'Remove Tag') && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        <Tag className="w-3 h-3 inline mr-1" />
                        Tag Name
                      </label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                        value={selectedNode.data.tagName || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { tagName: e.target.value })}
                      >
                        <option value="">Select a tag...</option>
                        {tags.map(tag => (
                          <option key={tag.id} value={tag.name}>{tag.name}</option>
                        ))}
                      </select>
                      <input 
                        type="text"
                        className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                        value={selectedNode.data.tagName || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { tagName: e.target.value })}
                        placeholder="Or type tag name..."
                      />
                    </div>
                  )}

                  {/* Assign/Remove Variable Fields */}
                  {(selectedNode.data.action === 'Assign Variable' || selectedNode.data.action === 'Remove Variable') && (
                    <div className="space-y-3 p-4 bg-surface-bg rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-2 pb-2 border-b border-border-light">
                        <Variable className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold text-text-secondary uppercase">
                          Variable Configuration
                        </span>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Variable Name
                        </label>
                        <select 
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.variableAction?.variableName || ''}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            variableAction: { ...selectedNode.data.variableAction!, variableName: e.target.value }
                          })}
                        >
                          <option value="">Select a variable...</option>
                          {globalVariables.map(v => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Variable Type
                        </label>
                        <select 
                          className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                          value={selectedNode.data.variableAction?.variableType || 'string'}
                          onChange={(e) => updateNodeData(selectedNode.id, { 
                            variableAction: { ...selectedNode.data.variableAction!, variableType: e.target.value }
                          })}
                        >
                          <option value="string">String</option>
                          <option value="string[]">String Array</option>
                        </select>
                      </div>

                      {selectedNode.data.action === 'Assign Variable' && (
                        <div>
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                            Value
                          </label>
                          {selectedNode.data.variableAction?.variableType === 'string[]' ? (
                            <input 
                              type="text"
                              className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                              value={(selectedNode.data.variableAction?.variableValue as string[]) || ''}
                              onChange={(e) => updateNodeData(selectedNode.id, { 
                                variableAction: { ...selectedNode.data.variableAction!, variableValue: e.target.value.split(',').map(s => s.trim()) }
                              })}
                              placeholder="value1, value2, value3..."
                            />
                          ) : (
                            <input 
                              type="text"
                              className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                              value={selectedNode.data.variableAction?.variableValue || ''}
                              onChange={(e) => updateNodeData(selectedNode.id, { 
                                variableAction: { ...selectedNode.data.variableAction!, variableValue: e.target.value }
                              })}
                              placeholder="Enter value..."
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
                          External API Configuration
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                            Action Name
                          </label>
                          <input 
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                            value={selectedNode.data.externalApi?.name || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { 
                              externalApi: { ...selectedNode.data.externalApi!, name: e.target.value }
                            })}
                            placeholder="e.g., Get User Data"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                            HTTP Method
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
                            Response Type
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
                            Response Variable Name
                          </label>
                          <input 
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-border-light bg-white text-sm focus:ring-2 focus:ring-brand-500"
                            value={selectedNode.data.externalApi?.response_variable || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { 
                              externalApi: { ...selectedNode.data.externalApi!, response_variable: e.target.value }
                            })}
                            placeholder="e.g., userData, apiResponse"
                          />
                        </div>

                        {(selectedNode.data.externalApi?.method === 'POST' || 
                          selectedNode.data.externalApi?.method === 'CREATE' || 
                          selectedNode.data.externalApi?.method === 'UPDATE') && (
                          <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              Request Body (JSON)
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
          <span>Save Changes</span>
        </button>
        <button className="w-11 h-11 rounded-btn border border-status-danger/20 flex items-center justify-center text-status-danger hover:bg-status-dangerBg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
