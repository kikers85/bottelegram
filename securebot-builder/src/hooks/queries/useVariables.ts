import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseService } from '../../services/SupabaseService';
import type { GlobalVariable } from '../../lib/validations/schemas';

const varService = new SupabaseService('global_variables');

export function useVariables(botId?: string | null) {
    const queryClient = useQueryClient();

    const fetchVars = useQuery({
        queryKey: ['variables', botId],
        queryFn: () => {
            if (botId) {
                return varService.getAll<GlobalVariable>((q) => q.or(`scope.eq.global,bot_id.eq.${botId}`));
            }
            return varService.getAll<GlobalVariable>((q) => q.eq('scope', 'global'));
        },
    });

    const createVariableMutation = useMutation({
        mutationFn: (newVar: Partial<GlobalVariable>) => varService.create<GlobalVariable>(newVar),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['variables', botId] }),
    });

    const updateVariableMutation = useMutation({
        mutationFn: ({ id, variable }: { id: string, variable: Partial<GlobalVariable> }) => varService.update<GlobalVariable>(id, variable),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['variables', botId] }),
    });

    const deleteVariableMutation = useMutation({
        mutationFn: (id: string) => varService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['variables', botId] }),
    });

    return {
        variables: fetchVars.data || [],
        isLoading: fetchVars.isLoading,
        error: fetchVars.error,
        createVariable: createVariableMutation.mutateAsync,
        updateVariable: updateVariableMutation.mutateAsync,
        deleteVariable: deleteVariableMutation.mutateAsync,
    };
}
