import { stopsApi } from "../../api/stops";
import { routesApi } from "../../api/routes";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOptions } from "../../hooks/useOptions";

const columns = [
  { key: "stopName", label: "Stop" },
  { key: "routeName", label: "Route" },
  { key: "stopOrder", label: "Order" },
  { key: "estimatedArrivalMinutes", label: "ETA (min)" },
  { key: "address", label: "Address" },
  { key: "active", label: "Status", render: (row) => <StatusBadge value={row.active} /> },
];

export default function Stops() {
  const { options: routeOptions } = useOptions(routesApi, (r) => ({ value: String(r.id), label: r.routeName }));

  const fields = [
    { name: "stopName", label: "Stop name", required: true },
    { name: "address", label: "Address", required: true },
    {
      name: "routeId",
      label: "Route",
      type: "select",
      required: true,
      options: routeOptions,
      placeholder: routeOptions.length ? "Select a route" : "No routes yet — add one first",
    },
    { name: "stopOrder", label: "Stop order", type: "number", required: true, hint: "Position along the route, starting at 1" },
    { name: "estimatedArrivalMinutes", label: "Estimated arrival (minutes from route start)", type: "number", required: true },
    { name: "latitude", label: "Latitude", type: "number", step: "0.0001" },
    { name: "longitude", label: "Longitude", type: "number", step: "0.0001" },
    { name: "active", label: "Active", type: "checkbox" },
  ];

  return (
    <CrudPage
      api={stopsApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        stopName: "",
        address: "",
        routeId: "",
        stopOrder: "",
        estimatedArrivalMinutes: "",
        latitude: "",
        longitude: "",
        active: true,
      }}
      toEditValues={(row) => ({
        stopName: row.stopName,
        address: row.address,
        routeId: row.routeId ? String(row.routeId) : "",
        stopOrder: row.stopOrder,
        estimatedArrivalMinutes: row.estimatedArrivalMinutes,
        latitude: row.latitude ?? "",
        longitude: row.longitude ?? "",
        active: row.active,
      })}
      toPayload={(values) => ({
        ...values,
        routeId: Number(values.routeId),
        stopOrder: Number(values.stopOrder),
        estimatedArrivalMinutes: Number(values.estimatedArrivalMinutes),
        latitude: values.latitude === "" ? null : Number(values.latitude),
        longitude: values.longitude === "" ? null : Number(values.longitude),
      })}
      searchPlaceholder="Search by stop name or address…"
      resourceLabel="stop"
      deleteWarning={(row) => `Delete "${row.stopName}"? Students assigned to this stop may be affected.`}
    />
  );
}
