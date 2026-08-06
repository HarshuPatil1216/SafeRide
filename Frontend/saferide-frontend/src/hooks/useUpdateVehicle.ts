import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updateVehicle,
    type UpdateVehicleRequest,
} from '../services/vehicleService';

function useUpdateVehicle() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: number;
            payload: UpdateVehicleRequest;
        }) =>
            updateVehicle(
                id,
                payload
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ['vehicles'],
            });

        },

    });

}

export default useUpdateVehicle;