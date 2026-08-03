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

import useCreateStudent from '../../hooks/useCreateStudent';

type AddStudentDialogProps = {
    open: boolean;
    onClose: () => void;
};

type StudentFormState = {
    fullName: string;
    rollNumber: string;
    standard: string;
    division: string;
    parentId: string;
    routeId: string;
    stopId: string;
    address: string;
};

const initialFormState: StudentFormState = {
    fullName: '',
    rollNumber: '',
    standard: '',
    division: '',
    parentId: '',
    routeId: '',
    stopId: '',
    address: '',
};

function AddStudentDialog({
                              open,
                              onClose,
                          }: AddStudentDialogProps) {

    const createStudentMutation = useCreateStudent();

    const [form, setForm] =
        useState<StudentFormState>(initialFormState);

    const [validationError, setValidationError] =
        useState('');

    useEffect(() => {
        if (!open) {
            setForm(initialFormState);
            setValidationError('');
            createStudentMutation.reset();
        }
    }, [open, createStudentMutation]);

    const handleFieldChange = (
        field: keyof StudentFormState,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setValidationError('');
    };

    const handleClose = () => {
        if (createStudentMutation.isPending) {
            return;
        }

        setForm(initialFormState);
        setValidationError('');
        createStudentMutation.reset();
        onClose();
    };

    const handleSubmit = () => {

        if (
            !form.fullName.trim() ||
            !form.rollNumber.trim() ||
            !form.standard.trim() ||
            !form.division.trim() ||
            !form.parentId.trim() ||
            !form.address.trim()
        ) {
            setValidationError(
                'Please fill all required fields.'
            );
            return;
        }

        const parentId = Number(form.parentId);
        const routeId = form.routeId
            ? Number(form.routeId)
            : null;

        const stopId = form.stopId
            ? Number(form.stopId)
            : null;

        if (
            Number.isNaN(parentId) ||
            parentId <= 0
        ) {
            setValidationError(
                'Enter a valid Parent ID.'
            );
            return;
        }

        createStudentMutation.mutate(
            {
                fullName: form.fullName.trim(),
                rollNumber: form.rollNumber.trim(),
                standard: form.standard.trim(),
                division: form.division.trim(),
                parentId,
                routeId,
                stopId,
                address: form.address.trim(),
                active: true,
            },
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Add Student
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

                {createStudentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {createStudentMutation.error.message ??
                            'Student could not be created.'}
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
                            label="Roll Number"
                            value={form.rollNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    'rollNumber',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Standard"
                            value={form.standard}
                            onChange={(e) =>
                                handleFieldChange(
                                    'standard',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Division"
                            value={form.division}
                            onChange={(e) =>
                                handleFieldChange(
                                    'division',
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
                            label="Parent ID"
                            value={form.parentId}
                            onChange={(e) =>
                                handleFieldChange(
                                    'parentId',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Route ID"
                            value={form.routeId}
                            onChange={(e) =>
                                handleFieldChange(
                                    'routeId',
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Stop ID"
                            value={form.stopId}
                            onChange={(e) =>
                                handleFieldChange(
                                    'stopId',
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
                    onClick={handleClose}
                    disabled={createStudentMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={createStudentMutation.isPending}
                >
                    {createStudentMutation.isPending
                        ? 'Saving...'
                        : 'Save Student'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default AddStudentDialog;