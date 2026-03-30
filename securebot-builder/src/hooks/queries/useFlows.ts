import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowService } from '../../services/EntityServices';
import type { Flow } from '../../lib/validations/schemas';

export function useFlows(botId: string | null) {
    const queryClient = useQueryClient();

    const fetchFlows = useQuery({
        queryKey: ['flows', botId],
        queryFn: () => botId ? flowService.getFlowsByBotId(botId) : [],
        enabled: !!botId,
    });

    const saveFlowMutation = useMutation({
        mutationFn: (flow: Partial<Flow>) => flowService.saveFlow(flow),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flows', botId] });
        },
    });

    return {
        flows: fetchFlows.data || [],
        activeFlow: fetchFlows.data?.[0] || null,
        isLoading: fetchFlows.isLoading,
        error: fetchFlows.error,
        saveFlow: saveFlowMutation.mutateAsync,
    };
}
