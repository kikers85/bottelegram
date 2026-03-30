import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '../../services/EntityServices';
import type { Agent } from '../../lib/validations/schemas';

export function useAgents() {
    const queryClient = useQueryClient();

    const fetchAgents = useQuery({
        queryKey: ['agents'],
        queryFn: () => agentService.getAll<Agent>(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const createAgentMutation = useMutation({
        mutationFn: (newAgent: Partial<Agent>) => agentService.createAgent(newAgent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
    });

    const updateAgentMutation = useMutation({
        mutationFn: ({ id, agent }: { id: string, agent: Partial<Agent> }) => agentService.update<Agent>(id, agent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
    });

    const deleteAgentMutation = useMutation({
        mutationFn: (id: string) => agentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
    });

    return {
        agents: fetchAgents.data || [],
        isLoading: fetchAgents.isLoading,
        error: fetchAgents.error,
        createAgent: createAgentMutation.mutateAsync,
        updateAgent: updateAgentMutation.mutateAsync,
        deleteAgent: deleteAgentMutation.mutateAsync,
    };
}
