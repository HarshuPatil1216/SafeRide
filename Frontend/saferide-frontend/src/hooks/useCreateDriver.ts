import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createDriver,
    type CreateDriverRequest,
} from '../services/driverService';

function useCreateDriver() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (
            payload: CreateDriverRequest
        ) => createDriver(payload),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['drivers'],
            });

        },
    });

}

export default useCreateDriver;