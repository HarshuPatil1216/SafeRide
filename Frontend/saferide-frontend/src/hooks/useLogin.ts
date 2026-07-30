import { useMutation } from '@tanstack/react-query';

import {
    loginUser,
    type LoginRequest,
    type LoginResponse,
} from '../services/authService';

function useLogin() {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
    });
}

export default useLogin;