# 🚍 SafeRide Backend

SafeRide is a School Transport Management System developed using Spring Boot. It helps schools manage students, parents, drivers, vehicles, routes, rides, attendance, notifications, and live vehicle tracking securely.

---

# 🚀 Features

- JWT Authentication & Authorization
- Role Based Access (ADMIN, PARENT)
- Student Management
- Parent Management
- Driver Management
- Vehicle Management
- Route Management
- Stop Management
- Ride Management
- Student Ride Attendance
- Vehicle Live Location
- Notification Management
- Dashboard Statistics
- Global Search
- Reports
- Swagger API Documentation
- Docker Support

---

# 🛠 Tech Stack

- Java 21
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA
- MySQL 8
- Maven
- Docker
- Swagger OpenAPI
- JUnit 5
- Mockito

---

# 📁 Project Structure

```
src
 ├── controller
 ├── service
 ├── serviceimpl
 ├── repository
 ├── entity
 ├── dto
 ├── config
 ├── security
 ├── exception
 ├── util
 └── test
```

---

# ⚙️ Run Locally

```bash
git clone <repository-url>

cd saferide-backend

mvn clean install

mvn spring-boot:run
```

---

# 🐳 Run with Docker

```bash
docker compose up --build
```

Backend

```
http://localhost:8081
```

Swagger

```
http://localhost:8081/swagger-ui/index.html
```

---

# 🔐 Authentication

Register

```
POST /api/auth/register
```

Login

```
POST /api/auth/login
```

Use returned JWT token as

```
Authorization: Bearer <token>
```

---

# 📚 Main APIs

- Authentication
- Dashboard
- Students
- Parents
- Drivers
- Vehicles
- Routes
- Stops
- Rides
- Notifications
- Reports
- Search

---

# 🧪 Testing

- Unit Tests
- Integration Tests
- Mockito
- JUnit 5

---

# 📦 Docker

```
Dockerfile
docker-compose.yml
```

---

# 👨‍💻 Author

Harshvardhan Patil

SafeRide Backend Project

2026