import React, { useState, useMemo } from 'react';
import {
  Heart,
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';
import {
  useParents,
  useCreateParent,
  useUpdateParent,
  useDeleteParent,
} from '../../hooks/useParents';
import { Parent, ParentRequestDTO } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ParentFormDialog } from '../../components/forms/ParentFormDialog';

export const ParentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);

  const { data: parents = [], isLoading, refetch } = useParents();
  const createMutation = useCreateParent();
  const updateMutation = useUpdateParent();
  const deleteMutation = useDeleteParent();

  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      return (
        !searchTerm ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
      );
    });
  }, [parents, searchTerm]);

  const totalPages = Math.ceil(filteredParents.length / pageSize) || 1;
  const paginatedParents = useMemo(() => {
    const start = page * pageSize;
    return filteredParents.slice(start, start + pageSize);
  }, [filteredParents, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedParent(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (parent: Parent) => {
    setSelectedParent(parent);
    setFormOpen(true);
  };

  const handleOpenDelete = (parent: Parent) => {
    setParentToDelete(parent);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (dto: ParentRequestDTO) => {
    if (selectedParent) {
      updateMutation.mutate(
        { id: selectedParent.id, dto },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createMutation.mutate(dto, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (parentToDelete) {
      deleteMutation.mutate(parentToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Parents & Guardians
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage parent accounts, notification settings, and linked children
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
            <span>Add Parent Account</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-md">
          <SearchInput placeholder="Search parent by name, email, or phone..." onChange={setSearchTerm} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : filteredParents.length === 0 ? (
          <EmptyState
            title="No Parents Found"
            description="Register parents to link them to students for real-time tracking."
            icon={Heart}
            actionText="Add Parent"
            onAction={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Parent Name</th>
                    <th className="px-6 py-3.5">Contact Info</th>
                    <th className="px-6 py-3.5">Relationship</th>
                    <th className="px-6 py-3.5">Linked Children</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedParents.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {p.firstName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {p.firstName} {p.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {p.address || 'Address not registered'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{p.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{p.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {p.relationship || 'Guardian'}
                      </td>

                      <td className="px-6 py-4">
                        {p.children && p.children.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.children.map((c) => (
                              <span
                                key={c.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                <GraduationCap className="w-3 h-3" />
                                {c.firstName} ({c.grade})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No linked children</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(p)}
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
              totalElements={filteredParents.length}
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

      <ParentFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedParent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Parent Account"
        message={`Are you sure you want to delete ${parentToDelete?.firstName} ${parentToDelete?.lastName}?`}
        confirmText="Delete Account"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
};
