import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateDriver,
    type UpdateDriverRequest,
} from '../services/driverService';

function useUpdateDriver() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: number;
            payload: UpdateDriverRequest;
        }) =>
            updateDriver(
                id,
                payload
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['drivers'],
            });

        },
    });

}

export default useUpdateDriver;