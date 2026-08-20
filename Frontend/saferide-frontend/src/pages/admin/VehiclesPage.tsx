import React, { useState, useMemo } from 'react';
import {
  Bus,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Users,
  RefreshCw,
  Fuel,
} from 'lucide-react';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '../../hooks/useVehicles';
import { Vehicle, VehicleRequestDTO } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { VehicleFormDialog } from '../../components/forms/VehicleFormDialog';

export const VehiclesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const { data: vehicles = [], isLoading, refetch } = useVehicles();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        !searchTerm ||
        v.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || v.vehicleType === typeFilter;
      const matchesStatus = !statusFilter || v.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = page * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleOpenDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: VehicleRequestDTO) => {
    if (selectedVehicle) {
      updateMutation.mutate(
        { id: selectedVehicle.id, dto },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      deleteMutation.mutate(vehicleToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            School Bus Fleet
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage school buses, passenger capacity, maintenance status, and assigned drivers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-white bg-[#0a0a0a] border border-[#1e293b] rounded-xl hover:bg-slate-800 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fleet Vehicle</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#1e293b] shadow-xs flex flex-col md:flex-row gap-3 justify-between">
        <div className="max-w-md flex-1">
          <SearchInput placeholder="Search bus number, registration, or model..." onChange={setSearchTerm} />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs bg-[#050505] border border-[#1e293b] rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
          >
            <option value="">All Vehicle Types</option>
            <option value="BUS">School Bus</option>
            <option value="MINIBUS">Minibus</option>
            <option value="VAN">Van</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs bg-[#050505] border border-[#1e293b] rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1e293b] shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredVehicles.length === 0 ? (
          <EmptyState
            title="No Fleet Vehicles"
            description="Register buses to build routes and assign drivers."
            icon={Bus}
            actionText="Add Vehicle"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0d0d0d] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#1e293b]">
                  <tr>
                    <th className="px-6 py-3.5">Bus Number</th>
                    <th className="px-6 py-3.5">Registration & Model</th>
                    <th className="px-6 py-3.5">Capacity</th>
                    <th className="px-6 py-3.5">Assigned Driver</th>
                    <th className="px-6 py-3.5">Fuel & Type</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {paginatedVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                            <Bus className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-white">
                              {v.vehicleNumber}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                              {v.vehicleType || 'BUS'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{v.registrationNumber}</div>
                        <div className="text-[11px] text-slate-400">
                          {v.make} {v.model} ({v.year || 2023})
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>{v.capacity} seats</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {v.assignedDriverName ? (
                          <div className="font-medium text-slate-200 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            <span>{v.assignedDriverName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-300 font-medium">
                          <Fuel className="w-3 h-3 text-slate-400" />
                          <span>{v.fuelType || 'DIESEL'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={v.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-1.5 text-slate-400 hover:text-[#38bdf8] hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(v)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
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
              totalElements={filteredVehicles.length}
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

      <VehicleFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedVehicle}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message={`Are you sure you want to remove vehicle ${vehicleToDelete?.vehicleNumber}?`}
        confirmText="Delete Vehicle"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
