import { parentsApi } from "../../api/parents";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/formatters";

const columns = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "active", label: "Status", render: (row) => <StatusBadge value={row.active} /> },
  { key: "createdAt", label: "Added", render: (row) => formatDate(row.createdAt) },
];

const fields = [
  { name: "fullName", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", required: true, hint: "10 digits, e.g. 9876543210" },
  { name: "address", label: "Address", required: true },
  { name: "active", label: "Active", type: "checkbox" },
];

export default function Parents() {
  return (
    <CrudPage
      api={parentsApi}
      columns={columns}
      fields={fields}
      emptyValues={{ fullName: "", email: "", phone: "", address: "", active: true }}
      toEditValues={(row) => ({
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        address: row.address,
        active: row.active,
      })}
      searchPlaceholder="Search by name, email or phone…"
      resourceLabel="parent"
      deleteWarning={(row) => `Delete ${row.fullName}? Any linked students and notifications will be affected.`}
    />
  );
}
