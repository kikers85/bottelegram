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
  viewport: { x: number; y: number; zoom: number };
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  isNewFlow: boolean;
  setIsNewFlow: (is: boolean) => void;
  resetFlow: () => void;
  pendingNodeType: string | null;
  setPendingNodeType: (type: string | null) => void;
  deleteNode: (id: string) => void;
}

/**
 * Zustand store to manage React Flow state.
 * Handles node/edge changes and connections dynamically.
 */
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  viewport: { x: 0, y: 0, zoom: 0.2 },
  isNewFlow: false,
  pendingNodeType: null,

  setPendingNodeType: (pendingNodeType) => set({ pendingNodeType }),

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

  setViewport: (viewport) => set({ viewport }),

  setIsNewFlow: (isNewFlow) => set({ isNewFlow }),

  resetFlow: () => set({ 
    nodes: [], 
    edges: [], 
    selectedNodeId: null, 
    viewport: { x: 0, y: 0, zoom: 0.2 },
    isNewFlow: true 
  }),

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
      } : type === 'userInputNode' ? {
        id: nodeId,
        label: 'User Input',
        question: '',
        variableName: '',
        variableType: 'string',
        status: 'draft',
      } : type === 'resourceNode' ? {
        id: nodeId,
        label: 'Recurso',
        variables: [],
        status: 'draft',
      } : {
        id: nodeId,
        label: 'Trigger',
        description: '',
        status: 'draft',
      },
    };
    
    set({ 
      nodes: [...get().nodes, newNode],
    });
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

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },
}));
