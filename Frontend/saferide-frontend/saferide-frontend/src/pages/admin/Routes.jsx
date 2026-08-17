import { routesApi } from "../../api/routes";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";

const columns = [
  { key: "routeName", label: "Route" },
  { key: "source", label: "From" },
  { key: "destination", label: "To" },
  { key: "distanceInKm", label: "Distance (km)" },
  { key: "estimatedDurationInMinutes", label: "Duration (min)" },
  { key: "active", label: "Status", render: (row) => <StatusBadge value={row.active} /> },
];

const fields = [
  { name: "routeName", label: "Route name", required: true, placeholder: "Pune Station - SafeRide School" },
  { name: "source", label: "Source", required: true },
  { name: "destination", label: "Destination", required: true },
  { name: "distanceInKm", label: "Distance (km)", type: "number", step: "0.1", required: true },
  { name: "estimatedDurationInMinutes", label: "Estimated duration (minutes)", type: "number", required: true },
  { name: "active", label: "Active", type: "checkbox" },
];

export default function Routes() {
  return (
    <CrudPage
      api={routesApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        routeName: "",
        source: "",
        destination: "",
        distanceInKm: "",
        estimatedDurationInMinutes: "",
        active: true,
      }}
      toEditValues={(row) => ({
        routeName: row.routeName,
        source: row.source,
        destination: row.destination,
        distanceInKm: row.distanceInKm,
        estimatedDurationInMinutes: row.estimatedDurationInMinutes,
        active: row.active,
      })}
      toPayload={(values) => ({
        ...values,
        distanceInKm: Number(values.distanceInKm),
        estimatedDurationInMinutes: Number(values.estimatedDurationInMinutes),
      })}
      searchPlaceholder="Search by route name, source or destination…"
      resourceLabel="route"
      deleteWarning={(row) => `Delete "${row.routeName}"? Stops and students assigned to it may be affected.`}
    />
  );
}
