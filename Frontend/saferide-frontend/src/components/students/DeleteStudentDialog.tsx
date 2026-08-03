import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import useDeleteStudent from '../../hooks/useDeleteStudent';

import type { Student } from '../../services/studentService';

type DeleteStudentDialogProps = {
    open: boolean;
    student: Student | null;
    onClose: () => void;
};

function DeleteStudentDialog({
                                 open,
                                 student,
                                 onClose,
                             }: DeleteStudentDialogProps) {

    const deleteStudentMutation = useDeleteStudent();

    const handleDelete = () => {

        if (!student) {
            return;
        }

        deleteStudentMutation.mutate(student.id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                Delete Student
            </DialogTitle>

            <DialogContent>

                {deleteStudentMutation.isError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {deleteStudentMutation.error.message ||
                            'Failed to delete student.'}
                    </Alert>
                )}

                <Typography>
                    Are you sure you want to delete
                    <strong>
                        {' '}
                        {student?.fullName}
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
                    disabled={deleteStudentMutation.isPending}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={deleteStudentMutation.isPending}
                >
                    {deleteStudentMutation.isPending
                        ? 'Deleting...'
                        : 'Delete'}
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default DeleteStudentDialog;