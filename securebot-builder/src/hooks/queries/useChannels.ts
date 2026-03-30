import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelService } from '../../services/EntityServices';
import type { Channel } from '../../lib/validations/schemas';

export function useChannels() {
    const fetchChannels = useQuery({
        queryKey: ['channels'],
        queryFn: () => channelService.getAll<Channel>(),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    const queryClient = useQueryClient();

    const updateChannelMutation = useMutation({
        mutationFn: ({ id, channel }: { id: string, channel: Partial<Channel> }) => 
            channelService.updateChannel(id, channel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['channels'] });
        },
    });

    return {
        channels: fetchChannels.data || [],
        isLoading: fetchChannels.isLoading,
        error: fetchChannels.error,
        refetch: fetchChannels.refetch,
        updateChannel: updateChannelMutation.mutateAsync,
    };
}
