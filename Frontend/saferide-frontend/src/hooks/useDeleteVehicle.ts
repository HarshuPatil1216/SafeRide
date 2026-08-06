import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteVehicle } from '../services/vehicleService';

function useDeleteVehicle() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (
            id: number
        ) => deleteVehicle(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['vehicles'],
            });

        },

    });

}

export default useDeleteVehicle;