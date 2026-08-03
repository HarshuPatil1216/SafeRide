import { useQuery } from '@tanstack/react-query';

import {
    getParents,
    type GetParentsParams,
    type PageResponse,
    type Parent,
} from '../services/parentService';

function useParents(
    params: GetParentsParams
) {
    return useQuery<PageResponse<Parent>, Error>({
        queryKey: [
            'parents',
            params.page,
            params.size,
            params.sortBy,
            params.sortDir,
            params.query,
        ],

        queryFn: () =>
            getParents(params),

        placeholderData: (previousData) =>
            previousData,
    });
}

export default useParents;