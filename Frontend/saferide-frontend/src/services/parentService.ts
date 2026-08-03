import axios from 'axios';

export type Parent = {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
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

export type GetParentsParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    query?: string;
};

export type CreateParentRequest = {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    active?: boolean;
};

export type UpdateParentRequest = CreateParentRequest;

const parentApi = axios.create({
    baseURL: 'http://localhost:8081/api/parents',
});

parentApi.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function getParents(
    params: GetParentsParams
): Promise<PageResponse<Parent>> {

    const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'asc',
        query = '',
    } = params;

    const endpoint = query.trim()
        ? '/search'
        : '';

    const response =
        await parentApi.get<PageResponse<Parent>>(
            endpoint,
            {
                params: {
                    ...(query.trim()
                        ? { query: query.trim() }
                        : {}),
                    page,
                    size,
                    sortBy,
                    sortDir,
                },
            }
        );

    return response.data;
}

export async function getParentById(
    id: number
): Promise<Parent> {

    const response =
        await parentApi.get<Parent>(
            `/${id}`
        );

    return response.data;
}

export async function createParent(
    payload: CreateParentRequest
): Promise<Parent> {

    const response =
        await parentApi.post<Parent>(
            '',
            payload
        );

    return response.data;
}

export async function updateParent(
    id: number,
    payload: UpdateParentRequest
): Promise<Parent> {

    const response =
        await parentApi.put<Parent>(
            `/${id}`,
            payload
        );

    return response.data;
}

export async function deleteParent(
    id: number
): Promise<void> {

    await parentApi.delete(`/${id}`);
}