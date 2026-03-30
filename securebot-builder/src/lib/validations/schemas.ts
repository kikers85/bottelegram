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

// 2. Channel & Interface Schemas
export const InterfaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  api_key: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  url_qr: z.string().url().nullable().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
});

export const ChannelSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string(),
  interfaces: z.array(InterfaceSchema).default([]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type ChannelInterface = z.infer<typeof InterfaceSchema>;

// 3. Bot Schema
export const BotSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  owner_id: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  channel_id: z.string().uuid().nullable().optional(),
  interface_id: z.string().nullable().optional(),
  flow_ids: z.array(z.string().uuid()).default([]),
  trigger_on: z.string().optional(),
  trigger_config: z.any().default({}),
  version: z.string().default('1.0.0'),
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

// 5. Trigger Config Schema (Discriminated Union)
export const TriggerTypeEnum = z.enum([
  'keyword', 'post_comment', 'story_mention', 'story_reply', 
  'ad_click', 'new_contact', 'tag_added', 'webhook', 
  'scheduled', 'user_idle'
]);

export const TriggerConfigSchema = z.union([
  z.object({ type: z.literal('keyword'), condition: z.enum(['exactly', 'contains', 'starts_with']), keywords: z.array(z.string()) }),
  z.object({ type: z.literal('post_comment'), source: z.enum(['any', 'specific']), post_id: z.string().optional(), keyword: z.string().optional() }),
  z.object({ type: z.literal('story_mention'), thank_you_msg: z.string().optional(), excluded_words: z.array(z.string()).optional() }),
  z.object({ type: z.literal('story_reply'), source: z.enum(['any', 'specific']), post_id: z.string().optional(), keyword: z.string().optional() }),
  z.object({ type: z.literal('ad_click'), ref_parameter: z.string() }),
  z.object({ type: z.literal('new_contact'), platform: z.enum(['whatsapp', 'instagram', 'facebook', 'web']) }),
  z.object({ type: z.literal('tag_added'), tag_ids: z.array(z.string().uuid()) }),
  z.object({ type: z.literal('webhook'), url: z.string().url(), mapping: z.record(z.string()) }),
  z.object({ type: z.literal('scheduled'), scheduled_at: z.string(), recurrence: z.enum(['once', 'daily', 'weekly']) }),
  z.object({ type: z.literal('user_idle'), time: z.number(), unit: z.enum(['minutes', 'hours', 'days']) }),
]);

export type TriggerConfig = z.infer<typeof TriggerConfigSchema>;
export type TriggerType = z.infer<typeof TriggerTypeEnum>;

// 6. Flow Schema
export const FlowSchema = z.object({
  id: z.string().uuid().optional(),
  bot_id: z.string().uuid(),
  name: z.string().min(1, 'Flow name is required'),
  trigger_type: TriggerTypeEnum.default('keyword'),
  trigger_config: z.any().optional(), // We'll validate this manually or via discriminatedUnion in UI
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
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

