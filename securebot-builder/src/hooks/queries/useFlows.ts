import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flowService } from '../../services/EntityServices';
import type { Flow } from '../../lib/validations/schemas';

export function useFlows(botId: string | null) {
    const queryClient = useQueryClient();

    const fetchFlow = useQuery({
        queryKey: ['flow', botId],
        queryFn: () => botId ? flowService.getByBotId(botId) : null,
        enabled: !!botId,
    });

    const saveFlowMutation = useMutation({
        mutationFn: (flow: Partial<Flow>) => flowService.saveFlow(flow),
        onSuccess: (data: Flow) => {
            queryClient.setQueryData(['flow', botId], data);
            queryClient.invalidateQueries({ queryKey: ['flow', botId] });
        },
    });

    return {
        flow: fetchFlow.data || null,
        isLoading: fetchFlow.isLoading,
        error: fetchFlow.error,
        saveFlow: saveFlowMutation.mutateAsync,
    };
}
