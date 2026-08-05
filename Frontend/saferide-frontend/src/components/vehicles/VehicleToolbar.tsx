import {
    Add,
    Search,
} from '@mui/icons-material';

import {
    Button,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';

type VehicleToolbarProps = {
    search: string;
    onSearchChange: (
        value: string
    ) => void;
    onAddClick: () => void;
};

function VehicleToolbar({
                            search,
                            onSearchChange,
                            onAddClick,
                        }: VehicleToolbarProps) {

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
                placeholder="Search vehicle..."

                value={search}

                onChange={(e) =>
                    onSearchChange(
                        e.target.value
                    )
                }

                slotProps={{
                    input: {

                        startAdornment: (

                            <InputAdornment
                                position="start"
                            >
                                <Search />
                            </InputAdornment>

                        ),
                    },
                }}
            />

            <Button
                variant="contained"

                startIcon={
                    <Add />
                }

                onClick={onAddClick}

                sx={{
                    minWidth: 180,
                }}
            >
                Add Vehicle
            </Button>

        </Stack>

    );
}

export default VehicleToolbar;