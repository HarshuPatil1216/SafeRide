import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createStudent,
    type CreateStudentRequest,
    type Student,
} from '../services/studentService';

function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation<Student, Error, CreateStudentRequest>({
        mutationFn: createStudent,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students'],
            });
        },
    });
}

export default useCreateStudent;