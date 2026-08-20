import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Route as RouteIcon,
  Navigation,
  RefreshCw,
} from 'lucide-react';
import {
  useStops,
  useCreateStop,
  useUpdateStop,
  useDeleteStop,
} from '../../hooks/useStops';
import { useRoutes } from '../../hooks/useRoutes';
import { Stop, StopRequestDTO } from '../../types';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StopFormDialog } from '../../components/forms/StopFormDialog';

export const StopsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [stopToDelete, setStopToDelete] = useState<Stop | null>(null);

  const { data: stops = [], isLoading, refetch } = useStops();
  const { data: routes = [] } = useRoutes();

  const createMutation = useCreateStop();
  const updateMutation = useUpdateStop();
  const deleteMutation = useDeleteStop();

  const filteredStops = useMemo(() => {
    return stops.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.stopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoute = !routeFilter || String(s.routeId) === String(routeFilter);
      return matchesSearch && matchesRoute;
    });
  }, [stops, searchTerm, routeFilter]);

  const totalPages = Math.ceil(filteredStops.length / pageSize) || 1;
  const paginatedStops = useMemo(() => {
    const start = page * pageSize;
    return filteredStops.slice(start, start + pageSize);
  }, [filteredStops, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedStop(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (stop: Stop) => {
    setSelectedStop(stop);
    setFormOpen(true);
  };

  const handleOpenDelete = (stop: Stop) => {
    setStopToDelete(stop);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: StopRequestDTO) => {
    if (selectedStop) {
      updateMutation.mutate(
        { id: selectedStop.id, dto },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (stopToDelete) {
      deleteMutation.mutate(stopToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Designated Bus Stops
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage GPS waypoints, pickup/drop estimated timings, and sequence on routes
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
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between">
        <div className="max-w-md flex-1">
          <SearchInput placeholder="Search stop landmark name or street address..." onChange={setSearchTerm} />
        </div>

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
              {r.routeName} ({r.routeCode})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredStops.length === 0 ? (
          <EmptyState
            title="No Bus Stops Found"
            description="Create designated stops to construct route schedules and student pickups."
            icon={MapPin}
            actionText="Add Stop"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Sequence</th>
                    <th className="px-6 py-3.5">Stop Landmark</th>
                    <th className="px-6 py-3.5">Route</th>
                    <th className="px-6 py-3.5">GPS Coordinates</th>
                    <th className="px-6 py-3.5">Scheduled Times</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStops.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold font-mono text-xs flex items-center justify-center">
                          #{s.sequenceOrder || 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{s.stopName}</div>
                        <div className="text-[11px] text-slate-400">{s.address}</div>
                      </td>

                      <td className="px-6 py-4">
                        {s.routeName ? (
                          <div className="font-semibold text-blue-600 flex items-center gap-1">
                            <RouteIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{s.routeName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                        {s.latitude?.toFixed(4)}, {s.longitude?.toFixed(4)}
                      </td>

                      <td className="px-6 py-4 font-mono">
                        <div className="space-y-0.5">
                          <div className="text-emerald-600 font-semibold">
                            Pickup: {s.pickupTime || '07:30'}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Drop: {s.dropTime || '15:45'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(s)}
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
              totalElements={filteredStops.length}
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

      <StopFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedStop}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Stop"
        message={`Are you sure you want to remove stop "${stopToDelete?.stopName}"?`}
        confirmText="Delete Stop"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
