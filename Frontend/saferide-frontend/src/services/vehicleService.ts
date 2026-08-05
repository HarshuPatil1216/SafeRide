import axios from 'axios';

export type VehicleType =
    | 'BUS'
    | 'VAN'
    | 'MINI_BUS';

export type VehicleStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'MAINTENANCE';

export type Vehicle = {
    id: number;
    vehicleNumber: string;
    vehicleType: VehicleType;
    capacity: number;
    model: string;
    manufacturer: string;
    status: VehicleStatus;
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

export type GetVehiclesParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    query?: string;
};

export type CreateVehicleRequest = {
    vehicleNumber: string;
    vehicleType: VehicleType;
    capacity: number;
    model: string;
    manufacturer: string;
    status: VehicleStatus;
};

export type UpdateVehicleRequest =
    CreateVehicleRequest;

const vehicleApi = axios.create({
    baseURL: 'http://localhost:8081/api/vehicles',
});

vehicleApi.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export async function getVehicles(
    params: GetVehiclesParams
): Promise<PageResponse<Vehicle>> {

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
        await vehicleApi.get<PageResponse<Vehicle>>(
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

export async function createVehicle(
    payload: CreateVehicleRequest
): Promise<Vehicle> {

    const response =
        await vehicleApi.post<Vehicle>(
            '',
            payload
        );

    return response.data;
}

export async function getVehicleById(
    id: number
): Promise<Vehicle> {

    const response =
        await vehicleApi.get<Vehicle>(
            `/${id}`
        );

    return response.data;
}

export async function updateVehicle(
    id: number,
    payload: UpdateVehicleRequest
): Promise<Vehicle> {

    const response =
        await vehicleApi.put<Vehicle>(
            `/${id}`,
            payload
        );

    return response.data;
}

export async function deleteVehicle(
    id: number
): Promise<void> {

    await vehicleApi.delete(
        `/${id}`
    );
}