# Better Spreadsheet

## System Design Document

**Author:** Kylie Jurgensen

**Last Updated:** 08/26/2026

---

## About this Document

This System Design Document (SDD) describes how Better Spreadsheet is designed and implemented from an engineering perspective.

It defines the application's architecture, major components, persistence model, synchronization strategy, APIs, infrastructure, deployment model, testing approach, and the technical boundaries that implementation should preserve.

The companion Knowledge Model (KM) defines what Better Spreadsheet means from a product and data-model perspective. The KM is the source of truth for product behavior, ownership, relationships, and invariants. This SDD defines how those concepts are implemented.

If the KM and SDD ever disagree about product meaning or behavior, the KM takes priority unless the KM is intentionally changed.

This version is the final system-design baseline before implementation and wire-framing. Detailed implementation decisions that do not affect the architecture may still be made during development without requiring the SDD to define them in advance.

---

## Table of Contents

- [Better Spreadsheet](#better-spreadsheet)
  - [System Design Document](#system-design-document)
  - [About this Document](#about-this-document)
  - [Table of Contents](#table-of-contents)
  - [Glossary](#glossary)
- [Part I - Architecture Foundations](#part-i---architecture-foundations)
  - [1. Purpose and Scope](#1-purpose-and-scope)
  - [2. Governing Engineering Principles](#2-governing-engineering-principles)
    - [2.1 Knowledge Model Semantics Are Authoritative](#21-knowledge-model-semantics-are-authoritative)
    - [2.2 Local-First Interaction](#22-local-first-interaction)
    - [2.3 Domain Operations Represent Meaningful Changes](#23-domain-operations-represent-meaningful-changes)
    - [2.4 Modular Monolith Before Microservices](#24-modular-monolith-before-microservices)
    - [2.5 Application-Owned Behavior When Practical](#25-application-owned-behavior-when-practical)
    - [2.6 Add Infrastructure When It Solves a Real Problem](#26-add-infrastructure-when-it-solves-a-real-problem)
    - [2.7 Protect User Data](#27-protect-user-data)
    - [2.8 Localize Failure](#28-localize-failure)
    - [2.9 Autosave Is the Normal Persistence Model](#29-autosave-is-the-normal-persistence-model)
    - [2.10 Accessibility Is Architectural](#210-accessibility-is-architectural)
    - [2.11 Spreadsheet Interoperability Is First-Class](#211-spreadsheet-interoperability-is-first-class)
    - [2.12 Configuration Should Be Centralized](#212-configuration-should-be-centralized)
    - [2.13 Live Dependencies Stay Within a Workspace](#213-live-dependencies-stay-within-a-workspace)
    - [2.14 Stable Identity Drives Relationships](#214-stable-identity-drives-relationships)
  - [3. System Architecture](#3-system-architecture)
  - [4. Application Boundaries and Responsibilities](#4-application-boundaries-and-responsibilities)
    - [4.1 Browser Responsibilities](#41-browser-responsibilities)
    - [4.2 Core Responsibilities](#42-core-responsibilities)
    - [4.3 Worker Responsibilities](#43-worker-responsibilities)
    - [4.4 Storage Responsibilities](#44-storage-responsibilities)
- [Part II - Frontend and Local Application](#part-ii---frontend-and-local-application)
  - [5. Frontend Architecture](#5-frontend-architecture)
    - [5.1 Framework](#51-framework)
    - [5.2 UI Component Architecture](#52-ui-component-architecture)
    - [5.3 Application Shell](#53-application-shell)
    - [5.4 Theming and Design Tokens](#54-theming-and-design-tokens)
    - [5.5 State Management](#55-state-management)
    - [5.6 Application Services](#56-application-services)
  - [6. Spreadsheet Grid and Interaction Architecture](#6-spreadsheet-grid-and-interaction-architecture)
    - [6.1 Hybrid Spreadsheet Rendering](#61-hybrid-spreadsheet-rendering)
    - [6.2 Spreadsheet Ownership](#62-spreadsheet-ownership)
    - [6.3 Canvas and DOM Interaction Boundary](#63-canvas-and-dom-interaction-boundary)
    - [6.4 Virtualization](#64-virtualization)
    - [6.5 Heavy Client Computation](#65-heavy-client-computation)
  - [7. Client State and Local Persistence](#7-client-state-and-local-persistence)
    - [7.1 IndexedDB Repository](#71-indexeddb-repository)
    - [7.2 Local Schema Versioning](#72-local-schema-versioning)
    - [7.3 Migration Failure](#73-migration-failure)
  - [8. Application-Owned Domain and Expression Engine](#8-application-owned-domain-and-expression-engine)
    - [8.1 Shared Expression Semantics](#81-shared-expression-semantics)
    - [8.2 Expression Consumers](#82-expression-consumers)
    - [8.3 Function Catalog](#83-function-catalog)
    - [8.4 Structural Dependency Representation](#84-structural-dependency-representation)
  - [9. Local Query Execution](#9-local-query-execution)
    - [9.1 Local Capability](#91-local-capability)
    - [9.2 Decimal-Safe Evaluation](#92-decimal-safe-evaluation)
    - [9.3 Local Query Workloads](#93-local-query-workloads)
  - [10. Local-First Operations and Synchronization](#10-local-first-operations-and-synchronization)
    - [10.1 Edit Lifecycle](#101-edit-lifecycle)
    - [10.2 Operation Model](#102-operation-model)
    - [10.3 Conflict Handling](#103-conflict-handling)
    - [10.4 Permission Changes](#104-permission-changes)
    - [10.5 Synchronization Recovery](#105-synchronization-recovery)
    - [10.6 Workspace Boundary](#106-workspace-boundary)
  - [11. PWA, Offline, and Browser Behavior](#11-pwa-offline-and-browser-behavior)
    - [11.1 Installable PWA](#111-installable-pwa)
    - [11.2 PWA Updates](#112-pwa-updates)
    - [11.3 Offline Availability](#113-offline-availability)
    - [11.4 Network Policy](#114-network-policy)
    - [11.5 Browser Support](#115-browser-support)
    - [11.6 Demo Mode](#116-demo-mode)
  - [12. Accessibility](#12-accessibility)
- [Part III - Server Architecture](#part-iii---server-architecture)
  - [13. Backend Architecture](#13-backend-architecture)
    - [13.1 Spring Boot Modular Monolith](#131-spring-boot-modular-monolith)
    - [13.2 Core Process](#132-core-process)
    - [13.3 Server Transaction Boundary](#133-server-transaction-boundary)
  - [14. API and Realtime Communication](#14-api-and-realtime-communication)
    - [14.1 REST Is the Authoritative Mutation Path](#141-rest-is-the-authoritative-mutation-path)
    - [14.2 WebSocket Responsibilities](#142-websocket-responsibilities)
    - [14.3 OpenAPI](#143-openapi)
    - [14.4 API Versioning](#144-api-versioning)
  - [15. Authentication and Authorization](#15-authentication-and-authorization)
    - [15.1 Domain Authorization](#151-domain-authorization)
    - [15.2 Authorization Boundaries](#152-authorization-boundaries)
  - [16. PostgreSQL Persistence](#16-postgresql-persistence)
    - [16.1 Numeric Semantics](#161-numeric-semantics)
    - [16.2 Typed Cell Persistence](#162-typed-cell-persistence)
    - [16.3 Indexing](#163-indexing)
    - [16.4 Connection Management](#164-connection-management)
    - [16.5 Server Caching](#165-server-caching)
  - [17. Server Query Execution](#17-server-query-execution)
    - [17.1 SQL Translation](#171-sql-translation)
    - [17.2 PostgreSQL-Friendly Semantics](#172-postgresql-friendly-semantics)
    - [17.3 Server Execution Placement](#173-server-execution-placement)
  - [18. Background Jobs and Asynchronous Processing](#18-background-jobs-and-asynchronous-processing)
    - [18.1 Transactional Outbox](#181-transactional-outbox)
    - [18.2 Delivery Semantics](#182-delivery-semantics)
    - [18.3 Failure Handling](#183-failure-handling)
    - [18.4 No Distributed Transaction](#184-no-distributed-transaction)
  - [19. Files and Object Storage](#19-files-and-object-storage)
    - [19.1 Metadata and Binary Ownership](#191-metadata-and-binary-ownership)
    - [19.2 Upload Validation](#192-upload-validation)
    - [19.3 Attachment References](#193-attachment-references)
    - [19.4 Offline File Delivery](#194-offline-file-delivery)
    - [19.5 Large File Workflows](#195-large-file-workflows)
- [Part IV - Cross-Cutting Application Systems](#part-iv---cross-cutting-application-systems)
  - [20. Query Architecture](#20-query-architecture)
    - [20.1 Query Sources](#201-query-sources)
    - [20.2 Query Plan](#202-query-plan)
    - [20.3 Query Output Fields](#203-query-output-fields)
    - [20.4 Common Execution Contract](#204-common-execution-contract)
    - [20.5 Execution Placement](#205-execution-placement)
    - [20.6 Partial Results and Errors](#206-partial-results-and-errors)
    - [20.7 Query Result Caching](#207-query-result-caching)
    - [20.8 Reference Candidate Queries](#208-reference-candidate-queries)
  - [21. Dependency Tracking](#21-dependency-tracking)
    - [21.1 Canonical Dependency Representation](#211-canonical-dependency-representation)
    - [21.2 Dependency Service](#212-dependency-service)
    - [21.3 Dependency Index](#213-dependency-index)
    - [21.4 High-Volume Relationships](#214-high-volume-relationships)
  - [22. Templates](#22-templates)
    - [22.1 Scope](#221-scope)
    - [22.2 Template Model](#222-template-model)
    - [22.3 Instantiation](#223-instantiation)
  - [23. History, Undo, and Lifecycle](#23-history-undo-and-lifecycle)
    - [23.1 Undo and Redo](#231-undo-and-redo)
    - [23.2 Durable History](#232-durable-history)
    - [23.3 History Storage](#233-history-storage)
    - [23.4 Named Restore Points](#234-named-restore-points)
    - [23.5 Archive](#235-archive)
    - [23.6 Trash](#236-trash)
  - [24. Import, Export, and Native Packages](#24-import-export-and-native-packages)
    - [24.1 Interoperability Formats](#241-interoperability-formats)
    - [24.2 XLSX](#242-xlsx)
    - [24.3 Native Package](#243-native-package)
    - [24.4 Native Package Compatibility](#244-native-package-compatibility)
    - [24.5 Workspace Restore](#245-workspace-restore)
    - [24.6 Lower-Level Transfer](#246-lower-level-transfer)
    - [24.7 Attachment Content](#247-attachment-content)
  - [25. Search](#25-search)
    - [25.1 Server Search](#251-server-search)
    - [25.2 Local Search](#252-local-search)
    - [25.3 Common Search Semantics](#253-common-search-semantics)
    - [25.4 Query Search](#254-query-search)
  - [26. Spreadsheet and Clipboard Interoperability](#26-spreadsheet-and-clipboard-interoperability)
    - [26.1 Internal Clipboard](#261-internal-clipboard)
    - [26.2 External Clipboard](#262-external-clipboard)
    - [26.3 Spreadsheet Semantics](#263-spreadsheet-semantics)
- [Part V - Infrastructure and Operations](#part-v---infrastructure-and-operations)
  - [27. Deployment and Networking](#27-deployment-and-networking)
    - [27.1 Kubernetes](#271-kubernetes)
    - [27.2 Ingress](#272-ingress)
    - [27.3 Public Topology](#273-public-topology)
    - [27.4 Configuration](#274-configuration)
    - [27.5 Hosting](#275-hosting)
  - [28. Backup and Disaster Recovery](#28-backup-and-disaster-recovery)
  - [29. Logging and Diagnostics](#29-logging-and-diagnostics)
  - [30. Configuration and Operational Policy](#30-configuration-and-operational-policy)
    - [30.1 Product Policy](#301-product-policy)
    - [30.2 Deployment Configuration](#302-deployment-configuration)
    - [30.3 Implementation Tuning](#303-implementation-tuning)
- [Part VI - Quality and Engineering Constraints](#part-vi---quality-and-engineering-constraints)
  - [31. Testing Strategy](#31-testing-strategy)
    - [31.1 Unit and Property Tests](#311-unit-and-property-tests)
    - [31.2 Local/Server Conformance Tests](#312-localserver-conformance-tests)
    - [31.3 Integration Tests](#313-integration-tests)
    - [31.4 Interoperability Tests](#314-interoperability-tests)
    - [31.5 Accessibility Tests](#315-accessibility-tests)
  - [32. Performance and Scalability](#32-performance-and-scalability)
    - [32.1 Performance Prototypes](#321-performance-prototypes)
    - [32.2 Execution Placement](#322-execution-placement)
    - [32.3 Scale-Driven Infrastructure](#323-scale-driven-infrastructure)
  - [33. Dependency Philosophy](#33-dependency-philosophy)
  - [34. Intentionally Excluded Dependencies](#34-intentionally-excluded-dependencies)
- [Part VII - Implementation Reference](#part-vii---implementation-reference)
  - [35. Architecture Decision Summary](#35-architecture-decision-summary)
  - [36. Remaining Implementation Contracts](#36-remaining-implementation-contracts)
  - [37. Architecture Invariants](#37-architecture-invariants)
  - [38. Index](#38-index)

---

## Glossary

**Core**
The Spring Boot server process responsible for synchronous user-facing server behavior, including REST APIs, WebSocket communication, authorization, domain operations, synchronization coordination, and access to authoritative server persistence.

**Dependency Index**
A derived and rebuildable index of structural dependencies used for reverse traversal, deletion-impact analysis, invalidation, recalculation, duplication, template processing, and dependency inspection. It is not the canonical source of dependency relationships.

**Domain Operation**
A coherent application-level change representing a meaningful user or system action, such as updating a cell, creating a record, moving an object, or resequencing a field.

**IndexedDB Repository**
The application-owned TypeScript persistence layer that provides controlled access to the browser's IndexedDB database.

**Local-First**
The application model in which ordinary user edits commit to durable local state before requiring a network round trip. Cloud-backed work synchronizes asynchronously.

**Native Package**
Better Spreadsheet's versioned application-owned format for preserving and transferring application structure, configuration, relationships, and optional file content.

**Pending Operation**
A locally committed domain operation that has not yet been accepted and reconciled with the authoritative server state of a cloud-synchronized workspace.

**Query Plan**
The application-owned typed representation of a query definition. Query plans describe sources, relationships, filters, expressions, grouping, aggregation, sorting, and limiting without exposing raw SQL as the product model.

**Repository**
An application-owned persistence boundary that isolates domain code from the details of the underlying storage technology.

**Structural Dependency**
A dependency between application objects represented through stable identities, such as a calculated field depending on another field or a widget depending on a query output.

**Transactional Outbox**
A reliability pattern in which a domain change and the durable record that asynchronous work is required are committed in the same PostgreSQL transaction. The recorded work is published to RabbitMQ after commit.

**Worker**
The separately runnable Spring process that consumes RabbitMQ jobs for asynchronous or resource-intensive work. The Worker is part of the modular monolith and is not an independent domain authority.

---

# Part I - Architecture Foundations

## 1. Purpose and Scope

Better Spreadsheet is implemented as a local-first web application with a structured-data and spreadsheet domain model.

The architecture supports:

- Desktop-style spreadsheet interaction
- Durable offline editing
- Optional workspace synchronization
- Structured fields, records, references, and expressions
- Queries and dashboards
- Files and attachments
- Templates
- History and recovery
- Spreadsheet import and export
- Browser and installable PWA use
- Self-hosted deployment

The system is designed as a modular monolith rather than a collection of microservices.

The browser contains substantial application logic so that ordinary interaction and offline work do not depend on constant server communication. The server provides authoritative synchronized persistence, authorization, shared cloud state, asynchronous processing, and services that are better suited to server execution.

---

## 2. Governing Engineering Principles

The following principles guide implementation decisions throughout Better Spreadsheet.

### 2.1 Knowledge Model Semantics Are Authoritative

The Knowledge Model (KM) defines product meaning.
The architecture should implement those semantics rather than allowing persistence, framework, or infrastructure choices to redefine them.

### 2.2 Local-First Interaction

Ordinary edits should not wait for a network round trip.

Changes are committed to durable local state first and synchronized asynchronously when the workspace participates in cloud synchronization.

### 2.3 Domain Operations Represent Meaningful Changes

One user action should map as closely as practical to one coherent domain operation. This keeps synchronization, history, undo, authorization, and server transaction boundaries aligned with meaningful application behavior.

### 2.4 Modular Monolith Before Microservices

Better Spreadsheet uses one application architecture and domain model.

Separate processes may be used where operationally useful, but process separation does not divide the application into independently owned microservice domains.

### 2.5 Application-Owned Behavior When Practical

Product-specific behavior should be implemented within Better Spreadsheet when practical.

External dependencies should provide substantial value through standards compatibility, security maturity, infrastructure capability, interoperability, or functionality that would be unnecessarily expensive or risky to reproduce.

### 2.6 Add Infrastructure When It Solves a Real Problem

Infrastructure should not be introduced simply because it is common in larger systems.

Components such as Redis, PgBouncer, read replicas, distributed caches, and dedicated feature-flag infrastructure are not part of the initial architecture without demonstrated need.

### 2.7 Protect User Data

Unsynced or local-only user work must never be silently discarded.
When recovery, migration, synchronization, or conflict handling becomes difficult, preserving recoverable user work takes priority over convenience.

### 2.8 Localize Failure

Errors and partial failures should remain as close as practical to the data or operation that caused them.

Unrelated usable data and functionality should continue working when safely possible.

### 2.9 Autosave Is the Normal Persistence Model

Ordinary persistent changes are saved as part of the operation that creates them, while explicit save or apply actions are reserved for workflows that intentionally stage a larger operation before execution.

### 2.10 Accessibility Is Architectural

Better Spreadsheet targets WCAG 2.2 AA.

Accessibility requirements apply to the application architecture, including the Canvas-based spreadsheet grid, rather than being treated as post-implementation polish.

### 2.11 Spreadsheet Interoperability Is First-Class

Clipboard, CSV, and XLSX behavior should work naturally with common spreadsheet applications, especially Excel and Google Sheets.

### 2.12 Configuration Should Be Centralized

Configurable product behavior should use defined policy and configuration boundaries rather than scattered implementation branches or hard-coded values.

### 2.13 Live Dependencies Stay Within a Workspace

No live application dependency crosses a workspace boundary.
Cross-workspace reuse creates new identities and remaps dependencies through copying, templates, or import/export workflows.

### 2.14 Stable Identity Drives Relationships

References and dependencies use stable identities rather than display names or presentation positions.

---

## 3. System Architecture

Better Spreadsheet consists of a browser application, a Spring Boot server application, persistent storage, supporting infrastructure, and an asynchronous Worker process.

```text
Browser / Installed PWA
├── Angular application architecture
├── PrimeNG general-purpose UI components
├── Better Spreadsheet application shell and feature UI
├── Hybrid spreadsheet rendering system
│   ├── Canvas high-density rendering
│   └── Angular / PrimeNG DOM interaction overlays
├── Accessible DOM companion representation
├── Application-owned domain and expression engine
├── Query engine
├── Dashboard and Widget runtime
├── Angular services + Signals
├── IndexedDB repository
├── Pending operation log
├── History / Undo state
└── Web Workers
          │
          │ HTTPS / REST + WebSocket
          ▼
       Traefik
          │
          ▼
     Spring Core
     ├── Spring Security
     ├── Keycloak integration
     ├── Domain modules
     ├── Synchronization
     ├── Query coordination
     ├── Native Package coordination
     ├── PostgreSQL repositories
     ├── SeaweedFS integration
     └── Transactional outbox
          │
          ├──────────────► PostgreSQL
          ├──────────────► SeaweedFS
          └──────────────► RabbitMQ ──► Worker
                                      ├── Import / Export
                                      ├── Native Package jobs
                                      ├── Attachment-heavy work
                                      ├── Expensive background work
                                      └── Maintenance
```

The public application should use one origin where practical.

Deployment targets a self-hosted Kubernetes environment using k3s and Helm, initially hosted on Oracle Cloud Infrastructure (OCI).

OCI is the selected initial hosting platform, while the application and deployment architecture should remain portable enough to move to another compatible hosting environment without redesigning the system.

---

## 4. Application Boundaries and Responsibilities

The architecture separates responsibilities without unnecessarily fragmenting the application.

### 4.1 Browser Responsibilities

The browser owns:

- Interactive application state
- Spreadsheet rendering and editing
- Durable local persistence
- Offline-capable domain operations
- Pending synchronization operations
- Local expression evaluation
- Local query execution
- Local search
- Undo and applicable local recovery
- Client-side validation
- PWA behavior

### 4.2 Core Responsibilities

Core owns server-authoritative behavior including:

- Authentication integration
- Authorization enforcement
- REST APIs
- WebSocket communication
- Synchronous domain operations
- Cloud synchronization
- Authoritative PostgreSQL persistence
- Server query execution
- File metadata and authorization
- Template persistence for signed-in users
- Transactional outbox creation
- Coordination of asynchronous jobs

### 4.3 Worker Responsibilities

Worker handles asynchronous or resource-intensive jobs and does not independently own application domain state.

Any authoritative relational changes made by Worker operations use the same application domain rules and PostgreSQL persistence boundaries as applicable server behavior.

### 4.4 Storage Responsibilities

IndexedDB stores durable local application state.

PostgreSQL stores authoritative synchronized relational state.

SeaweedFS stores file binary content.

RabbitMQ transports asynchronous work after that work has been durably recorded through the transactional outbox.

Keycloak provides identity and authentication but does not replace Better Spreadsheet's domain authorization model.

---

# Part II - Frontend and Local Application

## 5. Frontend Architecture

### 5.1 Framework

The frontend is implemented using Angular and TypeScript.

Angular owns application composition, dependency injection, routing, lifecycle management, and integration between application features.

The frontend should prefer modern Angular capabilities, including standalone components, Signals, and framework-provided dependency injection and routing facilities.

### 5.2 UI Component Architecture

PrimeNG is the standard general-purpose UI component library for the Better Spreadsheet Angular frontend.

PrimeNG should be used for conventional application controls and interaction patterns when an appropriate component exists. This includes:

- Buttons
- Menus
- Context menus
- Form controls
- Selects and dropdowns
- Data and time controls
- Dialogs
- Confirmation dialogs
- Popovers
- Tooltips
- Tabs
- Trees
- Notification
- Progress indicators
- Other conventional application UI primitives

Better Spreadsheet owns components that represent application-specific structure, behavior, interactions, or domain concepts.

Application-owned components may compose PrimeNG components internally without exposing PrimeNG component models as part of the better Better Spreadsheet domain model.

PrimeNG does **NOT** own:

- Application architecture
- Domain models
- Application state
- Persistence
- Synchronization
- Spreadsheet semantics
- Spreadsheet interaction behavior
- High-density spreadsheet rendering

PrimeNG components may be used directly where appropriate. Application-owner wrapper components should not be created solely to abstract PrimeNG behind a second general-purpose component API.

A Better Spreadsheet component should be introduced when application-specific behavior, composition, semantics, or reuse provides a meaningful reason for the abstraction.

### 5.3 Application Shell

Better Spreadsheet owns its application shell, workspace composition, and application-level navigation behavior.

The application shell provides the persistent structure through which users navigate and interact with application features and workspace content. Application-owned shell responsibilities include:

- Top-level application navigation
- Workspace and feature navigation
- Primary work-area composition
- Contextual and supporting application surfaces
- Application-level status and feedback surfaces
- Resizing, visibility, and layout behavior where applicable
- Coordination between shell surfaces and application state

The exact arrangement, presence, and visual presentation of shell surfaces are user-experience decisions and are not fixed by the system architecture.

PrimeNG components may be composed within application shell surfaces for conventional controls, menus, trees, buttons, tooltips, overlays, panels, and similar interaction elements.

PrimeNG may provide the implementation mechanism for individual shell surfaces where appropriate, but Better Spreadsheet retains ownership of their application semantics, composition, state, and behavior.

The application shell must not depend on PrimeNG-specific models as representations of Better Spreadsheet domain or application state.

### 5.4 Theming and Design Tokens

PrimeNG's theming and design-token system provides the foundation for styling general-purpose UI components. Better Spreadsheet defines application-specific semantic design tokens for application-owned surfaces and behaviors.

The combined theme architecture supports:

- Light appearance
- Dark appearance
- Application accent colors
- Consistent typography
- Surface hierarchy
- Borders and separators
- Hover states
- Active states
- Focus states
- Disabled states
- Application-specific semantic states

Application styling should prefer supported PrimeNG theming and token mechanisms over global CSS rules that depend on PrimeNG implementation details.

Better Spreadsheet-specific design tokens should describe semantic application concepts rather than unnecessarily duplicating PrimeNG's component-level token system.

Theme and accent color selections are presentation concerns and must not impact the domain state.

### 5.5 State Management

Angular Signals and application services are the default frontend state-management mechanisms.

State should be placed according to ownership and lifecycle. Local component state should remain local when it does not need to be shared. Shared application state should be exposed through application-owned services or other explicitly
defined state boundaries.

PrimeNG component state must not become the canonical source of Better Spreadsheet domain state.

### 5.6 Application Services

Application services coordinate frontend behavior that spans components or application features. Services may own responsibilities such as:

- Persistence coordination
- Synchronization
- Workspace state
- Application preferences
- Command execution
- Undo and redo
- Notifications
- Background operations
- Other cross-feature application behavior

Services should expose application concepts rather than PrimeNG-specific component models.

---

## 6. Spreadsheet Grid and Interaction Architecture

### 6.1 Hybrid Spreadsheet Rendering

The actual spreadsheet uses an application-owned hybrid rendering architecture optimized for high-density spreadsheet interaction.

Canvas is the preferred rendering mechanism for high-volume visual surfaces where DOM-based rendering would create unacceptable performance, memory, or interaction overhead.

Angular and DOM-based controls are used where native browser interaction, accessibility, or component-library integration provides greater value.

The rendering architecture may therefore combine:

- Canvas-rendered cells, grid lines, selections, ranges, and high-volume visual state
- DOM-based editors, interactive controls, and accessibility representations
- PrimeNG-powered interaction overlays
- Other rendering mechanisms when profiling demonstrates a meaningful benefit

The system design does not require every spreadsheet visual element to use canvas. Implementation decisions such as whether row and column headers, drag handles, frozen-region controls, or similar surfaces use Canvas or DOM rendering may be made according to performance, accessibility, interaction complexity, and maintainability.

The spreadsheet rendering system must preserve the ability to support large datasets and high-density visible regions without creating one Angular component or DOM subtree per cell.

### 6.2 Spreadsheet Ownership

Better Spreadsheet owns the spreadsheet interaction model rather than delegating spreadsheet behavior to a third-party spreadsheet or grid product. Application-owned spreadsheet responsibilities include:

- Cell and range selection
- Active cell behavior
- Keyboard navigation
- Editing lifecycle
- Row and column operations
- Clipboard behavior
- Fill behavior
- Undo and redo integration
- Field semantics
- Validation integration
- Formula and expression integration
- Spreadsheet commands
- Rendering coordination
- Interaction between spreadsheet state and application state

PrimeNG does not replace Better Spreadsheet's spreadsheet engine. General-purpose PrimeNG components may be used to implement conventional controls presented by the spreadsheet system.

### 6.3 Canvas and DOM Interaction Boundary

High-density spreadsheet rendering and conventional interactive controls have different requirements and should use the rendering mechanism best suited to each responsibility.

The preferred responsibility boundary is:

```text
High-density visual rendering
    -> Canvas preferred

Application controls
    -> Angular / PrimeNG

Cell editors
    -> Angular / PrimeNG DOM overlays

Menus and popovers
    -> PrimeNG where appropriate

Accessibility representation
    -> DOM companion representation

Spreadsheet behavior and semantics
    -> Better Spreadsheet engine
```

DOM-based spreadsheet interaction overlays may include:

- Text editors
- Numeric editors
- Choice selectors
- Date and time controls
- Context menus
- Tooltips
- Popovers
- Validation messages
- Dialogs
- Other controls requiring conventional browser interaction

Spreadsheet interaction overlays are positioned and coordinated by the Better Spreadsheet spreadsheet system.

For example:

    Rendered cell
          |
          | edit requested
          v
    Spreadsheet interaction model
          |
          | determines field and editor semantics
          v
    Angular overlay
          |
          v
    PrimeNG or native DOM control
          |
          | value committed
          v
    Domain / spreadsheet state
          |
          v
    Grid redraw

The interactive control provides the appropriate user interface but does not become the canonical owner of the cell value, field semantics, validation rules, or editing lifecycle.

### 6.4 Virtualization

The grid should render only the content needed for the visible working area and appropriate surrounding buffer. Large tables must not require a DOM element for every visible or non-visible cell.

Virtualization applies independently of the specific rendering mechanism used for an individual spreadsheet surface. The renderer may use techniques such as:

- Viewport virtualization
- Selective rendering
- Dirty-region redraws
- Cached text measurement
- Cached layout calculations
- Batched rendering
- Efficient hit testing

Rendering optimizations should be introduced based on profiling and measured performance requirements.

### 6.5 Heavy Client Computation

CPU-intensive client operations may run in Web Workers when doing so materially protects interface responsiveness.Candidate workloads include:

- Large formula recalculation
- Query evaluation
- Import parsing and preflight
- Export preparation
- Large sorting, filtering, and grouping
- Conditional-formatting evaluation batches

Ordinary lightweight interaction should remain on the normal application path unless profiling demonstrates a need to move it.

---

## 7. Client State and Local Persistence

### 7.1 IndexedDB Repository

Use native IndexedDB through an application-owned TypeScript repository and data-access layer.

Raw IndexedDB access remains contained within this persistence layer and no IndexedDB ORM or wrapper is required initially.

The repository is responsible for:

- Schema and version management
- Transactions
- Cached workspace data
- Local-only workspace data
- Pending operations
- Synchronization cursors and metadata
- Protected unsynced work
- Durable object and configuration state
- Local Template Library state
- History state required for local recovery
- Safe reconstructible query or result caches

### 7.2 Local Schema Versioning

The IndexedDB schema has its own explicit version and forward migrations.

Local migrations are independent from PostgreSQL and Liquibase migrations.

On application startup or update:

1. Open the local database
2. Inspect its schema version
3. Run required forward migrations
4. Preserve pending, unsynced, and local-only user work
5. Enter normal application use and synchronization only after migration succeeds

Server-reconstructible cache may be discarded and rebuilt when that is safer than performing a complicated migration.

User-owned unsynced or local-only work may not be silently wiped.

### 7.3 Migration Failure

A failed migration does not automatically wipe IndexedDB.

Transient failures may allow retry.

Persistent failures should preserve local state and prevent unsafe normal editing until the application can recover, export the user's work, or safely rebuild the affected state.

Automatic wipe and resynchronization is allowed only when the application can establish that no unsynced or local-only user work would be lost.

---

## 8. Application-Owned Domain and Expression Engine

Better Spreadsheet uses a shared typed domain and expression engine rather than implementing separate expression languages for different features.

### 8.1 Shared Expression Semantics

The expression engine defines:

- Typed values
- Blank semantics
- Arithmetic
- Boolean logic
- Comparisons
- Text operations
- Date and time operations
- Functions
- Type inference and coercion
- Scalar and multi-value behavior
- Stable structural references
- Dependency relationships
- Cycle detection
- Localized error values
- Record-level evaluation context

### 8.2 Expression Consumers

The same expression semantics are used by:

- Calculated fields
- Summaries
- Record validation
- Conditional formatting
- Query expressions and filters
- Widget calculations
- Applicable dashboard controls

Relational query operations such as joins and grouping remain part of the query layer rather than being forced into cell formula syntax.

### 8.3 Function Catalog

Function registration should be typed and extensible.

The product's current function catalog is not an architectural closed enum.

`NOW()` uses browser or JavaScript current-time semantics during local evaluation.

Stored Created and Last Modified metadata is maintained separately.

### 8.4 Structural Dependency Representation

Structural dependencies are stored as stable-ID references in the authoritative definition or configuration of the object that owns the dependency.

Display names may be used for authoring and presentation without becoming dependency identity.

Do not maintain a second canonical inverse `depended on by` list on target objects.

High-volume record-level relationships, such as individual reference-cell links, use purpose-built storage and indexes rather than being represented as general structural dependency metadata.

---

## 9. Local Query Execution

The browser provides a local query execution path for offline-capable data.

### 9.1 Local Capability

Local execution uses the same application-owned typed query plan and semantic contract used by server execution.

Local execution supports the applicable query operations available to the client, including:

- Sources
- Relationships and joins
- Filters
- Projections and calculations
- Grouping
- Aggregation
- Sorting
- Limiting

### 9.2 Decimal-Safe Evaluation

Client numeric evaluation uses decimal-safe behavior rather than relying on ordinary binary floating-point arithmetic for canonical numeric semantics.

This keeps local calculation compatible with PostgreSQL `NUMERIC` behavior and the application's Number, Currency, Percentage, formula, query, and aggregation semantics.

The exact client decimal implementation remains an implementation contract.

### 9.3 Local Query Workloads

Query execution may move to a Web Worker when workload size or complexity would otherwise interfere with interface responsiveness.

Exact thresholds should be established through profiling rather than hard-coded into the architecture.

---

## 10. Local-First Operations and Synchronization

### 10.1 Edit Lifecycle

For an ordinary mutation:

1. Validate what can be validated synchronously
2. Commit the domain operation to IndexedDB
3. Update reactive application state
4. Record or maintain a pending synchronization operation when the workspace is cloud-backed
5. Synchronize asynchronously
6. Reconcile the server response or conflict without silently discarding local work

Autosave follows directly from this model.

### 10.2 Operation Model

Synchronization uses explicit domain operations with:

- Stable object identities
- Operation identity
- Actor and device context where required
- Enough semantic information for deterministic replay and conflict handling

Examples include:

- Create, update, or delete a record
- Update a cell
- Reorder records
- Move a structural object
- Update view, query, or dashboard configuration
- Resequence a field
- Archive, trash, or restore an object
- Duplicate an object
- Apply a template

### 10.3 Conflict Handling

Independent field or object changes should merge when they can safely coexist without using last-write-wins as a universal conflict policy.

Structural conflicts that cannot be safely resolved automatically are surfaced explicitly.

Where useful, conflict resolution may use base, local, and remote state similar to a source-control merge workflow.

### 10.4 Permission Changes

If server authorization changes while a user has local pending work, later unauthorized server writes are rejected.
The local work remains recoverable or exportable where appropriate rather than being silently deleted.

### 10.5 Synchronization Recovery

Durable synchronization state and cursors allow clients to recover after disconnection or missed realtime notifications.

WebSocket delivery is not relied upon as the sole record of synchronized state.

### 10.6 Workspace Boundary

Synchronization does not create live cross-workspace dependencies.

Cross-workspace copying or import creates new identities and remaps dependencies according to the applicable workflow.

---

## 11. PWA, Offline, and Browser Behavior

### 11.1 Installable PWA

Better Spreadsheet is primarily delivered as an installable Progressive Web App on platforms that support installation well. The application remains usable through a normal browser URL without installation.

### 11.2 PWA Updates

New application builds may download or cache in the background and an update must not force-reload the application underneath active editing.

Activation occurs at a safe boundary, with local schema migration completed before normal use and synchronization resumes.
The exact update prompt and interface remain an implementation detail.

### 11.3 Offline Availability

Content explicitly made available offline is protected from normal working-cache cleanup.

Other working data may be retained according to configurable policy.

Archive state does not determine whether content is available offline.

### 11.4 Network Policy

Synchronization and download behavior may support configurable network policies such as Wi-Fi-only operation.

### 11.5 Browser Support

Where browser-native PWA installation is unavailable or limited, Better Spreadsheet provides the best browser-supported bookmark, install, or app-window experience available without requiring a platform-specific native wrapper.

### 11.6 Demo Mode

A browser-based demo mode may be provided without installation or account setup.

Demo data remains separate from ordinary persistent user workspace data.
The exact demo reset and retention behavior remains an implementation contract.

---

## 12. Accessibility

Better Spreadsheet targets WCAG 2.2 AA.

The hybrid spreadsheet rendering system must provide an accessible interaction model independent of its high-density visual rendering mechanism.

Canvas-rendered information must not be the sole representation of information required for accessible operation. The spreadsheet must provide appropriate DOM-based accessibility support for:

- Keyboard navigation
- Focus semantics
- Active cell identification
- Row and column context
- Cell values
- Editing, validation, and selection states
- Screen-reader announcements
- Non-pointer operation

An accessible DOM companion representation may be maintained independently from the visual canvas representation. Angular and PrimeNG controls used as spreadsheet interaction overlays must participate correctly in the spreadsheet focus and keyboard model.

Accessibility requirements take precedence over rendering convenience.

---

# Part III - Server Architecture

## 13. Backend Architecture

### 13.1 Spring Boot Modular Monolith

The backend uses Java Spring Boot as a modular monolith.

One codebase is organized into domain-focused modules rather than independent microservices.

Candidate modules include:

- Identity and access
- Workspace and collection
- Table, record, and field
- View, section, and summary
- Query
- Dashboard and widget
- Template
- File and attachment
- Validation and expression metadata
- Synchronization
- History and lifecycle
- Import, export, and Native Package

### 13.2 Core Process

Core handles:

- Synchronous user-facing API work
- Authorization
- Domain validation
- Synchronization coordination
- Realtime communication
- PostgreSQL persistence
- File metadata operations
- Query coordination
- Background-job creation

### 13.3 Server Transaction Boundary

One logical synchronous domain operation is atomic across the authoritative PostgreSQL state it directly changes whenever that state can reasonably participate in one database transaction.

A synchronous operation must not leave partially committed authoritative relational state.

External or asynchronous concerns such as file binaries, Worker jobs, notifications, and large exports are not forced into a distributed transaction.

Reliable asynchronous work uses the transactional outbox described in [Section 18](#18-background-jobs-and-asynchronous-processing).

---

## 14. API and Realtime Communication

### 14.1 REST Is the Authoritative Mutation Path

REST and server domain operations are the authoritative server mutation path.

WebSocket is not a separate mutation API.

Local-first changes synchronize through the authoritative REST/domain-operation path.

### 14.2 WebSocket Responsibilities

WebSocket supports realtime coordination such as:

- Change notifications
- Invalidation signals
- Synchronization signals
- Job completion
- Permission or status changes
- Applicable presence-style events

After a server mutation commits, WebSocket may notify other connected clients.

Clients use durable synchronization state to recover if those messages are missed.

### 14.3 OpenAPI

Maintain OpenAPI documentation for the REST surface.

Swagger UI should be available in appropriate development and test deployments.

OpenAPI is an implementation and developer contract rather than part of the product domain model.

### 14.4 API Versioning

A global `/v1` API prefix is not required initially.

Compatibility for durable operations or protocols should be handled explicitly where needed rather than requiring global API versioning before a concrete need exists.

---

## 15. Authentication and Authorization

Better Spreadsheet uses **Keycloak with OAuth2/OIDC** for authentication.

Spring Security performs server-side authentication integration and authorization enforcement.

### 15.1 Domain Authorization

Workspace membership, ownership, roles, grants, and sharing relationships are stored as Better Spreadsheet domain facts.

Keycloak roles do not replace the application's authorization model.

### 15.2 Authorization Boundaries

Authorization applies to:

- Direct object APIs
- Queries and derived access
- Files and attachments
- Synchronization operations
- Background jobs
- Export and Native Package workflows

Derived access must not become a path around permissions that would apply to the underlying data.

---

## 16. PostgreSQL Persistence

PostgreSQL is the authoritative relational database for synchronized server state.

Liquibase manages PostgreSQL schema migrations.

### 16.1 Numeric Semantics

Canonical application numeric behavior uses decimal arithmetic.

PostgreSQL `NUMERIC` is the server-side basis for applicable:

- Number values
- Integer-compatible numeric persistence
- Currency
- Percentage
- Rating
- Formula results
- Query calculations
- Aggregations

Exact precision, scale, rounding, and serialization rules remain implementation contracts and must be validated against client behavior and XLSX interoperability.

### 16.2 Typed Cell Persistence

Scalar cell values use a relational hybrid typed-value model keyed by stable record and field identities.

Compatible semantic field types may share physical storage families.
For example, Number, Integer, Currency, Percentage, and Rating may share decimal numeric storage while field metadata defines their semantic type and configuration.

Multi-value or relational values such as references and attachments use purpose-built relational storage.

Select values use stable option identities rather than display labels.

JSONB is not the canonical cell-value store but may be used for configuration or metadata where its flexibility is useful.

### 16.3 Indexing

Indexes are designed around measured access patterns, including:

- Workspace and object ownership
- Stable identity lookup
- Record and field storage
- Reference lookup
- Synchronization cursors
- Lifecycle state
- Search
- Query execution

Do not default to a generic EAV-only persistence strategy that makes typed filtering and aggregation unnecessarily expensive.

### 16.4 Connection Management

Use the normal Spring/HikariCP connection pool initially.
PgBouncer is not required unless later workload demonstrates a need.

### 16.5 Server Caching

Do not introduce Redis or another dedicated server cache initially.
Safe reconstructible caches may use application process memory where useful.

---

## 17. Server Query Execution

Server query execution uses the same application-owned query plan and semantic contract as local execution.

### 17.1 SQL Translation

The application may translate query plans into parameterized PostgreSQL SQL.

Users do not author raw SQL as the initial query product model.

Generated SQL must remain:

- Parameterized
- Authorization-scoped
- Semantically consistent with the application query model

### 17.2 PostgreSQL-Friendly Semantics

Application query and expression semantics should align with PostgreSQL behavior when that behavior is compatible with the KM.

PostgreSQL does not independently define product semantics.

When PostgreSQL behavior differs from the application contract, generated SQL compensates using explicit:

- Casts
- Expressions
- Ordering clauses
- Null handling
- Other controlled translation

### 17.3 Server Execution Placement

Server execution may be used when:

- Required data is not locally available
- Workload size favors server execution
- The operation requires server-only capability
- Authorization or shared state requires server evaluation

Placement is automatic and transparent to ordinary users.

Exact workload thresholds and cost heuristics remain implementation-tuned.

---

## 18. Background Jobs and Asynchronous Processing

RabbitMQ and Worker handle asynchronous or resource-intensive work.

Candidate jobs include:

- Large XLSX import and export
- Native Package creation and restore
- Workspace duplication with attachments
- Large attachment processing
- Expensive server-side queries where synchronous latency is inappropriate
- Cleanup and maintenance
- History compaction where needed

### 18.1 Transactional Outbox

Better Spreadsheet uses a transactional outbox for asynchronous work.

The synchronous domain change and the durable fact that asynchronous work is required are committed together in the same authoritative PostgreSQL transaction.

An outbox publisher delivers pending work to RabbitMQ after the transaction commits, which prevents a successful domain change from losing the fact that its required asynchronous work still needs to happen.

### 18.2 Delivery Semantics

RabbitMQ and Worker processing are at-least-once, meaning worker operations must be idempotent or otherwise safely retryable where applicable.

A job may be delivered or attempted more than once without creating incorrect duplicate domain effects.

### 18.3 Failure Handling

Asynchronous jobs expose explicit success or failure state where the workflow requires user visibility.

Retry counts, acknowledgement behavior, dead-letter configuration, and exact job-state representation remain implementation contracts.

### 18.4 No Distributed Transaction

Do not use a distributed transaction between PostgreSQL and RabbitMQ.

PostgreSQL provides the authoritative transaction boundary.

The transactional outbox bridges that boundary to asynchronous processing.

---

## 19. Files and Object Storage

PostgreSQL and SeaweedFS have separate responsibilities for files.

### 19.1 Metadata and Binary Ownership

PostgreSQL stores:

- File identity
- Workspace ownership
- Metadata
- Lifecycle state
- References
- Authorization facts
- Integrity metadata

SeaweedFS stores binary object content.

### 19.2 Upload Validation

Uploads perform bounded validation for:

- Size
- Applicable file-type rules
- Authorization
- Storage availability
- Integrity metadata

### 19.3 Attachment References

Attachment cells store file identities.

Reference changes update applicable relational reference state transactionally.

Binary content must not be deleted while another valid attachment reference remains.

### 19.4 Offline File Delivery

File metadata and binary availability are separate.

Binary caching and downloading follow workspace offline-availability and network policy.

### 19.5 Large File Workflows

Native Package, duplication, import, and export workflows should stream large binaries rather than requiring entire files to be loaded into application memory.

---

# Part IV - Cross-Cutting Application Systems

## 20. Query Architecture

Queries are first-class workspace objects implemented through an application-owned typed query engine.

### 20.1 Query Sources

Initial query sources are:

- Table
- View

A view source contributes its included dataset and filtering behavior.
Presentation-only settings such as field width, color, and gridlines do not become query semantics.

Query-to-query composition is deferred.

### 20.2 Query Plan

A query definition is represented as an application-owned typed plan or AST.

The plan may contain:

- Source declarations
- Join and relationship nodes
- Filters
- Projections
- Calculated expressions
- Grouping
- Aggregate expressions
- Sorting
- Limits

The query product model is not raw SQL.

### 20.3 Query Output Fields

A query owns stable-identity Query Output Fields distinct from table fields and may contain:

- Stable identity
- Display name
- Inferred or declared semantic type
- Source or expression lineage
- Aggregation metadata
- Source record identity lineage where applicable

Widgets, dashboard controls, query configuration, and other consumers bind to Query Output Field identities rather than display names or result column positions.

### 20.4 Common Execution Contract

Local and server execution implement the same application contract for:

- Decimal numeric behavior
- Blank and null behavior
- Comparison and coercion
- Sorting
- Date and time behavior
- Aggregation
- Localized errors

Conformance tests verify equivalent semantics across execution paths.

### 20.5 Execution Placement

Execution placement is automatic.

Prefer local execution when required data is available locally and client execution is appropriate.

Use server execution when capability, data availability, authorization, or workload makes it the appropriate path.

Offline use falls back to local execution where possible. If the query cannot be evaluated offline because required data or capability is unavailable, the application reports that limitation rather than returning a misleading empty result.

Developer tooling may force an execution path for testing and diagnostics.

### 20.6 Partial Results and Errors

Query errors remain localized when safely possible.

A broken calculated output should not automatically make independent valid outputs unavailable. If source or join context cannot be established, the broader query may be marked broken while preserving its definition.

### 20.7 Query Result Caching

Query results are derived and reconstructible.

Cached query results are performance optimizations and are not canonical business records.

### 20.8 Reference Candidate Queries

Queries used to restrict reference candidates must preserve identifiable source record identities.

Aggregated or derived rows without source record identity cannot become reference targets.

---

## 21. Dependency Tracking

Better Spreadsheet uses source-owned structural dependency metadata with a derived dependency index.

### 21.1 Canonical Dependency Representation

The object that owns a dependency stores the stable identity of the object it depends on.

When an AST or configuration already contains that authoritative reference, the same dependency should not be duplicated into a second canonical declaration.

### 21.2 Dependency Service

An application-owned Dependency Service exposes structural dependencies as typed edges.

It provides a common interface for features that need to understand relationships without making the derived index authoritative.

### 21.3 Dependency Index

The derived Dependency Index supports:

- Reverse dependency traversal
- Deletion-impact analysis
- Invalidation
- Recalculation
- Duplication and copy remapping
- Template packaging
- Template instantiation
- Broken-state analysis
- Dependency inspection

The index is rebuildable from authoritative source-owned definitions.

### 21.4 High-Volume Relationships

Individual record-reference relationships are not forced into the general structural dependency index.

High-volume relationships use purpose-built relational or local indexes appropriate to their access patterns.

---

## 22. Templates

Templates use one application-level template concept.

### 22.1 Scope

Templates are application-scoped rather than workspace-scoped.

For signed-in cloud use, user templates are stored in an account or application-scoped server area separate from workspace ownership.

For local or unsigned use, templates are stored in IndexedDB.

### 22.2 Template Model

Use one template domain model with a scope or type discriminator and versioned configuration structure.

The model supports:

- Table templates
- View templates
- Query templates
- Dashboard templates
- Workspace templates

Do not create unrelated parallel domain hierarchies for each template type.

### 22.3 Instantiation

Template instantiation:

1. Validates target compatibility
2. Creates new stable identities
3. Remaps template-internal relationships
4. Infers external mappings only when safe
5. Requests user mapping when a dependency is unresolved or ambiguous
6. Never silently guesses an ambiguous dependency

Built-in templates are immutable.

Customization of a built-in template begins by duplicating it into a user template.

---

## 23. History, Undo, and Lifecycle

### 23.1 Undo and Redo

Use command or operation-based short-term undo and redo capacity is configurable or implementation-defined rather than hard-coded to a fixed number.

Bulk operations such as resequencing should behave as one coherent undo-able action where practical.

### 23.2 Durable History

History records meaningful persistent domain and configuration changes.

Applicable history may include:

- Table, record, and cell state
- Views and sections
- Query definitions
- Dashboard, widget, and control configuration
- Lifecycle changes
- Persistent configuration changes

Do not store transient interface state such as scroll position, hover state, open panels, or panel size as durable history.

### 23.3 History Storage

The architecture does not yet lock History to snapshots, deltas, operations, or a hybrid.
The chosen implementation must support the product's recovery semantics and configured retention requirements.

History is not a backup mechanism.

### 23.4 Named Restore Points

The final user-facing name for intentional named history restore points is not locked.

### 23.5 Archive

Archive is represented as a lifecycle state for applicable structural objects and preserves stable identities, hierarchy, and valid dependencies.

### 23.6 Trash

Trash preserves the hierarchy needed for restoration and later permanent deletion.

Retention is configurable.

Deletion-impact analysis focuses on dependencies that survive outside the deletion scope.

---

## 24. Import, Export, and Native Packages

### 24.1 Interoperability Formats

Better Spreadsheet supports:

- CSV
- JSON where applicable
- XLSX

### 24.2 XLSX

Use Apache POI on the Java side for XLSX import and export.

Support should include:

- Compatible formula translation
- High-fidelity compatible formatting
- Explicit data-only workflows
- Clear warnings for unsupported formula or formatting constructs

### 24.3 Native Package

The Native Package is an application-owned versioned format.

It may preserve:

- Workspace and object metadata
- Collections
- Tables, fields, and records
- Views, sections, and summaries
- Queries
- Dashboards, widgets, and controls
- Dependency mappings
- Applicable lifecycle and configuration state
- Optional attachment binaries
- Checksums and version metadata

The exact archive or container format remains an implementation contract.

### 24.4 Native Package Compatibility

Native Packages are explicitly versioned.

Current-version packages import normally.
Supported older versions are migrated forward during import or read.

Migration does not mutate the original package.

Unsupported future versions fail safely and explicitly.
Unknown structures are not guessed or partially imported.

Successfully imported objects use the current application's model and schema.

Indefinite backward compatibility is not required. The supported migration range may evolve with the application.

### 24.5 Workspace Restore

Restoring a complete workspace package always creates a new workspace identity but packaged child identities are preserved when safe.

If preserving a child identity would cause a collision or violate an invariant, the identity is remapped and internal dependencies are rewritten consistently.

A whole-workspace restore does not generically merge into an existing workspace.

### 24.6 Lower-Level Transfer

Supported lower-level native objects may be imported into an existing workspace.

These objects receive new identities where required, and internal dependencies are remapped.

External dependencies require safe mapping or explicit unresolved state.

### 24.7 Attachment Content

Native export, backup, restore, and workspace duplication may allow attachment binaries to be included or excluded.

When excluded, package metadata must explicitly preserve enough information to identify unavailable file content.

Large binaries should be streamed.

---

## 25. Search

Better Spreadsheet does not initially require a dedicated search service.

### 25.1 Server Search

Server and cloud workspace search uses PostgreSQL-native indexing and search capabilities.

### 25.2 Local Search

Offline and local search uses application-owned indexing over IndexedDB.

### 25.3 Common Search Semantics

A common Search layer should preserve the application's search behavior across local and server execution.

A dedicated search engine may be introduced later if measured scale or performance demonstrates the need.

### 25.4 Query Search

Normal workspace search does not automatically evaluate or index query definitions and query results.

Queries use their explicit query search and browsing behavior.

---

## 26. Spreadsheet and Clipboard Interoperability

### 26.1 Internal Clipboard

The internal clipboard may carry Better Spreadsheet metadata needed for structural copy and paste.

Values-only behavior remains the safe interoperable default where appropriate.

Formula-aware or reference-aware paste is explicit when needed.

### 26.2 External Clipboard

Copy and paste with Excel and Google Sheets should use standard clipboard formats.

Ordinary value transfer must not depend on proprietary Better Spreadsheet clipboard metadata.

### 26.3 Spreadsheet Semantics

Import, export, formula translation, date/time behavior, percentages, currency, and numeric precision must be tested against representative spreadsheet files rather than assumed to behave identically across systems.

---

# Part V - Infrastructure and Operations

## 27. Deployment and Networking

### 27.1 Kubernetes

Deploy using k3s and Helm.

### 27.2 Ingress

Use Traefik for:

- TLS termination
- Routing
- Coarse edge controls

### 27.3 Public Topology

Prefer one public origin for the application and API where practical to simplify:

- PWA behavior
- Security boundaries
- CORS
- Authentication integration
- Portfolio and demo deployment

### 27.4 Configuration

Deployment configuration is externalized through:

- Helm values
- Kubernetes Secrets
- Kubernetes ConfigMaps
- Application configuration

Product-level configurable behavior remains application or domain configuration rather than being scattered across deployment flags.

### 27.5 Hosting

Oracle Cloud Infrastructure (OCI) is the initial hosting platform for Better Spreadsheet and is deployed using k3s and Helm.

OCI is a deployment target rather than an application dependency. Better Spreadsheet should avoid provider-specific architectural coupling where practical so the deployment can move to another compatible hosting environment without requiring application redesign.

---

## 28. Backup and Disaster Recovery

Infrastructure backup is separate from user-facing Native Package functionality.

Infrastructure disaster recovery covers:

- PostgreSQL backup
- SeaweedFS or object-store backup
- Required Keycloak data and configuration
- Deployment configuration
- Secrets recovery procedures

Native Packages are portable user-facing product artifacts.

They are not a replacement for infrastructure-level disaster recovery.

---

## 29. Logging and Diagnostics

Use structured application logging.

Logs should include appropriate operational identifiers such as:

- Correlation or request IDs
- Domain operation IDs
- Background-job IDs
- Workspace or object IDs where safe and useful
- Synchronization failures
- Migration failures
- Query execution diagnostics
- Import and export failures
- Native Package failures
- Authorization denials
- Worker retries and failures

Sensitive cell values and file contents should not be logged by default.

A heavy third-party telemetry platform is not required initially.

---

## 30. Configuration and Operational Policy

Configuration should distinguish between product policy, deployment configuration, and implementation tuning.

### 30.1 Product Policy

Examples include:

- Retention behavior
- Offline availability policy
- Network synchronization preferences
- Other user or application-level configurable behavior

These belong to the application model and configuration system.

### 30.2 Deployment Configuration

Examples include:

- Service endpoints
- Credentials and secrets
- Storage configuration
- Environment-specific infrastructure values

These belong in application configuration, Kubernetes configuration, Secrets, ConfigMaps, or Helm values.

### 30.3 Implementation Tuning

Performance thresholds and internal tuning values may change based on profiling without becoming product semantics.

Examples include:

- Query execution thresholds
- Worker concurrency
- Web Worker thresholds
- Cache sizes
- Connection-pool sizing

---

# Part VI - Quality and Engineering Constraints

## 31. Testing Strategy

Testing should verify both individual components and the architectural contracts between local and server behavior.

### 31.1 Unit and Property Tests

Important domains include:

- Type conversion
- Blank semantics
- Expression functions
- Dependency and cycle behavior
- Record-level expressions
- Validation severity
- Uniqueness and composite uniqueness
- Reference restrictions
- Sequence generation and resequencing
- Query-plan evaluation
- Partial errors
- Naming scopes

### 31.2 Local/Server Conformance Tests

Run shared semantic fixtures against local and server query and expression execution where both paths exist.

The same logical input and query definition should produce semantically equivalent results.

### 31.3 Integration Tests

Integration coverage includes:

- IndexedDB migration
- Local-first operation replay
- Offline edits and reconnect
- Permission revocation
- File reference lifecycle
- Native Package round trip
- Workspace restore creating a new workspace
- Template instantiation and remapping
- Hierarchical collection trash and restore
- Collection and workspace duplication dependency remapping
- Transactional outbox publication
- Worker retry and idempotency behavior

### 31.4 Interoperability Tests

Maintain representative workbook fixtures for:

- XLSX formulas
- Formatting
- Multiple worksheets
- Dates and times
- Percentages
- Currency
- Invalid and incomplete imported values

### 31.5 Accessibility Tests

Accessibility testing is part of normal release validation.

Testing includes keyboard operation, focus behavior, accessible grid representation, screen-reader state, and non-pointer workflows.

---

## 32. Performance and Scalability

Better Spreadsheet should optimize based on measured workloads rather than speculative scale.

### 32.1 Performance Prototypes

Benchmark before locking low-level optimizations for:

- Large Canvas grids
- Large local sorting, filtering, and grouping
- Formula recalculation
- Multi-source queries
- IndexedDB transaction patterns
- Large Native Packages
- Attachment-heavy workspace duplication

### 32.2 Execution Placement

Expensive work may move between:

- Main browser thread
- Web Worker
- Synchronous Core processing
- Server query execution
- RabbitMQ Worker

The appropriate path depends on capability, data location, latency, and measured workload.

### 32.3 Scale-Driven Infrastructure

Do not introduce additional infrastructure solely in anticipation of future scale.

Measured performance should drive decisions such as:

- Dedicated caching
- PgBouncer
- Read replicas
- Dedicated search infrastructure
- Additional Worker specialization
- Other distributed components

---

## 33. Dependency Philosophy

Better Spreadsheet uses dependencies according to the responsibility being solved.

Depending on which option provides the strongest combination of maintainability, accessibility, interoperability, performance, security, and implementation value, preferences could be:

- Browser platform capabilities
- Angular framework capabilities
- Mature general-purpose dependencies
- Application-owned implementations

Product-specific behavior should remain application-owned when practical.

Standardized infrastructure and general-purpose UI may use mature dependencies when those dependencies provide meaningful capability or reduce unnecessary maintenance burden.

Major intended dependencies include:

- Angular
- PrimeNG
- Spring Boot
- PostgreSQL
- RabbitMQ
- Keycloak
- SeaweedFS or another S3-compatible object storage implementation
- Other explicitly selected infrastructure dependencies

Application-owned systems include:

- Better Spreadsheet domain behavior
- Spreadsheet interaction engine
- Hybrid spreadsheet rendering system
- Formula and expression engine
- IndexedDB abstraction
- Synchronization operation model
- Better Spreadsheet-specific composite UI and interaction systems

PrimeNG is the standard general-purpose Angular UI component library, but it does not define the Better Spreadsheet application architecture or domain model.

Application-owned wrappers around third-party components should only be introduced when they add meaningful Better Spreadsheet behavior, semantics, composition, or reuse. Wrappers should not be created solely to hide the identity of a dependency.

---

## 34. Intentionally Excluded Dependencies

The following dependency categories are intentionally excluded unless a future architecture decision explicitly revisits them:

- Third-party full spreadsheet or grid engines that replace the Better Spreadsheet spreadsheet interaction or rendering architecture
- Dependencies that duplicate capabilities already adequately provided by Angular, PrimeNG, the browser platform, or existing application infrastructure without providing meaningful additional value
- Dependencies that require Better Spreadsheet domain models to conform to library-specific representations without a compelling architectural reason

These exclusions do not prohibit the use of focused libraries that solve specific technical problems without taking ownership of Better Spreadsheet domain behavior or application architecture.

A new dependency should be evaluated based on whether it:

- Solves a meaningful problem that would otherwise require substantial application-owned implementation or maintenance
- Has a clear and limited architectural responsibility
- Integrates without becoming the canonical owner of Better Spreadsheet domain concepts
- Provides sufficient accessibility, maintainability, security, performance, or interoperability value
- Does not unnecessarily duplicate an existing platform, Angular, PrimeNG, or application capability
- Can be replaced or removed without requiring fundamental changes to the Better Spreadsheet domain model

The goal is not to minimize dependency count for its own sake. The goal is to maintain clear ownership boundaries while using mature dependencies where they provide meaningful value.

---

# Part VII - Implementation Reference

## 35. Architecture Decision Summary

| Area                         | Decision                                                                              | Defined In                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --- |
| Frontend                     | Angular + TypeScript                                                                  | [Section 5](#5-frontend-architecture)                                               |
| UI component library         | PrimeNG for general-purpose application UI                                            | [Section 5.2](#52-ui-component-architecture)                                        |
| Client state                 | Angular services + Signals                                                            | [Section 5.5](#55-state-management)                                                 |     |
| Spreadsheet rendering        | Application-owned hybrid rendering with Canvas preferred for high-density surfaces    | [Section 6](#6-spreadsheet-grid-and-interaction-architecture)                       |
| Local persistence            | Native IndexedDB behind application-owned repository                                  | [Section 7](#7-client-state-and-local-persistence)                                  |
| Local-first model            | Durable local commit followed by asynchronous synchronization                         | [Section 10](#10-local-first-operations-and-synchronization)                        |
| Backend                      | Java Spring Boot modular monolith                                                     | [Section 13](#13-backend-architecture)                                              |
| Server database              | PostgreSQL                                                                            | [Section 16](#16-postgresql-persistence)                                            |
| Database migration           | Liquibase                                                                             | [Section 16](#16-postgresql-persistence)                                            |
| Identity                     | Keycloak OAuth2/OIDC                                                                  | [Section 15](#15-authentication-and-authorization)                                  |
| Authorization                | Spring Security + application domain grants                                           | [Section 15](#15-authentication-and-authorization)                                  |
| API                          | REST authoritative mutations                                                          | [Section 14](#14-api-and-realtime-communication)                                    |
| Realtime                     | WebSocket coordination and notifications                                              | [Section 14.2](#142-websocket-responsibilities)                                     |
| API documentation            | OpenAPI + Swagger UI                                                                  | [Section 14.3](#143-openapi)                                                        |
| Expressions                  | Application-owned shared typed expression engine                                      | [Section 8](#8-application-owned-domain-and-expression-engine)                      |
| Query model                  | Application-owned typed Query Plan                                                    | [Section 20](#20-query-architecture)                                                |
| Query sources                | Table and View initially                                                              | [Section 20.1](#201-query-sources)                                                  |
| Query outputs                | Stable Query Output Field identities                                                  | [Section 20.3](#203-query-output-fields)                                            |
| Query placement              | Automatic local/server execution                                                      | [Section 20.5](#205-execution-placement)                                            |
| Numeric semantics            | Decimal arithmetic                                                                    | [Sections 9.2](#92-decimal-safe-evaluation) and [16.1](#161-numeric-semantics)      |
| Cell persistence             | Relational hybrid typed scalar storage with purpose-built multi-value storage         | [Section 16.2](#162-typed-cell-persistence)                                         |
| Dependency model             | Source-owned dependencies + derived rebuildable index                                 | [Section 21](#21-dependency-tracking)                                               |
| Search                       | PostgreSQL server search + application-owned IndexedDB local search                   | [Section 25](#25-search)                                                            |
| File storage                 | SeaweedFS binary storage + PostgreSQL metadata                                        | [Section 19](#19-files-and-object-storage)                                          |
| Templates                    | Application-scoped Template Library                                                   | [Section 22](#22-templates)                                                         |
| History                      | Durable user-facing recovery; physical storage strategy deferred                      | [Section 23](#23-history-undo-and-lifecycle)                                        |
| Native recovery              | Versioned Native Package                                                              | [Section 24](#24-import-export-and-native-packages)                                 |
| Workspace restore            | New workspace; packaged child identities preserved where safe                         | [Section 24.5](#245-workspace-restore)                                              |
| Attachment package behavior  | Configurable binary include/exclude                                                   | [Section 24.7](#247-attachment-content)                                             |
| Async jobs                   | RabbitMQ + Worker                                                                     | [Section 18](#18-background-jobs-and-asynchronous-processing)                       |
| Async consistency            | Transactional outbox + at-least-once retry-safe processing                            | [Sections 18.1](#181-transactional-outbox) and [18.2](#182-delivery-semantics)      |
| Server transactions          | One logical synchronous domain operation is atomic across applicable PostgreSQL state | [Section 13.3](#133-server-transaction-boundary)                                    |
| Deployment                   | k3s + Helm                                                                            | [Section 27](#27-deployment-and-networking)                                         |
| Ingress                      | Traefik                                                                               | [Section 27.2](#272-ingress)                                                        |
| Hosting                      | Oracle Cloud Infrastructure (OCI), while preserving deployment portability            | [Section 27.5](#275-hosting)                                                        |
| Accessibility                | WCAG 2.2 AA                                                                           | [Section 12](#12-accessibility)                                                     |
| Spreadsheet interoperability | Standard clipboard + CSV/XLSX; Apache POI server-side                                 | [Sections 24.2](#242-xlsx) and [26](#26-spreadsheet-and-clipboard-interoperability) |

---

## 36. Remaining Implementation Contracts

The following are engineering details that still require implementation design, prototyping, profiling, or interface work.

They are not unresolved product semantics.

- Exact IndexedDB object-store schema
- Exact PostgreSQL columns, constraints, indexes, and physical layout for hybrid typed cell persistence
- Exact decimal precision and scale limits
- Exact rounding modes and decimal serialization
- Exact client decimal implementation
- Exact Query Plan / AST serialization
- Exact local/server query execution thresholds and cost heuristics
- Exact Native Package archive/container layout
- Exact supported Native Package migration/version range
- Exact History storage strategy, compaction, and reconstruction mechanics
- Final user-facing replacement term for `Checkpoint`
- Exact widget catalog
- Exact dashboard layout engine
- Exact PostgreSQL and local search index implementation
- Exact conditional-formatting precedence interface
- Exact default retention durations
- Exact PWA update interface
- Exact WebSocket notification and synchronization message shapes
- Exact synchronization cursor mechanics
- Exact transactional-outbox schema and publication mechanics
- Exact Worker job payloads
- Exact Worker retry and dead-letter configuration
- Performance thresholds for Web Worker use
- Performance thresholds for Worker use
- Exact demo-mode data reset and retention behavior

---

## 37. Architecture Invariants

The following implementation boundaries should remain true unless the architecture is deliberately amended.

1. The Knowledge Model remains authoritative for product semantics.
2. Ordinary user edits commit durably to local state before requiring a network round trip.
3. IndexedDB access remains behind application-owned persistence boundaries.
4. Signals are reactive state and are not the durable local source of truth.
5. Unsynced and local-only user work is never silently discarded.
6. The spreadsheet interaction and rendering architecture remains application-owned rather than delegating product semantics to a third-party spreadsheet or grid engine.
7. Local and server expression/query execution follow the same application-defined semantic contract.
8. Canonical numeric semantics use decimal-safe behavior.
9. PostgreSQL is authoritative for synchronized relational server state.
10. JSONB is not the canonical cell-value store.
11. Multi-value relationships use purpose-built storage where appropriate.
12. Stable identities, not display names or presentation positions, define references and dependencies.
13. Structural dependency definitions are source-owned.
14. The reverse Dependency Index is derived and rebuildable.
15. Live dependencies do not cross workspace boundaries.
16. Queries use an application-owned typed plan rather than raw user-authored SQL.
17. Query results are derived and are not canonical business records.
18. REST/domain operations are the authoritative server mutation path.
19. WebSocket is not an independent mutation API.
20. One logical synchronous domain operation is atomic across the authoritative PostgreSQL state it directly changes when that state can reasonably share one transaction.
21. PostgreSQL and RabbitMQ do not participate in a distributed transaction.
22. Asynchronous work uses a transactional outbox when a domain change must reliably cause that work.
23. RabbitMQ and Worker processing are at-least-once.
24. Worker operations are idempotent or otherwise retry-safe where applicable.
25. Worker is operational separation within the modular monolith, not an independent domain authority.
26. PostgreSQL stores file metadata and authorization facts while SeaweedFS stores file binary content.
27. File binary content is not deleted while valid attachment references remain.
28. Native Packages are explicitly versioned.
29. Unsupported future Native Package versions fail safely rather than being guessed or partially imported.
30. Whole-workspace Native Package restore creates a new workspace.
31. Templates are application-scoped rather than workspace-scoped.
32. History is a user-facing recovery capability and is not infrastructure backup.
33. Infrastructure backup and Native Package recovery remain separate concerns.
34. Accessibility remains part of the architecture and release-validation process.
35. Infrastructure is added in response to demonstrated requirements or measured problems rather than speculation.

---

## 38. Index

- **Accessibility** - [12](#12-accessibility), [31.5](#315-accessibility-tests)
- **Angular** - [5](#5-frontend-architecture)
- **API** - [14](#14-api-and-realtime-communication)
- **Apache POI** - [24.2](#242-xlsx)
- **Application services** - [5.6](#56-application-services)
- **Application shell** - [5.3](#53-application-shell)
- **Archive** - [23.5](#235-archive)
- **Authentication** - [15](#15-authentication-and-authorization)
- **Authorization** - [15](#15-authentication-and-authorization)
- **Autosave** - [2.9](#29-autosave-is-the-normal-persistence-model), [10.1](#101-edit-lifecycle)
- **Background jobs** - [18](#18-background-jobs-and-asynchronous-processing)
- **Backup** - [28](#28-backup-and-disaster-recovery)
- **Browser support** - [11.5](#115-browser-support)
- **Canvas** - [6.1](#61-hybrid-spreadsheet-rendering), [6.3](#63-canvas-and-dom-interaction-boundary)
- **Cell persistence** - [16.2](#162-typed-cell-persistence)
- **Clipboard** - [26](#26-spreadsheet-and-clipboard-interoperability)
- **Cloud synchronization** - [10](#10-local-first-operations-and-synchronization)
- **Configuration** - [30](#30-configuration-and-operational-policy)
- **Conflict handling** - [10.3](#103-conflict-handling)
- **Conformance tests** - [31.2](#312-localserver-conformance-tests)
- **Core process** - [4.2](#42-core-responsibilities), [13.2](#132-core-process)
- **Decimal arithmetic** - [9.2](#92-decimal-safe-evaluation), [16.1](#161-numeric-semantics)
- **Demo mode** - [11.6](#116-demo-mode)
- **Dependencies** - [21](#21-dependency-tracking), [33](#33-dependency-philosophy)
- **Dependency Index** - [21.3](#213-dependency-index)
- **Deployment** - [27](#27-deployment-and-networking)
- **Disaster recovery** - [28](#28-backup-and-disaster-recovery)
- **Domain operations** - [2.3](#23-domain-operations-represent-meaningful-changes), [10.2](#102-operation-model)
- **File storage** - [19](#19-files-and-object-storage)
- **Helm** - [27.1](#271-kubernetes)
- **History** - [23](#23-history-undo-and-lifecycle)
- **Hosting** - [27.5](#275-hosting)
- **Hybrid spreadsheet rendering** - [6](#6-spreadsheet-grid-and-interaction-architecture)
- **IndexedDB** - [7](#7-client-state-and-local-persistence)
- **IndexedDB migration** - [7.2](#72-local-schema-versioning), [7.3](#73-migration-failure)
- **Intentionally excluded dependencies** - [34](#34-intentionally-excluded-dependencies)
- **Interoperability** - [24](#24-import-export-and-native-packages), [26](#26-spreadsheet-and-clipboard-interoperability)
- **Keycloak** - [15](#15-authentication-and-authorization)
- **k3s** - [27.1](#271-kubernetes)
- **Liquibase** - [16](#16-postgresql-persistence)
- **Local-first** - [10](#10-local-first-operations-and-synchronization)
- **Local persistence** - [7](#7-client-state-and-local-persistence)
- **Local query execution** - [9](#9-local-query-execution)
- **Logging** - [29](#29-logging-and-diagnostics)
- **Microservices** - [2.4](#24-modular-monolith-before-microservices), [34](#34-intentionally-excluded-dependencies)
- **Native Package** - [24](#24-import-export-and-native-packages)
- **Native Package compatibility** - [24.4](#244-native-package-compatibility)
- **Numeric semantics** - [9.2](#92-decimal-safe-evaluation), [16.1](#161-numeric-semantics)
- **OAuth2 / OIDC** - [15](#15-authentication-and-authorization)
- **Offline availability** - [11.3](#113-offline-availability)
- **OpenAPI** - [14.3](#143-openapi)
- **Operation model** - [10.2](#102-operation-model)
- **Pending operations** - [10](#10-local-first-operations-and-synchronization)
- **Performance** - [32](#32-performance-and-scalability)
- **PgBouncer** - [16.4](#164-connection-management), [34](#34-intentionally-excluded-dependencies)
- **PostgreSQL** - [16](#16-postgresql-persistence)
- **PrimeNG** - [5.2](#52-ui-component-architecture), [5.4](#54-theming-and-design-tokens), [33](#33-dependency-philosophy)
- **PWA** - [11](#11-pwa-offline-and-browser-behavior)
- **Query architecture** - [20](#20-query-architecture)
- **Query execution placement** - [20.5](#205-execution-placement)
- **Query Output Fields** - [20.3](#203-query-output-fields)
- **Query Plan** - [20.2](#202-query-plan)
- **Query-to-Query composition** - [20.1](#201-query-sources), [34](#34-intentionally-excluded-dependencies)
- **RabbitMQ** - [18](#18-background-jobs-and-asynchronous-processing)
- **Redis** - [16.5](#165-server-caching), [34](#34-intentionally-excluded-dependencies)
- **Repositories** - [7.1](#71-indexeddb-repository)
- **REST** - [14.1](#141-rest-is-the-authoritative-mutation-path)
- **Search** - [25](#25-search)
- **SeaweedFS** - [19](#19-files-and-object-storage)
- **Server query execution** - [17](#17-server-query-execution)
- **Server transactions** - [13.3](#133-server-transaction-boundary)
- **Signals** - [5.5](#55-state-management)
- **Spreadsheet rendering** - [6](#6-spreadsheet-grid-and-interaction-architecture)
- **Spring Boot** - [13](#13-backend-architecture)
- **Spring Security** - [15](#15-authentication-and-authorization)
- **Swagger UI** - [14.3](#143-openapi)
- **Synchronization** - [10](#10-local-first-operations-and-synchronization)
- **Templates** - [22](#22-templates)
- **Testing** - [31](#31-testing-strategy)
- **Theming** - [5.4](#54-theming-and-design-tokens)
- **Transactional outbox** - [18.1](#181-transactional-outbox)
- **Traefik** - [27.2](#272-ingress)
- **Trash** - [23.6](#236-trash)
- **UI component architecture** - [5.2](#52-ui-component-architecture)
- **Undo and redo** - [23.1](#231-undo-and-redo)
- **WebSocket** - [14.2](#142-websocket-responsibilities)
- **Web Workers** - [6.5](#65-heavy-client-computation), [9.3](#93-local-query-workloads)
- **Worker** - [4.3](#43-worker-responsibilities), [18](#18-background-jobs-and-asynchronous-processing)
- **Workspace restore** - [24.5](#245-workspace-restore)
- **XLSX** - [24.2](#242-xlsx), [26.3](#263-spreadsheet-semantics)
