import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFlowStore } from '../../store/useFlowStore';
import { Modal } from './Modal';
import { useTags } from '../../hooks/queries/useTags';
import { useVariables } from '../../hooks/queries/useVariables';
import type { Agent, Tag, GlobalVariable } from '../../lib/validations/schemas';
import { useAgents } from '../../hooks/queries/useAgents';
import { useBots } from '../../hooks/queries/useBots';
import { useChannels } from '../../hooks/queries/useChannels';
import { useFlows } from '../../hooks/queries/useFlows';
import { TriggerForm } from '../flows/TriggerForm';
import { alerts } from '../../lib/alerts';
import { Trash2 } from 'lucide-react';

export function DialogManager() {
  const { setActiveDialog, isChannelConfigOpen, setIsChannelConfigOpen, isSettingsOpen, setIsSettingsOpen, selectedBotId, editingEntityId, activeDialog } = useAppStore();
  const { session, signOut } = useAuthStore();

  const { agents, createAgent, updateAgent } = useAgents();
  const { createBot } = useBots();
  const { channels, updateChannel } = useChannels();
  const { flows, saveFlow } = useFlows();
  const { tags, createTag, updateTag } = useTags(selectedBotId);
  const { variables, createVariable, updateVariable } = useVariables(selectedBotId);

  const { setNodes, onEdgesChange } = useFlowStore();
  const prevDialogRef = useRef<string | null>(null);

  // Sync ref with activeDialog
  useEffect(() => {
    prevDialogRef.current = activeDialog;
  }, [activeDialog]);

  const closeDialogs = () => {
    setActiveDialog(null);
    setIsChannelConfigOpen(null);
    setIsSettingsOpen(false);
  };

  // 1. Agent Dialog
  const [agentForm, setAgentForm] = useState<Partial<Agent>>({ name: '', email: '', role: 'editor', permissions: [] });

  useEffect(() => {
    if (activeDialog === prevDialogRef.current) return; // Only run on dialog change

    if (activeDialog === 'editAgent' && editingEntityId) {
      const existing = agents.find((a: Agent) => a.id === editingEntityId);
      if (existing) setAgentForm(existing);
    } else if (activeDialog === 'createAgent') {
      setAgentForm({ name: '', email: '', role: 'editor' as any, permissions: [] });
    }
  }, [activeDialog, editingEntityId, agents]);

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    alerts.loading('Guardando Agente', 'Sincronizando cambios con la base de datos...');
    try {
      if (activeDialog === 'createAgent') {
        await createAgent(agentForm);
        alerts.success('Agente Creado', `${agentForm.name} se ha añadido con éxito.`);
      } else if (activeDialog === 'editAgent' && editingEntityId) {
        await updateAgent({ id: editingEntityId, agent: agentForm });
        alerts.success('Agente Actualizado', 'Cambios guardados con éxito.');
      }
      closeDialogs();
    } catch (err) {
      console.error('Failed to save agent:', err);
      alerts.error('Error', 'No se pudo guardar el perfil del agente.');
    }
  };

  // 2. Bot Dialog (Creates new bot)
  const [botForm, setBotForm] = useState({ name: '', description: '', channel_id: '', interface_id: '', flow_ids: [] as string[] });
  
  // Get active interfaces for selected channel
  const activeInterfaces = channels.find((c: any) => c.id === botForm.channel_id)?.interfaces || [];

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botForm.channel_id || !botForm.interface_id) {
      alerts.error('Error de Validación', 'Por favor, selecciona un canal y una interfaz.');
      return;
    }

    alerts.loading('Creando Bot', 'Inicializando bot y preparando lienzo...');
    try {
      await createBot({
        name: botForm.name,
        description: botForm.description,
        channel_id: botForm.channel_id,
        interface_id: botForm.interface_id,
        flow_ids: botForm.flow_ids,
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
      
      alerts.success('Bot Listo', 'Lienzo inicializado con mensaje de bienvenida.');
      closeDialogs();
    } catch (err) {
      console.error('Failed to create bot:', err);
      alerts.error('Error', 'No se pudo crear el proyecto del bot.');
    }
  };

  // 3. Tag Dialog
  const [tagForm, setTagForm] = useState<Partial<Tag>>({ name: '', description: '', color: '#6366F1' });
  useEffect(() => {
    if (activeDialog === prevDialogRef.current) return; // Only run on dialog change

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
    alerts.loading('Guardando Etiqueta');
    try {
      if (activeDialog === 'createTag') {
        await createTag({ ...tagForm, bot_id: selectedBotId });
        alerts.success('Etiqueta Creada');
      } else if (activeDialog === 'editTag' && editingEntityId) {
        await updateTag({ id: editingEntityId, tag: tagForm });
        alerts.success('Etiqueta Actualizada');
      }
      closeDialogs();
    } catch (err) { 
      console.error(err); 
      alerts.error('Error', 'No se pudo guardar la etiqueta.');
    }
  };

  // 4. Variable Dialog
  const [varForm, setVarForm] = useState<Partial<GlobalVariable>>({ name: '', type: 'string', scope: 'bot', description: '' });
  useEffect(() => {
    if (activeDialog === prevDialogRef.current) return; // Only run on dialog change

    if (activeDialog === 'editVar' && editingEntityId) {
      const existing = variables.find((v: GlobalVariable) => v.id === editingEntityId);
      if (existing) setVarForm(existing);
    } else if (activeDialog === 'createVar') {
      setVarForm({ name: '', type: 'string', scope: 'bot', description: '' });
    }
  }, [activeDialog, editingEntityId, variables]);

  const handleSaveVar = async (e: React.FormEvent) => {
    e.preventDefault();
    alerts.loading('Guardando Variable');
    try {
      if (activeDialog === 'createVar') {
        const payload = { ...varForm, bot_id: varForm.scope === 'bot' ? selectedBotId : null };
        await createVariable(payload);
        alerts.success('Variable Creada');
      } else if (activeDialog === 'editVar' && editingEntityId) {
        await updateVariable({ id: editingEntityId, variable: varForm });
        alerts.success('Variable Actualizada');
      }
      closeDialogs();
    } catch (err) { 
      console.error(err); 
      alerts.error('Error', 'No se pudo guardar la variable.');
    }
  };
  
  // 5. Flow Dialog Logic
  const [flowName, setFlowName] = useState('');
  
  useEffect(() => {
    if (activeDialog === prevDialogRef.current) return;
    if (activeDialog === 'createFlow') setFlowName('');
    else if (activeDialog === 'editFlow' && editingEntityId) {
      const flow = flows.find((f: any) => f.id === editingEntityId);
      if (flow) setFlowName(flow.name);
    }
  }, [activeDialog, editingEntityId, flows]);

  const handleSaveFlow = async (triggerConfig: any) => {
    alerts.loading('Guardando Flujo');
    try {
      const payload = {
        name: flowName || 'Nuevo Flujo',
        trigger_type: triggerConfig.type,
        trigger_config: triggerConfig,
        status: 'draft' as any,
      };

      if (activeDialog === 'editFlow' && editingEntityId) {
        await saveFlow({ ...payload, id: editingEntityId });
      } else {
        await saveFlow(payload);
      }
      
      alerts.success('Flujo Guardado', 'La automatización está lista.');
      closeDialogs();
    } catch (err) {
      console.error(err);
      alerts.error('Error', 'No se pudo guardar la configuración del flujo.');
    }
  };

  return (
        <>
          {/* Agent Modal */}
          <Modal
            isOpen={activeDialog === 'createAgent' || activeDialog === 'editAgent'}
            onClose={closeDialogs}
            title={activeDialog === 'createAgent' ? 'Invitar Nuevo Agente' : 'Editar Agente'}
          >
            <form onSubmit={handleSaveAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  value={agentForm.name}
                  onChange={e => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  value={agentForm.email}
                  onChange={e => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Rol</label>
                <select
                  value={agentForm.role}
                  onChange={e => setAgentForm({ ...agentForm, role: e.target.value as Agent['role'] })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  <option value="viewer">Observador</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                  <option value="owner">Propietario</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover border border-border-light rounded-lg">Cancelar</button>
                <button type="submit" className="btn-primary">{activeDialog === 'createAgent' ? 'Invitar' : 'Guardar Cambios'}</button>
              </div>
            </form>
          </Modal>

          {/* Bot Modal */}
          <Modal
            isOpen={activeDialog === 'createBot'}
            onClose={closeDialogs}
            title="Desplegar Nuevo Bot"
          >
            <form onSubmit={handleSaveBot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Nombre del Bot</label>
                <input
                  required
                  type="text"
                  value={botForm.name}
                  onChange={e => setBotForm({ ...botForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="ej. Asistente de Ventas"
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-text-primary mb-1">Descripción</label>
                 <textarea
                   value={botForm.description}
                   onChange={e => setBotForm({ ...botForm, description: e.target.value })}
                   className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                   placeholder="¿Cuál es el propósito de este bot?"
                   rows={2}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-text-primary mb-1">Canal</label>
                   <select
                     required
                     value={botForm.channel_id}
                     onChange={e => setBotForm({ ...botForm, channel_id: e.target.value, interface_id: '' })}
                     className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                   >
                     <option value="">Selecciona canal...</option>
                     {channels.map((c: any) => (
                       <option key={c.id} value={c.id}>{c.nombre[0].toUpperCase() + c.nombre.slice(1)}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-text-primary mb-1">Interfaz de Conexión</label>
                   <select
                     required
                     disabled={!botForm.channel_id}
                     value={botForm.interface_id}
                     onChange={e => setBotForm({ ...botForm, interface_id: e.target.value })}
                     className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white disabled:bg-surface-hover"
                   >
                     <option value="">Selecciona interfaz...</option>
                     {activeInterfaces.map((i: any) => (
                       <option key={i.id} value={i.id}>{i.name}</option>
                     ))}
                   </select>
                 </div>
               </div>

               {/* Flows Multi-Select */}
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-text-primary">Asociar Flujos</label>
                 <div className="max-h-[120px] overflow-y-auto border border-border-light rounded-lg p-2 bg-surface-base space-y-1">
                   {flows.length === 0 ? (
                     <p className="text-[10px] text-text-muted italic">No hay flujos disponibles. Crea flujos primero.</p>
                   ) : (
                     flows.map((f: any) => (
                       <label key={f.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                         <input 
                           type="checkbox" 
                           checked={botForm.flow_ids.includes(f.id!)}
                           onChange={(e) => {
                             const ids = e.target.checked 
                               ? [...botForm.flow_ids, f.id!]
                               : botForm.flow_ids.filter(id => id !== f.id);
                             setBotForm({ ...botForm, flow_ids: ids });
                           }}
                           className="rounded border-border-light text-brand-600 focus:ring-brand-500"
                         />
                         <span className="text-xs font-medium text-text-secondary">{f.name}</span>
                       </label>
                     ))
                   )}
                 </div>
               </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover border border-border-light rounded-lg">Cancelar</button>
                <button type="submit" className="btn-primary">Crear Bot</button>
              </div>
            </form>
          </Modal>

          {/* Tag Modal */}
          <Modal
            isOpen={activeDialog === 'createTag' || activeDialog === 'editTag'}
            onClose={closeDialogs}
            title={activeDialog === 'createTag' ? 'Crear Nueva Etiqueta' : 'Editar Etiqueta'}
          >
            <form onSubmit={handleSaveTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Nombre de la Etiqueta</label>
                <input
                  required
                  type="text"
                  value={tagForm.name}
                  onChange={e => setTagForm({ ...tagForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="ej. Usuario Premium"
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
                <label className="block text-sm font-medium text-text-primary mb-1">Descripción</label>
                <textarea
                  value={tagForm.description}
                  onChange={e => setTagForm({ ...tagForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Etiqueta</button>
              </div>
            </form>
          </Modal>

          {/* Variable Modal */}
          <Modal
            isOpen={activeDialog === 'createVar' || activeDialog === 'editVar'}
            onClose={closeDialogs}
            title={activeDialog === 'createVar' ? 'Crear Nueva Variable' : 'Editar Variable'}
          >
            <form onSubmit={handleSaveVar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Nombre de Variable</label>
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
                  <label className="block text-sm font-medium text-text-primary mb-1">Tipo</label>
                  <select
                    value={varForm.type}
                    onChange={e => setVarForm({ ...varForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border-light rounded-lg bg-white"
                  >
                    <option value="string">Cadena (String)</option>
                    <option value="number">Número (Number)</option>
                    <option value="boolean">Booleano (Boolean)</option>
                    <option value="json">Objeto (JSON)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Alcance</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={varForm.scope === 'bot'} onChange={() => setVarForm({ ...varForm, scope: 'bot' })} className="text-brand-600" />
                    Solo este Bot
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={varForm.scope === 'global'} onChange={() => setVarForm({ ...varForm, scope: 'global' })} className="text-brand-600" />
                    Global
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Descripción</label>
                <textarea
                  value={varForm.description}
                  onChange={e => setVarForm({ ...varForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={2}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={closeDialogs} className="px-4 py-2 text-sm font-medium border border-border-light rounded-lg">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Variable</button>
              </div>
            </form>
          </Modal>

          {/* Channel Config Modal */}
          <Modal
            isOpen={!!isChannelConfigOpen}
            onClose={closeDialogs}
            title={`Configurar Integración ${isChannelConfigOpen}`}
            width="max-w-xl"
          >
            {(() => {
              const channel = channels.find((c: any) => c.nombre.toLowerCase() === isChannelConfigOpen?.toLowerCase());
              if (!channel) return <div className="p-4 text-center text-text-muted">Canal no encontrado en la base de datos.</div>;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted uppercase font-bold">Interfaces de Conexión</p>
                    <button 
                      onClick={() => {
                        const newInterfaces = [...(channel.interfaces || []), { id: `int-${Date.now()}`, name: 'Nueva Interfaz', status: 'active' as const }];
                        updateChannel({ id: channel.id!, channel: { interfaces: newInterfaces } });
                      }}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      + Añadir Interfaz
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
                    <button type="button" onClick={closeDialogs} className="btn-primary">Hecho</button>
                  </div>
                </div>
              );
            })()}
          </Modal>

          {/* Flow Modal */}
          <Modal
            isOpen={activeDialog === 'createFlow' || activeDialog === 'editFlow'}
            onClose={closeDialogs}
            title={activeDialog === 'createFlow' ? 'Nuevo Flujo de Automatización' : 'Editar Detalles del Flujo'}
            width="max-w-2xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Nombre del Flujo</label>
                <input
                  required
                  type="text"
                  value={flowName}
                  onChange={e => setFlowName(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="ej. Flujo de Bienvenida"
                />
              </div>
              <div className="border-t border-border-light pt-4">
                 <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Configurar Disparador (Trigger)</label>
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
            onClose={() => setIsSettingsOpen(false)}
            title="Ajustes del Sistema"
          >
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
                <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold">
                  {session?.user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{session?.user?.email}</p>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Usuario Autenticado</p>
                </div>
                <button onClick={() => { signOut(); setIsSettingsOpen(false); }} className="ml-auto p-2 text-status-danger hover:bg-status-dangerBg rounded-lg transition-colors" title="Cerrar Sesión">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b pb-2">Preferencias</h4>
                <div className="flex items-center justify-between p-3 bg-surface-base rounded-lg border border-border-light">
                  <div>
                    <p className="text-sm font-bold text-text-primary">Notificaciones de Escritorio</p>
                    <p className="text-[10px] text-text-muted">Alertas en tiempo real sobre la actividad del bot.</p>
                  </div>
                  <div className="w-10 h-5 bg-brand-500 rounded-full relative">
                     <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-1">
                  <input type="checkbox" id="dark-mode" className="rounded border-border-light text-brand-600 focus:ring-brand-500" />
                  <label htmlFor="dark-mode" className="text-sm font-medium text-text-primary">Habilitar Modo Oscuro (Próximamente)</label>
                </div>

                <div className="pt-6 flex justify-end">
                  <button type="button" onClick={closeDialogs} className="btn-primary">Cerrar Ajustes</button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      );
    }
