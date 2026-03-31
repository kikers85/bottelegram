import { useAppStore } from '../store/useAppStore';
import { useBots } from '../hooks/queries/useBots';
import { useAgents } from '../hooks/queries/useAgents';
import { useTags } from '../hooks/queries/useTags';
import { useVariables } from '../hooks/queries/useVariables';
import { useChannels } from '../hooks/queries/useChannels';
import { useFlows } from '../hooks/queries/useFlows';
import type { Bot, Tag, GlobalVariable, Agent, Flow } from '../lib/validations/schemas';
import { cn } from '../lib/cn';
import { alerts } from '../lib/alerts';
import {
  Bot as BotIcon,
  Tags,
  Variable as VariableIcon,
  Users,
  Plus,
  ChevronRight,
  Zap,
  MessageCircle,
  Settings,
  Trash2,
  Edit,
  PanelLeftClose,
  Share2,
  Globe,
} from 'lucide-react';

const navItems = [
  { id: 'bots', label: 'Bots', icon: BotIcon },
  { id: 'flows', label: 'Flujos', icon: Zap },
  { id: 'tags', label: 'Etiquetas', icon: Tags },
  { id: 'variables', label: 'Variables', icon: VariableIcon },
  { id: 'agents', label: 'Agentes', icon: Users },
  { id: 'channels', label: 'Canales', icon: Share2 },
] as const;


function BotList() {
  const { selectedBotId, setSelectedBotId, setActiveDialog } = useAppStore();
  const { bots, isLoading } = useBots();
  const { channels } = useChannels();

  if (isLoading) return <div className="p-4 text-xs text-text-muted animate-pulse">Cargando bots...</div>;

  return (
    <div className="space-y-2">
      {bots.map((bot: Bot) => (
        <button
          key={bot.id}
          onClick={() => setSelectedBotId(bot.id!)}
          className={cn(
            'w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left group',
            selectedBotId === bot.id
              ? 'bg-brand-50 border-2 border-brand-500'
              : 'bg-white border border-border-light hover:border-brand-300'
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            bot.status === 'published' ? 'bg-green-500' : 'bg-amber-500'
          )}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">{bot.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-text-muted bg-surface-base px-1.5 py-0.5 rounded border border-border-light uppercase font-bold tracking-tight">
                {channels.find(c => c.id === bot.channel_id)?.nombre || 'General'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      <button 
        onClick={() => setActiveDialog('createBot')}
        className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Nuevo Bot</span>
      </button>
    </div>
  );
}
function FlowList() {
  const { selectedFlowId, setSelectedFlowId, setActiveDialog } = useAppStore();
  const { flows, isLoading } = useFlows(); // Fetch all flows

  if (isLoading) return <div className="p-4 text-xs text-text-muted">Cargando flujos...</div>;

  return (
    <div className="space-y-2">
      {flows.map((flow: Flow) => (
        <button 
          key={flow.id} 
          onClick={() => setSelectedFlowId(flow.id!)}
          className={cn(
            "w-full p-3 rounded-xl border flex items-center gap-3 transition-all",
            selectedFlowId === flow.id 
              ? "bg-indigo-50 border-indigo-500 shadow-sm" 
              : "bg-white border-border-light hover:border-brand-300"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            selectedFlowId === flow.id ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600"
          )}>
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-text-primary truncate">{flow.name}</p>
            <p className="text-[10px] text-text-muted uppercase">{flow.trigger_type}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setActiveDialog('editFlow', flow.id); }} className="p-1.5 hover:bg-surface-hover rounded-lg">
            <Edit className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </button>
      ))}
      <button 
        onClick={() => setActiveDialog('createFlow')}
        className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Nuevo Flujo</span>
      </button>
      </div>
    );
  }

function TagList() {
  const { selectedBotId, setActiveDialog } = useAppStore();
  const { tags, isLoading, deleteTag } = useTags(selectedBotId);

  if (isLoading) return <div className="p-4 text-xs text-text-muted">Cargando etiquetas...</div>;

  return (
    <div className="space-y-2">
      {tags.map((tag: Tag) => (
        <div
          key={tag.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light flex items-center gap-3"
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tag.color || '#ccc' }}
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-text-primary">{tag.name}</p>
            <p className="text-[10px] text-text-muted">{tag.description}</p>
          </div>
          <div className="flex gap-1">
             <button onClick={() => setActiveDialog('editTag', tag.id)} className="p-1.5 hover:bg-surface-hover rounded-lg">
              <Edit className="w-3.5 h-3.5 text-text-muted" />
            </button>
            <button 
              onClick={async () => {
                const confirmed = await alerts.confirm('Eliminar Etiqueta', `¿Estás seguro de que deseas eliminar la etiqueta "${tag.name}"?`);
                if (confirmed) {
                  alerts.loading('Eliminando Etiqueta');
                  try {
                    await deleteTag(tag.id!);
                    alerts.success('Etiqueta Eliminada');
                  } catch (err) {
                    alerts.error('Error', 'No se pudo eliminar la etiqueta.');
                  }
                }
              }} 
              className="p-1.5 hover:bg-status-dangerBg rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 text-status-danger" />
            </button>
          </div>
        </div>
      ))}
      <button 
        onClick={() => setActiveDialog('createTag')}
        className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Nueva Etiqueta</span>
      </button>
    </div>
  );
}

function VariableList() {
  const { selectedBotId, setActiveDialog } = useAppStore();
  const { variables, isLoading } = useVariables(selectedBotId);

  if (isLoading) return <div className="p-4 text-xs text-text-muted">Cargando variables...</div>;

  return (
    <div className="space-y-2">
      {variables.map((v: GlobalVariable) => (
        <div
          key={v.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-mono font-bold text-brand-600 truncate mr-2">{v.name}</p>
            <span className="text-[9px] font-bold uppercase bg-surface-panel px-2 py-0.5 rounded flex-shrink-0">
              {v.type}
            </span>
          </div>
          <p className="text-xs text-text-secondary truncate">{v.description}</p>
        </div>
      ))}
      <button 
        onClick={() => setActiveDialog('createVar')}
        className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Nueva Variable</span>
      </button>
    </div>
  );
}

function AgentList() {
  const { setActiveDialog } = useAppStore();
  const { agents, isLoading, deleteAgent } = useAgents();

  if (isLoading) return <div className="p-4 text-xs text-text-muted">Cargando agentes...</div>;

  return (
    <div className="space-y-2">
      {agents.map((agent: Agent) => (
        <div
          key={agent.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light flex flex-col gap-2"
        >
          <div className="flex flex-row items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
               {agent.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-text-primary truncate">{agent.name}</p>
               <p className="text-[10px] text-text-muted truncate">{agent.email}</p>
             </div>
             <span className="text-[9px] font-bold uppercase bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded shrink-0">
               {agent.role}
             </span>
          </div>
          <div className="flex gap-1 justify-end mt-1 pt-2 border-t border-border-light">
             <button onClick={() => setActiveDialog('editAgent', agent.id)} className="p-1.5 hover:bg-surface-hover rounded-lg">
               <Edit className="w-3.5 h-3.5 text-text-muted" />
             </button>
             <button 
               onClick={async () => {
                 const confirmed = await alerts.confirm('Eliminar Agente', `¿Estás seguro de que deseas eliminar a "${agent.name}"?`);
                if (confirmed) {
                  alerts.loading('Eliminando Agente');
                  try {
                    await deleteAgent(agent.id!);
                    alerts.success('Agente Eliminado');
                  } catch (err) {
                    alerts.error('Error', 'No se pudo eliminar el agente.');
                  }
                }
               }} 
               className="p-1.5 hover:bg-status-dangerBg rounded-lg"
             >
               <Trash2 className="w-3.5 h-3.5 text-status-danger" />
             </button>
           </div>
        </div>
      ))}
      <button 
        onClick={() => setActiveDialog('createAgent')}
        className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Nuevo Agente</span>
      </button>
    </div>
  );
}

export function LeftSidebar() {
  const { 
    currentView, 
    setCurrentView, 
    isSidebarDrawerOpen, 
    setIsSidebarDrawerOpen,
    setIsSettingsOpen,
    setIsChannelConfigOpen,
    setShowTestChat,
    showTestChat
  } = useAppStore();

  const { bots } = useBots();
  const { channels: dbChannels } = useChannels();

  return (
    <div className={cn(
      "h-full bg-surface-panel border-r border-border-light flex flex-col transition-all duration-300 flex-shrink-0 relative z-20",
      isSidebarDrawerOpen ? "w-[280px]" : "w-0 overflow-hidden border-r-0"
    )}>
      {/* Logo Header */}
      <div className="p-4 border-b border-border-light flex justify-between items-center min-w-[280px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary">SecureBot</h1>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">Builder</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarDrawerOpen(false)}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
          title="Ocultar Sidebar"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto min-w-[280px]">
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-text-secondary hover:bg-surface-hover'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-brand-500' : 'text-text-muted')} />
                {item.label}
                {item.id === 'bots' && (
                  <span className="ml-auto text-[10px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full">
                    {bots.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Lists */}
        <div className="p-3 border-t border-border-light min-h-[200px]">
          {currentView === 'bots' && <BotList />}
          {currentView === 'flows' && <FlowList />}
          {currentView === 'tags' && <TagList />}
          {currentView === 'variables' && <VariableList />}
          {currentView === 'agents' && <AgentList />}
          {currentView === 'channels' && (
            <div className="space-y-2">
              {dbChannels.map(c => (
                <button
                  key={c.id}
                  onClick={() => setIsChannelConfigOpen(c.nombre as any)}
                  className="w-full p-3 rounded-xl bg-white border border-border-light flex items-center gap-3 hover:border-brand-300 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-text-primary">{c.nombre[0].toUpperCase() + c.nombre.slice(1)}</p>
                    <p className="text-[10px] text-text-muted">{c.interfaces?.length || 0} Interfaces</p>
                  </div>
                  <Settings className="ml-auto w-4 h-4 text-text-muted" />
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border-light space-y-1 min-w-[280px]">
        <button 
          onClick={() => setShowTestChat(!showTestChat)}
          className={cn(
             "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
             showTestChat ? "bg-brand-50 text-brand-600" : "text-text-secondary hover:bg-surface-hover"
          )}
        >
          <MessageCircle className={cn('w-5 h-5', showTestChat ? 'text-brand-500' : 'text-text-muted')} />
          Probar Chat
        </button>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover transition-all"
        >
          <Settings className="w-5 h-5 text-text-muted" />
          Ajustes
        </button>
      </div>
    </div>
  );
}
