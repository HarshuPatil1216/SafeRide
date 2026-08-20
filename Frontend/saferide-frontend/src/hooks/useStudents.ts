import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import { StudentRequestDTO } from '../types';

export const useStudents = (params?: { search?: string; routeId?: number | string; parentId?: number | string; status?: string }) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentService.getAll(params),
    staleTime: 30000,
  });
};

export const useStudent = (id: number | string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: StudentRequestDTO) => studentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: StudentRequestDTO }) =>
      studentService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
