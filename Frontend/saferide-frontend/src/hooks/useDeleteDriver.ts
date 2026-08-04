import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    deleteDriver,
} from '../services/driverService';

function useDeleteDriver() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (id: number) =>
            deleteDriver(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['drivers'],
            });

        },
    });

}

export default useDeleteDriver;