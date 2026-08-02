import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import type { Student } from '../../services/studentService';

type EditStudentDialogProps = {
    open: boolean;
    student: Student | null;
    onClose: () => void;
};

function EditStudentDialog({
                               open,
                               student,
                               onClose,
                           }: EditStudentDialogProps) {
    console.log(student);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Edit Student</DialogTitle>

            <DialogContent>
                {/* Form will come here */}
            </DialogContent>

            <DialogActions>
                <Button
                    color="inherit"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                >
                    Update Student
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditStudentDialog;