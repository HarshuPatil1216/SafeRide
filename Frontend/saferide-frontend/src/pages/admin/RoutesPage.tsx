import React, { useState, useMemo } from 'react';
import {
  Route as RouteIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Bus,
  User,
  Clock,
  Navigation,
  RefreshCw,
} from 'lucide-react';
import {
  useRoutes,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
} from '../../hooks/useRoutes';
import { Route, RouteRequestDTO } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RouteFormDialog } from '../../components/forms/RouteFormDialog';
import { useNavigate } from 'react-router-dom';

export const RoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  const { data: routes = [], isLoading, refetch } = useRoutes();
  const createMutation = useCreateRoute();
  const updateMutation = useUpdateRoute();
  const deleteMutation = useDeleteRoute();

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      return (
        !searchTerm ||
        r.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.routeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.startLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.endLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [routes, searchTerm]);

  const totalPages = Math.ceil(filteredRoutes.length / pageSize) || 1;
  const paginatedRoutes = useMemo(() => {
    const start = page * pageSize;
    return filteredRoutes.slice(start, start + pageSize);
  }, [filteredRoutes, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedRoute(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormOpen(true);
  };

  const handleOpenDelete = (route: Route) => {
    setRouteToDelete(route);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: RouteRequestDTO) => {
    if (selectedRoute) {
      updateMutation.mutate(
        { id: selectedRoute.id, dto },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (routeToDelete) {
      deleteMutation.mutate(routeToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Transit Bus Routes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design school bus routes, manage waypoints, duration metrics, and bus assignments
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
            <span>Create Route</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-md">
          <SearchInput placeholder="Search route name, code, start or end destination..." onChange={setSearchTerm} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredRoutes.length === 0 ? (
          <EmptyState
            title="No Routes Found"
            description="Create bus routes to organize student pickup stops and driver schedules."
            icon={RouteIcon}
            actionText="Create Route"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Route</th>
                    <th className="px-6 py-3.5">Origin & Destination</th>
                    <th className="px-6 py-3.5">Distance / Est. Duration</th>
                    <th className="px-6 py-3.5">Stops / Students</th>
                    <th className="px-6 py-3.5">Assigned Bus & Driver</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRoutes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            <RouteIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{r.routeName}</div>
                            <div className="font-mono text-[11px] font-semibold text-blue-600">
                              {r.routeCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{r.startLocation}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>{r.endLocation}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                          <span>{r.totalDistanceKm || 0} km</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{r.estimatedDurationMinutes || 30} mins</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate('/admin/stops')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span>{r.totalStops || 0} Stops</span>
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        {r.vehicleNumber ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <Bus className="w-3 h-3 text-blue-600" />
                              <span>{r.vehicleNumber}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <User className="w-3 h-3 text-amber-600" />
                              <span>{r.driverName || 'Driver Assigned'}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Bus Assigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={r.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(r)}
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
              totalElements={filteredRoutes.length}
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

      <RouteFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRoute}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Route"
        message={`Are you sure you want to delete ${routeToDelete?.routeName} (${routeToDelete?.routeCode})?`}
        confirmText="Delete Route"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
