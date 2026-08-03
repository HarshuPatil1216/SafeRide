import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    deleteStudent,
} from '../services/studentService';

function useDeleteStudent() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: number) =>
            deleteStudent(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students'],
            });
        },
    });
}

export default useDeleteStudent;