import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import useLogin from '../../hooks/useLogin';

function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        loginMutation.mutate(
            {
                email,
                password,
            },
            {
                onSuccess: (response) => {
                    localStorage.setItem('token', response.token);
                    navigate('/dashboard');
                },
            }
        );
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                p: 2,
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    width: 420,
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            textAlign: 'center',
                        }}
                    >
                        SafeRide Login
                    </Typography>

                    {loginMutation.isError && (
                        <Alert severity="error">
                            Invalid email or password
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <Stack spacing={2}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending
                                    ? 'Signing In...'
                                    : 'Login'}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default LoginPage;