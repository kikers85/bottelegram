import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { cn } from '../lib/cn';
import { type LucideIcon, MoreVertical } from 'lucide-react';

/* ─── BaseNode Component ─── */
export interface BaseNodeData {
  id?: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
  description?: string;
  status?: 'active' | 'draft' | 'error';
  [key: string]: unknown;
}

export const BaseNode = memo(({ data, selected, id }: NodeProps<BaseNodeData>) => {
  const nodeId = id || data.id;
  const Icon = data.icon;
  
  return (
    <div className={cn(
      'card-base w-[260px] overflow-hidden group',
      selected && 'ring-2 ring-brand-500 ring-offset-2',
      data.status === 'error' && 'border-status-danger'
    )}>
      {/* Node Header */}
      <div className={cn(
        'px-4 py-2 flex items-center justify-between border-b gap-3',
        data.color || 'bg-brand-50 border-brand-100'
      )}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-brand-600" />}
          <span className="text-xs font-bold uppercase tracking-wider text-brand-900">
            {data.label}
          </span>
        </div>
        <button className="text-brand-900/50 hover:text-brand-900 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4 space-y-2 bg-white">
        {data.description && (
          <p className="text-sm text-text-secondary leading-snug">
            {data.description}
          </p>
        )}
        
        {/* Slot for children/custom controls */}
        <div className="pt-2">
          <div className="h-px bg-border-light w-full mb-3" />
          <div className="flex items-center justify-between text-[10px] text-text-muted font-medium">
            <span>#{nodeId || 'NEW'}</span>
            <span className={cn(
              'px-1.5 py-0.5 rounded-full',
              data.status === 'active' ? 'bg-status-successBg text-status-success' : 'bg-surface-hover text-text-muted'
            )}>
              {data.status?.toUpperCase() || 'DRAFT'}
            </span>
          </div>
        </div>
      </div>

      {/* Default Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-brand-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-brand-500 !border-2 !border-white"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
