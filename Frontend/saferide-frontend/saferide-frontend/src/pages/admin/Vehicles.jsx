import { vehiclesApi } from "../../api/vehicles";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { titleCase } from "../../utils/formatters";
import { VEHICLE_TYPES, VEHICLE_STATUSES } from "../../utils/constants";

const columns = [
  { key: "vehicleNumber", label: "Vehicle #" },
  { key: "vehicleType", label: "Type", render: (row) => titleCase(row.vehicleType) },
  { key: "capacity", label: "Capacity" },
  { key: "model", label: "Model" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
];

const fields = [
  { name: "vehicleNumber", label: "Vehicle number", required: true, placeholder: "MH12AB1234" },
  {
    name: "vehicleType",
    label: "Vehicle type",
    type: "select",
    required: true,
    options: VEHICLE_TYPES.map((v) => ({ value: v, label: titleCase(v) })),
  },
  { name: "capacity", label: "Capacity", type: "number", required: true },
  { name: "model", label: "Model", required: true },
  { name: "manufacturer", label: "Manufacturer", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: VEHICLE_STATUSES.map((v) => ({ value: v, label: titleCase(v) })),
  },
];

export default function Vehicles() {
  return (
    <CrudPage
      api={vehiclesApi}
      columns={columns}
      fields={fields}
      emptyValues={{ vehicleNumber: "", vehicleType: "", capacity: "", model: "", manufacturer: "", status: "ACTIVE" }}
      toEditValues={(row) => ({
        vehicleNumber: row.vehicleNumber,
        vehicleType: row.vehicleType,
        capacity: row.capacity,
        model: row.model,
        manufacturer: row.manufacturer,
        status: row.status,
      })}
      toPayload={(values) => ({ ...values, capacity: Number(values.capacity) })}
      searchPlaceholder="Search by number, model or manufacturer…"
      resourceLabel="vehicle"
      deleteWarning={(row) => `Delete vehicle ${row.vehicleNumber}? Rides and drivers using it may be affected.`}
    />
  );
}
