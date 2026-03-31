import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TriggerConfigSchema, type TriggerConfig, type TriggerType } from '../../lib/validations/schemas';
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
  keyword: { label: 'Palabras Clave', icon: MessageSquare, color: 'bg-blue-500', description: 'Se activa al detectar palabras específicas en un mensaje.' },
  post_comment: { label: 'Comentario Post', icon: MessageSquare, color: 'bg-pink-500', description: 'Se activa cuando alguien comenta en una publicación.' },
  story_mention: { label: 'Mención Historia', icon: Share2, color: 'bg-purple-500', description: 'Se activa cuando alguien te menciona en una historia.' },
  story_reply: { label: 'Respuesta Historia', icon: MessageSquare, color: 'bg-indigo-500', description: 'Se activa al recibir respuestas a tus historias.' },
  ad_click: { label: 'Anuncios Meta', icon: Megaphone, color: 'bg-blue-600', description: 'Se activa vía anuncios de Click-to-Messenger/IG.' },
  new_contact: { label: 'Nuevo Contacto', icon: UserPlus, color: 'bg-green-500', description: 'Se activa en la primera interacción.' },
  tag_added: { label: 'Etiqueta Añadida', icon: TagIcon, color: 'bg-amber-500', description: 'Se activa cuando se aplica una etiqueta de CRM.' },
  webhook: { label: 'Webhook', icon: Globe, color: 'bg-cyan-500', description: 'Se activa desde sistemas externos (Shopify, Stripe, etc).' },
  scheduled: { label: 'Programado', icon: Clock, color: 'bg-rose-500', description: 'Se activa en una fecha/hora específica o de forma recurrente.' },
  user_idle: { label: 'Inactividad', icon: Moon, color: 'bg-slate-700', description: 'Se activa si el usuario deja de responder.' },
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
      {/* Selector de Tipo */}
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
          Configurando {TRIGGER_META[selectedType].label}
        </h3>
        <p className="text-xs text-text-muted mb-4">{TRIGGER_META[selectedType].description}</p>

        {/* Campos Dinámicos */}
        <div className="space-y-4">
          {selectedType === 'keyword' && (
            <>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Condición</label>
                <select 
                  {...register('condition')}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-sm"
                >
                  <option value="exactly">Coincide exactamente</option>
                  <option value="contains">Contiene palabras</option>
                  <option value="starts_with">Empieza con</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Palabras Clave (Separadas por coma)</label>
                <input 
                  type="text"
                  placeholder="ej. hola, ayuda, registro"
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
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1">Origen</label>
                  <select {...register('source')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                    <option value="any">Cualquier Post</option>
                    <option value="specific">Post Específico</option>
                  </select>
                </div>
                {watch('source') === 'specific' && (
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">ID del Post</label>
                    <input {...register('post_id')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Filtrar por Palabra Clave (Opcional)</label>
                <input {...register('keyword')} placeholder="ej. INFO" className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
            </>
          )}

          {selectedType === 'webhook' && (
            <div className="space-y-4">
              <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-700 truncate mr-2">https://api.securebot.com/webhook/unique-id</span>
                <button type="button" className="text-[10px] font-bold text-brand-600 uppercase hover:underline">Copiar URL</button>
              </div>
              <p className="text-[10px] text-text-muted italic">Mapeo de variables próximamente...</p>
            </div>
          )}

          {selectedType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Fecha y Hora</label>
                <input type="datetime-local" {...register('scheduled_at')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Recurrencia</label>
                <select {...register('recurrence')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                  <option value="once">Una sola vez</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
            </div>
          )}

          {selectedType === 'user_idle' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Tiempo de Inactividad</label>
                <input type="number" {...register('time', { valueAsNumber: true })} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Unidad</label>
                <select {...register('unit')} className="w-full px-3 py-2 border border-border-light rounded-lg text-sm bg-white">
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Días</option>
                </select>
              </div>
            </div>
          )}

          {/* Más condiciones para otros tipos */}
          {!['keyword', 'post_comment', 'webhook', 'scheduled', 'user_idle'].includes(selectedType) && (
             <div className="p-8 text-center text-text-muted text-xs italic">
               Configuración del paso para {TRIGGER_META[selectedType].label} en desarrollo...
             </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="text-[10px] text-status-danger bg-status-dangerBg p-2 rounded">
              Por favor, corrige los errores de configuración anteriores.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-hover">Cancelar</button>
        <button type="submit" className="btn-primary">Guardar Disparador</button>
      </div>
    </form>
  );
}
