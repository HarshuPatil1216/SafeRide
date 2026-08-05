import { useEffect, useState } from 'react';

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

import useUpdateDriver from '../../hooks/useUpdateDriver';

import type { Driver } from '../../services/driverService';

type EditDriverDialogProps = {
    open: boolean;
    driver: Driver | null;
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

function EditDriverDialog({
                              open,
                              driver,
                              onClose,
                          }: EditDriverDialogProps) {

    const updateDriverMutation =
        useUpdateDriver();

    const [form, setForm] =
        useState<DriverFormState>(
            initialFormState
        );

    const [validationError, setValidationError] =
        useState('');

    useEffect(() => {

        if (!open || !driver) {
            return;
        }

        setForm({
            fullName: driver.fullName,
            email: driver.email,
            phone: driver.phone,
            licenseNumber: driver.licenseNumber,
            experience: String(driver.experience),
            vehicleId: driver.vehicleId
                ? String(driver.vehicleId)
                : '',
            address: driver.address,
            status: driver.status,
        });

        setValidationError('');

    }, [open, driver]);

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

        if (!driver) {
            return;
        }

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

        updateDriverMutation.mutate(
            {
                id: driver.id,
                payload: {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    licenseNumber: form.licenseNumber.trim(),
                    experience: Number(form.experience),
                    vehicleId: Number(form.vehicleId),
                    address: form.address.trim(),
                    status: form.status,
                    active: driver.active,
                },
            },
            {
                onSuccess: () => {
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
                Edit Driver
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

                {updateDriverMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Failed to update driver.
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
                    color="inherit"
                    onClick={onClose}
                    disabled={updateDriverMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={updateDriverMutation.isPending}
                >
                    {updateDriverMutation.isPending
                        ? 'Updating...'
                        : 'Update Driver'}
                </Button>

            </DialogActions>

        </Dialog>
    );

}

export default EditDriverDialog;