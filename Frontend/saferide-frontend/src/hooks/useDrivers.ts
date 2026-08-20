import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../services/driverService';
import { DriverRequestDTO } from '../types';

export const useDrivers = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => driverService.getAll(params),
    staleTime: 30000,
  });
};

export const useDriver = (id: number | string) => {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getById(id),
    enabled: !!id,
  });
};

export const useAvailableDrivers = () => {
  return useQuery({
    queryKey: ['drivers', 'available'],
    queryFn: () => driverService.getAvailable(),
    staleTime: 30000,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: DriverRequestDTO) => driverService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: DriverRequestDTO }) =>
      driverService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver', variables.id] });
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => driverService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
