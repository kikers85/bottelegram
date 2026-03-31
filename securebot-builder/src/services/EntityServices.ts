import { SupabaseService } from './SupabaseService';
import { AgentSchema, BotSchema, FlowSchema, TagSchema, VariableSchema } from '../lib/validations/schemas';
import type { Agent, Bot, Flow, Tag, GlobalVariable, Channel } from '../lib/validations/schemas';

// 1. Agent Service
export class AgentService extends SupabaseService {
    constructor() {
        super('agents');
    }

    async createAgent(agent: Partial<Agent>): Promise<Agent> {
        const validated = AgentSchema.parse(agent);
        return this.create<Agent>(validated);
    }
}

// 2. Bot Service
export class BotService extends SupabaseService {
    constructor() {
        super('bots');
    }

    async createBot(bot: Partial<Bot>): Promise<Bot> {
        const validated = BotSchema.parse(bot);
        return this.create<Bot>(validated);
    }

    async updateBot(id: string, bot: Partial<Bot>): Promise<Bot> {
        const validated = BotSchema.partial().parse(bot);
        return this.update<Bot>(id, validated);
    }
}

// 3. Flow Service
export class FlowService extends SupabaseService {
    constructor() {
        super('flows');
    }

    async saveFlow(flow: Partial<Flow>): Promise<Flow> {
        const validated = FlowSchema.parse(flow);
        if (validated.id) {
            return this.update<Flow>(validated.id, validated);
        }
        return this.create<Flow>(validated);
    }



    async getFlows(): Promise<Flow[]> {
        return this.getAll<Flow>();
    }

    async getFlowsByIds(ids: string[]): Promise<Flow[]> {
        if (!ids || ids.length === 0) return [];
        return this.getAll<Flow>((query) => query.in('id', ids));
    }

    async deleteFlow(id: string): Promise<void> {
        return this.delete(id);
    }
}

// 4. Tag Service
export class TagService extends SupabaseService {
    constructor() {
        super('tags');
    }

    async createTag(tag: Partial<Tag>): Promise<Tag> {
        const validated = TagSchema.parse(tag);
        return this.create<Tag>(validated);
    }
}

// 5. Variable Service
export class VariableService extends SupabaseService {
    constructor() {
        super('global_variables');
    }

    async createVariable(variable: Partial<GlobalVariable>): Promise<GlobalVariable> {
        const validated = VariableSchema.parse(variable);
        return this.create<GlobalVariable>(validated);
    }
}

// 6. Channel Service
export class ChannelService extends SupabaseService {
    constructor() {
        super('canales');
    }

    async updateChannel(id: string, channel: Partial<Channel>): Promise<Channel> {
        return this.update<Channel>(id, channel);
    }
}

export const agentService = new AgentService();
export const botService = new BotService();
export const flowService = new FlowService();
export const tagService = new TagService();
export const variableService = new VariableService();
export const channelService = new ChannelService();
