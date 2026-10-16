CarryLink — Journey-Based Delivery Platform

CarryLink is a full-stack web application that connects senders who need to deliver small permitted items with travellers who have spare carrying capacity on an existing journey.

Instead of creating a separate trip solely for delivery, the platform helps users discover compatible journeys, coordinate delivery requests, and manage bookings through a shared delivery workflow.

Key Features

- Authentication and authorization: JWT-based authentication, role-based access, and request validation.
- Trip management: Create trips with ordered route stops and manage their active status.
- Delivery requests: Submit delivery requirements for permitted items.
- Route-based matching: Identify compatible trips using route overlap, time windows, available capacity, and active status.
- Booking workflow: Propose bookings, accept proposals, and manage booking status transitions.
- Persistent data: H2 for local development by default, with MySQL support.
- Containerized setup: Docker Compose configuration for local infrastructure.

Feature availability should be verified against the current implementation before publishing.

Tech Stack

Layer| Technologies
Frontend| React, Vite, JavaScript
Backend| Java 17, Spring Boot
Security| Spring Security, JWT
Database| H2, MySQL
Persistence| Spring Data JPA, Hibernate
Validation| Jakarta Bean Validation
Development| Maven, npm, Docker Compose

Project Structure

pro/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite client
├── docs/             # API documentation and roadmap
├── docker-compose.yml
├── start-carrylink.cmd
└── README.md

Getting Started

Prerequisites

Install Java 17, Node.js with npm, and Maven. Docker is optional for the default H2 development setup.

Option 1: Windows Quick Start

Run "start-carrylink.cmd" from the project root. If the launcher is configured correctly, it starts the frontend and backend in separate terminal windows and opens the application in your browser.

Keep the terminal windows open while using the application.

Option 2: Run Manually

1. Start the backend

Open a terminal in the project root:

cd backend
mvn spring-boot:run

The API is expected at "http://localhost:8080".

If Maven is not installed globally, use the project's Maven Wrapper if it is present and configured.

2. Start the frontend

Open a second terminal in the project root:

cd frontend
npm install
npm run dev

Open "http://localhost:5173" in your browser.

Database Configuration

The default local configuration uses H2. To use MySQL, configure the database connection through the application's supported environment variables and ensure the database is running.

The repository includes a Docker Compose configuration. Review "docker-compose.yml" and the Spring Boot database configuration before choosing the MySQL startup procedure.

Do not use development database credentials in a production deployment.

API Overview

The API includes endpoints for authentication, trips, delivery requests, matching, and bookings.

Examples from the current API design:

- "POST /api/auth/register" — register a user
- "POST /api/auth/login" — authenticate a user
- "POST /api/trips" — create a trip
- "GET /api/trips/matches" — discover matching trips
- "POST /api/requests" — create a delivery request
- "GET /api/requests/matches" — discover compatible requests
- "POST /api/bookings" — create a booking proposal
- "PATCH /api/bookings/{id}/accept" — accept a booking proposal
- "PATCH /api/bookings/{id}/status" — update booking status

See "docs/API.md" for request examples and the implemented state-transition rules. Confirm the routes and methods against the source code before relying on this list.

Scope and Future Work

The initial focus is journey creation, delivery-request creation, route matching, and booking coordination.

Payment-provider integration, map services, identity-document review, dispute resolution, notifications, and administrative moderation are planned extensions rather than claims of completed functionality unless implemented in the current version.

Real payment integration should include secure payment processing, webhook verification, and reconciliation.

Security Notes

- Keep secrets and environment files out of version control.
- Use strong, externally configured secrets for deployment.
- Never rely on local development settings for production security.
- Do not use real sensitive personal or payment information in testing.

License

No license has been specified yet. Add one if you intend to define how others may use, modify, and distribute this project.