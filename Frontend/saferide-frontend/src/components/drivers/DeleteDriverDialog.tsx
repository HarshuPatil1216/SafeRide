import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import useDeleteDriver from '../../hooks/useDeleteDriver';

import type {
    Driver,
} from '../../services/driverService';

type DeleteDriverDialogProps = {
    open: boolean;
    driver: Driver | null;
    onClose: () => void;
};

function DeleteDriverDialog({
                                open,
                                driver,
                                onClose,
                            }: DeleteDriverDialogProps) {

    const deleteDriverMutation =
        useDeleteDriver();

    const handleDelete = () => {

        if (!driver) {
            return;
        }

        deleteDriverMutation.mutate(
            driver.id,
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
            maxWidth="xs"
        >
            <DialogTitle>
                Delete Driver
            </DialogTitle>

            <DialogContent>

                {deleteDriverMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {deleteDriverMutation.error.message ||
                            'Failed to delete driver.'}
                    </Alert>
                )}

                <Typography>
                    Are you sure you want to delete
                    <strong>
                        {' '}
                        {driver?.fullName}
                    </strong>
                    ?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>

            <DialogActions>

                <Button
                    color="inherit"
                    onClick={onClose}
                    disabled={
                        deleteDriverMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={
                        deleteDriverMutation.isPending
                    }
                >
                    {
                        deleteDriverMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default DeleteDriverDialog;