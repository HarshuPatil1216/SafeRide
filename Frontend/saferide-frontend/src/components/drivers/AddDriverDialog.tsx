import { useState } from 'react';

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
} from '@mui/material';

import useCreateDriver from '../../hooks/useCreateDriver';

type AddDriverDialogProps = {
    open: boolean;
    onClose: () => void;
};

type DriverFormState = {
    fullName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    experience: string;
    vehicleId: string;
    address: string;
    status: 'ACTIVE' | 'INACTIVE';
};

const initialFormState: DriverFormState = {
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    experience: '',
    vehicleId: '',
    address: '',
    status: 'ACTIVE',
};

function AddDriverDialog({
                             open,
                             onClose,
                         }: AddDriverDialogProps) {

    const createDriverMutation = useCreateDriver();

    const [form, setForm] =
        useState<DriverFormState>(initialFormState);

    const [validationError, setValidationError] =
        useState('');

    const handleFieldChange = (
        field: keyof DriverFormState,
        value: string
    ) => {

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setValidationError('');
    };

    const handleSubmit = () => {

        if (
            !form.fullName.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.licenseNumber.trim() ||
            !form.experience.trim() ||
            !form.vehicleId.trim() ||
            !form.address.trim()
        ) {
            setValidationError(
                'Please fill all required fields.'
            );
            return;
        }

        createDriverMutation.mutate(
            {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                licenseNumber: form.licenseNumber.trim(),
                experience: Number(form.experience),
                vehicleId: Number(form.vehicleId),
                address: form.address.trim(),
                status: form.status,
                active: true,
            },
            {
                onSuccess: () => {
                    setForm(initialFormState);
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Add Driver
            </DialogTitle>

            <DialogContent>

                {validationError && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {validationError}
                    </Alert>
                )}

                {createDriverMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Failed to create driver.
                    </Alert>
                )}

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Full Name"
                            value={form.fullName}
                            onChange={(e) =>
                                handleFieldChange(
                                    'fullName',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="email"
                            label="Email"
                            value={form.email}
                            onChange={(e) =>
                                handleFieldChange(
                                    'email',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                handleFieldChange(
                                    'phone',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="License Number"
                            value={form.licenseNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    'licenseNumber',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Experience (Years)"
                            value={form.experience}
                            onChange={(e) =>
                                handleFieldChange(
                                    'experience',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Vehicle ID"
                            value={form.vehicleId}
                            onChange={(e) =>
                                handleFieldChange(
                                    'vehicleId',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={form.status}
                            onChange={(e) =>
                                handleFieldChange(
                                    'status',
                                    e.target.value as 'ACTIVE' | 'INACTIVE'
                                )
                            }
                        >
                            <MenuItem value="ACTIVE">
                                ACTIVE
                            </MenuItem>

                            <MenuItem value="INACTIVE">
                                INACTIVE
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={3}
                            label="Address"
                            value={form.address}
                            onChange={(e) =>
                                handleFieldChange(
                                    'address',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={createDriverMutation.isPending}
                >
                    {createDriverMutation.isPending
                        ? 'Creating...'
                        : 'Create Driver'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default AddDriverDialog;