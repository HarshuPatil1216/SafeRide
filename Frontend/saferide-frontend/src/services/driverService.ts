import axios from 'axios';

export type Driver = {
    id: number;
    fullName: string;
    phoneNumber: string;
    licenseNumber: string;

    vehicleId: number | null;
    vehicleNumber: string | null;

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

export type GetDriversParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    query?: string;
};

export type CreateDriverRequest = {
    fullName: string;
    phoneNumber: string;
    licenseNumber: string;
    vehicleId?: number | null;
    address: string;
    active?: boolean;
};

export type UpdateDriverRequest =
    CreateDriverRequest;

const driverApi = axios.create({
    baseURL: 'http://localhost:8081/api/drivers',
});

driverApi.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export async function getDrivers(
    params: GetDriversParams
): Promise<PageResponse<Driver>> {

    const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'asc',
        query = '',
    } = params;

    const endpoint =
        query.trim()
            ? '/search'
            : '';

    const response =
        await driverApi.get<PageResponse<Driver>>(
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

export async function createDriver(
    payload: CreateDriverRequest
): Promise<Driver> {

    const response =
        await driverApi.post<Driver>(
            '',
            payload
        );

    return response.data;
}

export async function getDriverById(
    id: number
): Promise<Driver> {

    const response =
        await driverApi.get<Driver>(
            `/${id}`
        );

    return response.data;
}

export async function updateDriver(
    id: number,
    payload: UpdateDriverRequest
): Promise<Driver> {

    const response =
        await driverApi.put<Driver>(
            `/${id}`,
            payload
        );

    return response.data;
}

export async function deleteDriver(
    id: number
): Promise<void> {

    await driverApi.delete(
        `/${id}`
    );
}