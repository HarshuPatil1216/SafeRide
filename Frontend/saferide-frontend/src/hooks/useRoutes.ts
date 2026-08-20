import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routeService } from '../services/routeService';
import { RouteRequestDTO } from '../types';

export const useRoutes = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => routeService.getAll(params),
    staleTime: 30000,
  });
};

export const useRoute = (id: number | string) => {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => routeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RouteRequestDTO) => routeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: RouteRequestDTO }) =>
      routeService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', variables.id] });
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => routeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
};

export const useAssignRouteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, driverId }: { routeId: number | string; driverId: number | string }) =>
      routeService.assignDriver(routeId, driverId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
    },
  });
};

export const useAssignRouteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, vehicleId }: { routeId: number | string; vehicleId: number | string }) =>
      routeService.assignVehicle(routeId, vehicleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', variables.routeId] });
    },
  });
};
