import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['reports', 'dashboard-summary'],
    queryFn: () => reportService.getDashboardSummary(),
    staleTime: 20000,
    refetchInterval: 30000,
  });
};

export const useRideReports = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['reports', 'rides', params],
    queryFn: () => reportService.getRideReports(params),
    staleTime: 30000,
  });
};

export const useTripReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'trips', startDate, endDate],
    queryFn: () => reportService.getRideReports({ startDate, endDate }),
    staleTime: 30000,
  });
};

export const useAttendanceReports = (params?: { date?: string; routeId?: number }) => {
  return useQuery({
    queryKey: ['reports', 'attendance', params],
    queryFn: () => reportService.getAttendanceReports(params),
    staleTime: 30000,
  });
};

export const useAttendanceReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'attendance-range', startDate, endDate],
    queryFn: () => reportService.getAttendanceReports({ date: startDate }),
    staleTime: 30000,
  });
};
