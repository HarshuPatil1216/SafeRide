import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import useDeleteVehicle from '../../hooks/useDeleteVehicle';

import type {
    Vehicle,
} from '../../services/vehicleService';

type DeleteVehicleDialogProps = {
    open: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
};

function DeleteVehicleDialog({
                                 open,
                                 vehicle,
                                 onClose,
                             }: DeleteVehicleDialogProps) {

    const deleteVehicleMutation =
        useDeleteVehicle();

    const handleDelete = () => {

        if (!vehicle) {
            return;
        }

        deleteVehicleMutation.mutate(
            vehicle.id,
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
            maxWidth="sm"
        >

            <DialogTitle>
                Delete Vehicle
            </DialogTitle>

            <DialogContent>

                {deleteVehicleMutation.isError && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                        }}
                    >
                        {deleteVehicleMutation.error.message ||
                            'Failed to delete vehicle.'}
                    </Alert>

                )}

                <Typography>
                    Are you sure you want to delete vehicle
                    <strong>
                        {' '}
                        {vehicle?.vehicleNumber}
                    </strong>
                    ?
                </Typography>

            </DialogContent>
            <DialogActions>

                <Button
                    color="inherit"
                    onClick={onClose}
                    disabled={
                        deleteVehicleMutation.isPending
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={
                        deleteVehicleMutation.isPending
                    }
                >
                    {deleteVehicleMutation.isPending
                        ? 'Deleting...'
                        : 'Delete Vehicle'}
                </Button>

            </DialogActions>

        </Dialog>

    );
}

export default DeleteVehicleDialog;