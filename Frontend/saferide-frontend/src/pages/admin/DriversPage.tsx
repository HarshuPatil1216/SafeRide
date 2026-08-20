import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Bus,
  MapPin,
  RefreshCw,
  Award,
} from 'lucide-react';
import {
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from '../../hooks/useDrivers';
import { Driver, DriverRequestDTO } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DriverFormDialog } from '../../components/forms/DriverFormDialog';

export const DriversPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const { data: drivers = [], isLoading, refetch } = useDrivers();
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone?.includes(searchTerm);
      const matchesStatus = !statusFilter || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredDrivers.length / pageSize) || 1;
  const paginatedDrivers = useMemo(() => {
    const start = page * pageSize;
    return filteredDrivers.slice(start, start + pageSize);
  }, [filteredDrivers, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedDriver(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormOpen(true);
  };

  const handleOpenDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: DriverRequestDTO) => {
    if (selectedDriver) {
      updateMutation.mutate(
        { id: selectedDriver.id, dto },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (driverToDelete) {
      deleteMutation.mutate(driverToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Bus Drivers & Operators
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage certified commercial drivers, license credentials, and fleet allocations
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
            <span>Register Driver</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between">
        <div className="max-w-md flex-1">
          <SearchInput placeholder="Search driver by name, license number, or phone..." onChange={setSearchTerm} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_DUTY">On Duty</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredDrivers.length === 0 ? (
          <EmptyState
            title="No Drivers Registered"
            description="Add licensed operators to assign them to school bus routes."
            icon={UserCheck}
            actionText="Register Driver"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Driver</th>
                    <th className="px-6 py-3.5">License & Exp</th>
                    <th className="px-6 py-3.5">Assigned Vehicle</th>
                    <th className="px-6 py-3.5">Assigned Route</th>
                    <th className="px-6 py-3.5">Duty Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedDrivers.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {d.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {d.firstName} {d.lastName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{d.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono font-semibold text-slate-800">{d.licenseNumber}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          <span>{d.experienceYears || 5} yrs experience</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {d.assignedVehicleNumber ? (
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Bus className="w-3.5 h-3.5 text-blue-600" />
                            <span>{d.assignedVehicleNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Vehicle</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {d.assignedRouteName ? (
                          <div className="font-medium text-blue-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>{d.assignedRouteName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Route</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={d.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(d)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(d)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
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
              totalElements={filteredDrivers.length}
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

      <DriverFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedDriver}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message={`Are you sure you want to delete ${driverToDelete?.firstName} ${driverToDelete?.lastName}?`}
        confirmText="Delete Driver"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
