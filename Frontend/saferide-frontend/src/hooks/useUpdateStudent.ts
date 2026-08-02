import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateStudent,
    type CreateStudentRequest,
    type Student,
} from '../services/studentService';

type UpdateStudentRequest = {
    id: number;
    payload: CreateStudentRequest;
};

function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation<Student, Error, UpdateStudentRequest>({
        mutationFn: ({ id, payload }) =>
            updateStudent(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students'],
            });
        },
    });
}

export default useUpdateStudent;