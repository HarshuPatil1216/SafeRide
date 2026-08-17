import { studentsApi } from "../../api/students";
import { parentsApi } from "../../api/parents";
import { routesApi } from "../../api/routes";
import { stopsApi } from "../../api/stops";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOptions } from "../../hooks/useOptions";

const columns = [
  { key: "fullName", label: "Name" },
  { key: "rollNumber", label: "Roll #" },
  { key: "standard", label: "Standard" },
  { key: "division", label: "Div" },
  { key: "parentName", label: "Parent" },
  { key: "routeName", label: "Route" },
  { key: "stopName", label: "Stop" },
  { key: "active", label: "Status", render: (row) => <StatusBadge value={row.active} /> },
];

export default function Students() {
  const { options: parentOptions } = useOptions(parentsApi, (p) => ({ value: String(p.id), label: `${p.fullName} · ${p.email}` }));
  const { options: routeOptions } = useOptions(routesApi, (r) => ({ value: String(r.id), label: r.routeName }));
  const { options: stopOptions } = useOptions(stopsApi, (s) => ({ value: String(s.id), label: `${s.stopName} (${s.routeName})` }));

  const fields = [
    { name: "fullName", label: "Full name", required: true },
    { name: "rollNumber", label: "Roll number", required: true },
    { name: "standard", label: "Standard", required: true, placeholder: "e.g. 8" },
    { name: "division", label: "Division", required: true, placeholder: "e.g. A" },
    {
      name: "parentId",
      label: "Parent",
      type: "select",
      required: true,
      options: parentOptions,
      placeholder: parentOptions.length ? "Select a parent" : "No parents yet — add one first",
    },
    { name: "routeId", label: "Route (optional)", type: "select", options: routeOptions, placeholder: "No route assigned" },
    { name: "stopId", label: "Stop (optional)", type: "select", options: stopOptions, placeholder: "No stop assigned" },
    { name: "address", label: "Address", required: true },
    { name: "active", label: "Active", type: "checkbox" },
  ];

  return (
    <CrudPage
      api={studentsApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        fullName: "",
        rollNumber: "",
        standard: "",
        division: "",
        parentId: "",
        routeId: "",
        stopId: "",
        address: "",
        active: true,
      }}
      toEditValues={(row) => ({
        fullName: row.fullName,
        rollNumber: row.rollNumber,
        standard: row.standard,
        division: row.division,
        parentId: row.parentId ? String(row.parentId) : "",
        routeId: row.routeId ? String(row.routeId) : "",
        stopId: row.stopId ? String(row.stopId) : "",
        address: row.address,
        active: row.active,
      })}
      toPayload={(values) => ({
        ...values,
        parentId: Number(values.parentId),
        routeId: values.routeId ? Number(values.routeId) : null,
        stopId: values.stopId ? Number(values.stopId) : null,
      })}
      searchPlaceholder="Search by name or roll number…"
      resourceLabel="student"
      deleteWarning={(row) => `Delete ${row.fullName} (Roll #${row.rollNumber})? This can't be undone.`}
    />
  );
}
