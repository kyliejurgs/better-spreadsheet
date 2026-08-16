# Better Spreadsheet Backend Coding Standards

# 1. Purpose

This document defines backend-specific coding standards for Better Spreadsheet. These standards supplement the master Coding Standards and apply to the Java and Spring Boot backend.

The documentation hierarchy remains:

1. Knowledge Model — product and domain semantics
2. System Design Document — architecture and system behavior
3. Master Coding Standards — cross-cutting implementation standards
4. Backend Coding Standards — Java and Spring Boot implementation conventions

When this document does not define a backend-specific rule, follow the master Coding Standards.

# 2. Java

## 2.1 Modern Java

Use modern Java language features when they improve readability, correctness, or maintainability.

Records, switch expressions, pattern matching, local variable type inference, and similar features are appropriate when they make the code clearer. Do not use newer language features solely because they are available.

## 2.2 Type Safety

Use concrete, meaningful types for domain concepts and application contracts.

Avoid raw types, unchecked casts, generic maps, and loosely typed representations when the data can reasonably be modeled. Suppress unchecked warnings only when necessary and with the narrowest practical scope.

## 2.3 Local Variable Type Inference

`var` is acceptable when the resulting type is obvious from the expression or when the explicit type adds little information. Prefer an explicit type when it communicates information important to understanding the code.

Good:

    var workspace = new Workspace(workspaceId, name);
    var records = new ArrayList<Record>();

Less useful:

    var result = process(request);
    var data = load();

Readability determines whether `var` is appropriate.

## 2.4 Records

Prefer Java records for immutable data carriers and value-like types when their semantics fit. Common candidates include:

- Requests
- Responses
- Results
- Coordinates
- Operation context
- Simple value objects

Use ordinary classes when identity, lifecycle, mutability, framework requirements, or richer behavior make them more appropriate. Do not force domain entities or persistence entities into records merely to reduce boilerplate.

## 2.5 Interfaces

Interfaces should represent meaningful abstractions. Do not automatically create an interface for every service or concrete class. Avoid patterns when only one implementation exists and the interface provides no architectural value.

Introduce interfaces when:

- Multiple implementations exist or are reasonably expected.
- Substitution provides concrete value.
- The abstraction represents an architectural boundary.
- Infrastructure is implementing an application-owned contract.
- A framework or integration requires the abstraction.

Testing alone does not require every class to have an interface.

## 2.6 Collections

Program to an appropriate collection abstraction when the implementation does not matter to the contract.

Choose collection implementations according to their required semantics and expected workload rather than exposing a specific implementation unnecessarily. For example:

    List<Record>
    Set<FieldId>
    Map<RecordId, Record>

## 2.7 Optional

Use `Optional` primarily for return values where absence is a legitimate outcome. Do not use `Optional` mechanically for fields, method parameters, or every nullable concept. Domain models should represent optionality in the form that most accurately describes their semantics.

## 2.8 Streams

Use Java Streams when they make collection transformations or aggregations easier to understand. Prefer ordinary loops when a stream pipeline becomes difficult to follow, contains substantial branching or mutation, or obscures the algorithm. Do not treat stream-based code as inherently superior to imperative code.

# 3. Backend Source Organization

## 3.1 Technical-Layer-First Organization

Organize backend source primarily by technical responsibility.

The expected high-level structure is conceptually:

    src/main/java/.../
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    ├── dto/
    ├── security/
    ├── config/
    └── exception/

Additional top-level areas may be introduced when they represent a clear backend responsibility.

## 3.2 Domain Grouping

Within technical layers, group code by domain or feature when doing so improves navigation.

For example:

    controller/
    ├── workspace/
    ├── table/
    ├── view/
    └── query/

    service/
    ├── workspace/
    ├── table/
    ├── view/
    └── query/

Do not introduce domain sub-packages before the number or complexity of classes makes them useful.

## 3.3 Package Structure

Package structure should reflect actual responsibilities. Do not create empty or unnecessary package levels solely to maintain symmetry across technical layers. Cross-application concerns such as configuration, security, and exception handling do not need artificial domain groupings.

## 3.4 Package Visibility

Use the narrowest practical visibility. Classes, methods, and constructors should not be `public` merely by default.

Use package-private access when an implementation is internal to a package and no external contract requires broader visibility.

# 4. Spring Architecture

## 4.1 Spring Usage

Use Spring Boot and Spring Framework capabilities where they provide clear application or infrastructure value.

Prefer standard Spring mechanisms over application-specific replacements when Spring already solves the problem cleanly. Do not introduce Spring abstractions where ordinary Java is sufficient.

## 4.2 Dependency Injection

Use constructor injection as the standard dependency-injection mechanism.

Dependencies should generally be `final`. Do not use field injection. For a class with a single constructor, do not add `@Autowired` when Spring can infer constructor injection automatically.

## 4.3 Dependency Construction

Application services should receive their dependencies through dependency injection rather than constructing infrastructure dependencies directly. Ordinary domain/value objects that are not Spring-managed should remain ordinary Java objects.

## 4.4 Spring Annotations

Use Spring annotations when they make framework behavior clear and intentional. Avoid custom annotation, reflection, or AOP mechanisms that hide significant application behavior or make execution difficult to trace. Important domain operations should remain understandable from ordinary code flow.

## 4.5 Framework Boundaries

Spring-specific types and behavior should remain near the boundaries where they are needed. Avoid unnecessarily coupling domain behavior to Spring APIs or annotations.

# 5. Controllers

## 5.1 Controller Responsibility

Controllers own HTTP concerns. Typical controller responsibilities include:

- Routes
- HTTP methods
- Path parameters
- Query parameters
- Request bodies
- Request validation
- HTTP status codes
- Response headers
- Response representation
- Authentication context where appropriate

Controllers must not own application business rules or persistence behavior.

## 5.2 Delegation

Delegate application operations to the appropriate service or application boundary. A controller may perform meaningful HTTP-specific work before or after delegation.

"Thin controller" does not mean every controller method must be a one-line pass-through.

## 5.3 Persistence

Controllers must not access repositories, persistence entities, JDBC, or database infrastructure directly.

## 5.4 HTTP Models

Do not expose persistence entities as HTTP contracts. Requests and responses may reuse domain representations when their semantics genuinely match, but HTTP concerns must not dictate persistence representation.

## 5.5 Response Semantics

Use HTTP status codes and response semantics intentionally.

Do not return `200 OK` for every successful operation merely for consistency. Use appropriate semantics such as creation, deletion, validation failure, authorization failure, conflict, and absence when they accurately describe the result.

# 6. Services and Application Logic

## 6.1 Service Responsibility

Services own application operations, business coordination, and appropriate domain behavior that does not naturally belong to a domain object. Services may coordinate repositories, domain objects, infrastructure boundaries, events, and other application services.

## 6.2 Service Scope

Prefer cohesive services with identifiable responsibilities. Avoid large services that become the default location for unrelated business logic. Do not split services solely to satisfy arbitrary class-size or method-count limits.

## 6.3 Service Dependencies

Service-to-service dependencies are acceptable when responsibilities genuinely require coordination. Repeated or circular dependencies between services should trigger reconsideration of responsibility and ownership.

## 6.4 Domain Behavior

Behavior that naturally belongs to a domain concept may live with that domain model rather than automatically being placed in a service. Do not create an anemic domain model solely because the application uses Spring services.

## 6.5 Application Operations

Meaningful user or system actions should be represented through clear application operations. Operations should preserve the domain invariants and lifecycle rules defined by the KM and SDD.

# 7. Repositories and Persistence

## 7.1 Repository Responsibility

Repositories define persistence boundaries. They are responsible for loading, storing, querying, and deleting persisted state according to their contracts. Repositories must not become a hidden location for application business rules.

## 7.2 Repository Interfaces

Repository interfaces are appropriate when they represent an application-owned persistence contract or when required by the selected persistence framework. Do not create redundant interface/implementation pairs without a meaningful reason.

## 7.3 Persistence Details

Database-specific behavior should remain within repository or persistence infrastructure boundaries. Do not leak SQL, JDBC, ORM session behavior, or persistence-specific implementation details into controllers or domain logic.

## 7.4 Query Behavior

Repository methods should clearly communicate their lookup and absence semantics.

Avoid ambiguous methods whose naming does not reveal whether they:

- Return one result
- Return multiple results
- Permit absence
- Require existence
- Perform mutation

## 7.5 Performance

Avoid obvious N+1 queries, unbounded database operations, and unnecessary loading of large object graphs. Choose query strategies according to expected scale and application behavior rather than relying blindly on ORM defaults.

# 8. Entities, Domain Models, and DTOs

## 8.1 Separate When Semantics Differ

Persistence entities, domain models, requests, responses, and other representations may be separate when their semantics differ. Do not create separate representations merely because architectural boundaries exist.

## 8.2 Persistence Entities

Persistence entities represent stored database state. Persistence requirements must not silently redefine domain semantics.

## 8.3 DTOs

Use DTOs when transport, validation, security, versioning, or representation requirements differ from internal application models. DTOs should represent meaningful contracts rather than mechanical copies of every domain class.

## 8.4 Mapping

Keep non-trivial mapping logic explicit and testable. Avoid reflection-heavy or automated mapping mechanisms when they make important conversions difficult to understand or debug. Simple mappings do not require dedicated mapper abstractions unless reuse or complexity justifies them.

## 8.5 Domain Identity

Use stable domain identity according to the KM and SDD. Do not substitute database row identity or persistence implementation details for application identity unless they intentionally represent the same concept.

# 9. Validation

## 9.1 Boundary Validation

Validate HTTP requests and other external input at the appropriate boundary. Use Jakarta Bean Validation where it clearly expresses structural request constraints.

## 9.2 Domain Validation

Do not treat request validation as a replacement for domain invariants. Domain and application rules must remain enforceable regardless of which transport or caller initiates an operation.

## 9.3 Validation Placement

Place validation with the responsibility that owns the rule.

Examples:

- HTTP shape requirements belong at the HTTP boundary.
- Domain invariants belong with the domain/application behavior.
- Persistence constraints belong in the persistence schema where appropriate.

Important invariants may intentionally be enforced at multiple layers for defense in depth.

## 9.4 Invalid User Data

Do not reject, normalize, or discard user data merely because it fails a validation rule when the KM explicitly permits that invalid or incomplete state to be preserved.

# 10. Exceptions and Error Handling

## 10.1 Exceptions

Use exceptions for exceptional failures and violated operation expectations. Do not use exceptions as routine control flow for expected domain outcomes when a normal result representation is clearer.

## 10.2 Exception Types

Use meaningful exception types when callers or boundaries need to distinguish failure categories. Do not create a unique exception class for every possible failure without a behavioral reason.

## 10.3 Cause Preservation

When translating or wrapping an exception, preserve the original cause and useful diagnostic context.

## 10.4 HTTP Translation

Translate application failures into HTTP responses through a centralized exception-handling boundary where practical. Controllers should not repeatedly implement identical exception-to-response mapping.

## 10.5 Error Responses

Error responses should provide enough information for the client to understand the failure without exposing stack traces, credentials, internal SQL, implementation details, or sensitive data.

# 11. Transactions

## 11.1 Transaction Boundaries

Transaction boundaries should correspond to meaningful atomic application operations. Place transactions intentionally rather than mechanically annotating every service or repository method.

## 11.2 Transaction Ownership

The application operation should generally own the transaction boundary. Repositories participate in the surrounding transaction rather than independently defining business transaction semantics.

## 11.3 Transaction Scope

Keep transactions no broader or longer than necessary for correctness. Do not hold database transactions open while waiting on external systems, network operations, object storage, or other slow infrastructure without a specific reason.

## 11.4 Failure Semantics

Operations that must succeed or fail atomically should execute within an appropriate transaction. Behavior spanning systems that cannot share a transaction must use explicit recovery, compensation, retry, or reconciliation semantics rather than pretending to be atomic.

# 12. Security

## 12.1 Server Authority

The backend is the authoritative enforcement boundary for server-side authorization. Frontend restrictions and hidden controls are user-experience behavior, not security enforcement.

## 12.2 Authentication

Use the authentication and identity model established by the SDD and Keycloak integration. Do not implement custom authentication primitives when established platform capabilities exist.

## 12.3 Authorization

Authorization rules should be explicit and applied at the appropriate application or endpoint boundary. Use Spring Security declarative capabilities such as method or route authorization when they make the rule clearer. Do not bury important authorization behavior in difficult-to-trace infrastructure.

## 12.4 User Identity

Do not accept authoritative user identity, ownership, or permissions solely from client-provided request data when the trusted authentication context can provide them.

## 12.5 Secrets

Secrets and credentials must remain outside source code and committed configuration. Use the project's approved runtime configuration and secret-management mechanisms.

# 13. Async and Background Work

## 13.1 Async Usage

Use asynchronous or background execution when it provides concrete value. Do not make operations asynchronous solely because the framework supports it.

## 13.2 Ownership

Background work must have an identifiable owner responsible for its lifecycle, failures, retries, and observability.

## 13.3 Failure Handling

Background failures must not disappear silently. Failures should be logged, surfaced, retried, preserved, or otherwise handled according to the operation's semantics.

## 13.4 Ordering and Concurrency

Do not rely accidentally on background operations executing or completing in a particular order. When ordering matters, represent and enforce that requirement explicitly.

## 13.5 Scheduled Work

Scheduled jobs should have clear ownership and should be safe under the deployment model defined by the SDD. Do not assume a scheduled method executes on only one application instance unless the architecture guarantees it.

# 14. Logging and Diagnostics

## 14.1 Structured Context

Backend logs should include useful structured context where applicable, such as:

- Request or correlation ID
- Domain operation ID
- Job ID
- Workspace ID
- Relevant object IDs
- Operation type
- State transition

Do not include contextual fields merely to increase log volume.

## 14.2 Sensitive Data

Do not log cell contents, file contents, credentials, authentication tokens, secrets, or other sensitive user payloads by default.

## 14.3 Exception Logging

Log exceptions at the boundary responsible for observing or handling them. Avoid repeatedly logging the same exception as it propagates through controller, service, and repository layers.

## 14.4 Log Levels

Use log levels according to operational significance. Routine method entry, exit, and ordinary execution should not generate informational logging.

# 15. Backend Naming

## 15.1 Java Naming

Follow standard Java naming conventions. Use:

- `PascalCase` for classes, records, interfaces, enums, and other types.
- `camelCase` for methods, fields, parameters, and local variables.
- `UPPER_SNAKE_CASE` for true constants.

## 15.2 Domain Terminology

Use KM and SDD terminology consistently. Do not introduce alternate names for established concepts merely because another framework or database term is familiar.

## 15.3 Class Names

Names should communicate responsibility.

Names such as `Manager`, `Helper`, `Util`, `Common`, or `Processor` should be used only when they accurately describe a specific responsibility.

Do not append `Impl` to concrete classes merely because they implement an interface. Prefer names that describe the implementation when multiple implementations exist.

For example:

    ObjectStorage
    GarageObjectStorage
    LocalObjectStorage

rather than:

    ObjectStorage
    ObjectStorageImpl

## 15.4 Method Names

Method names should communicate intent and meaningful side effects. Use consistent verbs for related operations. Avoid naming a mutating or persistent operation as though it were a simple lookup or calculation.

# 16. Backend Tooling

## 16.1 Compiler

Use the configured Java compiler and language level consistently across development, CI, and production builds. Compiler warnings should be treated seriously and should not be globally disabled to accommodate isolated code.

## 16.2 Formatting

Use the project's configured formatter as the authority for mechanical Java formatting. Do not spend code-review effort debating formatting that can be automated.

## 16.3 Static Analysis

Use the project's configured static-analysis tools for automatable correctness and maintainability checks. Suppressions must be narrow and intentional.

## 16.4 Build

The backend must build through the project's standard build system without relying on developer-specific IDE behavior or configuration. Local development and CI should use the same authoritative project configuration.

## 16.5 Dependencies

Declare backend dependencies through the project's build configuration. Do not add dependencies solely to eliminate trivial amounts of straightforward Java code. Dependency choices remain subject to the master Coding Standards.

# 17. Relationship to Other Standards

This document defines Java and Spring Boot implementation conventions only.

Refer to:

- Master Coding Standards for cross-cutting coding principles.
- Frontend Coding Standards for Angular and TypeScript conventions.
- Database and Persistence Standards for PostgreSQL, Liquibase, database schema, query, and persistence conventions.
- Testing Standards for backend unit, integration, persistence, API, security, conformance, and end-to-end testing.

When backend implementation exposes a missing domain or architectural decision, update or clarify the KM or SDD rather than defining product semantics implicitly through backend code.
