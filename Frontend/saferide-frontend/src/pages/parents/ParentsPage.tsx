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

import ParentToolbar from '../../components/parents/ParentToolbar';
import AddParentDialog from '../../components/parents/AddParentDialog';
import EditParentDialog from '../../components/parents/EditParentDialog';
import DeleteParentDialog from '../../components/parents/DeleteParentDialog';

import useParents from '../../hooks/useParents';

import type { Parent } from '../../services/parentService';

function ParentsPage() {

    const [page, setPage] = useState(0);

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

    const [selectedParent, setSelectedParent] =
        useState<Parent | null>(null);

    const [parentToDelete, setParentToDelete] =
        useState<Parent | null>(null);

    const {
        data,
        isLoading,
        isError,
    } = useParents({
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
        parent: Parent
    ) => {
        setSelectedParent(parent);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setSelectedParent(null);
        setEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (
        parent: Parent
    ) => {
        setParentToDelete(parent);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setParentToDelete(null);
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
                    Parents
                </Typography>

                <Typography
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    View and manage all registered parents.
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
                <ParentToolbar
                    search={search}
                    onSearchChange={
                        handleSearchChange
                    }
                    onAddClick={
                        handleOpenAddDialog
                    }
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
                    Failed to load parents.
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
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {data?.content.map((parent) => (

                                    <TableRow
                                        key={parent.id}
                                        hover
                                    >

                                        <TableCell>
                                            {parent.id}
                                        </TableCell>

                                        <TableCell>
                                            {parent.fullName}
                                        </TableCell>

                                        <TableCell>
                                            {parent.phoneNumber}
                                        </TableCell>

                                        <TableCell>
                                            {parent.email}
                                        </TableCell>

                                        <TableCell>
                                            {parent.address}
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={
                                                    parent.active
                                                        ? 'Active'
                                                        : 'Inactive'
                                                }
                                                color={
                                                    parent.active
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                size="small"
                                            />

                                        </TableCell>

                                        <TableCell align="center">

                                            <Tooltip title="Edit Parent">

                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenEditDialog(parent)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>

                                            </Tooltip>

                                            <Tooltip title="Delete Parent">

                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(parent)
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
                                            No parents found.
                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>