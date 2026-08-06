import { useState, type ChangeEvent } from 'react';

import {
    Edit,
    Delete,
} from '@mui/icons-material';

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';

import VehicleToolbar from '../../components/vehicles/VehicleToolbar';
import AddVehicleDialog from '../../components/vehicles/AddVehicleDialog';
import EditVehicleDialog from '../../components/vehicles/EditVehicleDialog';
import DeleteVehicleDialog from '../../components/vehicles/DeleteVehicleDialog';

import useVehicles from '../../hooks/useVehicles';

import type {
    Vehicle,
} from '../../services/vehicleService';

function VehiclesPage() {

    const [page, setPage] =
        useState(0);

    const [rowsPerPage, setRowsPerPage] =
        useState(10);

    const [search, setSearch] =
        useState('');

    const [addDialogOpen, setAddDialogOpen] =
        useState(false);

    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedVehicle, setSelectedVehicle] =
        useState<Vehicle | null>(null);

    const [vehicleToDelete, setVehicleToDelete] =
        useState<Vehicle | null>(null);

    const {
        data,
        isLoading,
        isError,
    } = useVehicles({
        page,
        size: rowsPerPage,
        sortBy: 'id',
        sortDir: 'asc',
        query: search,
    });

    const handlePageChange = (
        _event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(
            Number(event.target.value)
        );

        setPage(0);
    };

    const handleSearchChange = (
        value: string
    ) => {

        setSearch(value);

        setPage(0);
    };

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
    };

    const handleOpenEditDialog = (
        vehicle: Vehicle
    ) => {

        setSelectedVehicle(vehicle);

        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {

        setSelectedVehicle(null);

        setEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (
        vehicle: Vehicle
    ) => {

        setVehicleToDelete(vehicle);

        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {

        setVehicleToDelete(null);

        setDeleteDialogOpen(false);
    };
    return (
        <Stack spacing={3}>

            <Box>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Vehicles
                </Typography>

                <Typography
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    View and manage all registered vehicles.
                </Typography>

            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                }}
            >

                <VehicleToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleOpenAddDialog}
                />

            </Paper>

            {isLoading && (

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>

            )}

            {isError && (

                <Alert severity="error">
                    Failed to load vehicles.
                </Alert>

            )}

            {!isLoading && !isError && (

                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >

                    <TableContainer>

                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell>ID</TableCell>

                                    <TableCell>
                                        Vehicle Number
                                    </TableCell>

                                    <TableCell>
                                        Type
                                    </TableCell>

                                    <TableCell>
                                        Capacity
                                    </TableCell>

                                    <TableCell>
                                        Model
                                    </TableCell>

                                    <TableCell>
                                        Manufacturer
                                    </TableCell>

                                    <TableCell>
                                        Status
                                    </TableCell>

                                    <TableCell align="center">
                                        Actions
                                    </TableCell>

                                </TableRow>

                            </TableHead>

                            <TableBody>
                                {data?.content.map((vehicle) => (

                                    <TableRow
                                        key={vehicle.id}
                                        hover
                                    >

                                        <TableCell>
                                            {vehicle.id}
                                        </TableCell>

                                        <TableCell>
                                            {vehicle.vehicleNumber}
                                        </TableCell>

                                        <TableCell>
                                            {vehicle.vehicleType}
                                        </TableCell>

                                        <TableCell>
                                            {vehicle.capacity}
                                        </TableCell>

                                        <TableCell>
                                            {vehicle.model || '-'}
                                        </TableCell>

                                        <TableCell>
                                            {vehicle.manufacturer || '-'}
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={vehicle.status}
                                                color={
                                                    vehicle.status === 'ACTIVE'
                                                        ? 'success'
                                                        : vehicle.status === 'MAINTENANCE'
                                                            ? 'warning'
                                                            : 'default'
                                                }
                                                size="small"
                                            />

                                        </TableCell>

                                        <TableCell align="center">

                                            <Tooltip title="Edit Vehicle">

                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenEditDialog(vehicle)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>

                                            </Tooltip>

                                            <Tooltip title="Delete Vehicle">

                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(vehicle)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>

                                            </Tooltip>

                                        </TableCell>

                                    </TableRow>

                                ))}

                                {data?.content.length === 0 && (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                            sx={{
                                                py: 5,
                                            }}
                                        >
                                            No vehicles found.
                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={data?.totalElements ?? 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={
                            handleRowsPerPageChange
                        }
                        rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            50,
                        ]}
                    />

                </Paper>

            )}

            <AddVehicleDialog
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
            />

            <EditVehicleDialog
                open={editDialogOpen}
                vehicle={selectedVehicle}
                onClose={handleCloseEditDialog}
            />

            <DeleteVehicleDialog
                open={deleteDialogOpen}
                vehicle={vehicleToDelete}
                onClose={handleCloseDeleteDialog}
            />

        </Stack>
    );
}

export default VehiclesPage;