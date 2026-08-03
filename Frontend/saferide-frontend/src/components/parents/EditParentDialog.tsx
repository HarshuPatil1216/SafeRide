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

import useUpdateParent from '../../hooks/useUpdateParent';

import type { Parent } from '../../services/parentService';

type EditParentDialogProps = {
    open: boolean;
    parent: Parent | null;
    onClose: () => void;
};

type ParentFormState = {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
};

const initialFormState: ParentFormState = {
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
};

function EditParentDialog({
                              open,
                              parent,
                              onClose,
                          }: EditParentDialogProps) {

    const updateParentMutation =
        useUpdateParent();

    const [form, setForm] =
        useState<ParentFormState>(
            initialFormState
        );

    const [validationError, setValidationError] =
        useState('');

    useEffect(() => {

        if (!open || !parent) {
            return;
        }

        setForm({
            fullName: parent.fullName,
            phoneNumber: parent.phoneNumber,
            email: parent.email,
            address: parent.address,
        });

        setValidationError('');

    }, [open, parent]);

    const handleFieldChange = (
        field: keyof ParentFormState,
        value: string
    ) => {

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setValidationError('');
    };
    const handleSubmit = () => {

        if (!parent) {
            return;
        }

        if (
            !form.fullName.trim() ||
            !form.phoneNumber.trim() ||
            !form.email.trim() ||
            !form.address.trim()
        ) {
            setValidationError(
                'Please fill all required fields.'
            );
            return;
        }

        updateParentMutation.mutate(
            {
                id: parent.id,
                payload: {
                    fullName: form.fullName.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    email: form.email.trim(),
                    address: form.address.trim(),
                    active: parent.active,
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
                Edit Parent
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

                {updateParentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {updateParentMutation.error.message ||
                            'Failed to update parent.'}
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

                    <Grid size={{ xs: 12 }}>
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
                        updateParentMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        updateParentMutation.isPending
                    }
                >
                    {updateParentMutation.isPending
                        ? 'Updating...'
                        : 'Update Parent'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default EditParentDialog;