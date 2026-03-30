import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
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
import { useEffect } from 'react';

const nodeTypes = {
  messageNode: MessageNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  triggerNode: TriggerNode,
};

export function FlowBuilder() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    setNodes,
    setEdges,
  } = useFlowStore();
  
  const { 
    showTestChat, 
    setShowTestChat, 
    showNodeProperties, 
    setShowNodeProperties,
    isSidebarDrawerOpen,
    setIsSidebarDrawerOpen,
    selectedBotId
  } = useAppStore();

  const { flow, isLoading, saveFlow } = useFlows(selectedBotId);

  // Load flow data into local store when fetched
  useEffect(() => {
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [flow, setNodes, setEdges]);

  const handleSave = async () => {
    if (!selectedBotId) return;
    try {
      await saveFlow({
        bot_id: selectedBotId,
        nodes,
        edges,
        id: flow?.id
      });
      alert('Flow published successfully to Supabase!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to publish flow.');
    }
  };

  if (isLoading) return <div className="w-full h-screen flex items-center justify-center bg-surface-bg text-text-muted">Loading Flow...</div>;

  return (
    <div className="w-full h-screen bg-surface-bg relative flex overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Canvas Area */}
      <div className="flex-1 h-full relative flex">
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
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

            {/* Header Panel */}
            <Panel position="top-left" className="m-4">
              <div className="flex items-center gap-3">
                {!isSidebarDrawerOpen && (
                  <button 
                    onClick={() => setIsSidebarDrawerOpen(true)}
                    className="w-11 h-11 rounded-btn bg-white border border-border-light flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-300 shadow-sm transition-all"
                    title="Show Sidebar"
                  >
                    <PanelLeftOpen className="w-5 h-5" />
                  </button>
                )}
                <div className="glass-panel p-3 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-text-primary">SecureBot Builder</h1>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
                      Alpha Engine • Multi-Channel
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Action Panel */}
            <Panel position="top-right" className="m-4 flex items-center gap-2">
              <button 
                onClick={() => setShowTestChat(!showTestChat)}
                className={cn(
                  "w-11 h-11 rounded-btn bg-white border flex items-center justify-center transition-all shadow-sm",
                  showTestChat ? "border-indigo-500 text-indigo-500" : "border-border-light text-text-secondary hover:text-indigo-500"
                )}
                title="Test chat"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleSave}
                className="btn-primary gap-2 h-11 px-5"
              >
                <Save className="w-4 h-4" />
                <span>Publish</span>
              </button>
              
              <button 
                onClick={() => setShowNodeProperties(!showNodeProperties)}
                className={cn(
                  "w-11 h-11 rounded-btn bg-white border flex items-center justify-center transition-all shadow-sm",
                  showNodeProperties ? "border-brand-500 text-brand-500" : "border-border-light text-text-secondary hover:text-brand-500"
                )}
                title="Toggle properties panel"
              >
                {showNodeProperties ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </Panel>

            {/* Floating Toolbox */}
            <Panel position="bottom-center" className="mb-8">
              <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/40">
                <button 
                  onClick={() => addNode('messageNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-brand-50 text-text-secondary hover:text-brand-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Message</span>
                </button>
                <div className="w-px h-8 bg-border-light mx-1" />
                <button 
                  onClick={() => addNode('conditionNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-amber-50 text-text-secondary hover:text-amber-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Condition</span>
                </button>
                <div className="w-px h-8 bg-border-light mx-1" />
                <button 
                  onClick={() => addNode('actionNode')}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-indigo-50 text-text-secondary hover:text-indigo-600 transition-all min-w-[90px]"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Action</span>
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
