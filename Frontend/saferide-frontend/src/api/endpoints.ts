// ==========================================
// SAFERIDE SPRING BOOT REST API ENDPOINTS
// ==========================================

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNIN: '/auth/signin',
    ME: '/auth/me',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: number | string) => `/students/${id}`,
    BY_PARENT: (parentId: number | string) => `/students/parent/${parentId}`,
    BY_ROUTE: (routeId: number | string) => `/students/route/${routeId}`,
    SEARCH: '/students/search'
  },
  PARENTS: {
    BASE: '/parents',
    BY_ID: (id: number | string) => `/parents/${id}`,
    MY_CHILDREN: '/parents/my-children',
    CHILDREN_BY_PARENT: (parentId: number | string) => `/parents/${parentId}/children`
  },
  DRIVERS: {
    BASE: '/drivers',
    BY_ID: (id: number | string) => `/drivers/${id}`,
    AVAILABLE: '/drivers/available',
    ASSIGN_VEHICLE: (id: number | string) => `/drivers/${id}/assign-vehicle`
  },
  VEHICLES: {
    BASE: '/vehicles',
    BY_ID: (id: number | string) => `/vehicles/${id}`,
    AVAILABLE: '/vehicles/available',
    LOCATION: (id: number | string) => `/vehicles/${id}/location`
  },
  ROUTES: {
    BASE: '/routes',
    BY_ID: (id: number | string) => `/routes/${id}`,
    ASSIGN_DRIVER: (id: number | string) => `/routes/${id}/assign-driver`,
    ASSIGN_VEHICLE: (id: number | string) => `/routes/${id}/assign-vehicle`
  },
  STOPS: {
    BASE: '/stops',
    BY_ID: (id: number | string) => `/stops/${id}`,
    BY_ROUTE: (routeId: number | string) => `/stops/route/${routeId}`
  },
  RIDES: {
    BASE: '/rides',
    BY_ID: (id: number | string) => `/rides/${id}`,
    TODAY: '/rides/today',
    ACTIVE: '/rides/active',
    START: (id: number | string) => `/rides/${id}/start`,
    END: (id: number | string) => `/rides/${id}/end`,
    UPDATE_LOCATION: (id: number | string) => `/rides/${id}/location`,
    ATTENDANCE: (id: number | string) => `/rides/${id}/attendance`,
    BY_DRIVER_TODAY: (driverId: number | string) => `/rides/driver/${driverId}/today`,
    BY_STUDENT_CURRENT: (studentId: number | string) => `/rides/student/${studentId}/current`
  },
  TRACKING: {
    ALL_ACTIVE: '/tracking/vehicles',
    BY_VEHICLE: (vehicleId: number | string) => `/tracking/vehicle/${vehicleId}`,
    BY_RIDE: (rideId: number | string) => `/tracking/ride/${rideId}`,
    UPDATE: '/tracking/update-location'
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: number | string) => `/notifications/${id}`,
    UNREAD: '/notifications/unread',
    MARK_READ: (id: number | string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    BROADCAST: '/notifications/broadcast'
  },
  REPORTS: {
    DASHBOARD_STATS: '/reports/dashboard',
    RIDES: '/reports/rides',
    ATTENDANCE: '/reports/attendance',
    VEHICLES: '/reports/vehicles'
  }
};
