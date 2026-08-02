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

import useUpdateStudent from '../../hooks/useUpdateStudent';
import type { Student } from '../../services/studentService';

type EditStudentDialogProps = {
    open: boolean;
    student: Student | null;
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

function EditStudentDialog({
                               open,
                               student,
                               onClose,
                           }: EditStudentDialogProps) {

    const updateStudentMutation = useUpdateStudent();

    const [form, setForm] =
        useState<StudentFormState>(initialFormState);

    const [validationError, setValidationError] =
        useState('');
    useEffect(() => {
        if (!open) {
            return;
        }

        if (student) {
            setForm({
                fullName: student.fullName,
                rollNumber: student.rollNumber,
                standard: student.standard,
                division: student.division,
                parentId: String(student.parentId),
                routeId: student.routeId ? String(student.routeId) : '',
                stopId: student.stopId ? String(student.stopId) : '',
                address: student.address,
            });

            setValidationError('');
        }
    }, [open, student]);

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
    const handleSubmit = () => {
        if (!student) {
            return;
        }

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

        updateStudentMutation.mutate(
            {
                id: student.id,
                payload: {
                    fullName: form.fullName.trim(),
                    rollNumber: form.rollNumber.trim(),
                    standard: form.standard.trim(),
                    division: form.division.trim(),
                    parentId,
                    routeId,
                    stopId,
                    address: form.address.trim(),
                    active: student.active,
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
            <DialogTitle>Edit Student</DialogTitle>

            <DialogContent>

                {validationError && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {validationError}
                    </Alert>
                )}

                {updateStudentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {updateStudentMutation.error.message ||
                            'Failed to update student.'}
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
                    onClick={onClose}
                    disabled={
                        updateStudentMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        updateStudentMutation.isPending
                    }
                >
                    {updateStudentMutation.isPending
                        ? 'Updating...'
                        : 'Update Student'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditStudentDialog;