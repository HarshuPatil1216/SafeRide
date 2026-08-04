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

import DriverToolbar from '../../components/drivers/DriverToolbar';
import AddDriverDialog from '../../components/drivers/AddDriverDialog';
import EditDriverDialog from '../../components/drivers/EditDriverDialog';
import DeleteDriverDialog from '../../components/drivers/DeleteDriverDialog';

import useDrivers from '../../hooks/useDrivers';

import type {
    Driver,
} from '../../services/driverService';

function DriversPage() {

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

    const [selectedDriver, setSelectedDriver] =
        useState<Driver | null>(null);

    const [driverToDelete, setDriverToDelete] =
        useState<Driver | null>(null);

    const {
        data,
        isLoading,
        isError,
    } = useDrivers({
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
        driver: Driver
    ) => {
        setSelectedDriver(driver);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setSelectedDriver(null);
        setEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (
        driver: Driver
    ) => {
        setDriverToDelete(driver);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDriverToDelete(null);
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
                    Drivers
                </Typography>

                <Typography
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    View and manage all registered drivers.
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
                <DriverToolbar
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
                    Failed to load drivers.
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>License</TableCell>
                                    <TableCell>Vehicle</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {data?.content.map((driver) => (

                                    <TableRow
                                        key={driver.id}
                                        hover
                                    >
                                        <TableCell>
                                            {driver.id}
                                        </TableCell>

                                        <TableCell>
                                            {driver.fullName}
                                        </TableCell>

                                        <TableCell>
                                            {driver.phoneNumber}
                                        </TableCell>

                                        <TableCell>
                                            {driver.licenseNumber}
                                        </TableCell>

                                        <TableCell>
                                            {driver.vehicleNumber ?? '-'}
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    driver.active
                                                        ? 'Active'
                                                        : 'Inactive'
                                                }
                                                color={
                                                    driver.active
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                size="small"
                                            />

                                        </TableCell>

                                        <TableCell align="center">

                                            <Tooltip title="Edit Driver">

                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenEditDialog(driver)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>

                                            </Tooltip>

                                            <Tooltip title="Delete Driver">

                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(driver)
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
                                            colSpan={7}
                                            align="center"
                                            sx={{
                                                py: 5,
                                            }}
                                        >
                                            No drivers found.
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

            <AddDriverDialog
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
            />

            <EditDriverDialog
                open={editDialogOpen}
                driver={selectedDriver}
                onClose={handleCloseEditDialog}
            />

            <DeleteDriverDialog
                open={deleteDialogOpen}
                driver={driverToDelete}
                onClose={handleCloseDeleteDialog}
            />

        </Stack>
    );
}

export default DriversPage;