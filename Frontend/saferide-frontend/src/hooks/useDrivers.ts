import { useQuery } from '@tanstack/react-query';

import {
    getDrivers,
    type GetDriversParams,
} from '../services/driverService';

function useDrivers(
    params: GetDriversParams
) {
    return useQuery({
        queryKey: [
            'drivers',
            params,
        ],
        queryFn: () =>
            getDrivers(params),
    });
}

export default useDrivers;