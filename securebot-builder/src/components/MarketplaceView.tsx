import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFlows } from '../hooks/queries/useFlows';
import { marketplaceTemplates } from '../data/templates';
import type { Template } from '../data/templates';
import { cn } from '../lib/cn';
import { alerts } from '../lib/alerts';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle,
  Send,
  Camera,
  Layout,
  Globe,
  Clock,
  Layers
} from 'lucide-react';

export function MarketplaceView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { saveFlow } = useFlows();
  const { setCurrentView, setSelectedFlowId } = useAppStore();

  const filteredTemplates = marketplaceTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.platform === filter;
    return matchesSearch && matchesFilter;
  });

  const handleInstall = async (template: Template) => {
    const confirmed = await alerts.confirm(
      'Instalar Plantilla', 
      `¿Deseas instalar la plantilla "${template.name}"? Esto creará un nuevo flujo en tu espacio de trabajo.`
    );

    if (confirmed) {
      alerts.loading('Instalando Plantilla');
      try {
        const payload: any = {
          name: `${template.name} (Copia)`,
          nodes: template.nodes,
          edges: template.edges,
          trigger_type: template.nodes.find(n => n.type === 'triggerNode')?.data?.trigger_type || 'keyword',
          trigger_config: template.nodes.find(n => n.type === 'triggerNode')?.data?.trigger_config || {},
          status: 'draft',
        };

        const saved: any = await saveFlow(payload);
        const newId = saved?.id || (Array.isArray(saved) ? saved[0]?.id : null);
        
        alerts.success('Plantilla Instalada', 'El flujo ha sido creado exitosamente.');
        
        if (newId) {
          setSelectedFlowId(newId);
          setCurrentView('flows');
        }
      } catch (err) {
        console.error(err);
        alerts.error('Error', 'No se pudo instalar la plantilla.');
      }
    }
  };

  const platforms = [
    { id: 'all', label: 'Todos', icon: Layers },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'instagram', label: 'Instagram', icon: Camera },
    { id: 'facebook', label: 'Facebook', icon: Layout },
    { id: 'web', label: 'Web', icon: Globe },
  ];

  return (
    <div className="flex-1 h-screen bg-surface-bg overflow-y-auto flex flex-col p-8">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-brand/20 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Tienda de Plantillas</h1>
            <p className="text-text-muted font-medium">Acelera tu automatización con flujos probados y optimizados.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-border-light shadow-sm overflow-x-auto w-full md:w-auto">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilter(p.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  filter === p.id 
                    ? "bg-brand-500 text-white shadow-md shadow-brand/20" 
                    : "text-text-secondary hover:bg-slate-50"
                )}
              >
                <p.icon className="w-4 h-4" />
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-border-light rounded-2xl text-sm shadow-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className="group bg-white border border-border-light rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all flex flex-col h-full relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                 <span className={cn(
                   "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                   template.difficulty === 'Principiante' ? "bg-green-50 text-green-600" :
                   template.difficulty === 'Intermedio' ? "bg-amber-50 text-amber-600" :
                   "bg-indigo-50 text-indigo-600"
                 )}>
                   {template.difficulty}
                 </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                  template.color
                )}>
                  <template.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0 pr-20">
                   <h2 className="text-lg font-bold text-text-primary leading-tight truncate">{template.name}</h2>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                        {template.platform}
                      </span>
                   </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-1">
                {template.description}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~2 min</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase ml-auto">
                   <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                   <span>Verificado</span>
                </div>
              </div>

              <button 
                onClick={() => handleInstall(template)}
                className="mt-6 w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group/btn"
              >
                <span>Instalar Plantilla</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">No encontramos plantillas</h3>
            <p className="text-text-muted max-w-xs">Intenta con otros términos de búsqueda o filtros diferentes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
