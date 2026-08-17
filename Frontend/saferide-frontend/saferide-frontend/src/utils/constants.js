export const ROLES = {
  ADMIN: "ADMIN",
  DRIVER: "DRIVER",
  PARENT: "PARENT",
};

export const ROLE_HOME = {
  ADMIN: "/admin",
  DRIVER: "/driver",
  PARENT: "/parent",
};

export function homeForRole(role) {
  return ROLE_HOME[role] || "/login";
}

export const DRIVER_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE"];
export const VEHICLE_STATUSES = ["ACTIVE", "INACTIVE", "UNDER_MAINTENANCE"];
export const VEHICLE_TYPES = ["BUS", "VAN", "MINI_BUS"];
export const RIDE_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
export const NOTIFICATION_TYPES = ["RIDE_STARTED", "STUDENT_PICKED_UP", "STUDENT_DROPPED_OFF", "BUS_NEAR_STOP", "GENERAL"];
export const RIDE_EVENT_TYPES = ["PICKED_UP", "DROPPED_OFF"];
