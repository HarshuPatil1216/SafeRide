import { useMutation, useQuery } from '@tanstack/react-query';
import { trackingService } from '../services/trackingService';
import { UpdateLocationRequestDTO } from '../types';

export const useActiveVehiclesTracking = () => {
  return useQuery({
    queryKey: ['tracking', 'active-vehicles'],
    queryFn: () => trackingService.getAllActiveVehicles(),
    refetchInterval: 6000, // 6-second live GPS polling
    staleTime: 4000,
  });
};

export const useVehicleTracking = (vehicleId: number | string) => {
  return useQuery({
    queryKey: ['tracking', 'vehicle', vehicleId],
    queryFn: () => trackingService.getVehicleLocation(vehicleId),
    enabled: !!vehicleId,
    refetchInterval: 5000,
  });
};

export const useRideTracking = (rideId: number | string) => {
  return useQuery({
    queryKey: ['tracking', 'ride', rideId],
    queryFn: () => trackingService.getRideTracking(rideId),
    enabled: !!rideId,
    refetchInterval: 5000,
  });
};

export const useSendDriverLocation = () => {
  return useMutation({
    mutationFn: (dto: UpdateLocationRequestDTO | any) => trackingService.sendDriverLocation(dto),
  });
};

export const useUpdateLocation = useSendDriverLocation;
