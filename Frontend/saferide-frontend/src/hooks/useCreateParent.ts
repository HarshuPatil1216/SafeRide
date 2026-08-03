import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createParent,
    type CreateParentRequest,
    type Parent,
} from '../services/parentService';

function useCreateParent() {

    const queryClient = useQueryClient();

    return useMutation<Parent, Error, CreateParentRequest>({

        mutationFn: (payload) =>
            createParent(payload),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['parents'],
            });

        },

    });

}

export default useCreateParent;