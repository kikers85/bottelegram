import { useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../store/useFlowStore';
import { 
  MessageNode, 
  ConditionNode, 
  ActionNode, 
  TriggerNode 
} from './Nodes';
import { SidePanel } from './SidePanel';
import { LeftSidebar } from './LeftSidebar';
import { TestChat } from './TestChat';
import { useAppStore } from '../store/useAppStore';
import { useFlows } from '../hooks/queries/useFlows';
import { cn } from '../lib/cn';
import { Plus, Save, Zap, MessageCircle, Eye, EyeOff, PanelLeftOpen } from 'lucide-react';

const nodeTypes = {
  messageNode: MessageNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  triggerNode: TriggerNode,
};

export function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner />
    </ReactFlowProvider>
  );
}

function FlowBuilderInner() {
  const { setViewport, getViewport } = useReactFlow();
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    setNodes,
    setEdges,
    setIsNewFlow,
    isNewFlow,
  } = useFlowStore();
  
  const { 
    showTestChat, 
    setShowTestChat, 
    selectedFlowId,
    setActiveDialog,
    isSidebarDrawerOpen,
    setIsSidebarDrawerOpen,
    showNodeProperties,
    setShowNodeProperties
  } = useAppStore();

  const lastLoadedFlowId = useRef<string | null>(null);
  const { isLoading, saveFlow, flows } = useFlows();
  
  // Find current flow from the list
  const currentFlow = flows.find((f: any) => f.id === selectedFlowId) || null;

  // Load flow data into local store when fetched or selected
  useEffect(() => {
    if (selectedFlowId === lastLoadedFlowId.current) return; // Don't reload if already on this flow

    if (currentFlow) {
      setNodes(currentFlow.nodes || []);
      setEdges(currentFlow.edges || []);
      setIsNewFlow(false);
      lastLoadedFlowId.current = selectedFlowId || null;
    } else if (!selectedFlowId) {
      setNodes([]);
      setEdges([]);
      setIsNewFlow(true);
      lastLoadedFlowId.current = null;
    }
  }, [currentFlow, selectedFlowId, setNodes, setEdges, setIsNewFlow]);

  const handleSaveFlow = async (status: 'draft' | 'published' | 'archived') => {
    if (isNewFlow && !currentFlow) {
      setActiveDialog('createFlow');
      return;
    }

    try {
      const flowData: any = {
        name: currentFlow?.name || 'Flujo sin nombre',
        nodes,
        edges,
        id: currentFlow?.id,
        status: status as any
      };

      await saveFlow(flowData);
      const statusLabel = status === 'published' ? 'publicado' : status === 'draft' ? 'guardado como borrador' : 'archivado';
      alert(`¡Flujo ${statusLabel} exitosamente!`);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el flujo.');
    }
  };

  const zoomLevels = [0.3, 0.4, 0.5, 1];
  const currentZoom = getViewport()?.zoom || 0.3;

  if (isLoading) return <div className="w-full h-screen flex items-center justify-center bg-surface-bg text-text-muted">Cargando Flujo...</div>;

  return (
    <div className="w-full h-screen bg-surface-bg relative flex overflow-hidden">
      {/* Barra Lateral Izquierda */}
      <LeftSidebar />
      
      {/* Área del Lienzo Principal */}
      <div className="flex-1 h-full relative flex">
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
            minZoom={0.1}
            maxZoom={4}
            className="bg-dot-pattern"
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#6366F1', strokeWidth: 2 }
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#CBD5E1" />
            <Controls showInteractive={false} className="!shadow-card !border-none !rounded-xl !overflow-hidden" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'triggerNode') return '#4F46E5';
                if (n.type === 'conditionNode') return '#F59E0B';
                return '#6366F1';
              }}
              maskColor="rgba(241, 245, 249, 0.7)"
              className="!rounded-xl !border-border-light !shadow-lg"
            />

            {/* Panel de Cabecera */}
            <Panel position="top-left" className="m-4">
              <div className="flex items-center gap-3">
                {!isSidebarDrawerOpen && (
                  <button 
                    onClick={() => setIsSidebarDrawerOpen(true)}
                    className="w-11 h-11 rounded-btn bg-white border border-border-light flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-300 shadow-sm transition-all"
                    title="Mostrar Barra Lateral"
                  >
                    <PanelLeftOpen className="w-5 h-5" />
                  </button>
                )}
                <div className="glass-panel p-3 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-text-primary">Constructor SecureBot</h1>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
                      Motor Alpha • Multicanal
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Panel de Acciones */}
            <Panel position="top-right" className="m-4 flex items-center gap-2">
              <button 
                onClick={() => setShowTestChat(!showTestChat)}
                className={cn(
                  "w-11 h-11 rounded-btn bg-white border flex items-center justify-center transition-all shadow-sm",
                  showTestChat ? "border-indigo-500 text-indigo-500" : "border-border-light text-text-secondary hover:text-indigo-500"
                )}
                title="Chat de prueba"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              <button 
                onClick={() => handleSaveFlow('draft')}
                className="btn-secondary gap-2 h-11 px-4 text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Borrador</span>
              </button>

              <button 
                onClick={() => handleSaveFlow('published')}
                className="btn-primary gap-2 h-11 px-5"
              >
                <Zap className="w-4 h-4" />
                <span>Publicar</span>
              </button>
              
              <button 
                onClick={() => setShowNodeProperties(!showNodeProperties)}
                className={cn(
                  "w-11 h-11 rounded-btn bg-white border flex items-center justify-center transition-all shadow-sm",
                  showNodeProperties ? "border-brand-500 text-brand-500" : "border-border-light text-text-secondary hover:text-brand-500"
                )}
                title="Alternar panel de propiedades"
              >
                {showNodeProperties ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </Panel>

            {/* Panel Selector de Zoom */}
            <Panel position="bottom-right" className="m-4">
              <div className="glass-panel p-1 rounded-xl flex items-center gap-1 shadow-lg bg-white/80 border border-white/40">
                {zoomLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setViewport({ x: 0, y: 0, zoom: level }, { duration: 400 })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                      Math.round(currentZoom * 100) === Math.round(level * 100)
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-text-muted hover:bg-slate-100"
                    )}
                  >
                    {Math.round(level * 100)}%
                  </button>
                ))}
              </div>
            </Panel>

            {/* Herramientas Flotantes */}
            <Panel position="bottom-center" className="mb-8">
              <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/40">
                <button 
                  onClick={() => addNode('messageNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-brand-50 text-text-secondary hover:text-brand-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Mensaje</span>
                </button>
                <div className="w-px h-8 bg-border-light mx-1" />
                <button 
                  onClick={() => addNode('conditionNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-amber-50 text-text-secondary hover:text-amber-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Condición</span>
                </button>
                <div className="w-px h-8 bg-border-light mx-1" />
                <button 
                  onClick={() => addNode('actionNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-indigo-50 text-text-secondary hover:text-indigo-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Acción</span>
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Test Chat Panel */}
        {showTestChat && <TestChat />}
      </div>

      {/* Right Properties SidePanel */}
      {showNodeProperties && <SidePanel />}
    </div>
  );
}

FlowBuilder.displayName = 'FlowBuilder';
