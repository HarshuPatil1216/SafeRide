import { useQuery } from '@tanstack/react-query';

import {
    getStudents,
    type GetStudentsParams,
    type PageResponse,
    type Student,
} from '../services/studentService';

function useStudents(params: GetStudentsParams) {
    return useQuery<PageResponse<Student>, Error>({
        queryKey: ['students', params],
        queryFn: () => getStudents(params),
    });
}

export default useStudents;