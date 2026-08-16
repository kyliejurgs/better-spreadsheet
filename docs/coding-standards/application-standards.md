# Better Spreadsheet Coding Standards

# 1. Purpose

This document defines the coding standards that apply across the full Better Spreadsheet application.

The Knowledge Model (KM) remains the authoritative source for product and domain semantics. The System Design Document (SDD) remains the authoritative source for system architecture. Coding standards define how code should be written within those constraints.

Technology-specific standards are maintained separately for:

- Frontend
- Backend
- Database and Persistence
- Testing

# 2. Core Coding Principles

## 2.1 Readability

Readability is the primary consideration when writing and reviewing code. Concise, idiomatic, sophisticated, or clever constructs are welcome when the preserve or improve readability.

Do not make code more verbose just for explicitness sake. Avoid cleverness when it obscures intent, behavior, or important type information.

## 2.2 Abstraction and Duplication

Prefer a small amount of clear duplication over premature or artificial abstraction. Extract shared behavior when it represents the same concept, rule, or responsibility.

Do not extract behavior merely because implementation looks similar. Abstractions should make code easier to understand, change, test, or reason about.

## 2.3 Type Safety

Preserve useful type information and model application concepts accurately through the available type system. Avoid bypassing the type system when the domain can reasonably be represented through types.

TypeScript `any`, unchecked casts, raw Java types, generic string/object maps, and similar hatches should be exceptional and justified. Do not sacrifice readability solely for type-system sophistication.

## 2.4 Responsibility and Decomposition

Functions, classes, components, and modules should have clear, cohesive responsibilities.

Decompose code according to conceptual and architectural boundaries rather than arbitrary limits on size, line count, parameter count, or method count.

Size and complexity are signals that decomposition may be appropriate, not violations themselves. Do not extract code solely to make another unit shorter.

## 2.5 Error Handling

Errors must not be silently swallowed. Handle errors where meaningful recovery is possible. Otherwise, preserve useful context and propagate them to the appropriate boundary.

Expected domain and validation outcomes should generally be modeled as application states or results rather than exceptions used for routine control flow.

Logging an error does not constitute handling it. When translating errors, preserve the original cause and relevant diagnostic context.

## 2.6 Comments and Documentation

Prefer self-explanatory code over comments that describe what the code already says. Use comments to explain intent, reasoning, constraints, non-obvious behavior, or architectural decisions.

TSDoc, Javadoc, and similar documentation should be provided when a contract contains important behavior, side effects, constraints, failure semantics, or usage requirements that are not apparent from its name and signature.

TODO and FIXME comments must provide enough context to understand the outstanding work. Documentation is not required merely because an element is public.

## 2.7 Dependencies

Choose dependencies according to the value they provide rather than the amount of code they eliminate. Prefer language, platform, framework, and application-owned capabilities when they solve the problem cleanly.

Dependencies are appropriate when they provide meaningful value through capability, correctness, interoperability, security, maintainability, or significant implementation cost.

Do not reimplement complex, security-sensitive, or standards-driven functionality just to avoid a dependency. Consider dependency maturity, maintenance, licensing, security exposure, transitive dependencies, scope, and replacement cost when appropriate.

## 2.8 Constants and Configuration

Avoid unexplained or duplicated literals when they carry domain, policy, protocol, or implementation meaning. Give fixed meaningful values a name.

Centralize configurable behavior and policy through the appropriate configuration mechanism. Ordinary literals whose meaning is obvious from context do not require constants.

Prefer types values, unions, enums, or domain models over unvalidated strings for defined application states and concepts.

## 2.9 Logging

Logs should provide enough context to understand what happened and why without becoming a secondary copy of user data. Prefer structured diagnostic information such as:

- Operation IDs
- Object IDs
- Request or correlation IDs
- Job IDs
- State transitions
- Types
- Counts

User-entered values, credentials, authentication tokes, file contents, and other sensitive payload data must not be logged by default. Log levels should reflect actual operational significance. Avoid repeatedly logging the same failure at multiple levels or layers.

## 2.10 Code Cleanliness and Tooling

Committed code should not contain obsolete implementations, unnecessary commented-out code, unused declarations, or avoidable noise.

Source control is the history for removed code. New code should not introduce unexplained compiler, linter, or static-analysis warnings. Suppressions must be as narrow as possible and practical and documented when their reason is not obvious.

Automate mechanical formatting and style whenever practical. Do not distort code merely to satisfy arbitrary quality metrics.

## 2.11 Naming

Names should communicate purpose and domain meaning while remaining appropriately concise for their context. Names do not need to repeat information already obvious from their scope or type.

Use terminology established by the KM and SDD consistently. Avoid unnecessary abbreviations and vague catch-all names. Common technical abbreviations and established domain abbreviations are acceptable when they preserve readability.

## 2.12 Absence and Nullability

Represent absence intentionally according to the contract. Do not use null, undefined, empty strings, sentinel values, exceptions, or other states interchangeably to mean absence. Do not conflate absence with false, blank, invalid, or error states.

Prefer types and domain models that make meaningful states distinguishable without unnecessary ceremony.

## 2.13 Validation and Invariants

Validate data when it crosses a trust or representation boundary. Once data has been validated and converted into an internal domain representation, internal code may rely on the guarantees of that representation.

Application invariants and user-data validation are distinct concepts. States that the product intentionally permit to remain incomplete, invalid, broken, or error-bearing should be represented explicitly rather than discarded, disguised, or silently corrected.

## 2.14 Mutation and Side Effects

Prefer predictable data flow and minimize unnecessary mutation and side effects. Mutation is appropriate when state has clear ownership and the operation makes the change apparent.

Avoid hidden mutation and surprising side effects. Do not perform unnecessary copying solely to satisfy an immutability ideal. A caller should be able to understand from a function's contract whether it observes or changes state.

# 3. Code Organization and Boundaries

## 3.1 Source Organization

Organize source code so related responsibilities and application concepts are easy to locate and understand.

Technical layers and domain/feature groupings may both be used. The preferred hierarchy is defined by the applicable technology-specific standard. Introduce additional structural levels when they improve navigation or clarify ownership rather than merely to satisfy a prescribed package layout.

## 3.2 Architectural Boundaries

Respect established architectural boundaries. Layers and modules should interact through their intended contracts rather than bypassing those contracts for convenience.

## 3.3 Dependency Direction

Domain and application behavior should remain independent from persistence, transport, framework, and infrastructure implementations when those concerns can be cleanly separated. Do not introduce interfaces or abstraction layers solely for architectural purity when no meaningful boundary exists.

Infrastructure should adapt to application-owned contracts rather than define the domain model.

## 3.4 Public and Internal APIs

Expose the smallest useful public surface.
Public APIs and exported types should represent intentional contracts rather than incidental implementation details.

Keep implementation details internal when practical. Formal facades, barrel files, interfaces, or API packages are not required unless they provide meaningful value.

## 3.5 Shared Code

Keep code as close as practical to the responsibility that owns it.

Move code into a shared or cross-cutting location only when it genuinely serves multiple independent areas and has a clear shared purpose. Do not create shared code merely because something might eventually be reused. Shared, common, helper, and utility locations must not become catch-all storage for code without clear ownership.

## 3.6 Circular Dependencies

Avoid circular dependencies between modules. Treat architectural cycles as a signal to reconsider ownership or boundaries rather than concealing them through import or dependency workarounds.

## 3.7 Layers and Indirection

Every architectural layer, wrapper, adapter, service, or other indirection should have a definable responsibility. Do not introduce pass-through layers solely to satisfy an architectural pattern.

## 3.8 Boundary Models

Models may cross boundaries when their semantics genuinely match. Introduce boundary-specific representations when persistence, transport, validation, security, versioning, or other concerns make them meaningfully different. Do not duplicate models merely because a boundary exists.

## 3.9 Cross-Module Communication

Modules should interact through intentional operations and contracts. Do not manipulate another module's internal state or implementation details directly.

# 4. Functions, Methods, and APIs

## 4.1 Function Design

Functions and methods should perform cohesive operations and communicate their intent through their names and contracts.

Excessive complexity, nesting, or parameter counts are signals to reconsider the design rather than violations of arbitrary limits.

## 4.2 Parameters

Pass the information an operation actually requires.

Use typed parameter or request objects when a group of parameters represents a meaningful concept or when positional arguments become difficult to understand. Do not introduce parameter objects where simple positional parameters remain clearer.

## 4.3 Boolean Parameters

Avoid positional boolean arguments when their meaning is ambiguous at the call site. Boolean parameters are acceptable when their meaning is immediately apparent.

## 4.4 Return Values

Return types should clearly communicate the meaningful outcomes of an operation. Avoid ambiguous sentinel return values when a more expressive contract is practical.

## 4.5 Side Effects

Consequential side effects should be apparent from an operation's contract and naming. Operations should not unexpectedly modify unrelated state, persist data, or perform other consequential work.

## 4.6 Early Returns and Complexity

Use early returns and guard clauses when they improve readability and reduce unnecessary nesting. Deep nesting or complicated branching should prompt reconsideration of the structure, but no fixed nesting limit is required.

## 4.7 Pure Functions

Prefer pure functions for calculations, transformations, parsing, and similar operations when natural. Do not manufacture purity around inherently stateful behavior.

## 4.8 API Consistency

Related APIs should use consistent conventions for naming, absence, errors, options, and return behavior unless their semantics genuinely differ.

# 5. Control Flow and Data Handling

Prefer straightforward, predictable control flow. Conditions and branches should communicate intent without requiring unnecessary mental reconstruction.

## 5.2 Collections

Use idiomatic collection operations when they clearly communicate the transformation being performed. Use ordinary loops when they are easier to understand than complex chained transformations or reductions.

## 5.3 Intermediate State

Avoid unnecessary intermediate state. Use intermediate variables when their names clarify an algorithm, transformation, or business concept.

## 5.4 Data Semantics

Transformations must preserve meaningful distinctions in application data. Do not unintentionally conflate blank, empty, false, zero, invalid, error, or absent values.

## 5.5 Lossy and Destructive Operations

Lossy or destructive transformations must be intentional and apparent from the operation's contract. Do not silently discard meaningful information as a convenience of conversion, normalization, or cleanup.

## 5.6 Mutation During Iteration

Avoid modifying collection structure during iteration when doing so makes behavior difficult to reason about. When mutation during traversal is necessary, its behavior should be intentional and clear.

## 5.7 Performance

Prefer the clearest correct implementation until requirements, expected scale, or measured behavior justify additional complexity. Do not introduce speculative optimization without a reason. Performance-driven complexity should remain as readable as practical and non-obvious decisions should be documented.

# 6. Async, Concurrency, State, and Resources

## 6.1 Async Ownership

Asynchronous work must have explicit ownership. Await work whose completion matters to the current operation. Intentionally delegate work that is expected to continue independently.

## 6.2 Concurrency

When operations may execute concurrently or complete out of order, define their ordering, conflict, and ownership semantics. Correctness must not depend accidentally on timing.

## 6.3 State Ownership

Mutable application state should have an identifiable owner responsible for maintaining its invariants. Other areas should interact with that state through intentional operations rather than uncontrolled mutation.

## 6.4 Sources of Truth

Avoid multiple independent authorities for the same state. When data exists in multiple representations or persistence layers, define which representation is authoritative for each operation and how representations are reconciled.

## 6.5 Derived State

Prefer deriving state from authoritative inputs rather than maintaining redundant mutable copies. Cached or materialized derived state must have clear invalidation or refresh semantics.

## 6.6 Races and Cancellation

Design out race conditions where practical rather than relying on timing assumptions.

Long-running, replaceable, or user-initiated asynchronous work should support cancellation or obsolescence when continuing could waste meaningful resources or apply stale results.

## 6.7 Resource Lifecycle

Resources requiring cleanup must have clear lifecycle ownership. This includes subscriptions, listeners, timers, streams, database resources, locks, temporary resources, workers, and connections.

## 6.8 Background Failures

Background execution must not hide failures. The subsystem that owns background work also owns observing, reporting, recovering from, or preserving its failures.

## 6.9 Preservation of User Work

Concurrency, synchronization, retry, cleanup, and recovery behavior must preserve recoverable user work. Implementation convenience must never silently discard unsynchronized or otherwise recoverable changes.

# 7. Security and Data Protection

## 7.1 Trust Boundaries

Treat external input and data crossing trust boundaries as untrusted until validated. Client-side validation improves usability but must not be treated as authoritative security enforcement.

## 7.2 Authentication and Authorization

Authentication establishes identity. Authorization determines whether that identity may perform an operation.

Authoritative authorization must occur at the appropriate trusted boundary. Do not rely solely on hidden UI elements, disabled controls, client-side routing, or other presentation behavior for access control.

## 7.3 Least Privilege

Code, services, credentials, and users should receive only the permissions required for their responsibilities. Avoid unnecessarily broad access to data or infrastructure.

## 7.4 Secrets and Credentials

Secrets, credentials, tokens, and private keys must not be committed to source control or embedded in application code. Use the approved configuration and secret-management mechanisms for the target environment.

## 7.5 Sensitive Data

Collect, expose, persist, transmit, and log only the sensitive information required for the operation. Avoid exposing internal or sensitive information through errors, logs, API responses, or diagnostic output.

## 7.6 Injection and Unsafe Execution

Do not construct executable queries, commands, expressions, markup, or other interpreted content through unsafe concatenation of untrusted values. Use parameterization, escaping, validation, or the appropriate safe API for the target technology.

## 7.7 Security Controls

Use established security libraries, platform capabilities, and protocols rather than implementing security-sensitive primitives from scratch. Security controls must fail safely and should not silently degrade into an insecure mode.

# 8. Testing and Maintainability

## 8.1 Testability

Code should be structured so important behavior can be tested without excessive coupling to unrelated infrastructure or implementation details. Do not introduce abstraction solely to make trivial code mockable.

## 8.2 Behavioral Testing

Prefer testing externally meaningful behavior and contracts over private implementation details. Refactoring an implementation without changing its behavior should not unnecessarily require rewriting its tests.

## 8.3 Regression Tests

Bug fixes should generally include a regression test capable of detecting the original failure when practical. Critical domain invariants should have explicit automated coverage.

## 8.4 Deterministic Tests

Automated tests should be deterministic and independently repeatable. Avoid unnecessary dependence on execution order, timing, shared mutable state, external systems, or uncontrolled data.

## 8.5 Test Quality

Tests are production code and should follow the same readability, naming, organization, and maintainability expectations as application code. Do not distort application design merely to maximize coverage metrics.

Detailed testing conventions are defined in the Testing Standards.

# 9. Standards Governance

## 9.1 Standards Hierarchy

The documentation hierarchy is:

1. Knowledge Model — product and domain semantics
2. System Design Document — architecture and system behavior
3. Master Coding Standards — cross-application implementation standards
4. Technology-specific standards — implementation conventions for a particular area

A lower-level standard must not contradict an authoritative higher-level document.

## 9.2 Specialized Standards

Technology-specific standards may refine these rules for their environment. The project maintains separate standards for:

- Frontend
- Backend
- Database and Persistence
- Testing

More specialized standards should be created only when they provide enough distinct guidance to justify another document.

## 9.3 Conflicts

When two standards appear to conflict, prefer the more specific rule unless doing so would violate the KM, SDD, or an explicit cross-cutting requirement in this document.

Ambiguous conflicts should be resolved intentionally rather than through whichever convention happens to be implemented first.

## 9.4 Exceptions

Standards exist to improve correctness, readability, consistency, and maintainability. A standard may be intentionally deviated from when following it would materially harm those goals or when technical constraints require another approach.

Exceptions should be narrow and understandable. Significant or recurring exceptions should be documented.

## 9.5 Evolution

Coding standards may evolve as the application and development practices mature.

When a recurring implementation pattern exposes a missing or unsuitable standard, update the standard rather than relying indefinitely on tribal knowledge.

Avoid adding rules based on isolated stylistic preferences or one-off situations.

Automatable rules should generally be enforced through project tooling rather than repeated manual review.
