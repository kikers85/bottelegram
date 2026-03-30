import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';

/* ─── Flow State Definition ─── */
export interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSelectedNodeId: (id: string | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: string) => void;
  updateNodeData: (id: string, data: any) => void;
  saveFlow: () => Promise<void>;
}

/**
 * Zustand store to manage React Flow state.
 * Handles node/edge changes and connections dynamically.
 */
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [
    {
      id: 'trigger-1',
      type: 'triggerNode',
      position: { x: 50, y: 150 },
      data: { 
        label: 'New Member', 
        description: 'Fires when a user joins the group.',
        status: 'active'
      },
    },
    {
      id: 'msg-1',
      type: 'messageNode',
      position: { x: 400, y: 100 },
      data: { 
        messages: [{ id: 'm1', type: 'text', content: 'Welcome to the SecureBot Lab! 👋' }],
        buttons: [{ id: 'b1', label: 'View Features' }, { id: 'b2', label: 'Contact Support' }],
        status: 'active'
      },
    },
    {
      id: 'cond-1',
      type: 'conditionNode',
      position: { x: 750, y: 150 },
      data: { 
        condition: 'User is Premium?',
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'trigger-1', target: 'msg-1', animated: true },
    { id: 'e2-3', source: 'msg-1', sourceHandle: 'b1', target: 'cond-1', animated: true },
  ],
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    
    // Track selection
    const selectChange = changes.find(c => c.type === 'select');
    if (selectChange && 'selected' in selectChange) {
      if (selectChange.selected) {
        set({ selectedNodeId: selectChange.id });
      } else if (get().selectedNodeId === selectChange.id) {
        set({ selectedNodeId: null });
      }
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setNodes: (nodes: Node[]) => set({ nodes }),

  setEdges: (edges: Edge[]) => set({ edges }),

  addNode: (type) => {
    const id = `${type}-${Date.now()}`;
    const nodeId = id.slice(0, 8);
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: type === 'messageNode' ? {
        id: nodeId,
        label: 'Send Message',
        messages: [{ id: `m-${Date.now()}`, type: 'text', content: '' }],
        buttons: [],
        status: 'draft',
      } : type === 'conditionNode' ? {
        id: nodeId,
        label: 'Condition',
        condition: '',
        status: 'draft',
      } : type === 'actionNode' ? {
        id: nodeId,
        label: 'Action',
        action: '',
        externalApi: undefined,
        status: 'draft',
      } : {
        id: nodeId,
        label: 'Trigger',
        description: '',
        status: 'draft',
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  saveFlow: async () => {
    const { nodes, edges } = get();
    try {
      const response = await fetch('http://localhost:3001/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error('Failed to save flow');
      console.log('Flow published successfully to backend');
    } catch (error) {
      console.error('Error saving flow:', error);
      throw error;
    }
  },
}));
