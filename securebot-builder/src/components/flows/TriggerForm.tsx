import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TriggerConfigSchema, TriggerTypeEnum, type TriggerConfig, type TriggerType } from '../../lib/validations/schemas';
import { 
  Zap, 
  MessageSquare, 
  Share2, 
  Globe, 
  Megaphone, 
  UserPlus, 
  Tag as TagIcon, 
  Clock, 
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/cn';

interface TriggerFormProps {
  initialConfig?: Partial<TriggerConfig>;
  onSave: (config: TriggerConfig) => void;
  onCancel: () => void;
}

const TRIGGER_META: Record<TriggerType, { label: string; icon: any; color: string; description: string }> = {
  keyword: { label: 'Keywords', icon: MessageSquare, color: 'bg-blue-500', description: 'Trigger on specific words in a message.' },
  post_comment: { label: 'Post Comment', icon: MessageSquare, color: 'bg-pink-500', description: 'Trigger when someone comments on a post.' },
  story_mention: { label: 'Story Mention', icon: Share2, color: 'bg-purple-500', description: 'Trigger when someone mentions you in a story.' },
  story_reply: { label: 'Story Reply', icon: MessageSquare, color: 'bg-indigo-500', description: 'Trigger on replies to your stories.' },
  ad_click: { label: 'Meta Ads', icon: Megaphone, color: 'bg-blue-600', description: 'Trigger via Click-to-Messenger/IG ads.' },
  new_contact: { label: 'New Contact', icon: UserPlus, color: 'bg-green-500', description: 'Trigger on the very first interaction.' },
  tag_added: { label: 'Tag Added', icon: TagIcon, color: 'bg-amber-500', description: 'Trigger when a CRM tag is applied.' },
  webhook: { label: 'Webhook', icon: Globe, color: 'bg-cyan-500', description: 'Trigger from external systems (Shopify, stripe).' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'bg-rose-500', description: 'Trigger at a specific date/time or recurr.' },
  user_idle: { label: 'User Idle', icon: Moon, color: 'bg-slate-700', description: 'Trigger if user stops responding.' },
};

export function TriggerForm({ initialConfig, onSave, onCancel }: TriggerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TriggerConfig>({
    resolver: zodResolver(TriggerConfigSchema),
    defaultValues: initialConfig as any || { type: 'keyword', condition: 'exactly', keywords: [] },
  });

  const selectedType = watch('type');

  const onSubmit = (data: TriggerConfig) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(TRIGGER_META) as TriggerType[]).map((type) => {
          const meta = TRIGGER_META[type];
          const Icon = meta.icon;
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setValue('type', type)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                isSelected 
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm" 
                  : "border-border-light bg-white hover:border-brand-200 text-text-secondary"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm", meta.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight leading-none text-center">
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-surface-base rounded-xl border border-border-light">
        <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-500" />
          Configuring {TRIGGER_META[selectedType].label}
        </h3>
        <p className="text-xs text-text-muted mb-4">{TRIGGER_META[selectedType].description}</p>

        {/* Dynamic Fields */}
        <div className="space-y-4">
          {selectedType === 'keyword' && (
            <>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Condition</label>
                <select 
                  {...register('condition')}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-sm"
                >
                  <option value="exactly">Exactly matches</option>
                  <option value="contains">Contains words</option>
                  <option value="starts_with">Starts with</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Keywords (Comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. hello, help, register"
                  onChange={(e) => setValue('keywords', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>
            </>
          )}

          {selectedType === 'post_comment' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1">Source</label>
                  <select {...register('source')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                    <option value="any">Any Post</option>
                    <option value="specific">Specific Post</option>
                  </select>
                </div>
                {watch('source') === 'specific' && (
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Post ID</label>
                    <input {...register('post_id')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Filter by Keyword (Optional)</label>
                <input {...register('keyword')} placeholder="e.g. INFO" className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
            </>
          )}

          {selectedType === 'webhook' && (
            <div className="space-y-4">
              <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-700 truncate mr-2">https://api.securebot.com/webhook/unique-id</span>
                <button type="button" className="text-[10px] font-bold text-brand-600 uppercase hover:underline">Copy URL</button>
              </div>
              <p className="text-[10px] text-text-muted italic">Mapeo de variables próximamente...</p>
            </div>
          )}

          {selectedType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Date & Time</label>
                <input type="datetime-local" {...register('scheduled_at')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Recurrence</label>
                <select {...register('recurrence')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                  <option value="once">One time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}

          {selectedType === 'user_idle' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Inactivity Time</label>
                <input type="number" {...register('time', { valueAsNumber: true })} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Unit</label>
                <select {...register('unit')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {/* Add more conditions for other types similarly */}
          {!['keyword', 'post_comment', 'webhook', 'scheduled', 'user_idle'].includes(selectedType) && (
             <div className="p-8 text-center text-text-muted text-xs italic">
               Step configuration for {TRIGGER_META[selectedType].label} in development...
             </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="text-[10px] text-status-danger bg-status-dangerBg p-2 rounded">
              Please fix the configuration errors above.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-hover">Cancel</button>
        <button type="submit" className="btn-primary">Save Trigger</button>
      </div>
    </form>
  );
}
