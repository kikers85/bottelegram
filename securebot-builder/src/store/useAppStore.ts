import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import database from '../data/database.json';

export interface Admin {
  id: string;
  name: string;
  email: string;
  telegramId: string;
  role: 'owner' | 'admin' | 'editor';
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'draft' | 'published' | 'archived';
  triggerOn: string;
  triggerConfig: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  version: string;
  flowId: string;
}

export interface Tag {
  id: string;
  name: string;
  botId: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface GlobalVariable {
  id: string;
  name: string;
  value: string | string[];
  type: 'string' | 'string[]' | 'object';
  scope: 'global' | 'bot';
  botId?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface AppState {
  currentView: 'bots' | 'tags' | 'variables' | 'admins' | 'chat';
  selectedBotId: string | null;
  showNodeProperties: boolean;
  showTestChat: boolean;
  
  admins: Admin[];
  bots: Bot[];
  tags: Tag[];
  globalVariables: GlobalVariable[];
  chatMessages: ChatMessage[];
  
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedBotId: (id: string | null) => void;
  setShowNodeProperties: (show: boolean) => void;
  setShowTestChat: (show: boolean) => void;
  
  addBot: (bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBot: (id: string, data: Partial<Bot>) => void;
  deleteBot: (id: string) => void;
  
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  updateTag: (id: string, data: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  addVariable: (variable: Omit<GlobalVariable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVariable: (id: string, data: Partial<GlobalVariable>) => void;
  deleteVariable: (id: string) => void;
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  loadFromDatabase: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'bots',
      selectedBotId: null,
      showNodeProperties: true,
      showTestChat: false,
      
      admins: database.entities.administrators.data as Admin[],
      bots: database.entities.bots.data as Bot[],
      tags: database.entities.tags.data as Tag[],
      globalVariables: database.entities.globalVariables.data as GlobalVariable[],
      chatMessages: [],
      
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedBotId: (id) => set({ selectedBotId: id }),
      setShowNodeProperties: (show) => set({ showNodeProperties: show }),
      setShowTestChat: (show) => set({ showTestChat: show }),
      
      addBot: (botData) => {
        const id = `bot-${Date.now()}`;
        const now = new Date().toISOString();
        const newBot: Bot = {
          ...botData,
          id,
          createdAt: now,
          updatedAt: now,
          publishedAt: null,
        };
        set({ bots: [...get().bots, newBot] });
      },
      
      updateBot: (id, data) => {
        set({
          bots: get().bots.map(bot => 
            bot.id === id ? { ...bot, ...data, updatedAt: new Date().toISOString() } : bot
          ),
        });
      },
      
      deleteBot: (id) => {
        set({ bots: get().bots.filter(bot => bot.id !== id) });
      },
      
      addTag: (tagData) => {
        const id = `tag-${Date.now()}`;
        const newTag: Tag = {
          ...tagData,
          id,
          createdAt: new Date().toISOString(),
        };
        set({ tags: [...get().tags, newTag] });
      },
      
      updateTag: (id, data) => {
        set({
          tags: get().tags.map(tag => tag.id === id ? { ...tag, ...data } : tag),
        });
      },
      
      deleteTag: (id) => {
        set({ tags: get().tags.filter(tag => tag.id !== id) });
      },
      
      addVariable: (varData) => {
        const id = `var-${Date.now()}`;
        const now = new Date().toISOString();
        const newVar: GlobalVariable = {
          ...varData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set({ globalVariables: [...get().globalVariables, newVar] });
      },
      
      updateVariable: (id, data) => {
        set({
          globalVariables: get().globalVariables.map(v => 
            v.id === id ? { ...v, ...data, updatedAt: new Date().toISOString() } : v
          ),
        });
      },
      
      deleteVariable: (id) => {
        set({ globalVariables: get().globalVariables.filter(v => v.id !== id) });
      },
      
      addChatMessage: (msgData) => {
        const message: ChatMessage = {
          ...msgData,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set({ chatMessages: [...get().chatMessages, message] });
      },
      
      clearChat: () => set({ chatMessages: [] }),
      
      loadFromDatabase: () => {
        set({
          admins: database.entities.administrators.data as Admin[],
          bots: database.entities.bots.data as Bot[],
          tags: database.entities.tags.data as Tag[],
          globalVariables: database.entities.globalVariables.data as GlobalVariable[],
        });
      },
    }),
    {
      name: 'securebot-storage',
      partialize: (state) => ({
        bots: state.bots,
        tags: state.tags,
        globalVariables: state.globalVariables,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
