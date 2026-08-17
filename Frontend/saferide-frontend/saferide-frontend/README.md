# SafeRide — Frontend

A React + Vite frontend for the SafeRide school transport safety platform, built directly against
the `saferide-backend` Spring Boot API (no mock data — every screen calls the real endpoints).

## 1. Overview

SafeRide tracks students from home to school and back: admins manage the network (students, parents,
drivers, vehicles, routes, stops), drivers run rides and log pickups/drop-offs, and parents get live
notifications and bus tracking for their child.

This frontend implements three role-specific experiences on top of the existing backend:

- **Admin** — full CRUD over students, parents, drivers, vehicles, routes, and stops; ride scheduling
  and lifecycle control (start/end); notification management; reports; global search; a stats dashboard.
- **Driver** — start/end an assigned ride, log student pickup/drop-off events, and push vehicle GPS
  location updates.
- **Parent** — view notifications (with unread filtering and mark-as-read), look up a child's ride
  events, and track the bus's last known location on a map link.

## 2. Frontend technology

- **React 19** + **Vite** — build tooling and dev server
- **React Router 7** — routing, nested layouts, protected routes
- **Axios** — HTTP client with a centralized instance (JWT attach, normalized error handling)
- **Tailwind CSS 3** — utility-first styling with a SafeRide-specific design system (navy/amber palette)
- **jwt-decode** — reading the JWT payload client-side (see note on authentication below)

## 3. Project structure

```
src/
├── api/            # One module per backend resource — the only place that calls axios directly
├── components/     # Reusable UI: forms, tables, modals, badges, nav, protected routes
│   ├── admin/      # Generic CRUD table/form/page used by every admin resource screen
│   └── ui/         # Buttons, inputs, spinners, empty/error states, pagination, dialogs
├── context/         # AuthContext (session/JWT/role) and ToastContext (notifications)
├── hooks/          # useAuth, useToast, useResourceList, useOptions, useLocalProfile
├── layouts/        # AdminLayout, DriverLayout, ParentLayout, AuthLayout — each with its own nav
├── pages/
│   ├── auth/       # Login, Register
│   ├── admin/      # Dashboard, Students, Parents, Drivers, Vehicles, Routes, Stops,
│   │                 Rides, Notifications, Reports, Search
│   ├── driver/     # RideControl, StudentEvents, VehicleLocation, Setup
│   └── parent/     # Notifications, StudentEvents, Tracking, Setup
├── utils/          # formatters, constants (roles, enums)
└── styles/         # Tailwind entry + component classes
```

## 4. Installation

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend runs elsewhere
npm run dev
```

The app runs at `http://localhost:5173`.

## 5. Environment variables

| Variable              | Description                                   | Default                |
|------------------------|------------------------------------------------|-------------------------|
| `VITE_API_BASE_URL`    | Base URL of the backend (no `/api` suffix)     | `http://localhost:8081` |

## 6. Running the backend

The backend is a Spring Boot 4 app (`saferide-backend/`) with:

- **Port:** `8081` (from `application.properties`; the `.env`/`docker-compose.yml` port of `8080` is
  only used when running the backend in Docker — plain `mvn spring-boot:run` uses `8081`).
- **Database:** MySQL 8, database name `saferide_db`. Create it and set credentials in
  `saferide-backend/src/main/resources/application.properties` before starting.
- **CORS:** the backend's `SecurityConfig` only allows requests from `http://localhost:5173` — **run
  the frontend dev server on port 5173** (the Vite default; the commands above already do this) or
  requests will be blocked by CORS.

```bash
cd saferide-backend
mvn spring-boot:run
```

Then, in another terminal, start the frontend as described above.

## 7. API configuration

All backend calls go through `src/api/client.js`, an Axios instance that:

- Prefixes every request with `${VITE_API_BASE_URL}/api`
- Attaches `Authorization: Bearer <token>` from `localStorage` automatically
- Normalizes every backend error shape (validation-error maps, `ApiErrorResponse`, default Spring
  error bodies, network failures) into a consistent `{ status, message, fieldErrors }` shape used
  throughout the UI
- Triggers an automatic logout on `401` responses

Resource-specific modules (`students.js`, `rides.js`, `notifications.js`, etc.) wrap the exact
endpoints, query params, and payload shapes implemented by the backend controllers.

## 8. Authentication flow

1. `POST /api/auth/register` creates a `User` with a chosen role (`ADMIN`, `DRIVER`, or `PARENT`).
2. `POST /api/auth/login` returns `{ token, message }` — **the backend does not return user info on
   login.** The frontend decodes the JWT locally to read the account's email (the token's `sub`
   claim), then calls `GET /api/users/authorities` to resolve the role. This combined `{ email, role }`
   is cached in `localStorage` and re-validated (expiry check) on every page load.
3. Every subsequent request carries the JWT as a bearer token. A `401` clears the session and redirects
   to `/login`.
4. Routes are gated by `<ProtectedRoute roles={[...]}>`, which redirects unauthenticated users to
   `/login` and users with the wrong role to `/unauthorized`.

### A known backend gap this frontend works around

The backend has **no endpoint linking a logged-in `User` account to its `Driver` or `Parent` record**
(no "my profile" endpoint), and the `Driver`/`Parent`/`Ride` list & search endpoints are admin-only.
This means a driver or parent has no API-supported way to discover their own `driverId`, `parentId`,
`vehicleId`, or assigned ride IDs.

The frontend works around this with a one-time **"My IDs"** setup screen (`/driver/setup`,
`/parent/setup`) where the person enters IDs given to them by an admin. These are stored in the
browser only (scoped per account email, never sent anywhere except as the parameters the existing
endpoints already require) and reused across the driver/parent screens. This was a deliberate choice
to avoid inventing new backend endpoints — if the backend adds a `/me`-style endpoint later, these
setup screens can be replaced with an automatic lookup.

A second, smaller gap: `GET /api/notifications/parent/{parentId}` does not verify that the
authenticated parent owns that `parentId` — any authenticated parent can view another parent's
notifications by changing the ID. This is a backend authorization issue, not something the frontend
can fully close; it's flagged here for visibility.

## 9. User roles

| Role     | Home route | Can do |
|----------|-----------|--------|
| `ADMIN`  | `/admin`  | Full CRUD on students, parents, drivers, vehicles, routes, stops; schedule/start/end/delete rides; send/manage notifications; view reports; global search; dashboard stats |
| `DRIVER` | `/driver` | Start/end a ride by ID; log student pickup/drop-off events; push and review vehicle GPS updates |
| `PARENT` | `/parent` | View/filter notifications and mark them read; look up a child's ride events; view the bus's last known location |

## 10. Main features

- Centralized, typed-by-convention API layer with consistent error handling
- JWT auth with persistence, expiry checks, and automatic logout on 401
- Role-based routing and navigation (admin/driver/parent each get their own layout and sidebar)
- Reusable, schema-driven admin CRUD (`CrudPage` + `ResourceTable` + `ResourceFormModal`) powering six
  parallel admin resource screens from one generic implementation
- Ride lifecycle control (schedule → start → end) with live status badges
- Debounced search + pagination on every paginated list
- Loading, error, and empty states on every data view
- Toast notifications for every create/update/delete/action outcome
- Responsive layout: collapsible mobile nav, responsive tables/cards, mobile-first forms

## 11. Testing this yourself

This project was built and verified with:

```bash
npm install
npm run build   # production build — passes cleanly
npm run lint    # oxlint — passes with 0 errors (a few informational fast-refresh warnings only)
npm run dev     # dev server boots and serves the app correctly
```

**Full end-to-end testing against a live backend (register → login → CRUD → ride lifecycle →
notifications) could not be completed in the environment this frontend was built in**, because that
environment has no MySQL server and no Maven/internet access to build and run the Spring Boot backend.
Every API call was instead built and cross-checked directly against the backend's actual controllers,
DTOs, enums, and security annotations (endpoint paths, HTTP methods, request/response field names,
and per-role `@PreAuthorize` rules were all read from source, not assumed).

To finish verification on your machine:

1. Start MySQL and create the `saferide_db` database.
2. `cd saferide-backend && mvn spring-boot:run`
3. `cd saferide-frontend && npm install && npm run dev`
4. Register an `ADMIN` account first, sign in, and use the Admin UI to create a parent, a vehicle, a
   driver (assigned to that vehicle), and a student — then register `DRIVER`/`PARENT` accounts and use
   the "My IDs" screens to link them to the records the admin created.
5. Schedule and start a ride as admin, then use the driver's Ride Control page (with the matching ride
   ID) to end it and log student events; check that the parent's Notifications/Ride Events pages reflect
   the activity.

If anything doesn't match — a field name, a status code, a response shape — it means the backend
changed after this frontend was built against it; the fix is almost always a one-line update in the
relevant `src/api/*.js` module.
