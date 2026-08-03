import { useState } from 'react';

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

import useCreateParent from '../../hooks/useCreateParent';

type AddParentDialogProps = {
    open: boolean;
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

function AddParentDialog({
                             open,
                             onClose,
                         }: AddParentDialogProps) {

    const createParentMutation =
        useCreateParent();

    const [form, setForm] =
        useState<ParentFormState>(
            initialFormState
        );

    const [validationError, setValidationError] =
        useState('');

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

        createParentMutation.mutate(
            {
                fullName: form.fullName.trim(),
                phoneNumber: form.phoneNumber.trim(),
                email: form.email.trim(),
                address: form.address.trim(),
                active: true,
            },
            {
                onSuccess: () => {

                    setForm(initialFormState);

                    setValidationError('');

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
                Add Parent
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

                {createParentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {createParentMutation.error.message ||
                            'Failed to create parent.'}
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
                        createParentMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        createParentMutation.isPending
                    }
                >
                    {createParentMutation.isPending
                        ? 'Saving...'
                        : 'Add Parent'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default AddParentDialog;