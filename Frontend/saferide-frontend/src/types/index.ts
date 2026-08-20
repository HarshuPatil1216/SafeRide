// ==========================================
// SAFERIDE TYPES & BACKEND DTO CONTRACTS
// ==========================================

export enum UserRole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_DRIVER = 'ROLE_DRIVER',
  ROLE_PARENT = 'ROLE_PARENT',
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  PARENT = 'PARENT'
}

export enum VehicleType {
  BUS = 'BUS',
  MINIBUS = 'MINIBUS',
  VAN = 'VAN'
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_DUTY = 'ON_DUTY',
  OFF_DUTY = 'OFF_DUTY',
  INACTIVE = 'INACTIVE'
}

export enum ParentRelationship {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN'
}

export enum PickupDropType {
  PICKUP_AND_DROP = 'PICKUP_AND_DROP',
  PICKUP_ONLY = 'PICKUP_ONLY',
  DROP_ONLY = 'DROP_ONLY'
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum RideType {
  MORNING_PICKUP = 'MORNING_PICKUP',
  EVENING_DROP = 'EVENING_DROP'
}

export enum RideStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED'
}

export enum AttendanceStatus {
  PENDING = 'PENDING',
  BOARDED = 'BOARDED',
  DROPPED = 'DROPPED',
  ABSENT = 'ABSENT'
}

export enum NotificationType {
  RIDE_STARTED = 'RIDE_STARTED',
  BUS_ARRIVING = 'BUS_ARRIVING',
  STUDENT_BOARDED = 'STUDENT_BOARDED',
  STUDENT_DROPPED = 'STUDENT_DROPPED',
  DELAY = 'DELAY',
  EMERGENCY = 'EMERGENCY',
  SYSTEM = 'SYSTEM'
}

// ------------------------------------------
// User & Auth Types
// ------------------------------------------

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phone?: string;
  avatar?: string;
  driverId?: number;
  parentId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phone?: string;
  driverId?: number;
  parentId?: number;
}

// ------------------------------------------
// Student Types
// ------------------------------------------

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  rollNumber: string;
  grade: string;
  section?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  parentId?: number;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  routeId?: number;
  routeName?: string;
  stopId?: number;
  stopName?: string;
  pickupDropType: PickupDropType | string;
  status: EntityStatus | string;
  emergencyContact?: string;
  address?: string;
  avatarUrl?: string;
  qrCode?: string;
  createdAt?: string;
}

export interface StudentRequestDTO {
  firstName: string;
  lastName: string;
  rollNumber: string;
  grade: string;
  section?: string;
  gender?: string;
  parentId?: number | null;
  routeId?: number | null;
  stopId?: number | null;
  pickupDropType: PickupDropType | string;
  status: EntityStatus | string;
  emergencyContact?: string;
  address?: string;
}

// ------------------------------------------
// Parent Types
// ------------------------------------------

export interface Parent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: string;
  relationship: ParentRelationship | string;
  status: EntityStatus | string;
  childrenCount?: number;
  children?: Student[];
  createdAt?: string;
}

export interface ParentRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  emergencyContact?: string;
  relationship: ParentRelationship | string;
  status: EntityStatus | string;
}

// ------------------------------------------
// Driver Types
// ------------------------------------------

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry?: string;
  experienceYears?: number;
  address?: string;
  status: DriverStatus | string;
  assignedVehicleId?: number;
  assignedVehicleNumber?: string;
  assignedRouteId?: number;
  assignedRouteName?: string;
  rating?: number;
  createdAt?: string;
}

export interface DriverRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  licenseNumber: string;
  licenseExpiry?: string;
  experienceYears?: number;
  address?: string;
  status: DriverStatus | string;
  assignedVehicleId?: number | null;
  assignedRouteId?: number | null;
}

// ------------------------------------------
// Vehicle Types
// ------------------------------------------

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  registrationNumber: string;
  capacity: number;
  model: string;
  make: string;
  year?: number;
  vehicleType: VehicleType | string;
  status: VehicleStatus | string;
  assignedDriverId?: number;
  assignedDriverName?: string;
  assignedRouteId?: number;
  assignedRouteName?: string;
  fuelType?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  currentLat?: number;
  currentLng?: number;
  speed?: number;
  lastUpdated?: string;
}

export interface VehicleRequestDTO {
  vehicleNumber: string;
  registrationNumber: string;
  capacity: number;
  model: string;
  make: string;
  year?: number;
  vehicleType: VehicleType | string;
  status: VehicleStatus | string;
  assignedDriverId?: number | null;
  fuelType?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
}

// ------------------------------------------
// Route & Stop Types
// ------------------------------------------

export interface Stop {
  id: number;
  stopName: string;
  address: string;
  latitude: number;
  longitude: number;
  pickupTime?: string;
  dropTime?: string;
  sequenceOrder: number;
  routeId?: number;
  routeName?: string;
  studentCount?: number;
}

export interface StopRequestDTO {
  stopName: string;
  address: string;
  latitude: number;
  longitude: number;
  pickupTime?: string;
  dropTime?: string;
  sequenceOrder: number;
  routeId?: number | null;
}

export interface Route {
  id: number;
  routeName: string;
  routeCode: string;
  startLocation: string;
  endLocation: string;
  description?: string;
  totalDistanceKm?: number;
  estimatedDurationMinutes?: number;
  status: EntityStatus | string;
  vehicleId?: number;
  vehicleNumber?: string;
  driverId?: number;
  driverName?: string;
  stops?: Stop[];
  studentCount?: number;
  createdAt?: string;
}

export interface RouteRequestDTO {
  routeName: string;
  routeCode: string;
  startLocation: string;
  endLocation: string;
  description?: string;
  totalDistanceKm?: number;
  estimatedDurationMinutes?: number;
  status: EntityStatus | string;
  vehicleId?: number | null;
  driverId?: number | null;
  stopIds?: number[];
}

// ------------------------------------------
// Ride & Attendance Types
// ------------------------------------------

export interface StudentAttendance {
  id?: number;
  studentId: number;
  studentName: string;
  grade?: string;
  rollNumber?: string;
  stopId?: number;
  stopName?: string;
  parentPhone?: string;
  parentName?: string;
  status: AttendanceStatus | string;
  boardedAt?: string;
  droppedAt?: string;
  notes?: string;
}

export interface Ride {
  id: number;
  rideCode: string;
  routeId: number;
  routeName: string;
  vehicleId: number;
  vehicleNumber: string;
  driverId: number;
  driverName: string;
  driverPhone?: string;
  rideType: RideType | string;
  status: RideStatus | string;
  scheduledStartTime: string;
  actualStartTime?: string;
  endTime?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  currentSpeed?: number;
  currentStopId?: number;
  currentStopName?: string;
  totalStudents: number;
  boardedStudents: number;
  droppedStudents?: number;
  passengerAttendances?: StudentAttendance[];
  stops?: Stop[];
  createdAt?: string;
}

export interface StartRideRequestDTO {
  rideId: number;
  startLatitude?: number;
  startLongitude?: number;
}

export interface EndRideRequestDTO {
  rideId: number;
  endLatitude?: number;
  endLongitude?: number;
}

export interface UpdateLocationRequestDTO {
  rideId?: number;
  vehicleId?: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export interface UpdateAttendanceRequestDTO {
  rideId: number;
  studentId: number;
  status: AttendanceStatus | string;
  stopId?: number;
  notes?: string;
}

// ------------------------------------------
// Live Tracking Types
// ------------------------------------------

export interface VehicleTrackingData {
  vehicleId: number;
  vehicleNumber: string;
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  rideId?: number;
  rideCode?: string;
  routeId?: number;
  routeName?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  status: RideStatus | VehicleStatus | string;
  lastUpdated: string;
  nextStopName?: string;
  etaNextStopMinutes?: number;
}

// ------------------------------------------
// Notification Types
// ------------------------------------------

export interface ChangePasswordRequest {
  currentPassword?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export type VehicleLocationDTO = VehicleTrackingData;

export interface Notification {
  id: number;
  userId?: number;
  title: string;
  message: string;
  type: NotificationType | string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
  relatedRideId?: number;
  relatedStudentId?: number;
  actionUrl?: string;
  targetRole?: string;
}

export interface NotificationRequestDTO {
  title: string;
  message: string;
  type: NotificationType | string;
  targetRole?: UserRole | string;
  targetUserId?: number;
  routeId?: number;
}

// ------------------------------------------
// Report & Dashboard Types
// ------------------------------------------

export interface DashboardSummary {
  totalStudents: number;
  totalParents: number;
  totalDrivers: number;
  totalVehicles: number;
  activeVehicles: number;
  activeRides: number;
  completedRidesToday: number;
  pendingProblemRides: number;
  attendanceRateToday: number;
  recentActivities: {
    id: string | number;
    title: string;
    description: string;
    timestamp: string;
    type: string;
  }[];
  weeklyRides?: {
    day: string;
    completed: number;
    delayed: number;
  }[];
  vehicleStatusDistribution?: {
    status: string;
    count: number;
  }[];
}

// ------------------------------------------
// Common API Response / Pagination
// ------------------------------------------

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
