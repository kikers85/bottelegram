import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botService } from '../../services/EntityServices';
import type { Bot } from '../../lib/validations/schemas';

export function useBots() {
    const queryClient = useQueryClient();

    const fetchBots = useQuery({
        queryKey: ['bots'],
        queryFn: () => botService.getAll<Bot>(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const createBotMutation = useMutation({
        mutationFn: (newBot: Partial<Bot>) => botService.createBot(newBot),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bots'] });
        },
    });

    const updateBotMutation = useMutation({
        mutationFn: ({ id, bot }: { id: string, bot: Partial<Bot> }) => botService.updateBot(id, bot),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bots'] });
        },
    });

    const deleteBotMutation = useMutation({
        mutationFn: (id: string) => botService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bots'] });
        },
    });

    return {
        bots: fetchBots.data || [],
        isLoading: fetchBots.isLoading,
        error: fetchBots.error,
        createBot: createBotMutation.mutateAsync,
        updateBot: updateBotMutation.mutateAsync,
        deleteBot: deleteBotMutation.mutateAsync,
    };
}
