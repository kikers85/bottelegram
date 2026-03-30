import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseService } from '../../services/SupabaseService';
import type { Tag } from '../../lib/validations/schemas';

const tagService = new SupabaseService('tags');

export function useTags(botId: string | null) {
    const queryClient = useQueryClient();

    const fetchTags = useQuery({
        queryKey: ['tags', botId],
        queryFn: () => botId ? tagService.getAll<Tag>((q) => q.eq('bot_id', botId)) : [],
        enabled: !!botId,
    });

    const createTagMutation = useMutation({
        mutationFn: (newTag: Partial<Tag>) => tagService.create<Tag>(newTag),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags', botId] }),
    });

    const updateTagMutation = useMutation({
        mutationFn: ({ id, tag }: { id: string, tag: Partial<Tag> }) => tagService.update<Tag>(id, tag),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags', botId] }),
    });

    const deleteTagMutation = useMutation({
        mutationFn: (id: string) => tagService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags', botId] });
        },
    });

    return {
        tags: fetchTags.data || [],
        isLoading: fetchTags.isLoading,
        createTag: createTagMutation.mutateAsync,
        updateTag: updateTagMutation.mutateAsync,
        deleteTag: deleteTagMutation.mutateAsync,
    };
}
