import { driversApi } from "../../api/drivers";
import { vehiclesApi } from "../../api/vehicles";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOptions } from "../../hooks/useOptions";
import { titleCase } from "../../utils/formatters";
import { DRIVER_STATUSES } from "../../utils/constants";

const columns = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "licenseNumber", label: "License #" },
  { key: "experience", label: "Experience (yrs)" },
  { key: "vehicleNumber", label: "Vehicle" },
  { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
];

export default function Drivers() {
  const { options: vehicleOptions } = useOptions(vehiclesApi, (v) => ({
    value: String(v.id),
    label: `${v.vehicleNumber} · ${titleCase(v.vehicleType)}`,
  }));

  const fields = [
    { name: "fullName", label: "Full name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "licenseNumber", label: "License number", required: true },
    { name: "experience", label: "Experience (years)", type: "number", required: true },
    {
      name: "vehicleId",
      label: "Assigned vehicle",
      type: "select",
      required: true,
      options: vehicleOptions,
      placeholder: vehicleOptions.length ? "Select a vehicle" : "No vehicles yet — add one first",
    },
    { name: "address", label: "Address", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: DRIVER_STATUSES.map((v) => ({ value: v, label: titleCase(v) })),
    },
    { name: "active", label: "Active", type: "checkbox" },
  ];

  return (
    <CrudPage
      api={driversApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        fullName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        experience: "",
        vehicleId: "",
        address: "",
        status: "ACTIVE",
        active: true,
      }}
      toEditValues={(row) => ({
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        licenseNumber: row.licenseNumber,
        experience: row.experience,
        vehicleId: row.vehicleId ? String(row.vehicleId) : "",
        address: row.address,
        status: row.status,
        active: row.active,
      })}
      toPayload={(values) => ({
        ...values,
        experience: Number(values.experience),
        vehicleId: Number(values.vehicleId),
      })}
      searchPlaceholder="Search by name or email…"
      resourceLabel="driver"
      deleteWarning={(row) => `Delete ${row.fullName}? Their ride history stays, but they'll lose vehicle access.`}
    />
  );
}
