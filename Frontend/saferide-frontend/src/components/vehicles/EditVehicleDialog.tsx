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

import useUpdateVehicle from '../../hooks/useUpdateVehicle';

import type {
    Vehicle,
} from '../../services/vehicleService';

type EditVehicleDialogProps = {
    open: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
};

type VehicleFormState = {
    vehicleNumber: string;
    vehicleType: 'BUS' | 'VAN' | 'MINI_BUS';
    capacity: string;
    model: string;
    manufacturer: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
};

const initialFormState: VehicleFormState = {
    vehicleNumber: '',
    vehicleType: 'BUS',
    capacity: '',
    model: '',
    manufacturer: '',
    status: 'ACTIVE',
};

function EditVehicleDialog({
                               open,
                               vehicle,
                               onClose,
                           }: EditVehicleDialogProps) {

    const updateVehicleMutation =
        useUpdateVehicle();

    const [form, setForm] =
        useState<VehicleFormState>(
            initialFormState
        );

    const [validationError, setValidationError] =
        useState('');

    useEffect(() => {

        if (!open) {
            return;
        }

        if (vehicle) {

            setForm({
                vehicleNumber:
                vehicle.vehicleNumber,

                vehicleType:
                vehicle.vehicleType,

                capacity:
                    String(vehicle.capacity),

                model:
                vehicle.model,

                manufacturer:
                vehicle.manufacturer,

                status:
                vehicle.status,
            });

            setValidationError('');
        }

    }, [open, vehicle]);
    const handleFieldChange = (
        field: keyof VehicleFormState,
        value: string
    ) => {

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setValidationError('');
    };

    const handleSubmit = () => {

        if (!vehicle) {
            return;
        }

        if (
            !form.vehicleNumber.trim() ||
            !form.capacity.trim()
        ) {

            setValidationError(
                'Please fill all required fields.'
            );

            return;
        }

        updateVehicleMutation.mutate(
            {
                id: vehicle.id,

                payload: {
                    vehicleNumber:
                        form.vehicleNumber.trim(),

                    vehicleType:
                    form.vehicleType,

                    capacity:
                        Number(form.capacity),

                    model:
                        form.model.trim(),

                    manufacturer:
                        form.manufacturer.trim(),

                    status:
                    form.status,
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
                Edit Vehicle
            </DialogTitle>

            <DialogContent>

                {validationError && (

                    <Alert
                        severity="warning"
                        sx={{
                            mt: 2,
                            mb: 2,
                        }}
                    >
                        {validationError}
                    </Alert>

                )}

                {updateVehicleMutation.isError && (

                    <Alert
                        severity="error"
                        sx={{
                            mt: 2,
                            mb: 2,
                        }}
                    >
                        {updateVehicleMutation.error.message ||
                            'Failed to update vehicle.'
                        }
                    </Alert>

                )}

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 1,
                    }}
                >
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Vehicle Number"
                            value={form.vehicleNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    'vehicleNumber',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            required
                            label="Vehicle Type"
                            value={form.vehicleType}
                            onChange={(e) =>
                                handleFieldChange(
                                    'vehicleType',
                                    e.target.value
                                )
                            }
                        >
                            <MenuItem value="BUS">
                                BUS
                            </MenuItem>

                            <MenuItem value="VAN">
                                VAN
                            </MenuItem>

                            <MenuItem value="MINI_BUS">
                                MINI BUS
                            </MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Capacity"
                            value={form.capacity}
                            onChange={(e) =>
                                handleFieldChange(
                                    'capacity',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Model"
                            value={form.model}
                            onChange={(e) =>
                                handleFieldChange(
                                    'model',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Manufacturer"
                            value={form.manufacturer}
                            onChange={(e) =>
                                handleFieldChange(
                                    'manufacturer',
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
                                    e.target.value
                                )
                            }
                        >
                            <MenuItem value="ACTIVE">
                                ACTIVE
                            </MenuItem>

                            <MenuItem value="INACTIVE">
                                INACTIVE
                            </MenuItem>

                            <MenuItem value="MAINTENANCE">
                                MAINTENANCE
                            </MenuItem>
                        </TextField>
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    color="inherit"
                    onClick={onClose}
                    disabled={updateVehicleMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={updateVehicleMutation.isPending}
                >
                    {updateVehicleMutation.isPending
                        ? 'Updating...'
                        : 'Update Vehicle'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default EditVehicleDialog;