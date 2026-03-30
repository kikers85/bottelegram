import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useFlowStore } from '../../store/useFlowStore';
import { Modal } from './Modal';
import { useTags } from '../../hooks/queries/useTags';
import { useVariables } from '../../hooks/queries/useVariables';
import type { Agent, Tag, GlobalVariable, Bot } from '../../lib/validations/schemas';
import { useAgents } from '../../hooks/queries/useAgents';
import { useBots } from '../../hooks/queries/useBots';
import { alerts } from '../../lib/alerts';

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

  const { agents, createAgent, updateAgent } = useAgents();
  const { bots, createBot } = useBots();
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
  const [botForm, setBotForm] = useState({ name: '', description: '' });
  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    alerts.loading('Creating Bot', 'Initializing bot and preparing canvas...');
    try {
      await createBot({
        name: botForm.name,
        description: botForm.description,
        owner_id: 'agent-001', // This should come from auth session in prod
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
                  rows={3}
                />
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
          >
            <div className="space-y-4">
              <p className="text-sm text-text-muted">Enter credentials for {isChannelConfigOpen} to connect your bot.</p>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">API Token / Secret</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="***************"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover border border-border-light rounded-lg">Cancel</button>
                <button type="button" onClick={closeDialogs} className="btn-primary">Save Connection</button>
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
