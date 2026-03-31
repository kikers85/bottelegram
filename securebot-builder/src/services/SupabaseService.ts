import { supabase } from '../lib/supabase';

export class SupabaseService {
    protected table: string;

    constructor(table: string) {
        this.table = table;
    }

    async getAll<T>(query?: (any: any) => any): Promise<T[]> {
        let baseQuery = supabase.from(this.table).select('*');
        if (query) baseQuery = query(baseQuery);
        const { data, error } = await baseQuery;
        if (error) throw error;
        return data as T[];
    }

    async getById<T>(id: string): Promise<T | null> {
        const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
        if (error) throw error;
        return data as T;
    }

    async create<T>(item: Partial<T>): Promise<T> {
        const { data, error } = await supabase.from(this.table).insert(item).select().single();
        if (error) throw error;
        return data as T;
    }

    async update<T>(id: string, item: Partial<T>): Promise<T> {
        const { data, error } = await supabase.from(this.table).update(item).eq('id', id).select().single();
        if (error) throw error;
        return data as T;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from(this.table).delete().eq('id', id);
        if (error) throw error;
    }

    async deleteFlow(id: string): Promise<void> {
        const { error } = await supabase.from(this.table).delete().eq('id', id);
        if (error) throw error;
    }
}
