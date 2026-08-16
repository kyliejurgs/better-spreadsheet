# Better Spreadsheet Database & Persistence Standards

## 1. Purpose

This document defines database and persistence coding standards for Better Spreadsheet. These standards supplement the Master Coding Standards and apply to server-side PostgreSQL persistence, Liquibase schema management, frontend IndexedDB persistence, and related persistence infrastructure.

The documentation hierarchy remains:

1. Knowledge Model — product and domain semantics
2. System Design Document — architecture and system behavior
3. Master Coding Standards — cross-cutting implementation standards
4. Database & Persistence Standards — persistence-specific conventions

When this document does not define a persistence-specific rule, follow the Master Coding Standards.

# 2. General Persistence Principles

## 2.1 Domain Semantics

Persistence models must preserve the semantics defined by the KM and SDD. Storage convenience must not redefine application identity, ownership, lifecycle, blank semantics, error states, or other domain concepts.

## 2.2 Persistence Boundaries

Access persistence through the application's established repository and persistence boundaries.

Application components and domain behavior should not depend directly on PostgreSQL, IndexedDB, JDBC, ORM sessions, or other persistence implementations.

## 2.3 Data Preservation

Persistence operations must prioritize preservation of valid and recoverable user work. Do not silently discard data because it cannot be immediately converted, synchronized, validated, or represented by a newer schema.

## 2.4 Physical Schema Independence

PostgreSQL and IndexedDB represent the same application domain but do not need identical physical schemas. Each persistence technology may structure and index data according to its own responsibilities and access patterns. Differences in physical representation must not change domain semantics.

# 3. PostgreSQL Schema Design

## 3.1 Relational Modeling

Prefer relational structures for data with meaningful identity, ownership, relationships, and integrity constraints. Use tables, columns, keys, relationships, and constraints to represent stable relational domain structure.

## 3.2 JSON and JSONB

Use JSON or JSONB when the stored information is genuinely flexible, document-like, or benefits meaningfully from schema flexibility. Do not use JSONB merely to avoid designing a relational schema. Frequently queried or integrity-sensitive data should generally have an appropriate relational representation.

## 3.3 Table Naming

Use plural table names. Examples:

    workspaces
    fields
    records
    views
    dashboards
    collections

Use clearer alternatives when direct pluralization would create ambiguity, conflict with database terminology, or reduce readability. For example:

    table_definitions
    query_definitions

may be preferable where names such as `tables` or `queries` would be unclear in context.

## 3.4 Identifier Naming

Use `snake_case` for database identifiers. Examples:

    workspace_id
    field_type
    created_at
    updated_at
    source_record_id

Names should communicate domain meaning rather than persistence implementation details.

## 3.5 Primary Keys

Persist stable domain UUIDs using PostgreSQL's native `uuid` type where applicable. Do not convert UUID domain identity into string columns merely for convenience.

Database-generated surrogate identity should not replace stable application identity unless the two intentionally represent the same concept.

## 3.6 Columns

Use database types that accurately represent the stored semantics. Do not store structured or strongly typed values as strings merely to simplify persistence code. Column nullability must reflect the actual persistence contract rather than defaulting to nullable columns.

# 4. Constraints and Relationships

## 4.1 Database Constraints

Use database constraints to protect persisted integrity where appropriate. This includes:

- `NOT NULL`
- `UNIQUE`
- `FOREIGN KEY`
- `CHECK`
- Primary-key constraints

Database constraints complement application validation rather than replace it.

## 4.2 Invariant Enforcement

Enforce important invariants at the lowest appropriate reliable layer. Application validation should provide domain behavior and meaningful feedback. Database constraints should prevent persisted state from violating invariants that the database can reliably enforce.

## 4.3 Foreign Keys

Use foreign keys for meaningful relationships maintained within PostgreSQL unless a specific architectural reason prevents them. Do not rely solely on application code to protect relational integrity when the database can enforce the relationship safely.

## 4.4 Cascading Behavior

Use cascading updates or deletes only when the behavior intentionally matches KM and SDD lifecycle semantics.

Do not use `ON DELETE CASCADE` merely for cleanup convenience. Deletion behavior must not bypass dependency checks, preservation rules, history requirements, synchronization semantics, or other domain lifecycle behavior.

## 4.5 Uniqueness

Use database uniqueness constraints when uniqueness is a persisted invariant. Application-level pre-checks may improve error handling but must not be relied upon as the sole protection against concurrent duplicate writes.

# 5. PostgreSQL Types and Values

## 5.1 Type Selection

Choose PostgreSQL types according to domain semantics rather than convenience. Prefer native types such as:

- `uuid`
- `boolean`
- Appropriate numeric types
- Appropriate date/time types
- Structured relational references

Avoid encoding strongly typed values into generic text fields without a reason.

## 5.2 Numeric Precision

Choose numeric representations according to required precision and range. Do not use floating-point storage for values requiring exact decimal semantics, such as currency, when doing so could introduce unintended precision loss.

## 5.3 Temporal Values

Persist actual moments in time using representations with clear UTC semantics. Do not assume every date or time value represents an instant.

Preserve the semantic distinction between:

- Date
- Time
- DateTime
- Timestamp/instant metadata

Do not convert a user-entered Date or Time into an artificial UTC instant merely for storage convenience.

## 5.4 Blank and Empty Values

Persistence must preserve meaningful distinctions between:

- Blank
- Empty text
- Zero
- False
- Invalid values
- Error states
- Absence

Do not normalize these states into one another unless the KM explicitly defines that behavior.

# 6. Liquibase and Schema Evolution

## 6.1 Schema Authority

Liquibase is the authoritative mechanism for PostgreSQL schema evolution. Do not rely on ORM automatic schema generation or manual environment-specific database changes as the application schema-management strategy.

## 6.2 Applied Changesets

Once a changeset has been applied to a shared environment or committed as part of established migration history, treat it as immutable. Correct or extend the schema through a new changeset rather than rewriting migration history.

## 6.3 Changeset Design

Changesets should be:

- Meaningfully named or described
- Deterministic
- Reviewable
- Narrow enough to understand
- Ordered according to required dependencies

Avoid unnecessarily large changesets containing unrelated schema modifications.

## 6.4 Data Migrations

Schema changes requiring data transformation must define how existing data is preserved or converted. Do not assume a structural migration alone is sufficient when existing persisted values require migration.

## 6.5 Destructive Migrations

Destructive schema changes require deliberate consideration of existing data and supported upgrade paths. Do not drop columns, tables, or persisted values merely because the current application version no longer uses them without determining whether migration, preservation, or cleanup is required.

## 6.6 Manual Changes

Do not make persistent shared-environment schema changes that are not represented through Liquibase. Emergency manual changes must be reconciled into migration history as appropriate.

## 6.7 ORM Schema Management

ORM schema auto-update features must not manage application schema evolution. Development convenience must not create a schema state that cannot be reproduced through Liquibase.

# 7. ORM and Repository Persistence

## 7.1 ORM Role

ORM tooling adapts application persistence behavior to the database. The ORM does not define domain semantics or own schema evolution.

## 7.2 Entity Relationships

Model ORM relationships when they provide meaningful persistence behavior. Do not automatically model every database foreign key as a deeply navigable ORM object graph.

## 7.3 Loading Behavior

Choose eager and lazy loading intentionally. Do not rely blindly on ORM defaults when they can cause excessive loading, hidden queries, or lifecycle-dependent behavior.

## 7.4 Explicit Queries

Use explicit queries when they provide clearer behavior, better performance, narrower projections, or more appropriate access patterns than generic ORM traversal. Do not contort high-volume or complex data operations into entity navigation merely to remain ORM-pure.

## 7.5 Persistence Leakage

Do not allow persistence proxies, session requirements, or lazy-loading behavior to become implicit dependencies of unrelated application code.

# 8. Query Design and Performance

## 8.1 Query Scope

Queries should retrieve the data required for the operation. Avoid unbounded reads of potentially large datasets unless the operation intentionally requires the complete dataset.

## 8.2 Projections

Use narrow projections when only a subset of persisted data is required and doing so provides meaningful clarity or performance value. Do not use `SELECT *` mechanically when the operation intentionally requires only specific values.

## 8.3 N+1 Queries

Avoid accidental N+1 query behavior. Review ORM traversal and repeated repository access when operating over collections or object graphs.

## 8.4 Indexes

Create indexes according to known access patterns, integrity requirements, and measured or expected workload. Do not index every column by default. Do not omit indexes from known high-volume lookup, relationship, ordering, or filtering paths when their value is clear.

## 8.5 Query Plans

Use database query plans and profiling when query performance is uncertain or problematic. Prefer correcting access patterns, algorithms, and indexing before introducing application-level workarounds for database inefficiency.

## 8.6 Pagination and Bounded Retrieval

Use pagination, cursors, ranges, or other bounded retrieval strategies when an operation may otherwise return impractically large result sets. Pagination must have deterministic ordering when consistency between pages matters.

# 9. Transactions and Concurrency

## 9.1 Transaction Ownership

Follow the transaction ownership defined by the Backend Coding Standards. Transactions should represent meaningful atomic application operations rather than arbitrary repository boundaries.

## 9.2 Isolation

Do not rely on accidental transaction isolation behavior. When correctness depends on visibility or concurrency semantics, make the requirement explicit and select an appropriate strategy.

## 9.3 Optimistic Concurrency

Use optimistic concurrency or version checks when concurrent modification must be detected without unnecessary locking. Concurrency behavior must align with the domain-operation and synchronization model defined by the SDD.

## 9.4 Locking

Use explicit database locking only when required for correctness Keep locks scoped as narrowly and briefly as practical. Do not introduce broad pessimistic locking as a substitute for understanding concurrency semantics.

## 9.5 Retries

Retry database operations only when the failure is transient and the operation is safe to retry. Do not blindly retry operations whose side effects or semantics could cause duplication or corruption.

## 9.6 External Systems

Do not treat PostgreSQL transactions as distributed transactions. Avoid holding database transactions open while waiting for object storage, WebSockets, external services, or other network operations unless specifically required. Use explicit reconciliation, compensation, retry, or recovery behavior when operations span systems.

# 10. Deletion and Lifecycle

## 10.1 Physical Deletion

Physical deletion is acceptable when it matches the lifecycle semantics defined by the KM and SDD. Do not introduce universal soft deletion merely as a defensive convention.

## 10.2 Soft Deletion

Use soft deletion only when the domain requires retained identity, recovery, auditability, lifecycle state, or similar behavior. A generic `deleted` or `deleted_at` field should not be added to every table by default.

## 10.3 Synchronization Tombstones

Synchronization tombstones are part of synchronization semantics and should not be conflated automatically with general-purpose soft deletion. Their representation and retention should follow the synchronization design.

## 10.4 History

Historical reconstruction should use the history and operation mechanisms defined by the KM and SDD rather than relying on undeleted database rows as accidental history.

# 11. IndexedDB

## 11.1 Persistence Role

IndexedDB is authoritative local persistence for local-first operation. It must not be treated as disposable browser cache when it may contain local or unsynchronized user work.

## 11.2 Repository Boundary

Access IndexedDB through application-owned repositories. Components and unrelated application code must not directly use IndexedDB APIs.

## 11.3 Schema Versioning

IndexedDB schema changes must use explicit versioning and upgrade behavior. Schema evolution should be deterministic and reviewable.

## 11.4 Data Migration

IndexedDB upgrades must preserve existing user data whenever reasonably possible. Do not delete and recreate object stores merely because migration is inconvenient when those stores may contain recoverable user work.

## 11.5 Migration Failure

Migration and recovery behavior must prioritize preservation of user data. When automatic migration cannot safely complete, retain enough information to support recovery rather than silently resetting local persistence.

## 11.6 Storage Representation

IndexedDB representations may differ from PostgreSQL representations when local access patterns, offline operation, synchronization, or browser constraints justify the difference. The stored representation should remain explicitly versionable when its shape may evolve.

## 11.7 Local Indexes

Create IndexedDB indexes according to actual local lookup and synchronization patterns. Do not reproduce PostgreSQL indexes mechanically.

## 11.8 Bulk Operations

Design large IndexedDB operations with browser responsiveness and transaction limits in mind. Avoid unnecessary per-record transactions when work can safely be grouped. Do not make transaction scopes so large that failure recovery or UI responsiveness becomes impractical.

# 12. Local-First Persistence

## 12.1 Local Commit

Durable local persistence is the commit point for local-first editing as defined by the SDD. UI state alone does not constitute durable persistence.

## 12.2 Synchronization

Server synchronization occurs asynchronously from local persistence. Failure to synchronize must not silently roll back or discard successfully committed local user work.

## 12.3 Pending Operations

Unsynchronized operations must remain identifiable and recoverable until synchronization semantics determine that they are safely acknowledged, superseded, resolved, or otherwise finalized.

## 12.4 Reconciliation

When local and server representations diverge, reconciliation must follow the domain-operation and conflict semantics defined by the KM and SDD. Do not apply generic last-write-wins behavior where the application model requires more precise conflict handling.

## 12.5 Offline Retention

Offline cleanup and retention behavior must respect synchronization state. Unsynchronized user work must not be removed merely because ordinary cache or retention limits have been reached.

# 13. Data Integrity and Recovery

## 13.1 Partial Failure

Persistence workflows spanning multiple steps must define behavior for partial failure. Do not assume every multi-step persistence workflow is atomic.

## 13.2 Recovery

When persistence failure leaves recoverable state, preserve enough information to retry, reconcile, repair, or explain the failure. Do not replace recoverable state with a generic failure marker when the original information can safely be retained.

## 13.3 Invalid Stored Data

When the domain permits invalid, broken, or error-bearing values to remain stored, persistence must preserve those states explicitly. Do not silently normalize invalid data during load or save unless the KM defines that normalization.

## 13.4 Corruption

Detected persistence corruption should fail visibly and locally where possible. Do not silently invent replacement values that could disguise corruption as valid user data.

# 14. Persistence Security

## 14.1 Server Authorization

Database access through the application must remain subject to authoritative backend authorization. Possession of an object identifier does not imply permission to access the corresponding persisted data.

## 14.2 Query Safety

Use parameterized queries and framework-supported parameter binding. Do not construct SQL by concatenating untrusted values.

## 14.3 Sensitive Data

Persist sensitive data only when required by the application. Do not duplicate sensitive information across tables, logs, caches, or local stores without a defined need.

## 14.4 Local Storage

Treat IndexedDB data as locally accessible application data rather than as a secure secret store. Do not store credentials, authentication secrets, or equivalent sensitive material there merely for convenience.

# 15. Persistence Naming

## 15.1 PostgreSQL Naming

Use lowercase `snake_case` for PostgreSQL:

- Tables
- Columns
- Constraints
- Indexes
- Sequences
- Other schema objects

## 15.2 Table Names

Use plural table names representing collections of persisted objects. Prefer clarity over mechanical pluralization when a domain name conflicts with SQL/database terminology or would otherwise be ambiguous.

## 15.3 Key Columns

Name primary and foreign-key columns according to the referenced domain identity. Examples:

    workspace_id
    table_id
    record_id
    field_id

## 15.4 Timestamp Columns

Use clear timestamp names describing their semantics. Examples:

    created_at
    updated_at
    deleted_at

Do not use generic names such as `timestamp` when the value has a more specific meaning.

## 15.5 Constraints and Indexes

Constraint and index names should be deterministic and understandable. Use a consistent project convention rather than relying on environment-specific generated names when explicit naming provides operational value.

# 16. Persistence Tooling

## 16.1 Liquibase

Liquibase configuration and changesets must be committed with the application and participate in normal code review.

## 16.2 Development Environments

Local and automated environments should build their database schema from the same authoritative migration history used by deployed environments. Do not maintain an independent hand-created development schema.

## 16.3 Test Databases

Persistence tests should use schemas produced from authoritative migrations where practical. Tests must not rely on schema behavior that differs materially from production.

## 16.4 Diagnostics

Database diagnostics, query logging, and profiling may be enabled when needed for development or troubleshooting. Diagnostic configuration must not expose sensitive user data or generate unsuitable production logging by default.

# 17. Relationship to Other Standards

This document defines database and persistence-specific implementation conventions only.

Refer to:

- Master Coding Standards for cross-cutting coding principles.
- Frontend Coding Standards for Angular, TypeScript, frontend repositories, and reactive state.
- Backend Coding Standards for Java, Spring Boot, backend repositories, services, and transaction ownership.
- Testing Standards for persistence, migration, repository, integration, and recovery testing.

The KM remains authoritative for domain semantics such as identity, blank values, lifecycle, references, history, synchronization, and preservation behavior. The SDD remains authoritative for architectural decisions such as PostgreSQL, IndexedDB, Liquibase, local-first persistence, synchronization, and repository boundaries.

When persistence implementation exposes a missing domain or architectural decision, update or clarify the KM or SDD rather than defining product semantics implicitly through the storage model.
