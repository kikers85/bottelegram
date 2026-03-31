import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFlowStore } from '../../store/useFlowStore';
import { Modal } from './Modal';
import { useTags } from '../../hooks/queries/useTags';
import { useVariables } from '../../hooks/queries/useVariables';
import type { Agent, Tag, GlobalVariable, Bot } from '../../lib/validations/schemas';
import { useAgents } from '../../hooks/queries/useAgents';
import { useBots } from '../../hooks/queries/useBots';
import { useChannels } from '../../hooks/queries/useChannels';
import { useFlows } from '../../hooks/queries/useFlows';
import { TriggerForm } from '../flows/TriggerForm';
import { alerts } from '../../lib/alerts';
import { Trash2 } from 'lucide-react';

export function DialogManager() {
  const {
    activeDialog,
    isChannelConfigOpen,
    isSettingsOpen,
    setActiveDialog,
    setIsChannelConfigOpen,
    setIsSettingsOpen,
    editingEntityId,
    selectedBotId,
  } = useAppStore();

  const { session } = useAuthStore();

  const { agents, createAgent, updateAgent } = useAgents();
  const { bots, createBot } = useBots();
  const { channels, updateChannel } = useChannels();
  const { flows, saveFlow } = useFlows(selectedBotId);
  const { tags, createTag, updateTag } = useTags(selectedBotId);
  const { variables, createVariable, updateVariable } = useVariables(selectedBotId);

  const { onEdgesChange, setNodes } = useFlowStore();

  const closeDialogs = () => {
    setActiveDialog(null);
    setIsChannelConfigOpen(null);
    setIsSettingsOpen(false);
  };

  // 1. Agent Dialog
  const [agentForm, setAgentForm] = useState<Partial<Agent>>({ name: '', email: '', role: 'editor', permissions: [] });

  useEffect(() => {
    if (activeDialog === 'editAgent' && editingEntityId) {
      const existing = agents.find((a: Agent) => a.id === editingEntityId);
      if (existing) setAgentForm(existing);
    } else if (activeDialog === 'createAgent') {
      setAgentForm({ name: '', email: '', role: 'editor' as any, permissions: [] });
    }
  }, [activeDialog, editingEntityId, agents]);

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    alerts.loading('Saving Agent', 'Committing changes to Supabase...');
    try {
      if (activeDialog === 'createAgent') {
        await createAgent(agentForm);
        alerts.success('Agent Created', `${agentForm.name} added successfully.`);
      } else if (activeDialog === 'editAgent' && editingEntityId) {
        await updateAgent({ id: editingEntityId, agent: agentForm });
        alerts.success('Agent Updated', 'Changes saved successfully.');
      }
      closeDialogs();
    } catch (err) {
      console.error('Failed to save agent:', err);
      alerts.error('Error', 'Failed to save agent profile.');
    }
  };

  // 2. Bot Dialog (Creates new bot & clears canvas)
  const [botForm, setBotForm] = useState({ name: '', description: '', channel_id: '', interface_id: '' });
  
  // Get active interfaces for selected channel
  const activeInterfaces = channels.find(c => c.id === botForm.channel_id)?.interfaces || [];

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botForm.channel_id || !botForm.interface_id) {
      alerts.error('Validation Error', 'Please select a channel and an interface.');
      return;
    }

    alerts.loading('Creating Bot', 'Initializing bot and preparing canvas...');
    try {
      await createBot({
        name: botForm.name,
        description: botForm.description,
        channel_id: botForm.channel_id,
        interface_id: botForm.interface_id,
        flow_ids: [],
        owner_id: session?.user?.id || '00000000-0000-0000-0000-000000000000',
        status: 'draft',
        trigger_on: 'manual',
        trigger_config: {},
        version: '1.0.0',
      });

      // SDD requirement: Start with a Welcome Message node
      setNodes([{
        id: `msg-${Date.now()}`,
        type: 'messageNode',
        position: { x: 250, y: 150 },
        data: {
          id: `msg-${Date.now()}`,
          label: "Welcome Message",
          messages: [{ id: "m1", type: "text", content: "Welcome to our bot!" }],
          buttons: [],
          status: "active"
        }
      }]);
      onEdgesChange([]); // Clear edges
      
      alerts.success('Bot Ready', 'Canvas initialized with welcome message.');
      closeDialogs();
    } catch (err) {
      console.error('Failed to create bot:', err);
      alerts.error('Error', 'Could not create bot project.');
    }
  };

  // 3. Tag Dialog
  const [tagForm, setTagForm] = useState<Partial<Tag>>({ name: '', description: '', color: '#6366F1' });
  useEffect(() => {
    if (activeDialog === 'editTag' && editingEntityId) {
      const existing = tags.find((t: Tag) => t.id === editingEntityId);
      if (existing) setTagForm(existing);
    } else if (activeDialog === 'createTag') {
      setTagForm({ name: '', description: '', color: '#6366F1' });
    }
  }, [activeDialog, editingEntityId, tags]);

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBotId) return;
    alerts.loading('Saving Tag');
    try {
      if (activeDialog === 'createTag') {
        await createTag({ ...tagForm, bot_id: selectedBotId });
        alerts.success('Tag Created');
      } else if (activeDialog === 'editTag' && editingEntityId) {
        await updateTag({ id: editingEntityId, tag: tagForm });
        alerts.success('Tag Updated');
      }
      closeDialogs();
    } catch (err) { 
      console.error(err); 
      alerts.error('Error', 'Failed to save tag.');
    }
  };

  // 4. Variable Dialog
  const [varForm, setVarForm] = useState<Partial<GlobalVariable>>({ name: '', type: 'string', scope: 'bot', description: '' });
  useEffect(() => {
    if (activeDialog === 'editVar' && editingEntityId) {
      const existing = variables.find((v: GlobalVariable) => v.id === editingEntityId);
      if (existing) setVarForm(existing);
    } else if (activeDialog === 'createVar') {
      setVarForm({ name: '', type: 'string', scope: 'bot', description: '' });
    }
  }, [activeDialog, editingEntityId, variables]);

  const handleSaveVar = async (e: React.FormEvent) => {
    e.preventDefault();
    alerts.loading('Saving Variable');
    try {
      if (activeDialog === 'createVar') {
        const payload = { ...varForm, bot_id: varForm.scope === 'bot' ? selectedBotId : null };
        await createVariable(payload);
        alerts.success('Variable Created');
      } else if (activeDialog === 'editVar' && editingEntityId) {
        await updateVariable({ id: editingEntityId, variable: varForm });
        alerts.success('Variable Updated');
      }
      closeDialogs();
    } catch (err) { 
      console.error(err); 
      alerts.error('Error', 'Failed to save variable.');
    }
  };

  // 5. Flow Dialog
  const [flowName, setFlowName] = useState('');
  
  useEffect(() => {
    if (activeDialog === 'createFlow') setFlowName('');
    else if (activeDialog === 'editFlow' && editingEntityId) {
      const flow = flows.find(f => f.id === editingEntityId);
      if (flow) setFlowName(flow.name);
    }
  }, [activeDialog, editingEntityId, flows]);

  const handleSaveFlow = async (triggerConfig: any) => {
    if (!selectedBotId) return;
    alerts.loading('Saving Flow');
    try {
      const payload = {
        bot_id: selectedBotId,
        name: flowName || 'New Flow',
        trigger_type: triggerConfig.type,
        trigger_config: triggerConfig,
        status: 'draft' as any,
      };

      await saveFlow(payload);
      alerts.success('Flow Created', 'The flow and its trigger were saved.');
      closeDialogs();
    } catch (err) {
      console.error(err);
      alerts.error('Error', 'Could not save the flow configuration.');
    }
  };

  return (
        <>
          {/* Agent Modal */}
          <Modal
            isOpen={activeDialog === 'createAgent' || activeDialog === 'editAgent'}
            onClose={closeDialogs}
            title={activeDialog === 'createAgent' ? 'Create New Agent' : 'Edit Agent'}
          >
            <form onSubmit={handleSaveAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={agentForm.name}
                  onChange={e => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={agentForm.email}
                  onChange={e => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Role</label>
                <select
                  value={agentForm.role}
                  onChange={e => setAgentForm({ ...agentForm, role: e.target.value as Agent['role'] })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary">{activeDialog === 'createAgent' ? 'Create' : 'Save Changes'}</button>
              </div>
            </form>
          </Modal>

          {/* Bot Modal */}
          <Modal
            isOpen={activeDialog === 'createBot'}
            onClose={closeDialogs}
            title="Create New Bot"
          >
            <form onSubmit={handleSaveBot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Bot Name</label>
                <input
                  required
                  type="text"
                  value={botForm.name}
                  onChange={e => setBotForm({ ...botForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. Support Bot"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                 <textarea
                   value={botForm.description}
                   onChange={e => setBotForm({ ...botForm, description: e.target.value })}
                   className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                   placeholder="What does this bot do?"
                   rows={2}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-text-primary mb-1">Channel</label>
                   <select
                     required
                     value={botForm.channel_id}
                     onChange={e => setBotForm({ ...botForm, channel_id: e.target.value, interface_id: '' })}
                     className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                   >
                     <option value="">Select Channel</option>
                     {channels.map(c => (
                       <option key={c.id} value={c.id}>{c.nombre[0].toUpperCase() + c.nombre.slice(1)}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-text-primary mb-1">Interface</label>
                   <select
                     required
                     disabled={!botForm.channel_id}
                     value={botForm.interface_id}
                     onChange={e => setBotForm({ ...botForm, interface_id: e.target.value })}
                     className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white disabled:bg-surface-hover"
                   >
                     <option value="">Select Interface</option>
                     {activeInterfaces.map(i => (
                       <option key={i.id} value={i.id}>{i.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary">Create Bot</button>
              </div>
            </form>
          </Modal>

          {/* Tag Modal */}
          <Modal
            isOpen={activeDialog === 'createTag' || activeDialog === 'editTag'}
            onClose={closeDialogs}
            title={activeDialog === 'createTag' ? 'Create New Tag' : 'Edit Tag'}
          >
            <form onSubmit={handleSaveTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Tag Name</label>
                <input
                  required
                  type="text"
                  value={tagForm.name}
                  onChange={e => setTagForm({ ...tagForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Premium User"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={tagForm.color}
                    onChange={e => setTagForm({ ...tagForm, color: e.target.value })}
                    className="w-10 h-10 rounded border-none cursor-pointer"
                  />
                  <span className="text-xs text-text-muted">{tagForm.color}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  value={tagForm.description}
                  onChange={e => setTagForm({ ...tagForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary">Save Tag</button>
              </div>
            </form>
          </Modal>

          {/* Variable Modal */}
          <Modal
            isOpen={activeDialog === 'createVar' || activeDialog === 'editVar'}
            onClose={closeDialogs}
            title={activeDialog === 'createVar' ? 'Create New Variable' : 'Edit Variable'}
          >
            <form onSubmit={handleSaveVar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Var Name</label>
                  <input
                    required
                    type="text"
                    value={varForm.name}
                    onChange={e => setVarForm({ ...varForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="PRO_USER"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
                  <select
                    value={varForm.type}
                    onChange={e => setVarForm({ ...varForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border-light rounded-lg bg-white"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Scope</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={varForm.scope === 'bot'} onChange={() => setVarForm({ ...varForm, scope: 'bot' })} className="text-brand-600" />
                    This Bot Only
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={varForm.scope === 'global'} onChange={() => setVarForm({ ...varForm, scope: 'global' })} className="text-brand-600" />
                    Global
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  value={varForm.description}
                  onChange={e => setVarForm({ ...varForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary">Save Variable</button>
              </div>
            </form>
          </Modal>

          {/* Channel Config Modal */}
          <Modal
            isOpen={!!isChannelConfigOpen}
            onClose={closeDialogs}
            title={`Configure ${isChannelConfigOpen} Integration`}
            width="max-w-xl"
          >
            {(() => {
              const channel = channels.find(c => c.nombre.toLowerCase() === isChannelConfigOpen?.toLowerCase());
              if (!channel) return <div className="p-4 text-center text-text-muted">Channel not found in database.</div>;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted uppercase font-bold">Connection Interfaces</p>
                    <button 
                      onClick={() => {
                        const newInterfaces = [...(channel.interfaces || []), { id: `int-${Date.now()}`, name: 'New Interface', status: 'active' as const }];
                        updateChannel({ id: channel.id!, channel: { interfaces: newInterfaces } });
                      }}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      + Add Interface
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {(channel.interfaces || []).map((int: any) => (
                      <div key={int.id} className="p-3 border border-border-light rounded-xl bg-surface-base space-y-2">
                        <div className="flex items-center justify-between">
                          <input 
                            className="bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-brand-300"
                            value={int.name}
                            onChange={(e) => {
                              const updated = channel.interfaces.map((i: any) => i.id === int.id ? { ...i, name: e.target.value } : i);
                              updateChannel({ id: channel.id!, channel: { interfaces: updated } });
                            }}
                          />
                          <button 
                            onClick={() => {
                              const updated = channel.interfaces.filter((i: any) => i.id !== int.id);
                              updateChannel({ id: channel.id!, channel: { interfaces: updated } });
                            }}
                            className="text-status-danger hover:bg-status-dangerBg p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            placeholder="API Key / Token" 
                            type="password"
                            value={int.api_key || ''}
                            onChange={(e) => {
                              const updated = channel.interfaces.map((i: any) => i.id === int.id ? { ...i, api_key: e.target.value } : i);
                              updateChannel({ id: channel.id!, channel: { interfaces: updated } });
                            }}
                            className="w-full text-[10px] p-2 border border-border-light rounded bg-white outline-none"
                          />
                          <input 
                            placeholder="Webhook / URL" 
                            value={int.url || ''}
                            onChange={(e) => {
                              const updated = channel.interfaces.map((i: any) => i.id === int.id ? { ...i, url: e.target.value } : i);
                              updateChannel({ id: channel.id!, channel: { interfaces: updated } });
                            }}
                            className="w-full text-[10px] p-2 border border-border-light rounded bg-white outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="button" onClick={closeDialogs} className="btn-primary">Done</button>
                  </div>
                </div>
              );
            })()}
          </Modal>

          {/* Flow Modal */}
          <Modal
            isOpen={activeDialog === 'createFlow' || activeDialog === 'editFlow'}
            onClose={closeDialogs}
            title={activeDialog === 'createFlow' ? 'Create New Flow' : 'Edit Flow'}
            width="max-w-2xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Flow Name</label>
                <input
                  required
                  type="text"
                  value={flowName}
                  onChange={e => setFlowName(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Welcome Automation"
                />
              </div>
              <div className="border-t border-border-light pt-4">
                 <TriggerForm 
                   initialConfig={activeDialog === 'editFlow' ? flows.find(f => f.id === editingEntityId)?.trigger_config : undefined}
                   onSave={handleSaveFlow} 
                   onCancel={closeDialogs} 
                 />
              </div>
            </div>
          </Modal>

          {/* Settings Modal */}
          <Modal
            isOpen={isSettingsOpen}
            onClose={closeDialogs}
            title="Settings"
            width="max-w-2xl"
          >
            <div className="space-y-4">
              <h3 className="text-md font-bold text-text-primary border-b border-border-light pb-2">Active Bot Settings</h3>
              {selectedBotId ? (
                <div className="text-sm text-text-secondary">
                  <p><strong>Bot ID:</strong> {selectedBotId}</p>
                  <p><strong>Name:</strong> {bots.find((b: Bot) => b.id === selectedBotId)?.name}</p>
                </div>
              ) : (
                <p className="text-sm text-text-muted">No bot selected.</p>
              )}

              <h3 className="text-md font-bold text-text-primary border-b border-border-light pb-2 mt-6">Global Preferences</h3>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="dark-mode" className="rounded border-border-light text-brand-600 focus:ring-brand-500" />
                <label htmlFor="dark-mode" className="text-sm font-medium text-text-primary">Enable Dark Mode (Coming soon)</label>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="button" onClick={closeDialogs} className="btn-primary">Close Settings</button>
              </div>
            </div>
          </Modal>
        </>
      );
    }
