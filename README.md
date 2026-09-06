# Coding Platform — Backend

Spring Boot 3.4 / Java 21 backend for the **Web Platform for Coding Practice and
Performance Assessment**. Built to match the schema in `web_coding_platform_setup.sql`
and the module breakdown in the project milestone document.

## What's implemented

- **Auth**: JWT-based register/login, BCrypt password hashing, role-based access
  (`USER` / `ADMIN`) via Spring Security 6.
- **Problem bank**: full CRUD (admin-only for write), difficulty filter, hidden vs.
  visible (sample) test cases — non-admins only ever see `isSample = true` test cases
  in API responses.
- **Submissions**: submit code, evaluated synchronously against every stored test
  case, verdict lifecycle `PENDING → RUNNING → ACCEPTED / WRONG_ANSWER /
  COMPILATION_ERROR / RUNTIME_ERROR / TIME_LIMIT_EXCEEDED`, per-user submission
  history, rate limiting (max 5 submissions per problem per minute per user,
  configurable).
- **Leaderboard**: global ranking by total score, recalculated after every accepted
  submission.
- **Code execution engine**: `LocalProcessCodeExecutionService` compiles/runs Java,
  Python, C++, and JavaScript via `ProcessBuilder` with a wall-clock timeout per
  test case. **Read the "Code execution — important limitation" section below before
  deploying this anywhere with untrusted users.**
- **Swagger / OpenAPI**: `springdoc-openapi` at `/swagger-ui.html` and
  `/v3/api-docs`, titled "Coding Practice Platform API".
- **Flyway migrations** creating the full schema on first boot; a `DataSeeder`
  seeds one admin user, one regular user, and 4 sample problems (with real
  BCrypt hashes, generated through the actual `PasswordEncoder` bean rather than
  hardcoded hash strings).

## Code execution — important limitation

`LocalProcessCodeExecutionService` runs submitted code as a local OS process on
the same machine as the Spring Boot app. It enforces a **timeout** but does
**not** provide:

- filesystem or network isolation
- a hard memory cap (only `-Xmx512m` is passed to the JVM for Java; other
  languages are unconstrained)
- a non-privileged execution user

This is fine for local development/demos with code you trust, but **do not
expose the `/api/submissions` endpoint to untrusted users in this configuration**.
For production, implement `CodeExecutionService` with a Docker-backed version
instead — one container per language (`openjdk:17`, `python:3.11`, `gcc:latest`),
run with `--network=none --memory=512m`, and a supervised timeout — as described
in the project's Weeks 1-2 requirements. The interface is already isolated
behind `CodeExecutionService`, so this is a single new `@Service` bean plus a
`@Primary`/profile swap — no controller or service-layer changes needed.

The bundled `Dockerfile` only installs the JDK, so out of the box the
containerized app can run **Java** submissions only. Install `python3`, `g++`,
and `nodejs` in the image (or point at a separate sandbox) to support the other
languages.

## Running locally

### 1. Database

```bash
createdb coding_platform
```

Flyway creates the schema automatically on first boot — you do **not** need to
run `web_coding_platform_setup.sql` yourself (its schema is superseded by the
Flyway migration in `src/main/resources/db/migration`, which adds a few extra
columns: `topic_tags`, `starter_code`, `time_limit_ms`, `memory_limit_mb`,
`created_by`).

Update credentials in `src/main/resources/application.properties` if your local
Postgres isn't `postgres`/`postgres` on `localhost:5432`.

### 2. Build & run

```bash
mvn clean install
mvn spring-boot:run
```

Or import as an existing Maven project in Spring Tool Suite / IntelliJ, run
Maven → Update Project, then run `CodingPlatformApplication`.

### 3. Docker Compose (Postgres + app)

```bash
docker compose up --build
```

## Default seeded accounts

| Role  | Email                       | Password   |
|-------|------------------------------|-----------|
| ADMIN | admin@codingplatform.com     | Admin@123 |
| USER  | alex@example.com             | User@123  |

Change these before any real deployment.

## API surface

Swagger UI: `http://localhost:8080/swagger-ui.html`

| Method | Endpoint                          | Auth          |
|--------|------------------------------------|---------------|
| POST   | `/api/auth/register`               | public        |
| POST   | `/api/auth/login`                  | public        |
| GET    | `/api/users/me`                    | authenticated |
| GET    | `/api/problems`                    | authenticated |
| GET    | `/api/problems/{id}`               | authenticated |
| GET    | `/api/problems/difficulty/{level}` | authenticated |
| POST   | `/api/problems`                    | ADMIN         |
| PUT    | `/api/problems/{id}`               | ADMIN         |
| DELETE | `/api/problems/{id}`               | ADMIN         |
| POST   | `/api/submissions`                 | authenticated |
| GET    | `/api/submissions/me`              | authenticated |
| GET    | `/api/submissions/{id}`            | authenticated |
| GET    | `/api/leaderboard`                 | authenticated |

## What's intentionally out of scope here

This build focused on the backend core (entities, auth, controllers, a working
— but not sandboxed — execution engine) rather than the full mega-scope from
the original prompt (Docker-per-language sandbox, hint/editorial system,
weekly/language-specific leaderboards, the full React/Monaco/Tailwind
frontend). Those are substantial standalone efforts — happy to build any of
them out next as a focused follow-up.

## Project structure

```
src/main/java/com/platform/
├── config/          SecurityConfig, OpenApiConfig, DataSeeder
├── controller/       Auth, Problem, Submission, Leaderboard, User
├── service/           AuthService, ProblemService, SubmissionService, LeaderboardService
│   └── execution/      CodeExecutionService + LocalProcessCodeExecutionService
├── repository/       Spring Data JPA repositories
├── entity/            User, Problem, TestCase, Submission, SubmissionResult, Leaderboard, enums
├── dto/                Request/response DTOs, per feature
├── security/          JWT filter/util, UserPrincipal, UserDetailsService
├── mapper/            Entity → DTO mappers
└── exception/         Custom exceptions + GlobalExceptionHandler
```
