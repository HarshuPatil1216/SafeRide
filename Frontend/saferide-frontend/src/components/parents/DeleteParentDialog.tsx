import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import useDeleteParent from '../../hooks/useDeleteParent';

import type { Parent } from '../../services/parentService';

type DeleteParentDialogProps = {
    open: boolean;
    parent: Parent | null;
    onClose: () => void;
};

function DeleteParentDialog({
                                open,
                                parent,
                                onClose,
                            }: DeleteParentDialogProps) {

    const deleteParentMutation =
        useDeleteParent();

    const handleDelete = () => {

        if (!parent) {
            return;
        }

        deleteParentMutation.mutate(
            parent.id,
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
                Delete Parent
            </DialogTitle>

            <DialogContent>

                {deleteParentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {deleteParentMutation.error?.message ||
                            'Failed to delete parent.'}
                    </Alert>
                )}

                <Typography>
                    Are you sure you want to delete
                    <strong>
                        {' '}
                        {parent?.fullName}
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
                        deleteParentMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={
                        deleteParentMutation.isPending
                    }
                >
                    {deleteParentMutation.isPending
                        ? 'Deleting...'
                        : 'Delete'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default DeleteParentDialog;