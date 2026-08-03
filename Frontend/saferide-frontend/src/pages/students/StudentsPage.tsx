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

import AddStudentDialog from '../../components/students/AddStudentDialog';
import EditStudentDialog from '../../components/students/EditStudentDialog';
import DeleteStudentDialog from '../../components/students/DeleteStudentDialog';
import StudentToolbar from '../../components/students/StudentToolbar';

import useStudents from '../../hooks/useStudents';

import type { Student } from '../../services/studentService';

function StudentsPage() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const [addDialogOpen, setAddDialogOpen] =
        useState(false);

    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedStudent, setSelectedStudent] =
        useState<Student | null>(null);

    const [studentToDelete, setStudentToDelete] =
        useState<Student | null>(null);

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
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(Number(event.target.value));
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
        student: Student
    ) => {
        setSelectedStudent(student);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setSelectedStudent(null);
        setEditDialogOpen(false);
    };

    const handleOpenDeleteDialog = (
        student: Student
    ) => {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setStudentToDelete(null);
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
                                    <TableCell align="center">
                                        Actions
                                    </TableCell>
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
                                            {student.standard} - {student.division}
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

                                        <TableCell align="center">
                                            <Tooltip title="Edit Student">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenEditDialog(student)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete Student">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(student)
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
                                            colSpan={9}
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
                        rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            50,
                        ]}
                    />
                </Paper>
                )}            <AddStudentDialog
            open={addDialogOpen}
            onClose={handleCloseAddDialog}
        />

            <EditStudentDialog
                open={editDialogOpen}
                student={selectedStudent}
                onClose={handleCloseEditDialog}
            />

            <DeleteStudentDialog
                open={deleteDialogOpen}
                student={studentToDelete}
                onClose={handleCloseDeleteDialog}
            />
        </Stack>
    );
}


export default StudentsPage;