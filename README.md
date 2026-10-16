# CarryLink

CarryLink matches senders with verified travellers who have spare capacity on an existing journey. This repository is a serious internship-level modular monolith starter with:

- Spring Boot REST API with JWT authentication, Bean Validation, role authorization, and transactional booking/capacity handling
- MySQL schema managed by JPA/Hibernate
- Constraint-based route-stop matching (route overlap, time window, capacity, and active status)
- React + Vite client for registration, trip/request creation, matching, and booking state transitions
- Docker Compose for local MySQL and the API

## Run locally

### Easiest Windows launch

Double-click `start-carrylink.cmd` in the project folder. It opens separate backend and frontend windows and then opens the app at `http://localhost:5173`.

Keep both command windows open while using CarryLink. To stop the app, press `Ctrl+C` in each window.

### Save and reopen the project

Keep the complete `pro` folder together. The important folders are:

- `frontend` - React/Vite web interface
- `backend` - Spring Boot API
- `docs` - project documentation

To open the source in VS Code, right-click the `pro` folder and choose **Open with Code**, or run:

```powershell
code .
```

For a backup, copy the whole `pro` folder to another drive or upload it to a private GitHub repository. Do not delete `frontend/package-lock.json` or `backend/mvnw.cmd`; they make setup more reproducible.

### Backend

```powershell
cd backend
$env:JAVA_HOME='C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot'
$env:Path="$env:JAVA_HOME\bin;C:\Tools\apache-maven-3.9.9\bin;$env:Path"
mvn.cmd spring-boot:run
```

The API starts on `http://localhost:8080`. By default, the app starts with an embedded H2 database for local development, so you do not need Docker just to run the project. If you want MySQL instead, set `DB_URL`, `DB_USER`, and `DB_PASSWORD` or use Docker Compose.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The UI starts on `http://localhost:5173`.

### MySQL with Docker

```powershell
docker compose up -d mysql
```

The default local database is `carrylink`, user `carrylink`, password `carrylink`.

## Product scope

The initial release deliberately focuses on the highest-value workflow:

1. A user registers and logs in.
2. A traveller creates a trip and ordered stops.
3. A sender creates a permitted-item delivery request.
4. The matching engine finds compatible route segments.
5. Either side can approach the other with a booking proposal; the other person accepts it before capacity is reserved.
6. The sender authorizes payment, marks the package collected, and the traveller marks it departed and reached. Both dashboards show the same delivery timeline.

Payment, Maps, identity-document review, disputes, notifications, and admin moderation are modelled as next modules in `docs/ROADMAP.md`. A real payment provider should only be connected after the booking state machine and webhook reconciliation are in place.

## API highlights

- `POST /api/auth/register`, `POST /api/auth/login`
- `POST /api/trips`, `GET /api/trips/matches`
- `POST /api/bookings`, `PATCH /api/bookings/{id}/accept`, `PATCH /api/bookings/{id}/status`
- `POST /api/requests`, `GET /api/requests/matches`
- `POST /api/bookings`, `PATCH /api/bookings/{id}/status`

See `docs/API.md` for request examples and state rules.
