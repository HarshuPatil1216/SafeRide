import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createVehicle,
    type CreateVehicleRequest,
} from '../services/vehicleService';

function useCreateVehicle() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (
            payload: CreateVehicleRequest
        ) => createVehicle(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['vehicles'],
            });
        },

    });

}

export default useCreateVehicle;