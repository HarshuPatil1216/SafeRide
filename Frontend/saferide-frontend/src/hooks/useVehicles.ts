import { useQuery } from '@tanstack/react-query';

import {
    getVehicles,
    type GetVehiclesParams,
} from '../services/vehicleService';

function useVehicles(
    params: GetVehiclesParams
) {

    return useQuery({

        queryKey: [
            'vehicles',
            params,
        ],

        queryFn: () =>
            getVehicles(params),

    });

}

export default useVehicles;