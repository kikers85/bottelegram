import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/cn';
import {
  Bot,
  Tags,
  Variable,
  Users,
  Plus,
  ChevronRight,
  Zap,
  MessageCircle,
  Settings,
  Trash2,
  Edit,
} from 'lucide-react';

const navItems = [
  { id: 'bots', label: 'Bots', icon: Bot },
  { id: 'tags', label: 'Tags', icon: Tags },
  { id: 'variables', label: 'Variables', icon: Variable },
  { id: 'admins', label: 'Admins', icon: Users },
] as const;

function BotList() {
  const { bots, selectedBotId, setSelectedBotId } = useAppStore();

  return (
    <div className="space-y-2">
      {bots.map((bot) => (
        <button
          key={bot.id}
          onClick={() => setSelectedBotId(bot.id)}
          className={cn(
            'w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left',
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
            <p className="text-[10px] text-text-muted uppercase">{bot.triggerOn}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </button>
      ))}
      <button className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">New Bot</span>
      </button>
    </div>
  );
}

function TagList() {
  const { tags } = useAppStore();

  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light flex items-center gap-3"
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-text-primary">{tag.name}</p>
            <p className="text-[10px] text-text-muted">{tag.description}</p>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-surface-hover rounded-lg">
              <Edit className="w-3.5 h-3.5 text-text-muted" />
            </button>
            <button className="p-1.5 hover:bg-status-dangerBg rounded-lg">
              <Trash2 className="w-3.5 h-3.5 text-status-danger" />
            </button>
          </div>
        </div>
      ))}
      <button className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">New Tag</span>
      </button>
    </div>
  );
}

function VariableList() {
  const { globalVariables } = useAppStore();

  return (
    <div className="space-y-2">
      {globalVariables.map((v) => (
        <div
          key={v.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-mono font-bold text-brand-600">{v.name}</p>
            <span className="text-[9px] font-bold uppercase bg-surface-panel px-2 py-0.5 rounded">
              {v.type}
            </span>
          </div>
          <p className="text-xs text-text-secondary truncate">{v.description}</p>
          <p className="text-[10px] text-text-muted mt-1 font-mono">
            {Array.isArray(v.value) ? v.value.join(', ') : v.value}
          </p>
        </div>
      ))}
      <button className="w-full p-3 rounded-xl border-2 border-dashed border-border-strong text-text-muted hover:border-brand-400 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">New Variable</span>
      </button>
    </div>
  );
}

function AdminList() {
  const { admins } = useAppStore();

  return (
    <div className="space-y-2">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="w-full p-3 rounded-xl bg-white border border-border-light flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-text-primary">{admin.name}</p>
            <p className="text-[10px] text-text-muted">{admin.email}</p>
          </div>
          <span className="text-[9px] font-bold uppercase bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">
            {admin.role}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LeftSidebar() {
  const { currentView, setCurrentView } = useAppStore();

  return (
    <div className="w-[280px] h-full bg-white border-r border-border-light flex flex-col">
      {/* Logo Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary">SecureBot</h1>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">Builder</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
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
                  2
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-y-auto p-3 border-t border-border-light">
        {currentView === 'bots' && <BotList />}
        {currentView === 'tags' && <TagList />}
        {currentView === 'variables' && <VariableList />}
        {currentView === 'admins' && <AdminList />}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border-light space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover transition-all">
          <MessageCircle className="w-5 h-5 text-text-muted" />
          Test Chat
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover transition-all">
          <Settings className="w-5 h-5 text-text-muted" />
          Settings
        </button>
      </div>
    </div>
  );
}
