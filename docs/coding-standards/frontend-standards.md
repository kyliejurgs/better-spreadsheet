# Better Spreadsheet Frontend Coding Standards

# 1. Purpose

This document defines frontend-specific coding standards for Better Spreadsheet. These standards supplement the master Coding Standards and apply to the Angular and TypeScript frontend.

The documentation hierarchy remains:

1. Knowledge Model — product and domain semantics
2. System Design Document — architecture and system behavior
3. Master Coding Standards — cross-cutting implementation standards
4. Frontend Coding Standards — Angular and TypeScript implementation conventions

When this document does not define a frontend-specific rule, follow the master Coding Standards.

# 2. TypeScript

## 2.1 Strict Typing

Use TypeScript strict mode.

Preserve useful type information throughout the application and prefer domain-specific types over generic representations.

Avoid `any` except where interoperability or external APIs make it genuinely necessary. Use `unknown` when a value is truly unknown and narrow it before use.

Avoid unchecked type assertions. Use `as` only when the application knows something the compiler cannot reasonably determine.

## 2.2 Type Inference

Allow TypeScript to infer types when the result is clear and useful.

Do not add redundant type annotations solely for explicitness. Prefer explicit types when they clarify a public contract, prevent unintended inference, or make non-obvious behavior easier to understand.

## 2.3 Types and Interfaces

Use the construct that most clearly represents the concept. As a general guideline:

- Use `interface` for object contracts intended to be implemented, extended, or augmented.
- Use `type` for unions, aliases, compositions, mapped types, and similar type-system constructs.

Do not treat this distinction as an absolute rule when the alternative is clearer.

## 2.4 Constrained Values

Use literal unions when a concept is naturally represented as a constrained set of values. Prefer discriminated unions when modeling domain variants whose available data or behavior differs by type.

Use a runtime representation when the values require runtime identity, enumeration, mapping, metadata, or behavior.

TypeScript `enum`, literal unions, and `as const` objects are all acceptable when appropriate to the concept.

## 2.5 Generics

Use generics when they preserve meaningful type relationships or support genuinely reusable behavior.

Avoid generic abstractions that make straightforward domain code difficult to understand. Do not introduce generics solely to eliminate small amounts of duplication.

## 2.6 Readonly Data

Use `readonly` when immutability is meaningful to the contract or protects owned state from unintended mutation. Do not apply `readonly` mechanically to every value or structure.

## 2.7 Nullability and Absence

Represent absence intentionally. Do not treat `null`, `undefined`, empty strings, false values, invalid values, and errors as interchangeable.

Use optional properties and nullable/undefined types according to the actual domain contract. Avoid non-null assertions (`!`) unless the invariant is established outside TypeScript's ability to determine it and the reason is clear.

# 3. Angular Architecture

## 3.1 Modern Angular

Use current Angular capabilities for new application code when they improve clarity, maintainability, or integration with Angular's reactive model. Do not preserve legacy Angular patterns solely because they were historically standard.

## 3.2 Standalone Components

Use standalone components for application development. NgModules should not be introduced for ordinary application organization unless a framework, integration, or other technical requirement justifies them.

## 3.3 Component Responsibility

Components should primarily own presentation, user interaction, and component-local UI behavior and must not directly access IndexedDB or other persistence implementations.

Domain behavior, persistence, synchronization, and other application responsibilities should remain behind the appropriate application, state, service, or repository boundary.

## 3.4 Dependency Injection

Use Angular dependency injection for application services and dependencies. Constructor injection and `inject()` are both acceptable.

Choose the form that provides the clearest implementation for the class or Angular construct being written. Use `inject()` where Angular APIs or composition patterns make it advantageous. Maintain consistency within a class.

## 3.5 Inputs and Outputs

Prefer modern `input()` and `output()` APIs for new components when appropriate. Component inputs and outputs should form intentional component contracts.

Children should not reach into parent implementation state when the required interaction can be represented through an input, output, shared state owner, or application operation.

## 3.6 DOM Access

Prefer Angular templates, bindings, directives, and browser/CSS capabilities over direct DOM manipulation.

Use direct DOM access when the required behavior cannot reasonably be expressed through Angular's normal mechanisms or when implementing infrastructure that inherently operates on the DOM or Canvas. Keep direct DOM behavior localized and intentional.

# 4. Source Organization

## 4.1 Feature-First Organization

Organize frontend application code primarily by application feature or domain.

A typical high-level structure may resemble:

    src/app/
    ├── core/
    ├── shared/
    ├── features/
    │   ├── workspace/
    │   ├── table/
    │   ├── view/
    │   ├── query/
    │   └── dashboard/
    └── ...

The exact structure should evolve with the application rather than being created prematurely.

## 4.2 Feature Internals

Keep related code together within its owning feature. Do not create `components`, `services`, `models`, `state`, or similar subdirectories merely to satisfy a template. Introduce internal grouping when the size or complexity of a feature makes that structure easier to navigate.

## 4.3 Core

Use `core` for frontend infrastructure and application-wide capabilities with clear global responsibility. Do not use `core` as a general location for code without an obvious feature owner.

## 4.4 Shared

Use `shared` for frontend code that genuinely serves multiple independent features. Reusable visual components, directives, pipes, or similarly cross-cutting frontend constructs may belong here. Do not move code into `shared` because it might eventually be reused.

## 4.5 Imports and Boundaries

Features should interact through intentional public contracts rather than importing another feature's internal implementation details.

Avoid circular feature dependencies. When multiple features require the same behavior, determine its actual owner rather than resolving the problem through arbitrary cross-imports.

# 5. Angular State and Reactivity

## 5.1 Signals

Use Angular Signals for synchronous reactive state when reactivity provides meaningful value. Do not convert ordinary constants or non-reactive values into Signals merely for consistency.

## 5.2 Derived State

Use `computed()` for state that can be derived from other Signals.

Prefer derived state over manually maintaining redundant mutable state. Do not use `effect()` merely to copy or synchronize one Signal into another when the value can be expressed as computed state.

## 5.3 Effects

Use `effect()` for genuine side effects caused by reactive state. Effects should have a clear purpose and should not become a general-purpose mechanism for coordinating application state.

Avoid effects that obscure state ownership or create difficult-to-follow chains of reactive mutations.

## 5.4 RxJS

Use RxJS when modeling asynchronous streams, event sequences, or APIs for which Observable semantics provide meaningful value. Do not use RxJS as the default representation for ordinary synchronous application state.

Avoid unnecessary conversions between Signals and Observables.

## 5.5 State Ownership

Keep state at the narrowest reasonable owner. Component-local state should remain local when no other area requires it. Feature or application state should move to a broader owner only when its lifecycle, sharing requirements, or responsibilities justify doing so.

Avoid global state merely for convenience.

## 5.6 Multiple Representations

Reactive state, IndexedDB, and server persistence may represent the same underlying application data for different purposes. Their authority and synchronization behavior must follow the local-first architecture defined by the SDD. Do not introduce additional independent sources of truth without a defined ownership and reconciliation model.

# 6. Components and Templates

## 6.1 Component Boundaries

Create components around meaningful UI concepts, responsibilities, or reusable behavior.

Do not split templates into components solely to reduce file size. Avoid components that combine unrelated UI responsibilities merely to avoid creating additional components.

## 6.2 Templates

Keep templates readable and focused on presentation. Use Angular's built-in template control flow such as `@if`, `@for`, and `@switch` for new code.

Move complex calculations and domain logic out of templates. Simple presentation expressions may remain inline when they are easier to understand there.

## 6.3 Event Handling

Template event handlers should delegate meaningful operations to clearly named component methods or application operations. Small and immediately understandable assignments or state changes may remain inline. Avoid complex multi-step expressions in templates.

## 6.4 Component Communication

Prefer explicit inputs, outputs, or owned shared state for component communication. Avoid tightly coupling components through direct access to one another's implementation details.

## 6.5 Reusable Components

Reusable components should expose APIs based on their intended behavior rather than assumptions about one current caller. Do not prematurely generalize feature-specific components into reusable framework components.

# 7. Async Operations and Data Access

## 7.1 Data Boundaries

Frontend data access should follow established application boundaries. Conceptually:

    Component
        ↓
    Application / State / Service
        ↓
    Repository
        ↓
    IndexedDB / HTTP / Infrastructure

Not every operation requires every layer, but components should not bypass meaningful boundaries.

## 7.2 Repositories

Use repositories as the persistence boundary for IndexedDB and other frontend persistence mechanisms. Persistence implementation details should not leak into components or domain behavior.

## 7.3 HTTP and Server Communication

Centralize server communication behind the appropriate application or infrastructure boundary. Components should not construct ad hoc HTTP behavior when an application-owned service or repository owns the operation.

## 7.4 Async State

Represent meaningful loading, success, failure, retry, and similar states explicitly. Avoid collections of loosely related booleans when a typed state model communicates the operation more accurately.

## 7.5 Cancellation and Stale Work

Cancel or obsolete replaceable asynchronous work when continuing it could apply stale results or waste meaningful resources. Do not assume asynchronous operations complete in request order.

## 7.6 Errors

Frontend errors must follow the master error-handling standards. Preserve recoverable local user work when persistence, synchronization, or server operations fail. UI error presentation should be appropriate to the scope and recoverability of the failure rather than treating every failure as an application-wide error.

# 8. Styling, Layout, and Accessibility

## 8.1 Component Styling

Prefer component-scoped styles for component-specific presentation. Use global styles for genuinely application-wide concerns.

## 8.2 Design Tokens and Themes

Use CSS custom properties or the established design-token mechanism for themeable values.

Colors, spacing, typography, and other values that participate in application themes should not be independently hard-coded throughout components.

Support light, dark, and custom theme behavior through shared theme primitives.

## 8.3 Layout

Prefer CSS layout capabilities such as Grid, Flex-Box, intrinsic sizing, media queries, and container queries for visual layout. Do not reproduce browser layout behavior in TypeScript without a functional reason.

## 8.4 Responsive Behavior

Use CSS for visual responses to available space.

Use Angular state when responsive behavior changes application semantics, interaction, persisted user preferences, or meaningful component behavior.

Do not duplicate in TypeScript behavior that CSS can express directly.

## 8.5 User-Controlled Layout

Resizable, collapsible, docked, or otherwise user-controlled workspace regions are application state when their configuration affects user interaction or persisted preferences. Keep this behavior distinct from purely visual CSS responsiveness.

## 8.6 Accessibility

Accessibility is part of component correctness. Prefer semantic HTML and native browser behavior before introducing ARIA. Use ARIA when native semantics are insufficient.

Interactive elements must support appropriate keyboard interaction and focus behavior. Do not communicate important state through visual presentation alone.

## 8.7 CSS Overrides

Avoid `!important` unless an exceptional cascade or integration constraint makes it appropriate. Prefer correcting ownership, specificity, or structure rather than escalating CSS specificity unnecessarily.

# 9. Frontend Performance

## 9.1 General Performance

Prefer readable implementations unless expected scale, architectural requirements, or measured behavior justify additional complexity. Do not introduce optimization patterns solely because they are commonly described as Angular best practices.

## 9.2 Known Performance-Critical Areas

Known performance-sensitive systems may be designed for scale from the beginning when the expected workload already justifies it. For Better Spreadsheet, these include the primary spreadsheet grid, large-table operations, expression evaluation, query execution, and other workloads identified by the SDD.

## 9.3 Canvas

Use the Canvas-based rendering architecture established by the SDD for the primary spreadsheet grid. Keep Canvas-specific rendering and interaction concerns localized rather than allowing them to spread through unrelated application components.

## 9.4 Virtualization

Use virtualization where rendering or retaining the complete visual representation of large datasets would be impractical. Virtualization must not change the underlying data semantics.

## 9.5 Web Workers

Use Web Workers for sufficiently expensive computation when performing that work on the UI thread would materially affect responsiveness.

Worker boundaries should use typed messages and explicit contracts. Do not move trivial work into Workers solely to create architectural separation.

## 9.6 Optimization

Prefer algorithmic and architectural improvements over incidental micro-optimizations.

Profile when the performance problem is uncertain. Known scaling characteristics may justify appropriate algorithms and data structures without first reproducing an obvious performance failure.

# 10. Frontend Naming and Files

## 10.1 TypeScript Naming

Follow standard TypeScript naming conventions unless a domain-specific reason requires otherwise. Use:

- `PascalCase` for classes, interfaces, types, and other type-level concepts.
- `camelCase` for variables, functions, methods, properties, and parameters.
- Meaningful uppercase naming for true constants when appropriate.

Avoid encoding type information into names unnecessarily.

## 10.2 Domain Terminology

Use KM and SDD terminology consistently. Do not substitute UI or implementation terminology for established domain concepts when referring to the same object.

## 10.3 File Names

Use concise, descriptive kebab-case file names. Follow modern Angular concise naming for new application code where the file's responsibility is already clear from its name and location.

Examples:

    workspace-shell.ts
    navigation-panel.ts
    workspace-state.ts
    view-repository.ts

Do not add suffixes such as `.component` solely because an element is an Angular component. Use additional qualifiers when they meaningfully distinguish responsibilities.

## 10.4 Test Files

Test-file naming and organization are defined by the Testing Standards.

# 11. Frontend Tooling

## 11.1 TypeScript Compiler

Compiler configuration should enforce the strict typing expectations defined by this document. Do not weaken compiler safety globally to accommodate isolated implementation problems.

## 11.2 Linting

Use ESLint or the project's established Angular/TypeScript linting toolchain for automatable correctness and style rules. Lint suppressions must be narrow and intentional.

## 11.3 Formatting

Use the project's configured formatter as the authority for mechanical formatting. Do not manually maintain formatting conventions that can be enforced automatically.

## 11.4 Build Warnings

New frontend code should not introduce unexplained compiler, Angular, linter, or build warnings. Warnings should be corrected or intentionally suppressed with appropriate justification.

# 12. Relationship to Other Standards

This document defines frontend-specific implementation conventions only. Refer to:

- Master Coding Standards for cross-cutting coding principles.
- Backend Coding Standards for Java and Spring Boot conventions.
- Database and Persistence Standards for PostgreSQL, Liquibase, IndexedDB schema, and persistence conventions.
- Testing Standards for frontend unit, integration, component, accessibility, conformance, and end-to-end testing.

When frontend implementation exposes a missing domain or architectural decision, update or clarify the KM or SDD rather than defining product semantics implicitly through frontend code.
