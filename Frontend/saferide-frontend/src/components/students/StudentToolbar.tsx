import { Add } from '@mui/icons-material';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';

type StudentToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
};

function StudentToolbar({
                            search,
                            onSearchChange,
                            onAddClick,
                        }: StudentToolbarProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            <TextField
                label="Search by name or roll number"
                value={search}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                size="small"
                sx={{
                    minWidth: 280,
                    flexGrow: 1,
                }}
            />

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddClick}
            >
                Add Student
            </Button>
        </Box>
    );
}

export default StudentToolbar;