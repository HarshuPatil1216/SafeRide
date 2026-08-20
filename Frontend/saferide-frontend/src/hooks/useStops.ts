import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stopService } from '../services/stopService';
import { StopRequestDTO } from '../types';

export const useStops = (params?: { search?: string; routeId?: number | string }) => {
  return useQuery({
    queryKey: ['stops', params],
    queryFn: () => stopService.getAll(params),
    staleTime: 30000,
  });
};

export const useStop = (id: number | string) => {
  return useQuery({
    queryKey: ['stop', id],
    queryFn: () => stopService.getById(id),
    enabled: !!id,
  });
};

export const useRouteStops = (routeId: number | string) => {
  return useQuery({
    queryKey: ['stops', 'route', routeId],
    queryFn: () => stopService.getByRoute(routeId),
    enabled: !!routeId,
    staleTime: 30000,
  });
};

export const useCreateStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: StopRequestDTO) => stopService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};

export const useUpdateStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: StopRequestDTO }) =>
      stopService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};

export const useDeleteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => stopService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};
