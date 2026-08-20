import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Bus,
  MapPin,
  Heart,
  RefreshCw,
} from 'lucide-react';
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '../../hooks/useStudents';
import { useRoutes } from '../../hooks/useRoutes';
import { Student, StudentRequestDTO } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StudentFormDialog } from '../../components/forms/StudentFormDialog';

export const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Queries & Mutations
  const { data: students = [], isLoading, isError, refetch } = useStudents({
    search: searchTerm,
    routeId: routeFilter || undefined,
    status: statusFilter || undefined,
  });
  const { data: routes = [] } = useRoutes();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  // Filtered and paginated list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.grade?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoute = !routeFilter || String(s.routeId) === String(routeFilter);
      const matchesStatus = !statusFilter || s.status === statusFilter;
      return matchesSearch && matchesRoute && matchesStatus;
    });
  }, [students, searchTerm, routeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = page * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleOpenDelete = (student: Student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: StudentRequestDTO) => {
    if (selectedStudent) {
      updateMutation.mutate(
        { id: selectedStudent.id, dto },
        {
          onSuccess: () => setFormOpen(false),
        }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Student Passengers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student registrations, parent assignments, and school bus route allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search by name, roll number, or grade..."
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={routeFilter}
            onChange={(e) => {
              setRouteFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No Students Found"
            description={
              searchTerm || routeFilter || statusFilter
                ? 'No student matched your filter criteria.'
                : 'Get started by enrolling student passengers into SafeRide.'
            }
            icon={GraduationCap}
            actionText="Register Student"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Grade / Roll</th>
                    <th className="px-6 py-3.5">Parent / Contact</th>
                    <th className="px-6 py-3.5">Route & Stop</th>
                    <th className="px-6 py-3.5">Service Type</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {student.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {student.address || 'Address not listed'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{student.grade}</div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {student.rollNumber}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {student.parentName || student.parentPhone ? (
                          <div>
                            <div className="font-medium text-slate-800 flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-500" />
                              <span>{student.parentName || 'Parent Registered'}</span>
                            </div>
                            {student.parentPhone && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{student.parentPhone}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Parent Linked</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {student.routeName ? (
                          <div>
                            <div className="font-semibold text-blue-600 flex items-center gap-1">
                              <Bus className="w-3 h-3 shrink-0" />
                              <span>{student.routeName}</span>
                            </div>
                            {student.stopName && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{student.stopName}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {student.pickupDropType === 'PICKUP_AND_DROP'
                          ? 'Pickup & Drop'
                          : student.pickupDropType === 'PICKUP_ONLY'
                          ? 'Pickup Only'
                          : 'Drop Only'}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={student.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(student)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={filteredStudents.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(0);
              }}
            />
          </>
        )}
      </div>

      {/* Form Dialog */}
      <StudentFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedStudent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to remove ${studentToDelete?.firstName} ${studentToDelete?.lastName} (${studentToDelete?.rollNumber})? This will deactivate their ridership records.`}
        confirmText="Delete Student"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
