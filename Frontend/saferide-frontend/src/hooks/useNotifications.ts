import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { NotificationRequestDTO } from '../types';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationService.getUnread(),
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: NotificationRequestDTO) => notificationService.broadcast(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
