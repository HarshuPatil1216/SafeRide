import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    deleteParent,
} from '../services/parentService';

function useDeleteParent() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: number) =>
            deleteParent(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['parents'],
            });

        },

    });

}

export default useDeleteParent;