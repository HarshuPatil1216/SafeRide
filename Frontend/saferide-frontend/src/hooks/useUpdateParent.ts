import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateParent,
    type CreateParentRequest,
    type Parent,
} from '../services/parentService';

type UpdateParentRequest = {
    id: number;
    payload: CreateParentRequest;
};

function useUpdateParent() {

    const queryClient = useQueryClient();

    return useMutation<
        Parent,
        Error,
        UpdateParentRequest
    >({

        mutationFn: ({ id, payload }) =>
            updateParent(id, payload),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['parents'],
            });

        },

    });

}

export default useUpdateParent;