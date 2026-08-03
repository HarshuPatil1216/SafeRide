import {
    Add,
    Search,
} from '@mui/icons-material';

import {
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';

type ParentToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
};

function ParentToolbar({
                           search,
                           onSearchChange,
                           onAddClick,
                       }: ParentToolbarProps) {

    return (

        <Stack
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

            <Box sx={{ flex: 1 }}>

                <TextField
                    fullWidth
                    placeholder="Search parents..."
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

            </Box>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddClick}
            >
                Add Parent
            </Button>

        </Stack>

    );
}

export default ParentToolbar;