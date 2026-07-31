import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { useState } from 'react';

import AddStudentDialog from '../../components/students/AddStudentDialog';
import StudentToolbar from '../../components/students/StudentToolbar';
import useStudents from '../../hooks/useStudents';

function StudentsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const {
        data,
        isLoading,
        isError,
    } = useStudents({
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
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setAddDialogOpen(false);
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
                    Students
                </Typography>

                <Typography
                    sx={{
                        color: 'text.secondary',
                    }}
                >
                    View and manage all registered students.
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
                <StudentToolbar
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
                    Failed to load students.
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
                                    <TableCell>Roll Number</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Route</TableCell>
                                    <TableCell>Stop</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data?.content.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        hover
                                    >
                                        <TableCell>
                                            {student.id}
                                        </TableCell>

                                        <TableCell>
                                            {student.fullName}
                                        </TableCell>

                                        <TableCell>
                                            {student.rollNumber}
                                        </TableCell>

                                        <TableCell>
                                            {student.standard}-
                                            {student.division}
                                        </TableCell>

                                        <TableCell>
                                            {student.parentName}
                                        </TableCell>

                                        <TableCell>
                                            {student.routeName ?? '-'}
                                        </TableCell>

                                        <TableCell>
                                            {student.stopName ?? '-'}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    student.active
                                                        ? 'Active'
                                                        : 'Inactive'
                                                }
                                                color={
                                                    student.active
                                                        ? 'success'
                                                        : 'default'
                                                }
                                                size="small"
                                            />
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
                                            No students found.
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
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </Paper>
            )}

            <AddStudentDialog
                open={addDialogOpen}
                onClose={handleCloseAddDialog}
            />
        </Stack>
    );
}

export default StudentsPage;