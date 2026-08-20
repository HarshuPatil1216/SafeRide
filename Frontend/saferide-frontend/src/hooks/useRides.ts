import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rideService } from '../services/rideService';
import { EndRideRequestDTO, StartRideRequestDTO, UpdateAttendanceRequestDTO, UpdateLocationRequestDTO } from '../types';

export const useRides = (params?: { status?: string; date?: string; routeId?: number }) => {
  return useQuery({
    queryKey: ['rides', params],
    queryFn: () => rideService.getAll(params),
    staleTime: 10000,
  });
};

export const useTodayRides = () => {
  return useQuery({
    queryKey: ['rides', 'today'],
    queryFn: () => rideService.getToday(),
    staleTime: 10000,
    refetchInterval: 15000, // Poll active trips every 15s
  });
};

export const useActiveRides = () => {
  return useQuery({
    queryKey: ['rides', 'active'],
    queryFn: () => rideService.getActive(),
    staleTime: 5000,
    refetchInterval: 10000, // Poll active tracking
  });
};

export const useRide = (id: number | string) => {
  return useQuery({
    queryKey: ['ride', id],
    queryFn: () => rideService.getById(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
};

export const useDriverTodayRides = (driverId: number | string) => {
  return useQuery({
    queryKey: ['rides', 'driver', driverId],
    queryFn: () => rideService.getByDriverToday(driverId),
    enabled: !!driverId,
    refetchInterval: 10000,
  });
};

export const useCurrentChildRide = (studentId: number | string) => {
  return useQuery({
    queryKey: ['rides', 'child', studentId],
    queryFn: () => rideService.getCurrentChildRide(studentId),
    enabled: !!studentId,
    refetchInterval: 8000, // Frequent polling for child's bus
  });
};

export const useStartRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: StartRideRequestDTO | number) => rideService.startRide(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      if (data?.id) queryClient.invalidateQueries({ queryKey: ['ride', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tracking'] });
    },
  });
};

export const useEndRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EndRideRequestDTO | number) => rideService.endRide(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      if (data?.id) queryClient.invalidateQueries({ queryKey: ['ride', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tracking'] });
    },
  });
};

export const useCompleteRide = useEndRide;

export const useCancelRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      rideService.cancelRide(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['ride', variables.id] });
    },
  });
};

export const useUpdateRideLocation = () => {
  return useMutation({
    mutationFn: (dto: UpdateLocationRequestDTO) => rideService.updateLocation(dto),
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateAttendanceRequestDTO) => rideService.updateAttendance(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ride', variables.rideId] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
};

export const useRecordAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      rideId,
      dto,
    }: {
      rideId: number | string;
      dto: { studentId: number | string; status: any; recordedAt?: string; stopId?: number };
    }) =>
      rideService.updateAttendance({
        rideId: Number(rideId),
        studentId: Number(dto.studentId),
        status: dto.status,
        stopId: dto.stopId,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ride', variables.rideId] });
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });
};
