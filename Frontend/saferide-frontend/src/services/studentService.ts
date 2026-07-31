import axios from 'axios';

export type Student = {
    id: number;
    fullName: string;
    rollNumber: string;
    standard: string;
    division: string;

    parentId: number;
    parentName: string;
    parentPhone: string;

    routeId: number | null;
    routeName: string | null;

    stopId: number | null;
    stopName: string | null;

    address: string;
    active: boolean;
    createdAt: string;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
};

export type GetStudentsParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    query?: string;
};

const studentApi = axios.create({
    baseURL: 'http://localhost:8081/api/students',
});

studentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function getStudents(
    params: GetStudentsParams
): Promise<PageResponse<Student>> {
    const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'asc',
        query = '',
    } = params;

    const endpoint = query.trim() ? '/search' : '';

    const response = await studentApi.get<PageResponse<Student>>(endpoint, {
        params: {
            ...(query.trim() ? { query: query.trim() } : {}),
            page,
            size,
            sortBy,
            sortDir,
        },
    });

    return response.data;
}
export type CreateStudentRequest = {
    fullName: string;
    rollNumber: string;
    standard: string;
    division: string;
    parentId: number;
    routeId?: number | null;
    stopId?: number | null;
    address: string;
    active?: boolean;
};

export async function createStudent(
    payload: CreateStudentRequest
): Promise<Student> {
    const response = await studentApi.post<Student>('', payload);
    return response.data;
}