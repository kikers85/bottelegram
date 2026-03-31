import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowService } from '../../services/EntityServices';
import type { Flow } from '../../lib/validations/schemas';

export function useFlows() {
    const queryClient = useQueryClient();

    const fetchFlows = useQuery({
        queryKey: ['flows'],
        queryFn: () => flowService.getFlows(),
    });

    const saveFlowMutation = useMutation({
        mutationFn: (flow: Partial<Flow>) => flowService.saveFlow(flow),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flows'] });
        },
    });

    const deleteFlowMutation = useMutation({
        mutationFn: (id: string) => flowService.deleteFlow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flows'] });
        },
    });

    return {
        flows: fetchFlows.data || [],
        activeFlow: fetchFlows.data?.[0] || null,
        isLoading: fetchFlows.isLoading,
        error: fetchFlows.error,
        saveFlow: saveFlowMutation.mutateAsync,
        deleteFlow: deleteFlowMutation.mutateAsync,
    };
}
