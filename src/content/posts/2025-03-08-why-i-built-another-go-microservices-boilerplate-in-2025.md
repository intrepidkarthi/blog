---
title: "why I built another Go microservices boilerplate in 2025"
date: 2025-03-08
slug: why-i-built-another-go-microservices-boilerplate-in-2025
excerpt: "There are a thousand Go microservices boilerplates. I built another one. Here are the specific opinions baked into it that the alternatives did not have together."
tags: [go, microservices, boilerplate, grpc, kafka, postgresql, sqlc, infrastructure]
---

There are a thousand Go microservices boilerplates on GitHub. Most of them have the same components — HTTP handlers, database integration, Docker, some kind of logger. Picking one to start from is easier than building one from scratch, in principle.

In practice, every time I started a new Go service in 2024, I ended up half-rewriting whichever boilerplate I had cloned. The opinions did not match my opinions. The technology choices were one or two years out of date. The structure assumed a specific deployment target I did not use.

In February 2025 I built another one at [intrepidkarthi/golang-boilerplate](https://github.com/intrepidkarthi/golang-boilerplate). The stack is deliberately opinionated. Here is what is in it, why each choice is what it is, and what the boilerplate replaces.

## the stack

```
HTTP server         │ Gin
gRPC server         │ google.golang.org/grpc
database            │ PostgreSQL
sql layer           │ sqlc (type-safe code generation from SQL)
cache               │ Redis
streaming           │ Kafka
logger              │ Zap (structured)
config              │ environment variables
docs                │ Swagger/OpenAPI auto-generated
container           │ Docker + docker-compose
linting             │ golangci-lint
security            │ gosec
migrations          │ golang-migrate
hot reload          │ air
```

Both REST and gRPC services run from the same binary. The HTTP server and gRPC server share business logic via the service layer.

## why sqlc, not GORM or ent

The single most opinionated choice in the boilerplate. sqlc generates Go code from SQL queries; you write SQL, it produces typed Go functions.

```sql
-- queries.sql
-- name: GetUser :one
SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: ListActiveUsers :many
SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC;
```

```go
// generated code
func (q *Queries) GetUser(ctx context.Context, id int64) (User, error) { ... }
func (q *Queries) ListActiveUsers(ctx context.Context) ([]User, error) { ... }
```

The advantages over GORM and ent:

- **Compile-time SQL validation.** sqlc validates each query against the database schema at code generation time. Typos and schema drift fail the build, not production.
- **No ORM magic.** The generated code is plain Go calling pgx. There is no query builder, no lazy loading, no surprise N+1 problems. The SQL you wrote is the SQL that runs.
- **Performance is predictable.** Profiling shows you sqlc calls and the underlying Postgres queries. There is no ORM layer to instrument or work around.

The disadvantages: you write more SQL than you would with a query builder. For CRUD-heavy applications with simple queries, GORM might be faster to develop initially. For anything with non-trivial queries, sqlc wins on maintainability over the project's lifetime.

The boilerplate ships with sqlc as the default. If a project genuinely needs a query builder, that is a per-project decision; the boilerplate optimises for the common case where typed SQL is what you want.

## why both gRPC and REST

Most Go microservices need both. REST is what frontends and external partners call. gRPC is what other services in the system call internally. Building one and adding the other later means rewriting the service layer when you do.

The boilerplate has both from day one. The service layer is shared:

```
/api/http   ← Gin handlers, REST endpoints
/api/grpc   ← gRPC implementations
/internal/service  ← business logic, called by both
```

Both endpoints serve the same operations. Adding a new operation means defining it once in the service layer, then exposing it via the HTTP handler and the gRPC implementation. The Swagger documentation generates automatically from the HTTP layer; the gRPC `.proto` files are version-controlled and consumed by client services.

This is heavier than building only one of the two. It is also the configuration most real production Go services end up in within 6-12 months. Starting there saves the rewrite later.

## why Kafka

For event-driven architecture, Kafka is the default. The boilerplate ships with a Kafka producer and consumer setup, configurable via env vars, with both sync and async patterns.

The alternative is to start with no event bus and add one later. That works fine for small services. It fails badly for any service that grows past two or three downstream consumers — the "we'll just add Kafka later" plan turns into a multi-month migration during which inter-service contracts are negotiated and re-negotiated.

Starting with Kafka in the boilerplate means the service can publish events on day one. The boilerplate's Kafka layer handles the producer setup, consumer groups, error handling, and graceful shutdown. Adopters do not have to think about it until they have a real event to publish.

If the project genuinely does not need Kafka, removing it is mechanical (delete a folder and a few config lines). Adding it later is not.

## why Zap, not the standard log package

`log/slog` (Go 1.21+) is now perfectly capable for structured logging. Zap predates slog and was the de facto standard for high-performance structured logging in Go for years. The boilerplate uses Zap because:

- The ecosystem of Zap-compatible middleware, sinks, and integrations is mature.
- Performance benchmarks show Zap is still ~20% faster than slog for high-throughput logging.
- The Zap API is familiar to most production Go developers.

This is the choice I am least confident about. In 2026 or 2027, slog will likely have closed the performance gap and the ecosystem will have caught up. Switching the boilerplate to slog at that point is straightforward.

For now, Zap is the choice. The logging interface in the boilerplate is abstracted enough that a future migration is local, not global.

## what the boilerplate replaces

For a developer starting a new Go service, the boilerplate replaces about a week of setup work.

```
without boilerplate         │ with boilerplate
─────────────────────────────────────────────────────────────
day 1: project structure    │ day 1: clone, replace placeholders
day 2: HTTP server, routing │ day 1: HTTP server is working
day 3: database integration │ day 1: sqlc setup is done
day 4: gRPC setup            │ day 1: gRPC server is working
day 5: Kafka producer setup │ day 1: Kafka is wired up
day 6: Docker, compose       │ day 1: docker-compose up works
day 7: linting, security    │ day 1: gosec and golangci-lint run
                              │
                              │ day 2: write actual business logic
```

The boilerplate's value is in the days saved, not in the technology choices being uniquely brilliant. Other boilerplates have similar stacks. The specific opinions in this one match how I prefer to build, which is the only reason it exists at all.

## what is not in the boilerplate

Three deliberate omissions.

**Authentication and authorisation.** Every project needs different auth. The boilerplate does not pick one — no JWT middleware, no OAuth integration, no session management. Adopters add what they need.

**Frontend.** The boilerplate is backend-only. There is no React, no Vue, no UI scaffolding. Pair it with whatever frontend stack you prefer.

**Production deployment manifests.** No Kubernetes manifests, no Terraform, no Helm charts. The boilerplate runs in docker-compose for local development. Production deployment is a separate concern that depends on the target environment.

Adding any of these is straightforward. Including them by default would have biased the boilerplate toward specific architectural choices that not every adopter shares.

## the close

Boilerplates exist because starting a service from scratch is a known week of work that nobody enjoys. The right boilerplate compresses that to a day.

The wrong boilerplate is the one whose opinions do not match yours. Picking someone else's boilerplate that you mostly agree with, but mostly does not, ends with you rewriting half of it. Faster to start from one that aligns with your defaults.

If your defaults match mine — sqlc over GORM, gRPC+REST together, Kafka from day one, gosec in CI, Docker for local dev — this boilerplate works. If they do not, build your own or pick a different one. The cost of writing one boilerplate is meaningful but small; the cost of using the wrong one across many projects compounds badly.

I built this one for myself. Sharing it on GitHub costs nothing. If it saves another developer a week of setup, that is the entire upside, and it is enough.
