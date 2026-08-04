import { useEffect, useState } from 'react';

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from '@mui/material';

import useUpdateDriver from '../../hooks/useUpdateDriver';

import type {
    Driver,
} from '../../services/driverService';

type EditDriverDialogProps = {
    open: boolean;
    driver: Driver | null;
    onClose: () => void;
};

type DriverFormState = {
    fullName: string;
    phoneNumber: string;
    licenseNumber: string;
    vehicleId: string;
    address: string;
};

const initialFormState: DriverFormState = {
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleId: '',
    address: '',
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

        if (!open) {
            return;
        }

        if (driver) {

            setForm({
                fullName: driver.fullName,
                phoneNumber: driver.phoneNumber,
                licenseNumber: driver.licenseNumber,
                vehicleId: driver.vehicleId
                    ? String(driver.vehicleId)
                    : '',
                address: driver.address,
            });

            setValidationError('');
        }

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
            !form.phoneNumber.trim() ||
            !form.licenseNumber.trim() ||
            !form.address.trim()
        ) {
            setValidationError(
                'Please fill all required fields.'
            );
            return;
        }

        const vehicleId =
            form.vehicleId.trim()
                ? Number(form.vehicleId)
                : null;

        updateDriverMutation.mutate(
            {
                id: driver.id,
                payload: {
                    fullName: form.fullName.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    licenseNumber: form.licenseNumber.trim(),
                    vehicleId,
                    address: form.address.trim(),
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
                        {updateDriverMutation.error.message ||
                            'Failed to update driver.'}
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
                            label="Phone Number"
                            value={form.phoneNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    'phoneNumber',
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
                    disabled={
                        updateDriverMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        updateDriverMutation.isPending
                    }
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