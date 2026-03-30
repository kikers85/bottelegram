import { z } from 'zod';

// 1. Agent Schema
export const AgentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  telegram_id: z.string().nullable().optional(),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']).default('editor'),
  permissions: z.array(z.string()).default([]),
  created_at: z.string().optional(),
  last_login: z.string().nullable().optional(),
  updated_at: z.string().optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

// 2. Bot Schema
export const BotSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  owner_id: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  trigger_on: z.string().optional(),
  trigger_config: z.any().default({}),
  version: z.string().default('1.0.0'),
  flow_id: z.string().uuid().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  published_at: z.string().nullable().optional(),
});

export type Bot = z.infer<typeof BotSchema>;

// 3. Tag Schema
export const TagSchema = z.object({
  id: z.string().uuid().optional(),
  bot_id: z.string().uuid(),
  name: z.string().min(1, 'Tag name is required'),
  color: z.string().default('#6366F1'),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Tag = z.infer<typeof TagSchema>;

// 4. Global Variable Schema
export const VariableSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Variable name is required'),
  value: z.any().optional(),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  scope: z.enum(['global', 'bot']).default('global'),
  bot_id: z.string().uuid().nullable().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type GlobalVariable = z.infer<typeof VariableSchema>;

// 5. Flow Schema
export const FlowSchema = z.object({
  id: z.string().uuid().optional(),
  bot_id: z.string().uuid(),
  name: z.string().optional(),
  status: z.string().default('draft'),
  nodes: z.array(z.any()).default([]),
  edges: z.array(z.any()).default([]),
  version: z.string().default('1.0.0'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Flow = z.infer<typeof FlowSchema>;

// 6. Chat Message Schema
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'bot']),
  content: z.string(),
  timestamp: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

