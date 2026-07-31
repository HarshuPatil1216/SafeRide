import axios from 'axios';

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    message: string;
};

const authApi = axios.create({
    baseURL: 'http://localhost:8081/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function loginUser(
    credentials: LoginRequest
): Promise<LoginResponse> {
    const response   = await authApi.post<LoginResponse>(
        '/login',
        credentials
    );

    return response.data;
}