import { SupabaseService } from './SupabaseService';
import { AgentSchema, BotSchema, FlowSchema } from '../lib/validations/schemas';
import type { Agent, Bot, Flow } from '../lib/validations/schemas';

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

    async getByBotId(botId: string): Promise<Flow | null> {
        const flows = await this.getAll<Flow>((query) => query.eq('bot_id', botId));
        return flows.length > 0 ? flows[0] : null;
    }
}

export const agentService = new AgentService();
export const botService = new BotService();
export const flowService = new FlowService();
