import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upgradeUser, downgradeUser } from '@/services/userService';

export const userKeys = {
  all: ['users'] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

export function useUpgradeUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upgradeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

export function useDowngradeUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: downgradeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}