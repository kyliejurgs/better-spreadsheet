# Better Spreadsheet Testing Standards

## 1. Purpose

This document defines testing standards for Better Spreadsheet. These standards supplement the Master Coding Standards and apply across frontend, backend, persistence, synchronization, and end-to-end testing.

The documentation hierarchy remains:

1. Knowledge Model — product and domain semantics
2. System Design Document — architecture and system behavior
3. Master Coding Standards — cross-cutting implementation standards
4. Testing Standards — testing strategy and implementation conventions

Technology-specific implementation details may be refined by the Frontend, Backend, and Database & Persistence Standards. The goal of testing is confidence in application behavior, not maximizing test counts or coverage percentages.

# 2. Testing Principles

## 2.1 Test Meaningful Behavior

Tests should verify meaningful behavior, contracts, domain rules, and failure semantics. Prefer tests that answer:

> Given this state and operation, does the application produce the expected result?

Avoid tests whose primary purpose is verifying implementation details.

## 2.2 Test at the Appropriate Level

Use the lowest testing level that can confidently verify the behavior. Prefer:

- Unit tests for isolated logic and domain behavior.
- Component tests for meaningful UI behavior.
- Integration tests for boundaries and collaborating systems.
- End-to-end tests for critical user workflows.

Do not use expensive end-to-end tests when a smaller test can provide equivalent confidence.

## 2.3 Tests Are Code

Tests must follow the same readability, naming, organization, and maintainability expectations as application code. A difficult-to-understand test is a maintenance problem even when it passes.

## 2.4 Refactoring

Tests should generally survive internal refactoring when externally meaningful behavior remains unchanged. Avoid coupling tests unnecessarily to private methods, internal call order, implementation-specific object structure, or other incidental details.

# 3. Test Structure

## 3.1 Arrange, Act, Assert

Tests should have a clear setup, operation, and verification flow. Arrange/Act/Assert does not require comments or rigid visual sections when the structure is already obvious.

## 3.2 One Behavioral Purpose

Each test should have a clear behavioral purpose. A test may contain multiple assertions when they collectively verify one outcome. Do not split logically related assertions into separate tests merely to enforce one-assertion-per-test.

## 3.3 Naming

Test names should describe the behavior or outcome being verified.

Prefer names such as:

    rejectsDuplicateWorkspaceName

    preservesBlankValueDuringTypeChange

    returnsNotFoundWhenViewDoesNotExist

over names such as:

    testCreate

    testMethod1

    worksCorrectly

Framework-specific naming conventions may refine the exact syntax.

## 3.4 Setup

Keep test setup focused on information relevant to the behavior under test. Extract repeated setup when doing so improves readability. Do not hide important test conditions behind overly generalized fixture builders or helper abstractions.

# 4. Unit Testing

## 4.1 Appropriate Uses

Use unit tests for behavior that can be meaningfully verified in isolation, including:

- Domain rules
- Calculations
- Validation
- Transformations
- Parsing
- State transitions
- Expression behavior
- Conflict logic
- Pure functions
- Service behavior with meaningful isolated dependencies

## 4.2 Isolation

Unit tests should not require databases, networks, browsers, object storage, or other external infrastructure unless that infrastructure is itself the subject of the test.

## 4.3 Mocking

Mock or substitute dependencies when isolation provides useful control over the behavior being tested. Do not mock everything automatically. Prefer real lightweight objects when they make the test simpler and more representative.

## 4.4 Internal Methods

Do not expose private implementation solely to test it directly. Test private behavior through the public or package-level contract that gives the behavior meaning. If behavior is too difficult to test through its contract, reconsider whether the implementation has an unclear responsibility.

# 5. Frontend Testing

## 5.1 TypeScript Logic

Test significant TypeScript logic independently from Angular rendering when the behavior does not require the Angular runtime or DOM.

## 5.2 Angular Components

Component tests should verify meaningful user-visible behavior and component contracts. Examples include:

- Rendering based on state
- Inputs
- Outputs
- User interaction
- Conditional content
- Accessibility behavior
- Relevant reactive state changes

Avoid tests that merely verify Angular itself works.

## 5.3 Signals

Test the behavior produced by Signals and computed state rather than Angular's internal reactive implementation. Derived state should be verified through its observable result.

## 5.4 DOM Assertions

Prefer assertions based on meaningful content, roles, labels, state, and interaction. Avoid brittle selectors tied unnecessarily to CSS implementation or DOM structure.

## 5.5 Canvas

Canvas-based spreadsheet behavior should be separated into testable logical concerns where practical. Test coordinate calculations, selection behavior, virtualization, hit testing, editing state, and similar logic independently from pixel rendering when possible. Use visual or rendering-specific tests only where visual output itself is the behavior being verified.

## 5.6 PrimeNG Integration

Tests should verify Better Spreadsheet behavior and application contracts rather than duplicating tests of PrimeNG's internal implementation. When application behavior depends on PrimeNG integration, test the observable application behavior, configuration, event translation, accessibility expectations, or application state changes that the integration is responsible for.

Do not write tests that depend unnecessarily on undocumented PrimeNG DOM structure, internal classes, or implementation details.

## 5.7 Accessibility

Important interactive components should have automated accessibility coverage where practical. Automated accessibility testing supplements rather than replaces keyboard and interaction testing.

# 6. Backend Testing

## 6.1 Domain and Service Tests

Use unit tests for domain behavior and service logic when infrastructure is not necessary to establish confidence. Do not start a complete Spring application context merely to test ordinary Java behavior.

## 6.2 Spring Integration

Use Spring integration tests when Spring configuration, dependency wiring, transactions, security, serialization, validation, or framework behavior is relevant to the test.

## 6.3 Controller Tests

Controller tests should verify HTTP behavior such as:

- Routes
- Request validation
- Serialization
- Status codes
- Headers
- Authentication and authorization behavior
- Error translation

Do not duplicate all underlying business-logic tests through the controller layer.

## 6.4 Repository Tests

Repository tests should verify persistence behavior against a representative database environment. Do not mock the persistence framework when the behavior being tested is the actual repository query or mapping.

# 7. Persistence and Migration Testing

## 7.1 PostgreSQL

Persistence tests should use PostgreSQL behavior representative of production when database-specific semantics matter. Do not assume an unrelated in-memory database behaves equivalently to PostgreSQL.

## 7.2 Liquibase

Database integration environments should build their schema through the authoritative Liquibase migrations where practical. Migration tests should detect invalid migration ordering, syntax, constraints, and incompatible schema assumptions.

## 7.3 Data Migrations

Migrations that transform existing data should be tested with representative pre-migration data. Verify both:

- The resulting schema.
- Preservation or intentional transformation of existing values.

## 7.4 Constraints

Important database constraints should have integration coverage when their behavior is significant to application integrity.

## 7.5 IndexedDB

Test IndexedDB repositories and schema upgrades using an environment that represents IndexedDB behavior closely enough to verify:

- Reads and writes
- Transactions
- Indexes
- Version upgrades
- Migration behavior
- Failure recovery

## 7.6 Local Data Preservation

IndexedDB migration and recovery tests must explicitly verify preservation of recoverable local user work. Schema upgrades must not be considered correct merely because a clean database initializes successfully.

# 8. Synchronization and Offline Testing

## 8.1 Local-First Behavior

Test that edits become durably local according to the local-first architecture before server synchronization is required. Server unavailability must not cause successfully committed local work to disappear.

## 8.2 Offline Operation

Test meaningful offline workflows, including:

- Creating data
- Editing data
- Deleting data
- Pending synchronization
- Reconnection
- Synchronization recovery

## 8.3 Conflict Behavior

Test synchronization conflicts according to domain-operation semantics. Do not limit synchronization testing to simple last-write-wins scenarios.

## 8.4 Ordering

Test operations that may arrive or complete out of order. Correctness must not depend on accidental network or execution timing.

## 8.5 Retry and Recovery

Verify retry behavior for transient failures where retry is supported. Tests must also verify that retry does not duplicate operations or silently discard work.

## 8.6 Tombstones and Lifecycle

Test synchronization tombstone behavior, retention, and cleanup where lifecycle semantics depend on them.

# 9. Conformance Testing

## 9.1 Shared Semantics

Behavior implemented independently on the frontend and backend must remain semantically consistent where the KM or SDD requires equivalent results.

## 9.2 Expression Conformance

Expression parsing and evaluation must have shared conformance cases for frontend and backend implementations. Equivalent expressions and inputs must produce equivalent results or equivalent defined error states.

## 9.3 Query Conformance

Local and server query execution should use shared behavioral cases where equivalent semantics are required.

## 9.4 Domain Conformance

Other independently implemented domain behavior should receive shared conformance coverage when semantic drift would create correctness problems.

## 9.5 Shared Cases

Prefer shared fixtures, cases, or generated conformance data when doing so provides a reliable way to verify independent implementations against the same expected behavior. Do not couple implementations merely to avoid maintaining conformance tests.

# 10. End-to-End Testing

## 10.1 Purpose

Use end-to-end tests for critical workflows that require confidence across multiple application boundaries. End-to-end tests should complement rather than replace lower-level tests.

## 10.2 Critical Workflows

Prioritize workflows whose failure would materially affect user trust or core application behavior. Examples may include:

- Creating and opening a workspace
- Creating and editing table data
- Reloading persisted work
- Offline editing and reconnection
- Synchronization
- Authentication and authorization
- Import/export
- File attachment workflows
- History and recovery
- Critical query or dashboard workflows

## 10.3 Scope

Do not attempt to test every permutation of domain logic through the browser. Use unit, component, integration, and conformance tests for exhaustive behavioral coverage where they are more appropriate.

## 10.4 Stability

End-to-end tests must not rely unnecessarily on arbitrary delays, timing assumptions, or execution order. Wait for meaningful application conditions rather than sleeping for fixed periods.

# 11. Regression Testing

## 11.1 Bug Fixes

Bug fixes should generally include an automated regression test when practical. The regression test should fail because of the original defect and pass because of the correction.

## 11.2 Test Level

Place regression tests at the lowest level capable of reproducing the defect reliably. Do not automatically create an end-to-end regression test for every bug.

## 11.3 Production Failures

When a production defect exposes a missing invariant or architectural assumption, add coverage for the underlying behavior rather than only reproducing the exact reported input.

# 12. Test Data

## 12.1 Meaningful Data

Use test data that makes the scenario understandable. Prefer recognizable values when they help explain expected behavior.

## 12.2 Boundary Cases

Test meaningful boundaries and exceptional states, including where applicable:

- Empty collections
- Blank values
- Zero
- False
- Empty text
- Minimum and maximum values
- Invalid values
- Broken references
- Missing objects
- Large inputs
- Duplicate operations
- Concurrent operations

## 12.3 Domain Semantics

Test data must preserve the distinctions defined by the KM. Do not treat blank, empty text, zero, false, absence, invalid values, and errors as interchangeable test inputs.

## 12.4 Generated Data

Generated or randomized data may supplement deterministic cases when it provides meaningful additional coverage. Failures must be reproducible.

## 12.5 Production Data

Do not use sensitive production user data directly in automated tests. Representative fixtures must be synthetic or appropriately sanitized.

# 13. Determinism and Isolation

## 13.1 Deterministic Results

Tests should produce the same result when run repeatedly against the same code and environment.

## 13.2 Test Independence

Tests must not depend unnecessarily on another test running first. Each test should establish the state it requires.

## 13.3 Shared State

Avoid mutable global test state. When shared infrastructure is used for performance, tests must still isolate their logical data and cleanup behavior.

## 13.4 Time

Do not depend directly on the current wall-clock time when deterministic time can be supplied or controlled. Time-sensitive behavior should use controllable clocks or equivalent abstractions where appropriate.

## 13.5 Asynchronous Tests

Wait for meaningful completion conditions. Do not use arbitrary sleeps to make asynchronous tests pass.

# 14. Test Doubles and Fixtures

## 14.1 Test Doubles

Use mocks, stubs, fakes, spies, or in-memory implementations according to what best represents the test boundary. Do not use mocking as the default solution to every dependency.

## 14.2 Interaction Verification

Verify interactions when the interaction itself is part of the contract. Avoid excessive assertions such as exact internal method call counts when only the final behavior matters.

## 14.3 Fixtures

Keep fixtures close enough to tests that their relevant state is understandable. Large reusable fixture systems should provide meaningful value rather than hide test setup behind abstraction.

## 14.4 Builders

Use test builders or factories when they reduce repetitive setup while keeping scenario-specific values visible. Defaults should be safe and unsurprising.

# 15. Security Testing

## 15.1 Authentication

Test authentication boundaries and unauthenticated behavior for protected server operations.

## 15.2 Authorization

Test meaningful authorization rules independently from frontend visibility. A hidden or disabled frontend control does not constitute authorization coverage.

## 15.3 Ownership

Verify that authenticated users cannot access or modify resources they do not have permission to use merely by supplying another object's identifier.

## 15.4 Input Security

Test relevant malformed or hostile inputs at trust boundaries. Security testing should verify the application's actual protections rather than reproducing framework tests unnecessarily.

## 15.5 Sensitive Information

Tests should verify where appropriate that errors and responses do not expose credentials, secrets, internal stack traces, SQL, or other sensitive implementation information.

# 16. Performance Testing

## 16.1 Purpose

Performance tests should answer specific questions about expected application scale or responsiveness.

Do not create performance tests solely to produce benchmark numbers.

## 16.2 Critical Areas

Performance coverage should focus on known scale-sensitive behavior such as:

- Large tables
- Canvas rendering
- Virtualization
- Large queries
- Expression evaluation
- Bulk persistence
- IndexedDB operations
- Synchronization
- Import/export
- History reconstruction

## 16.3 Representative Scale

Use representative data sizes and access patterns.

A benchmark over trivial datasets does not establish performance at expected application scale.

## 16.4 Thresholds

Use hard performance thresholds only when they represent meaningful application requirements and can be measured reliably in the target environment.

Avoid brittle timing assertions in ordinary unit tests.

# 17. Coverage

## 17.1 Coverage Metrics

Coverage is a diagnostic tool, not the definition of test quality.

Do not optimize tests solely to achieve a percentage.

## 17.2 Critical Behavior

Critical domain rules, persistence guarantees, security boundaries, synchronization behavior, and destructive operations should receive strong automated coverage regardless of overall percentage.

## 17.3 Uncovered Code

Uncovered code should prompt consideration of whether meaningful behavior is missing coverage.

It does not automatically require a test if the resulting test would provide little confidence or merely exercise implementation lines.

## 17.4 Coverage Exclusions

Coverage exclusions may be used when justified.

Do not scatter exclusions through the codebase merely to improve reported metrics.

# 18. Test Failures

## 18.1 Failing Tests

A failing test should be treated as evidence requiring investigation.

Do not automatically update the expected result merely because implementation behavior changed.

## 18.2 Changed Requirements

When an intentional KM, SDD, or application behavior change invalidates a test, update the test to represent the new authoritative behavior.

## 18.3 Flaky Tests

Flaky tests are defects.

Investigate and correct their underlying timing, isolation, state, infrastructure, or design problems.

Do not normalize rerunning failed tests until they happen to pass.

## 18.4 Disabled Tests

Do not leave tests disabled indefinitely without a documented reason.

Tests that are obsolete should be removed.

Tests that represent unresolved defects should be tracked appropriately.

# 19. Test Tooling

## 19.1 Standard Toolchain

Use the project's established test frameworks and tooling for each application area.

Do not introduce additional testing libraries merely because they provide an alternative syntax for capabilities already adequately supported.

## 19.2 Local and CI Execution

Tests should run through the project's standard build and test commands.

Do not rely on IDE-specific execution behavior for correctness.

## 19.3 CI

Automated tests should participate in CI according to their cost and purpose.

Fast correctness checks should run early.

Slower integration, end-to-end, conformance, migration, and performance suites may run at appropriate later stages.

## 19.4 Failure Diagnostics

Test failures should provide enough information to understand the failed behavior without requiring excessive debugging.

Assertions, test names, fixtures, and diagnostic output should help identify the meaningful difference between expected and actual behavior.

# 20. Relationship to Other Standards

This document defines testing strategy and implementation conventions.

Refer to:

- Master Coding Standards for cross-cutting coding principles.
- Frontend Coding Standards for Angular and TypeScript implementation.
- Backend Coding Standards for Java and Spring Boot implementation.
- Database & Persistence Standards for PostgreSQL, Liquibase, IndexedDB, and persistence behavior.

The KM remains authoritative for the behavior tests should expect.

The SDD remains authoritative for architectural behavior and boundaries that tests should verify.

Tests must not become an independent source of product semantics.

When a test exposes ambiguity in expected product or architectural behavior, clarify the KM or SDD rather than allowing the test suite to define the answer implicitly.
