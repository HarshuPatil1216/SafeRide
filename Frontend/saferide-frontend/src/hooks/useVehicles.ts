import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { VehicleRequestDTO } from '../types';

export const useVehicles = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getAll(params),
    staleTime: 30000,
  });
};

export const useVehicle = (id: number | string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
};

export const useAvailableVehicles = () => {
  return useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: () => vehicleService.getAvailable(),
    staleTime: 30000,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: VehicleRequestDTO) => vehicleService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: VehicleRequestDTO }) =>
      vehicleService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
