import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parentService } from '../services/parentService';
import { ParentRequestDTO } from '../types';

export const useParents = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['parents', params],
    queryFn: () => parentService.getAll(params),
    staleTime: 30000,
  });
};

export const useParent = (id: number | string) => {
  return useQuery({
    queryKey: ['parent', id],
    queryFn: () => parentService.getById(id),
    enabled: !!id,
  });
};

export const useMyChildren = () => {
  return useQuery({
    queryKey: ['my-children'],
    queryFn: () => parentService.getMyChildren(),
    staleTime: 15000,
  });
};

export const useParentChildren = (parentId?: number | string) => {
  return useQuery({
    queryKey: ['parent-children', parentId],
    queryFn: () => parentService.getMyChildren(),
    staleTime: 15000,
  });
};

export const useCreateParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ParentRequestDTO) => parentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useUpdateParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: ParentRequestDTO }) =>
      parentService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['parent', variables.id] });
    },
  });
};

export const useDeleteParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => parentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
