import { Search, Add } from '@mui/icons-material';

import {
    Button,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';

type DriverToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
};

function DriverToolbar({
                           search,
                           onSearchChange,
                           onAddClick,
                       }: DriverToolbarProps) {

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
                justifyContent: 'space-between',
                alignItems: {
                    xs: 'stretch',
                    md: 'center',
                },
            }}
        >
            <TextField
                fullWidth
                placeholder="Search driver..."
                value={search}
                onChange={(e) =>
                    onSearchChange(e.target.value)
                }
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddClick}
                sx={{
                    minWidth: 170,
                }}
            >
                Add Driver
            </Button>
        </Stack>
    );
}

export default DriverToolbar;