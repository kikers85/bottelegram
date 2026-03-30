import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ChatMessage } from '../lib/validations/schemas';

export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'tiktok' | 'twitter';

export interface ChannelConfig {
  id: string;
  botId: string;
  type: ChannelType;
  isActive: boolean;
  credentials: {
    token?: string;
    appSecret?: string;
    accountId?: string;
    webhookUrl?: string;
  };
  name: string;
}

export interface AppState {
  currentView: 'bots' | 'tags' | 'variables' | 'agents' | 'chat' | 'flows' | 'channels';
  selectedBotId: string | null;
  showNodeProperties: boolean;
  showTestChat: boolean;
  
  // UI States
  isSidebarDrawerOpen: boolean;
  isSettingsOpen: boolean;
  activeDialog: 'createAgent'|'editAgent'|'createVar'|'editVar'|'createTag'|'editTag'|'createBot'|'editBot'|'createFlow'|'editFlow'| null;
  isChannelConfigOpen: ChannelType | null;
  editingEntityId: string | null;

  chatMessages: ChatMessage[];
  
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedBotId: (id: string | null) => void;
  setShowNodeProperties: (show: boolean) => void;
  setShowTestChat: (show: boolean) => void;
  
  // UI Actions
  setIsSidebarDrawerOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setActiveDialog: (dialog: AppState['activeDialog'], entityId?: string) => void;
  setIsChannelConfigOpen: (channel: ChannelType | null) => void;
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'bots',
      selectedBotId: null,
      showNodeProperties: false,
      showTestChat: false,
      isSidebarDrawerOpen: true,
      isSettingsOpen: false,
      activeDialog: null,
      isChannelConfigOpen: null,
      editingEntityId: null,
      chatMessages: [] as ChatMessage[],
      
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedBotId: (id) => set({ selectedBotId: id }),
      setShowNodeProperties: (show) => set({ showNodeProperties: show }),
      setShowTestChat: (show) => set({ showTestChat: show }),
      
      setIsSidebarDrawerOpen: (open) => set({ isSidebarDrawerOpen: open }),
      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
      setActiveDialog: (dialog, entityId?: string) => set({ activeDialog: dialog, editingEntityId: entityId || null }),
      setIsChannelConfigOpen: (channel) => set({ isChannelConfigOpen: channel }),
      
      addChatMessage: (msgData) => {
        const message: ChatMessage = {
          ...msgData,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set({ chatMessages: [...get().chatMessages, message] });
      },
      
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'securebot-storage',
      partialize: (state) => ({
        chatMessages: state.chatMessages,
      }),
    }
  )
);
