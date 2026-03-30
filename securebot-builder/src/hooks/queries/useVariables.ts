import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { variableService } from '../../services/EntityServices';
import type { GlobalVariable } from '../../lib/validations/schemas';

export function useVariables(botId?: string | null) {
    const queryClient = useQueryClient();

    const fetchVars = useQuery({
        queryKey: ['variables', botId],
        queryFn: () => {
            if (botId) {
                return variableService.getAll<GlobalVariable>((q) => q.or(`scope.eq.global,bot_id.eq.${botId}`));
            }
            return variableService.getAll<GlobalVariable>((q) => q.eq('scope', 'global'));
        },
    });

    const createVariableMutation = useMutation({
        mutationFn: (newVar: Partial<GlobalVariable>) => variableService.createVariable(newVar),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['variables', botId] }),
    });

    const updateVariableMutation = useMutation({
        mutationFn: ({ id, variable }: { id: string, variable: Partial<GlobalVariable> }) => variableService.update<GlobalVariable>(id, variable),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['variables', botId] }),
    });

    const deleteVariableMutation = useMutation({
        mutationFn: (id: string) => variableService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variables', botId] });
        },
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
