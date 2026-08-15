# Better Spreadsheet

## Knowledge Model

**Author:** Kylie Jurgensen

**Last Updated:** 08/12/2026

---

## About this Document

This Knowledge Model (KM) describes how Better Spreadsheet works from a product and data-model perspective.

It defines the main concepts in the application, how they relate to each other, what they own, and how users can expect them to behave. This includes concepts such as Workspaces, Collections, Tables, Records, Fields, Views, Queries, Dashboards, Templates, and Files, as well as the rules that connect them.

The goal is to keep the meaning of the application separate from the details of how it is built. Frameworks, databases, APIs, deployment, storage, and other technical implementation decisions belong in the System Design Document (SDD).

The KM is the source of truth for product behavior. If the KM and the SDD ever disagree about what something means or how it should behave, the KM takes priority unless it is explicitly stated.

This version is the final product-model baseline before implementation and wire-framing. It can still change later if implementation, testing, or actual use reveals that something should work differently. Those changes should be made deliberately rather than allowing the implementation model to slowly drift apart.

---

## Table of Contents

- [Part I - Foundations](#part-i---foundations)
  - [1. Purpose and Product Model](#1-purpose-and-product-model)
  - [2. Governing Principles](#2-governing-principles)
  - [3. Application Structure](#3-application-structure)
  - [4. Identity, Ownership, Naming, and Dependencies](#4-identity-ownership-naming-and-dependencies)
- [Part II - Core Data Model](#part-ii---core-data-model)
  - [5. Workspaces](#5-workspaces)
  - [6. Collections](#6-collections)
  - [7. Tables](#7-tables)
  - [8. Records](#8-records)
  - [9. Fields and Cells](#9-fields-and-cells)
  - [10. Field Value Models](#10-field-value-models)
  - [11. Data Types](#11-data-types)
  - [12. Generated Fields](#12-generated-fields)
  - [13. Validation and Constraints](#13-validation-and-constraints)
  - [14. References](#14-references)
- [Part III - Views and Data Organization](#part-iii---views-and-data-organization)
  - [15. Views](#15-views)
  - [16. Sections](#16-sections)
  - [17. Summaries](#17-summaries)
  - [18. Sorting, Filtering, and Ordering](#18-sorting-filtering-and-ordering)
  - [19. Formatting and Conditional Formatting](#19-formatting-and-conditional-formatting)
- [Part IV - Expressions and Derived Data](#part-iv---expressions-and-derived-data)
  - [20. Expressions and Formulas](#20-expressions-and-formulas)
  - [21. Errors and Partial Evaluation](#21-errors-and-partial-evaluation)
  - [22. Queries](#22-queries)
- [Part V - Dashboards and Analysis](#part-v---dashboards-and-analysis)
  - [23. Dashboards](#23-dashboards)
  - [24. Widgets and Dashboard Controls](#24-widgets-and-dashboard-controls)
- [Part VI - Supporting Content and Reuse](#part-vi---supporting-content-and-reuse)
  - [25. Notes](#25-notes)
  - [26. Files and Attachments](#26-files-and-attachments)
  - [27. Templates](#27-templates)
  - [28. Search](#28-search)
  - [29. Duplication, Copying, and Movement](#29-duplication-copying-and-movement)
- [Part VII - Lifecycle and Recovery](#part-vii---lifecycle-and-recovery)
  - [30. Archive and Trash](#30-archive-and-trash)
  - [31. Undo, Redo, and History](#31-undo-redo-and-history)
  - [32. Import, Export, and Native Packages](#32-import-export-and-native-packages)
- [Part VIII - Persistence and Application Behavior](#part-viii---persistence-and-application-behavior)
  - [33. Autosave and Persistence](#33-autosave-and-persistence)
  - [34. Offline Use and Synchronization](#34-offline-use-and-synchronization)
  - [35. Navigation and Presentation](#35-navigation-and-presentation)
- [Part IX - Model Reference](#part-ix---model-reference)
  - [36. Invariants](#36-invariants)
  - [37. Deferred Product Decisions](#37-deferred-product-decisions)
  - [38. Index](#38-index)

---

## Glossary

**All Data**
The required base view of a table. Every table has an `All Data` view, and it cannot be deleted.

**Archive**
A lifecycle state that removes applicable content from normal active use while preserving its identity, hierarchy, data, and valid dependencies. Archive is different from trash.

**Attachment**
A multi-value field type that references files owned by the same workspace. Multiple attachment cells may reference the same file without creating separate copies.

**Blank**
The absence of a value. Blank is distinct from `0`, `false`, empty text, or an error.

**Calculated Field**
A read-only field whose values are derived from an expression rather than directly entered by the user.

**Canonical Record Order**
The underlying order of records maintained by a table independently from sorting, filtering, sections, or other view-specific presentation.

**Cell**
The intersection of one record and one field. A cell represents that field's value for a particular record.

**Collection**
An optional folder-like container used to organize tables, queries, and dashboards within a workspace. Collections do not nest.

**Conditional Formatting**
Rules that change how applicable data is presented based on values or expressions without changing the underlying data.

**Dashboard**
A workspace object used to present and analyze data through widgets and shared dashboard controls.

**Dashboard Control**
A dashboard-owned control that can affect multiple widgets through explicit bindings, such as a date range, category, status, or other parameter.

**Data Type**
The semantic kind and valid shape of values stored or produced by a field, such as Text, Number, Date, Attachment, or Reference.

**Dynamic Default**
An expression-based initial value for a normal field. It is evaluated when a record is created, after which the resulting value becomes normally editable.

**Error**
A state indicating that a value or operation cannot be evaluated or used as intended. Errors remain distinguishable from blank or ordinary values and are kept as localized as practical.

**Expression**
A structured calculation, comparison, or evaluation used by features such as calculated fields, validation, conditional formatting, queries, summaries, and widgets.

**Field**
A typed definition of one piece of data that applies to every record in a table. Fields generally correspond to columns in the spreadsheet interface.

**Field Value Model**
The rule describing where a field's values come from and whether users directly edit them. Better Spreadsheet defines normal, calculated, and generated field value models.

**File**
A workspace-owned binary object with a stable identity that may be referenced by attachment cells.

**Generated Field**
A read-only field whose values are created and maintained by Better Spreadsheet according to a configured generator.

**History**
Durable access to meaningful changes in persistent application data and configuration. History is separate from undo/redo and is not itself a backup.

**Live Dependency**
An active relationship in which one object depends on the current data or structure of another object. Live dependencies cannot cross workspace boundaries.

**Native Package**
Better Spreadsheet's portable native format for preserving application structure and behavior for backup, recovery, native export, workspace restore, and supported object transfer.

**Normal Field**
A field containing user-owned, directly editable values. A normal field may also define a static or dynamic default.

**Note**
Text attached to a cell but stored separately from the cell's typed value.

**Query**
A workspace object that produces a typed, read-only derived dataset from existing data through operations such as filtering, joining, grouping, aggregation, calculation, and sorting.

**Query Output Field**
A stable, typed field owned by a query that describes one column of its derived result.

**Record**
One structured item in a table. A record has a stable identity and contains one cell for every field in its table.

**Reference**
A stable relationship from one record to another record within the same workspace.

**Resequence**
An explicit operation that regenerates the values of an entire sequence field.

**Section**
A grouping of records within a view. Sections may be manual or generated from underlying table data and may be nested.

**Sequence**
A generated-field behavior that produces ordered values according to configured starting, increment, and display rules.

**Snapshot**
A retained representation of widget data that is explicitly distinguishable from live data and may remain viewable when its original live source is unavailable.

**Stable Identity**
An internal identity that remains associated with an application object regardless of changes to its name, position, organization, or presentation.

**Static Default**
A configured starting value assigned to a normal field when a record is created. After assignment, it behaves like an ordinary editable value.

**Summary**
Derived aggregate information calculated from the records included in a view or section.

**Table**
The primary container for structured user data. A table owns its fields, records, cells, views, and canonical record order.

**Template**
A reusable definition for creating or configuring Better Spreadsheet content. Templates do not maintain live relationships to the objects from which they were created.

**Template Library**
The application-level location where built-in and user-created templates are stored independently from individual workspaces.

**Trash**
A deletion state in which content is retained temporarily for possible recovery before permanent deletion.

**Validation**
Rules used to determine whether data satisfies applicable field, record, or table requirements.

**View**
A saved way of working with and presenting the records of one table without owning or duplicating those records.

**Widget**
A dashboard-owned element used to present, summarize, or analyze information.

**Workspace**
The top-level container and boundary for a self-contained body of Better Spreadsheet data. Live references, formulas, queries, dashboard dependencies, files, and synchronization remain within a workspace.

---

# Part I - Foundations

## 1. Purpose and Product Model

Better Spreadsheet is a spreadsheet and structured-data application designed to keep the flexibility of a traditional spreadsheet while providing stronger structure for organizing, connecting, viewing, and analyzing data.

At its core, Better Spreadsheet lets users work with data in tables made up of records, fields, and cells. That same data can be organized and presented through views and sections, connected through references, transformed through queries, and presented through dashboards and widgets.

The application also provides supporting features such as templates, files and attachments, validation, formulas, history, import and export, and offline use.

The goal is not to replace the familiar spreadsheet experience with a database administration tool. Better Spreadsheet should still feel natural for everyday data entry and manipulation while providing a more dependable structure underneath that experience.

This Knowledge Model defines that structure and the rules that govern it.

---

## 2. Governing Principles

The following principles apply throughout Better Spreadsheet. More specific rules defined later in this document build on these principles.

### 2.1 Data and Presentation are Separate

Underlying data exists independently from the way it is currently displayed.

Changing a view, sorting or filtering records, hiding or reordering fields, changing row height or density, grouping records into sections, changing dashboard layouts, or applying formatting does not change the underlying data.

A presentation action changes data only when the user performs an operation that is explicitly defined as data-changing.


### 2.2 Strong Typing with User Control

Fields have meaningful data types rather than treating every cell as an unstructured value.

Better Spreadsheet should infer types and conversions when doing so is useful, but users retain control over most inferred behavior. When a requested change would be invalid or lose information, the application should explain the problem rather than silently changing or discarding data.

### 2.3 Blank Means No Value

A blank cell means that no value is present.

Blank is different from:

- `0`
- `false`
- an empty text value
- an error
- placeholder text such as `N/A`

Features that evaluate or transform data should preserve this distinction.

### 2.4 Identity Does Not Depend on Names or Position

Important application objects have stable internal identities.

Renaming an object, moving it, reordering it, or changing how it is displayed does not change what that object is.

References, formulas, dependencies, moves, renames, and similar operations rely on these stable identities rather than display names or spreadsheet coordinates.

### 2.5 Preserve Data and Keep Problems Local

A problem with one value or part of the application should not unnecessarily make unrelated data unusable.

When possible, Better Spreadsheet preserves the user's data, identifies the specific problem, and allows unaffected information and functionality to continue working.

For example, an invalid cell should not automatically make every other cell in its record unusable. A broken query output should not automatically prevent other valid outputs from being evaluated when they can still be calculated safely.

### 2.6 Prevent Invalid States When Practical

When Better Spreadsheet can identify an invalid operation before committing it, the application should prevent the operation and explain why it cannot be completed.

Some workflows intentionally allow incomplete or temporarily invalid data. In those cases, the application preserves the data and clearly identifies its validation or error state instead of pretending that it is valid.

### 2.7 Prefer Useful Configuration Over Arbitrary Limits

Different users and workflows may reasonably need different behavior.

When several behaviors are valid, Better Spreadsheet should prefer sensible defaults with meaningful configuration rather than turning arbitrary limits or preferences into permanent product rules.

### 2.8 Persistent Changes Autosave

Ordinary changes to persistent data and configuration are saved automatically.

Users should not need to press an Apply or Save button after normal actions such as editing a cell or changing a view.

Explicit confirmation is still appropriate for workflows that intentionally stage a larger operation before execution, such as reviewing an import before committing it.

Autosave does not replace undo, redo, history, or other recovery features.

---

## 3. Application Structure

Better Spreadsheet organizes information into a hierarchy of application objects.

At the highest level, users work with workspaces. A workspace contains the tables, queries, dashboards, files, and optional collections that belong to that body of work.

Tables contain the structured data itself. Views provide different ways of working with a table's records without creating separate copies of those records.

Queries create derived, read-only datasets from existing data. Dashboards present and analyze data through widgets that may utilize queries.

Templates exist outside individual workspaces so they can be reused across them.

Templates exist outside of individual Workspaces so they can be reused.

### 3.1 Object Hierarchy

The overall structure is:

```text
Application
├── Workspaces
│   └── Workspace
│       ├── Collection
│       │   ├── Table
│       │   │   ├── Field
│       │   │   ├── Record
│       │   │   │   └── Cell (one per Field)
│       │   │   └── View
│       │   ├── Query
│       │   └── Dashboard
│       │       └── Widget
│       ├── Table
│       ├── Query
│       ├── Dashboard
│       └── File
├── Template Library
│   ├── Built-in Template
│   └── User Template
└── Application/User Settings
```

Tables, queries, and dashboards may live directly at the workspace root or inside one collection.

Collections are optional and do not nest. They work like folders for organizing workspace content.

Views belong to tables and are managed within their owning table rather than as independent workspace objects.

Widgets belong to dashboards.

Files belong to the workspace but do not appear as normal children in the workspace navigation tree. They are managed through the workspace's file and attachment features.

Templates belong to the application-level Template Library rather than to a specific workspace.

The sections that follow define each of these objects and relationships in more detail.

---

## 4. Identity, Ownership, Naming, and Dependencies

Better Spreadsheet distinguishes between an object's identity, what owns it, where it is organized, what it is called, and what other objects depend on it.

These concepts are related, but they are not interchangeable.

### 4.1 Stable Identity

Application objects use stable internal identities that are independent of their display names and positions.

An object keeps the same identity when it is renamed, reordered, moved to another location with the same workspace, or displayed differently.

This allows formulas, references, queries, dashboards, and other relationships to continue working when users reorganize or rename their content.

### 4.2 Ownership and Organization

Ownership describes which object and lifecycle an item belongs to.

Organization describes where an object appears within the user's workspace structure.

A workspace owns its tables, queries, dashboards, and files.

A collection may organize tables, queries, and dashboards without replacing their workspace ownership. Moving one of these objects between workspace root and a collection changed its organizational location, not its identity or workspace ownership.

Other ownership relationships are more direct:

- Tables own their fields, records, and views
- Records contain one cell for each field in their table
- Dashboard own their widgets and shared dashboard controls
- Application-level Template Library contains templates

### 4.3 Naming Scopes

Names need to be unique only where ambiguity would occur within the same object type and scope.

The unique naming rules are:

| Object | Naming scope |
| --- | --- |
| Workspace | Among workspaces |
| Collection | Among sibling collections in the same workspace |
| Table | Among sibling tables in the same organizational location |
| Query | Among sibling queries in the same organizational location |
| Dashboard | Among sibling dashboards in the same organizational location |
| View | Within its owning table |
| Field | Within its owning table |
| Section | Among sibling sections |
| Select option | Within its select field |
| Template | Within the applicable Template Library scope and type |

Different kinds of objects may use the same display name.
For example, a workspace, collection, table, query, and dashboard may all be named `Sales` without creating a naming conflict.

Record display labels and widget titles are presentation labels and do not need to be unique.

### 4.4 Workspace Dependency Boundary

A workspace is the boundary for live data dependencies.

References, formulas, queries, dashboard data sources, and other live relationships may connect compatible objects within the same workspace, but a live dependency does not cross over from one workspace into another.

This keeps the workspace self-contained as a live body of data.

When content is copied or transferred between workspaces, Better Spreadsheet creates the appropriate new identities and remaps the dependencies rather than leaving live links back to objects in the original workspace.

### 4.5 Dependencies use Stable Identity

Dependencies connect to stable object identities rather than names or display positions.

As a result, renaming or reorganizing an object does not by itself break valid dependencies on that object.

When an operation would remove or change something that other surviving objects depend on, Better Spreadsheet can identify those dependencies and apply the appropriate warning, validation, broken reference, or lifecycle behavior defined later in this model.

---

# Part II - Core Data Model

## 5. Workspaces

A workspace is the top-level container and live data boundary in Better Spreadsheet.

Each workspace represents a self-contained body of work. Its tables hold the underlying data, while collections, queries, dashboards, files, and other workspace features organize, derive from, or support that data.

Every user or application instance has at least one workspace.

An initial workspace is created automatically and named `My Workspace`, but that workspace is able to be renamed or deleted if another workspace exists.

### 5.1 Workspace Contents

A workspace may contain:

- Collections
- Tables
- Queries
- Dashboards
- Files

Tables, queries, and dashboards may exist directly at the workspace root or inside a collection.

Files belong to the workspace but are managed separately from the normal workspace navigation hierarchy.

### 5.2 Workspace Boundaries

A workspace is the boundary for:

- Live references and formulas
- Query sources and dependencies
- Dashboard and widget data dependencies
- Files and attachments
- Cloud participation and synchronization
- Native workspace backup and recovery

Live dependencies do not cross workspace boundaries.

Content can still be copied, exported, imported, or reused between workspaces. These operations create or remap identities and dependencies rather than creating live cross-workspace relationships.

### 5.3 Workspace Deletion

A workspace may be permanently deleted only if at least one other workspace remains.

Before permanent deletion, Better Spreadsheet offers the user an opportunity to export the workspace and a native package for recovery.

### 5.4 Workspace Restore

Restoring a workspace from a native package creates a new workspace rather than merging the package into an existing workspace.

The restored workspace receives a new workspace identity.

Child object identities stored in the package are preserved when safe to do so. If an identity would conflict with an existing identity or violate another application rule, Better Spreadsheet creates a new identity for the affected object and updates its internal relationships accordingly.

---

## 6. Collections

A collection is an optional folder-like container used to organize content within a workspace.

Collections may contain:

- Tables
- Queries
- Dashboards

Collections may not contain other collections.

A table, query, or dashboard may exist at the workspace root or inside a collection.

### 6.1 Collections Organize Rather Than Own Data

A collection provides organizational parentage without replacing workspace ownership.

Moving a table, query, or dashboard into or out of a collection does not change its identity or its workspace ownership.

Because the object remains in the same workspace, valid dependencies also remain intact.

### 6.2 Collection-Wide Actions

Actions performed on a collection may also apply to its entire contained hierarchy. These actions include:

- Archive
- Trash
- Restore
- Duplicate
- Export
- Permanent deletion

For these operations, the collection and its contents are treated as one parent-scoped hierarchy unless the specific operation explicitly provides different behavior.

A collection is not automatically dissolved and its contents are not moved to the workspace root as a side effect of one these actions.

---

## 7. Tables

A table is the primary container for structured user data in Better Spreadsheet.

Tables own the canonical business data that views, queries, dashboards, formulas, and other features work with.

A table owns:

- One or more fields
- Zero or more records
- Cells created by the intersection of those records and fields
- One or more views

### 7.1 Canonical Data

Records and their values belong to the table itself, not to a particular view.

A table also maintains a canonical record order that exists independently from sorting, filtering, grouping, or other presentation performed by a view.

Changing how records are displayed does not change this canonical order unless the user performs an action specifically defined as reordering the underlying records.

### 7.2 Table-Level Configuration

A table may define behavior that applies across its data, including:

- Default conditional formatting rules
- Record-level validation expressions
- Simple or composite uniqueness constraints
- Other table-level configurations

Views and other features may build on this configuration without taking ownership of the underlying table data.

---

## 8. Records

A record represents one structured item in a table.

Each record contains one cell for every field defined by its table.

Records have stable identities independent of their current values, display labels, or position in a table or view.

### 8.1 Creating Records

A record may be created before all of its values are complete or valid.

For example, a field marked as required does not prevent a new record from being created simply because that field is initially blank.

After creation, the record's completeness and validity are determined by the validation rules that apply to it.
This allows users to enter and build up data naturally without requiring every record to be complete the moment it is created.

### 8.2 Record Display

A record may have configurable display behavior used when the record needs to be represented elsewhere in the workspace, such as in a reference selector.

This display value or label is presentation only and is not the record's identity so it does not need to be unique.

### 8.3 Deleting Records

Deleting a record warns the user when dependencies that will survive the deletion would be affected.

Dependencies that are themselves being deleted as part of the same operation do not require redundant warnings.

If another surviving record contains a reference to the deleted record, Better Spreadsheet preserves that reference in a broken state rather than silently clearing it.

### 8.4 Duplicating Records

Duplicating a record creates a new record identity.

The duplicate:

- Copies stored values from editable fields
- Copies references so they continue pointing to the same target records
- Copies attachment references so they continue pointing to the same workspace files
- Recalculates calculated fields
- Runs generated-field behavior for the newly created record

The duplicate is therefore a new record based on the original, not another identity for the same record.

---

## 9. Fields and Cells

A field defines a typed piece of data that applies to every record in a table.

In the spreadsheet interface, fields generally correspond to columns.

A cell is the intersection of one record and one field. It represents that field's value for that particular record.

Every record has one cell for each field in its table.

### 9.1 Field Configuration

A field defines the rules and configurations that apply to its cells, including its:

- Name
- Data type
- Value model
- Applicable validation
- Applicable defaults or generation behavior
- Type-specific configurations

Field names are unique within their table.

### 9.2 Cell State

Depending on the field and configuration, a cell may:

- Be blank
- Contain a compatible value
- Contain a derived or calculate value
- Carry localized validation or error state

A problem with one cell does not automatically invalidate unrelated cells.

Whether a user may directly edit a cell depends on the field's value model.

---

## 10. Field Value Models

A field's data type describes what kind of value it contains.

Its value model describes where that value comes from and whether the user directly owns or can edit it.

Better Spreadsheet supports three core field value models:

- Normal
- Calculated
- Generated

### 10.1 Normal Fields

A normal field stores user-owned, editable values.

Users may directly enter and change values in its cells, subject to the field's data type and validation rules.

A normal field may also define a default value.

#### Static Defaults

A static default supplies the same configured starting value when applicable to a newly created record.

After the value is assigned, it behaves like any other editable value.

#### Dynamic Defaults

A dynamic default uses an expression to determine the field's initial value when a record is created.

The expression is evaluated as part of record initialization and may use other values supplied during that same creation operation.

Once initialization is complete, the resulting value becomes an ordinary user-editable value.

A dynamic default does not continue recalculating when the values it originally used later changes.

### 10.2 Calculated Fields

A calculated field derives its values from an expression.

Its cells are read-only because the expression, rather than the individual cell, determines their values.

Calculated results have or infer a data type compatible with the field's type rules.

Changing the data type of a calculated field follows the same applicable type-conversion rules used for other fields rather than bypassing those rules because the value is calculated.

### 10.3 Generated Fields

A generated field contains values maintained by Better Spreadsheet according to a configured generator.

Its cells are read-only.

Generated fields do not have separate user-editable default values because their values are produced and maintained by their generator.

If a workflow needs a value to be generated once and then freely edited by the user, a normal field with a dynamic default should be used instead.

---

## 11. Data Types

A field's data type describes the meaning and valid shape of the values stored or produced by that field.

The core data types are:

- Text
- Number
- Integer
- Currency
- Percentage
- Rating
- Boolean
- Date
- Time
- DateTime
- Single Select
- Multi-select
- Attachment
- Reference

The type catalog may expand over time without changing the distinction between a field's semantic data type and the way its values are presented.

### 11.1 Text

Text represents textual content.

Blank remains distinct from a present text value, including an intentionally empty text value where that distinction is applicable.

### 11.2 Number

Number represents general numeric values.

Number is distinct from more specialized numeric types such as integer, currency, percentage, and rating, which carry additional meaning or configuration.

### 11.3 Integer

Integer represents whole-number values.

Values containing a fractional component are not valid integer values unless an explicit conversion operation converts them according to the applicable conversion rules.

### 11.4 Currency

Currency represents numeric monetary values using one configured currency for the field.
For example, a currency field may be configured for USD.

All values in that field use the same configured currency. Individual cells do not independently select different currencies.

Currency symbols or codes, locale-specific display, decimal places, and similar settings affect presentation rather than changing the underlying monetary value.

Currency fields do not perform automatic exchange-rate conversion.

### 11.5 Percentage

Percentage is a numeric type representing proportional values.

Its display may be configured independently from its underlying value. For example, the same percentage may be presented in forms such as `0.25` or `25%`.

Percentage does not inherently limit values to the range from 0% through 100%.

### 11.6 Rating

Rating is a numeric type intended for values measured against a configured scale.

A rating may define:

- Scale or range
- Presentation or representation
- Allowed increment or step

Fractional ratings are supported when permitted by the configured increment.

### 11.7 Boolean

Boolean supports:

- `true`
- `false`
- Blank

`false` is an actual value and is never treated as equivalent to a blank cell.

### 11.8 Date, Time, and DateTime

Date represents a calendar date.

Time represents a time value.

DateTime represents a combined date and time value.

Formatting and display may vary without changing the semantic distinction between these types.

### 11.9 Single Select and Multi-select

Select fields use a configured set of options.

Each option has a stable identity independent of its display label.

Option labels are unique within that select field.

A single-select field may contain at most one selected option.

A multi-select field may contain multiple selected options and may be subject to minimum or maximum item-count constraints.

### 11.10 Attachment

Attachment is a multi-value type that stores references to files owned by the same workspace.

An attachment cell may reference zero or more files, subject to applicable cardinality and file validation rules.

The attachment does not create an independent copy of the file for each cell that references it.

### 11.11 Reference

Reference stores a stable link to another record within the same workspace.

A reference field may allow one target record or multiple target records.

Reference behavior, target restrictions, broken references, and related rules are defined in [Section 14](#14-references).

---


## 12. Generated Fields

Generated fields are read-only fields whose values are maintained by Better Spreadsheet according to a configured generator.

Different generators may follow different rules for when and how their values are produced.

### 12.1 Sequence

A sequence generates ordered values according to its configuration.

Sequence configuration may include settings such as:

- Starting behavior
- Increment
- Display formatting

Deleting or reordering records does not automatically change existing sequence values.

Changing sequence configuration affects future generated values by default rather than rewriting values that already exist.

Newly generated values must avoid collisions with existing sequence values.

#### Resequence

`Resequence` is an explicit operation that regenerates the values of an entire sequence field.

There is no general per-cell regeneration action for generated fields.

By default, resequencing uses canonical table order.

The user may instead explicitly choose to resequence using the current view order.

When view order is used:

1. Records included in the view are processed first in their displayed order, including applicable sorting, sections, nesting, and `Uncategorized`
2. Records excluded from the view are processed afterward in canonical table order

Resequencing always operates across the entire sequence field, even when a view displays only part of the table.

Because resequencing may change many values at once, it participates in the application's warning, undo, and history safeguards for consequential bulk operations.

### 12.2 UUID / Random ID

Better Spreadsheet may generate UUID-family identifiers as generated field values.

Random ID behavior is treated as part of this UUID-family capability rather than as a separate conceptual field category.

### 12.3 Random Choice

A random-choice generator selects from a configured set of possible values.

Its generated result remains system-maintained rather than becoming an independently editable cell value.

### 12.4 Created and Modified Metadata

Generated metadata may record when an object was created or last directly modified.

Created metadata is established when the tracked object is created.

Last Modified metadata changes when the tracked object itself is directly changed.

A change that occurs only because a dependency elsewhere changed does not count as a direct modification of the tracked object.

When Better Spreadsheet is being used locally without a signed-in account, the established local-user identity may be used where user identity is required for generated metadata.

---

## 13. Validation and Constraints

Validation identifies whether data satisfies the rules configured for its field, record, or table.

Better Spreadsheet tries to prevent invalid states when practical, but validation does not exist to discard user data. When invalid or incomplete data can be safely preserved, the application keeps it and clearly identifies the problem.

### 13.1 Validation Severity

User-defined validation rules may produce either a warning or an error.

**Warning**

A warning identifies a problem or unusual value without making the affected data unusable.

The value remains available to the rest of the application but is visibly flagged.

**Error**

An error marks the affected field or record as invalid until the problem is corrected.

When it is safe to do so, the original data is preserved rather than discarded.

Structural, type, reference, and evaluation failures use the severity required by their application semantics. Users cannot arbitrarily downgrade those failures simply by configuring them as warnings.

### 13.2 Required Fields

A required field must contain a valid value for the record to be considered complete and valid.

Required does not prevent the initial creation of an incomplete record.

A user may therefore create a record, leave a required value blank temporarily, and complete it later while the application clearly shows that the record is incomplete.

### 13.3 Field-Level Validation

Fields may define constraints appropriate to their data type.

Examples include:

- Numeric ranges
- Text length
- Patterns
- Select rules
- Attachment/file restrictions
- Minimum or maximum item counts

The available constraints depend on the field's data type and configuration.

### 13.4 Record-Level Validation

A table may define validation expressions that evaluate multiple fields within the same record.

This supports rules that cannot be expressed by looking at one field alone.

For example, a record-level rule could determine whether one date occurs after another or whether a particular combination of values is allowed.

The same general record-level expression semantics may also be reused by features such as conditional formatting.

### 13.5 Uniqueness

A table may require values to be unique across its records.

A uniqueness constraint may use:

- One field for simple uniqueness
- Multiple fields for composite uniqueness

A composite uniqueness constraint treats the participating values together as one uniqueness key.

A uniqueness key is evaluated only when the values needed to evaluate that key are usable.

Incomplete records are not considered duplicates merely because the same participating fields are blank or otherwise incomplete.

Uniqueness is a specific built-in cross-record constraint. It does not imply that arbitrary validation expressions may inspect unrelated records throughout a table.

### 13.6 Multi-Value Cardinality

Applicable multi-value fields may define minimum and maximum numbers of values.

This may apply to types such as:

- Multi-select
- Multi-reference
- Attachments

---

## 14. References

A reference creates a stable relationship from one record to another record within the same workspace.

References allow structured data to be connected without relying on record names, display labels, row numbers, or other presentation details.

A reference may contain one target record or multiple target records, depending on the field's configuration.

### 14.1 Reference Identity

References store the stable identity of the target record.

Changing the target record's display label, moving it within a view, renaming its table, or otherwise changing its presentation does not break the reference.

Live references cannot target records in another workspace.

### 14.2 Same-Record Field References in Expressions

Expressions may also refer structurally to other fields within the same record.

These expression references use stable field identity rather than spreadsheet-style positional coordinates.

They are part of the application's broader structural reference model but do not create a separate reference-field value.

### 14.3 Cross-Table References

A reference field may point to records in another table within the same workspace.

The target table and applicable target restrictions are part of the reference field's configuration.

### 14.4 Restricting Available Targets

A reference field may restrict which records are valid choices.

Candidate records may be restricted using:

- Tables
- View subsets
- Applicable queries that preserve identifiable source records
- Dynamic restrictions based on values or context from the current record

Dynamic restrictions use the application's common expression semantics.

A query result can provide reference candidates only when its rows preserve the identity of actual source records.

Aggregated or otherwise derived query rows that no longer represent identifiable records cannot be reference targets.

### 14.5 Existing References That No Longer Match a Restriction

Changing a reference restriction does not silently remove existing references.

If an existing target no longer satisfies the current restriction, Better Spreadsheet:

- Preserves the reference
- Marks it with the appropriate localized validation state
- Requires new selections to satisfy the current restriction
- Automatically clears the validation problem if the existing target becomes valid again

This is different from deleting the target record itself.

### 14.6 Deleted Reference Targets

If a referenced target record is deleted while the referring record survives, the reference is preserved in a broken state.

Better Spreadsheet does not silently clear the value because doing so would hide the fact that a relationship previously existed.

The broken reference remains visible so the user can understand and resolve the problem.

---

# Part III - Views and Data Organization

## 15. Views

A view is a saved way of working with and presenting records from one table.

Views allow the same underlying table data to be presented differently for different purposes without duplicating the records.

A view belongs to one table.

### 15.1 Views Do Not Own Data

Records and their values belong to the table, not to its views.

Changing or deleting a view does not create, delete, or duplicate the table's records.

A change made to underlying data while using one view changes the table itself and is reflected anywhere else that uses the same data.

Changes that affect only presentation remain specific to the view unless the user performs an action that is explicitly defined as data-changing.

### 15.2 View Configuration

A view may define:

- Included records and filtering
- Sorting
- Field order and visibility
- Formatting overrides
- Sections
- Summary
- Other display configurations

These settings determine how the view presents and organizes its table's data.

### 15.3 All Data View

Every table has an `All Data` view.

`All Data` is the table's required base view and cannot be deleted.

Additional views may be created and managed independently from `All Data`.

### 15.4 Duplicating Views

Duplicating a view creates a new view of the same table with its own identity and copied configuration.

The duplicated view continues to use the same underlying table and records.

Reusing a view's configuration with another table is handled through templates rather than view duplication.

---

## 16. Sections

Sections organize records into groups within a view.

Sections may be:

- Manual
- Generated from table data

Sections may also be nested.

### 16.1 Manual Sections

A manual section is created and organized by the user.

Moving a record between manual sections changes its section membership within that view.

It does not inherently change the record's field values or canonical table order.

### 16.2 Generated Sections

A generated section groups records according to underlying table data.

For example, a view may create sections based on a `Status` field.

Because generated sections represent underlying data, moving a record from one generated section to another changes the applicable grouping field value.

### 16.3 Nested Sections

Sections may be nested to create multiple levels of organization.

Different levels may use manual or generated sections where applicable.

When a record moves through a mixed section structure, Better Spreadsheet applies the changes required by each affected level.

For example, moving a record between generated parent sections and manual child sections may change both its grouping field value and its manual section membership.

### 16.4 Section Membership

A record belongs to one section at each applicable level of the section structure.

Records that do not belong to an applicable section are placed in `Uncategorized`.

A record does not appear multiple times at the same section level.

### 16.5 Section Ordering

Sections may have a user-defined order.

Generated sections may also infer their order from the field used for grouping.

For example:

- Select-based sections may follow select-option order
- Text-based sections may use alphabetical ascending or descending order
- Users may define a custom order where supported
- Other field types use appropriate type-aware ordering

### 16.6 Moving Records and Table Order

Moving a record between sections does not automatically change the table's canonical record order.

A section move changes only the section membership or underlying data required by the section structure unless the user performs a separate action that explicitly changes canonical table order.

### 16.7 Section Names

Section names are unique among sibling sections.

Sections at different levels or locations may use the same name.

---

## 17. Summaries

A summary calculates or presents aggregate information about the records in a view or section.

Summaries use the common expression and aggregation behavior defined in [Section 20](#20-expressions-and-formulas).

### 17.1 View Summaries

A view may have one view summary which operates over the records included in that view so filtering affects which records participate in the summary.

### 17.2 Section Summaries

A section may have one section summary which operates over the records belonging to that section.

Nested sections may provide summaries at different levels where applicable.

### 17.3 Summary Data

Summaries are derived from existing data.

They do not create or own additional records, and changing a summary does not change the values being summarized.

Errors and unusable values follow the shared expression and partial-evaluation rules.

---

## 18. Sorting, Filtering, and Ordering

Sorting and filtering determine which records are presented and the order in which they appear.

They do not normally change the underlying data or canonical table order.

### 18.1 Sorting

A view may sort records using one or more applicable values.

Sorting changes displayed order without changing canonical table order.

### 18.2 Filtering

A view may filter its table to determine which records are included.

A record excluded by a filter still exists in the table. It is simply not included in that view's current dataset.

Changing or removing the filter makes qualifying records visible again without recreating them.

### 18.3 Filter Errors

Filter evaluation distinguishes between:

- `true`
- `false`
- Error or indeterminate

An error or indeterminate result is not silently treated as `false`.

This prevents a broken filter from quietly hiding records as though they legitimately failed the filter.

### 18.4 Sorting Blank and Error Values

Valid comparable values continue to participate in sorting when other records contain blank, invalid, or unavailable values.

Blank and error values remain distinct.

Their positions are determined consistently according to the applicable sorting configuration or default behavior.

### 18.5 Manual Reordering

Canonical table order changes only when the user's action explicitly represents a change to that order.

Moving a record within a sorted presentation does not silently rewrite canonical table order.

Section membership changes also do not inherently change canonical order.

### 18.6 Query Ordering

Query results are derived datasets.

Sorting query results does not define or modify the canonical record order of their source tables.

---

## 19. Formatting and Conditional Formatting

Formatting controls how data is presented without changing the meaning of its underlying values.

### 19.1 Presentation Formatting

Formatting may affect how applicable values, fields, records, or other content appear.

Examples include:

- Number formatting
- Currency and percentage display
- Date and time display
- Alignment
- Visual emphasis
- Other type-appropriate presentation

Changing presentation formatting does not change the underlying value unless a separate operation explicitly converts or changes that value.

### 19.2 Table-Level Conditional Formatting

A table may define default conditional formatting rules which provide formatting behavior that its views may inherit.

### 19.3 View-Level Conditional Formatting

A view may customize conditional formatting for its own presentation.

A view may:

- Inherit table defaults
- Add additional rules
- Override applicable defaults
- Disable applicable defaults
- Replace conditional formatting for that view

These changes affect presentation rather than underlying table data.

### 19.4 Conditional Formatting Expressions

Conditional-formatting rules use the common expression behavior defined in [Section 20](#20-expressions-and-formulas).

The condition being evaluated is separate from the content the rule visually affects.
A rule may therefore evaluate one set of values while formatting another applicable part of the record.

### 19.5 Conditional Formatting Targets

A conditional formatting rule may target:

- The associated cell or field
- Selected fields or cells
- The entire record or row

Available targets depend on where and how the rule is configured.

### 19.6 Multiple Conditional Formatting Rules

Multiple conditional formatting rules may apply to the same content.

Better Spreadsheet uses a predictable precedence when multiple rules affect the same presentation property.

The exact rule-ordering and precedence interface is left to interface and implementation design.

---

# Part IV - Expressions and Derived Data

## 20. Expressions and Formulas

Better Spreadsheet uses a common expression system anywhere the application needs to calculate, compare, or evaluate data.

This keeps formulas and other expression-based features consistent rather than giving each feature its own unrelated rules.

The common expression system is used by:

- Calculated fields
- Summaries
- Record-level validation
- Conditional formatting
- Query expressions and filters
- Widget calculations
- Applicable dashboard control expressions

### 20.1 Common Expression Behavior

The expression system provides shared behavior for:

- Arithmetic
- Boolean logic
- Comparisons
- Text operations
- Date and time operations
- Functions
- Type rules and inference
- Scalar and multi-value behavior
- Structural references
- Dependencies
- Blank values
- Errors

Features may add behavior specific to their own purpose without changing the meaning of these common operations.
For example, queries provide relational operations such as joins and grouping that do not belong in ordinary cell formulas.

### 20.2 Structural References

Formulas refer to fields and other applicable objects through their stable identities rather than spreadsheet coordinates.

Renaming or repositioning a referenced field therefore does not inherently break a formula.

The interface may display human-readable names while the underlying relationship continues to use stable identity.

### 20.3 Formula Copy and Paste

Copying and pasting formulas preserves their structural meaning according to the applicable reference rules.

Better Spreadsheet does not depend on traditional spreadsheet coordinates as the canonical identity of referenced data.

### 20.4 Blank Values

Blank continues to mean no value when used in expressions.

Blank is not automatically treated as zero, `false`, empty text, or an error.

Individual operators and functions define how blank participates in their behavior while preserving that distinction.

### 20.5 Current Time

`NOW()` represents the current date and time when evaluated.

Generated Created and Last Modified metadata are stored application data and are separate from `NOW()`.

---

## 21. Errors and Partial Evaluation

Errors remain visible rather than being silently converted into ordinary values.

Better Spreadsheet attempts to keep an error as close as possible to the specific value or operation that caused it.

Applicable errors may include:

- Reference errors
- Type errors
- Invalid values
- Division errors
- Dependency cycles
- General evaluation failures

### 21.1 Maximum Usable Data

An error or validation problem does not automatically make an entire record, query, widget, dashboard, export, or other operation unusable.

Better Spreadsheet uses every value that can still be safely and meaningfully evaluated so that only the affected portion is prevented from participating when possible.

### 21.2 Error Propagation

An error propagates only as far as required by the operation that depends on it.

If one calculated output fails but another output can still be evaluated independently, the valid output continues to work.

When an error prevents the application from establishing the broader context required for an operation, the broader operation may become unavailable or broken.

### 21.3 Filter and Sorting Errors

Filter errors follow the behavior defined in [Section 18.3](#183-filter-errors).

Sorting preserves the distinction between valid values, blank values, and errors as defined in [Section 18.4](#184-sorting-blank-and-error-values).

---

## 22. Queries

A query is a workspace object that creates a typed, read-only derived dataset from existing data.

Queries are useful when data needs to be filtered, combined, grouped, calculated, or otherwise transformed into a reusable result.

Queries may exist at the workspace root or inside a collection.

### 22.1 Query Sources

Initial query sources may be:

- Tables
- Views

When a view is used as a source, the query uses the view's included dataset and filtering behavior.

Presentation-only settings such as field widths, colors, or gridlines are not part of the query source.

Query-to-query composition is not part of the initial model.

### 22.2 Query Capabilities

A query may define:

- One or more sources
- Relationships and joins
- Filters
- Grouping
- Aggregations
- Calculated expressions
- Sorting
- Limits
- Reusable transformations

Queries use the common expression behavior defined in [Section 20](#20-expressions-and-formulas) while providing relational operations specific to query processing.

### 22.3 Query Output Fields

A query owns typed output fields that describe the columns of its derived result.

Query output fields are distinct from table fields and have their own stable identities and may include:

- Display name
- Data type
- Source or expression lineage
- Aggregation information
- Source record identity lineage where applicable

Widgets, dashboard controls, query configuration, and other consumers use these stable output identities rather than depending on display names or column positions.

### 22.4 Read-Only Results

Query results are derived and read-only.

Editing a query means changing its definition rather than directly editing cells in its result.
Arbitrary derived query rows are not required to have persistent record identities.

When a result row preserves the identity of a real source record, that identity may be retained for features that require it.

### 22.5 Query Errors

A broken dependency does not delete the query definition.

Errors remain localized when possible.
For example, a broken calculated output may affect only that output while other valid outputs continue to work.

If the failure prevents the query from establishing its required sources, relationships, or result context, the broader query may be marked as broken.

### 22.6 Queries as Reference Sources

A query may restrict the available targets for a reference only when its result preserves identifiable source records.

Aggregated or otherwise derived rows without source record identity cannot be reference targets.

### 22.7 Query Search

Normal workspace search does not search query definitions or evaluated query results by default.

Queries are searched and browsed explicitly through the applicable query interface.

---

# Part V - Dashboards and Analysis

## 23. Dashboards

A dashboard is a workspace presentation and analysis object.

Dashboards may exist at the workspace root or inside a collection.

A dashboard contains widgets and may also provide shared controls that affect multiple widgets.

Dashboards do not own the source table data they display or analyze.

### 23.1 Dashboard Data

A dashboard does not require one common dataset.

Different widgets on the same dashboard may use different compatible data sources.

Shared behavior between widgets is handled through queries or dashboard controls rather than by making one widget the data source for another.

### 23.2 Live Data

Dashboard content is live by default.

When underlying data changes, applicable dashboard content reflects those changes according to its source and configuration.

Where supported, a widget may instead retain or create a snapshot as defined in [Section 24.4](#244-live-and-snapshot-behavior).

---

## 24. Widgets and Dashboard Controls

Widgets are dashboard-owned elements used to present, summarize, or analyze information.

A dashboard may contain multiple widgets with different purposes and data sources.

### 24.1 Widget Sources

A data-backed widget may use:

- A table
- A view
- A query

A widget may perform analysis specific to itself, including:

- Filtering
- Grouping
- Aggregation
- Calculations
- Sorting
- Limiting

Simple widget-specific analysis does not require a separate query. Reusable or multi-source transformations should instead be defined as queries.

### 24.2 Non-Data Widgets

Some widgets may not require a data source, such as text or heading content used to organize or explain a dashboard.

The exact widget catalog is not defined by the KM.

### 24.3 Widget Relationships

Widgets do not use other widgets as direct data sources.

Reusable derived data belongs in queries and shared interactive behavior belongs in dashboard controls.

### 24.4 Live and Snapshot Behavior

Widgets are live by default.

Where supported, a widget may be converted to or retain a snapshot, which is explicitly distinguishable from live data.

If a live source becomes broken or unavailable, a previously captured snapshot may remain viewable without being presented as current data.

### 24.5 Shared Dashboard Controls

A dashboard may provide controls that affect multiple widgets.

Examples include:

- Date ranges
- Categories
- Status selections
- Other applicable parameters or filters

Each widget explicitly binds a compatible control to a field, expression, or parameter in its own data context.

Bindings are not inferred solely because two fields happen to have the same display name.

### 24.6 Widget Titles

Widget titles and labels are presentation and do not need to be unique within a dashboard.

---

# Part VI - Supporting Content and Reuse

## 25. Notes

Better Spreadsheet supports notes attached to individual cells.

A cell may contain one note that belongs to the cell but is separate from the it's typed value.

Changing or removing a note does not change the cell value itself.

The current model does not include a collaborative comment system with:

- Threads
- Replies
- Mentions
- Resolution status
- Comment-specific authorship workflows

These capabilities may be considered separately in the future.

---

## 26. Files and Attachments

A file is a workspace-owned binary object with a stable identity.

Files may be referenced by attachment cells throughout the same workspace.

The same file may be referenced by more than one attachment cell without creating a separate copy for each reference.

### 26.1 File Management

Files belong to the workspace but do not appear as ordinary items in the main workspace navigation hierarchy.

They are managed through a workspace-specific file and attachment interface.

### 26.2 File Access

Access to a file follows the application's authorization and sharing rules.

A file belonging to a workspace does not by itself mean that every user with some access to that workspace automatically has permission to access the file.

### 26.3 Attachment References

Attachment cells store references to files rather than owning separate file copies.

Removing one attachment reference does not delete the file while other valid references remain.

When the last applicable reference is removed, the file follows the application's applicable deletion and trash lifecycle.

### 26.4 Offline Availability

File metadata and file content availability are separate concerns.

Whether a file's binary content is available offline follows the workspace's local-availability and synchronization rules.

Archive state does not determine whether a file is available offline.

---

## 27. Templates

A template is a reusable definition that can be used to create or configure Better Spreadsheet content.

Templates store reusable structure and configuration rather than maintaining a live relationship to the object they were created from.

Changes to the original object do not automatically change a template created from it.

### 27.1 Template Types

Templates may apply to:

- Tables
- Views
- Queries
- Dashboards
- Workspaces

These are different uses of the same template concept rather than unrelated template object types.

### 27.2 Template Library

Templates live in an application-level Template Library rather than inside workspace or collection navigation so may therefore be reused across workspaces.

### 27.3 Built-in and User Templates

Better Spreadsheet may provide built-in templates that are read-only.

A user who wants to customize a built-in template duplicates it into a user template and edits the duplicate.

User-created templates may be archived within the Template Library.

### 27.4 Template Contents

A template contains the configuration appropriate to its purpose.

For example, a table template may include:

- Fields and data types
- Field configuration
- Views
- Sections
- Formatting
- Optional sample records

A dashboard template may include:

- Widgets
- Shared controls
- Dashboard configuration

### 27.5 Template Dependencies

When related objects are included together in a template, relationships between them are stored as template-internal relationships.

When the template is used, those relationships are rebound to the newly created objects.

Dependencies on objects that are not included in the template are:

- Inferred and mapped when the match is safe and unambiguous
- Mapped by the user when necessary
- Never silently guessed when the correct target is ambiguous

---

## 28. Search

Search allows users to find applicable workspace content without changing the data or view configuration being searched.

### 28.1 Workspace Search

Normal workspace search focuses on canonical workspace content and ordinary data surfaces.

Searching does not modify a view's filters, sorting, or other saved configuration.

### 28.2 Query Search

Query definitions and evaluated query results are not included in normal workspace search by default.

Queries are searched or browsed explicitly through the applicable query interface.

### 28.3 Archived Content

Archived content remains searchable through the applicable archive or search workflow.

---

## 29. Duplication, Copying, and Movement

Better Spreadsheet distinguishes between moving an existing object and creating a new copy of it.

Moving an object within the same workspace generally preserves its identity, whereas duplicating or copying an object creates new identities where appropriate.

### 29.1 Movement Within a Workspace

Tables, queries, and dashboards may move between the workspace root and collections.

These moves preserve:

- Object identity
- Workspace ownership
- Valid live dependencies

### 29.2 Transfer Between Workspaces

Live objects do not move directly across workspace boundaries while retaining their live dependencies.

Cross-workspace reuse uses:

- Copy
- Native Package import and export
- Templates

New identities and dependency mappings are created where appropriate.

### 29.3 Duplicating Tables

Duplicating a table creates a new table and copies its:

- Fields
- Records and stored data
- Table-level schema and configuration

Including the table's owned views is configurable during duplication.

Within the same workspace, duplicated attachment references continue pointing to the same files.

### 29.4 Duplicating Queries

Duplicating a query creates a new query identity with copied definition and configuration with valid source references continuing to point to the same source tables and views.

### 29.5 Duplicating Dashboards

Duplicating a dashboard creates a new dashboard identity.

Its widgets, shared controls, and dashboard configuration are also duplicated while references to source tables, views, and queries continue pointing to those existing sources.

### 29.6 Duplicating Collections

Duplicating a collection duplicates the collection and its contained hierarchy.

Dependencies between objects inside the duplicated collection are remapped to their duplicated counterparts.

Valid dependencies from duplicated objects to objects outside the collection continue pointing to those existing external objects.

### 29.7 Duplicating Workspaces

Duplicating a workspace creates a new workspace containing duplicated workspace content and hierarchy.

Internal live dependencies are remapped to the corresponding objects in the new workspace.

Including file and attachment binary content is configurable.
When file content is excluded, the resulting metadata and reference state clearly identifies unavailable content.

### 29.8 Duplicating Templates

Duplicating a template creates an independent template.

Customizing a built-in template begins by duplicating it into a user template.

---

# Part VII - Lifecycle and Recovery

## 30. Archive and Trash

Archive and trash represent different lifecycle states.

Archive is used to retain content while removing it from normal active use.

Trash is used for deletion with an opportunity for recovery before permanent deletion.

### 30.1 Archive

Archive is available to applicable structural objects, including:

- Collections
- Tables
- Views
- Queries
- Dashboards
- User templates

Records do not have a general archive lifecycle.

Archiving preserves the object's identity, hierarchy, and valid dependencies.

Archived content is normally hidden from active navigation and is read-only according to the applicable interface.

Valid dependencies may continue reading archived content.

Archive state is separate from offline availability.

### 30.2 Trash

Trash represents content that has been deleted but is still available for recovery.

Trashing a hierarchical object preserves that hierarchy.
For example, trashing a collection keeps its contained objects associated with that collection rather than moving them to the workspace root.

### 30.3 Trash Retention

Trash retention is configurable rather than permanently fixed by the KM.
After the applicable retention period or an explicit permanent-delete action, trashed content may be permanently removed.

### 30.4 Dependency Warnings

Deletion warnings focus on dependencies that will survive the deletion operation.
Dependencies entirely contained within the same deletion scope do not require redundant warnings.

---

## 31. Undo, Redo, and History

Better Spreadsheet provides both short-term action reversal and longer-term history to serve different purposes.

### 31.1 Undo and Redo

Undo and redo allow users to reverse or reapply recent actions.

The KM does not define a fixed number of actions that must be retained.

Capacity may be configurable or determined during implementation.

Bulk operations should behave as one coherent undo-able action where practical.
For example, resequencing an entire sequence field should be treated as one operation rather than requiring the user to undo each changed value separately.

### 31.2 History

History provides durable access to meaningful changes in persistent application state.

History may include changes to:

- Table data
- Views
- Sections
- Queries
- Dashboards
- Widgets
- Shared dashboard controls
- Other persistent configuration

History does not include temporary interface state such as:

- Scroll position
- Hover state
- Open panels
- Panel sizes
- Other transient session behavior

### 31.3 History Retention

History retention is configurable rather than permanently fixed by the KM.

### 31.4 Restore Points

Users may intentionally create named points in history for later recovery. The final user-facing name for this feature is not yet locked.

Restoring historical state restores the applicable object's previous state and identity rather than creating a duplicate merely because an older state was restored.

### 31.5 History Is Not a Backup

History is a user-facing recovery and versioning feature.

It is not a replacement for Native Packages or infrastructure-level backup.

---

## 32. Import, Export, and Native Packages

Better Spreadsheet supports both common interchange formats and an application-specific format that preserves Better Spreadsheet structure.

### 32.1 Interoperability Formats

Common formats such as CSV, JSON where applicable, and XLSX are used to exchange data with other applications.

These formats preserve only the information that the target format can represent.

Spreadsheet import and export may support compatible formulas and formatting as well as explicit data-only workflows.

### 32.2 Native Package

A Native Package is Better Spreadsheet's own portable format for preserving application structure and behavior.

The same Native Package model is used for applicable:

- Backup
- Recovery
- Native export
- Workspace restore
- Lower-level object transfer

Different workflows may provide different options while using the same underlying native representation.

### 32.3 Workspace Restore

Importing or restoring a complete workspace Native Package always creates a new workspace rather than merge the packaged workspace into an existing workspace.

The new workspace receives a new workspace identity and packaged child identities are preserved when safe, as defined in [Section 5.4](#54-workspace-restore).

### 32.4 Lower-Level Native Import

Supported lower-level objects may be imported into an existing workspace.

These imports create new identities and remap dependencies as appropriate.

Dependencies outside the imported content must be safely mapped or remain explicitly unresolved rather than being silently guessed.

### 32.5 File and Attachment Content

Native backup, recovery, export, and workspace duplication may allow users to include or exclude file binary content.

Excluding binaries can reduce package size. When binaries are excluded, enough metadata and reference information is preserved to make the unavailable content explicit.

### 32.6 Naming Conflicts

Import, duplication, and restore operations respect the naming scopes defined in [Section 4.3](#43-naming-scopes).

When an incoming name conflicts with an existing name in a scope that requires uniqueness, Better Spreadsheet resolves the conflict using an appropriate conflict-safe name rather than creating an invalid duplicate.

---

# Part VIII - Persistence and Application Behavior

## 33. Autosave and Persistence

Better Spreadsheet uses autosave for ordinary persistent changes.

Users do not need to manually save routine edits or configuration changes for actions such as:

- Cell edits
- View filters
- Section configuration
- Query configuration
- Dashboard and widget configuration
- Shared dashboard controls

### 33.1 Staged Operations

Some workflows intentionally prepare a larger operation before changing persistent data.

These workflows may use an explicit confirmation or apply step.
For example, an import may allow the user to review field mappings and detected data before committing the import.

This does not change the general autosave behavior used for ordinary application editing.

### 33.2 Recovery

Autosave works alongside:

- Undo
- Redo
- History
- Native Package recovery

Saving automatically does not remove the user's ability to recover from unwanted changes.

---

## 34. Offline Use and Synchronization

Better Spreadsheet supports local-first editing so that users can continue working with locally available data without requiring a continuous connection to the server.

### 34.1 Local-First Changes

User edits are committed locally first.

When the workspace participates in cloud synchronization, those changes synchronize asynchronously when connectivity is available.

Ordinary editing does not need to wait for a network request before the local change is accepted.

### 34.2 Cloud Participation

Cloud participation is configured at the workspace level.

A workspace may be:

- Local-only
- Cloud-synchronized

Live dependencies remain contained within the workspace regardless of whether it participates in cloud synchronization.

### 34.3 Offline Availability

Content explicitly made available offline remains locally available according to the configured policy.

Other working data may be cached locally and may expire after inactivity according to configurable retention behavior.

Archive state does not determine offline availability.

### 34.4 Unsynced Work

Unsynced user work is never silently discarded.

If synchronization cannot accept a local change, Better Spreadsheet preserves the user's recoverable work and clearly identifies the problem.

### 34.5 Synchronization Conflicts

When compatible changes can coexist, Better Spreadsheet should preserve both rather than treating every conflict as a last-write-wins situation.

Conflicts that cannot be resolved safely are surfaced to the user.

### 34.6 Demo Mode

Better Spreadsheet may provide a browser-based demo mode that does not require installation.

Demo data remains separate from the user's ordinary persistent workspace data.

---

## 35. Navigation and Presentation

Navigation reflects the ownership and organizational structure defined throughout this model.

### 35.1 Workspace Navigation

Tables, queries, and dashboards appear as user-facing workspace navigation objects and may appear at the workspace root or inside one collection.

Collections provide folder-like organization for these objects.

### 35.2 Table Navigation

Views are accessed within their owning table rather than appearing as independent workspace-level objects.

### 35.3 Dashboard Navigation

Widgets exist within their owning dashboard and are not independent workspace navigation objects.

### 35.4 Template Navigation

Templates are managed through the application-level Template Library rather than workspace navigation.

### 35.5 File Navigation

Files are managed through the applicable workspace file and attachment interface rather than as ordinary workspace navigation objects.

### 35.6 Interface Layout

The KM does not define exact interface layout behavior such as:

- Tab limits
- Panel sizes
- Dashboard drag behavior
- Widget resizing
- Responsive breakpoints
- Other detailed layout mechanics

These are interface and implementation concerns unless a future product requirement gives them semantic meaning.

---

# Part IX - Model Reference

## 36. Invariants

The following rules summarize the core boundaries that should remain true throughout Better Spreadsheet.

1. Tables own canonical user data.
2. Views do not own or duplicate records.
3. Queries produce read-only derived datasets.
4. Dashboards and widgets do not own their source table data.
5. Stable identity is independent of display name and presentation position.
6. Live dependencies do not cross workspace boundaries.
7. Collections do not nest.
8. Collections organize workspace-owned tables, queries, and dashboards.
9. Views belong to one table.
10. Widgets belong to one dashboard.
11. Templates are application-level reusable definitions rather than live workspace dependencies.
12. Calculated and generated cell values are read-only.
13. Generated fields are system-maintained.
14. Sequence resequencing is an explicit whole-field operation.
15. Errors remain visible and are localized when possible.
16. Usable data continues participating when unrelated data contains errors.
17. Filter errors are not silently treated as `false`.
18. Record display labels and widget titles do not need to be unique.
19. Field names are unique within their table.
20. Select-option labels are unique within their select field.
21. Required fields do not prevent the creation of incomplete records.
22. Existing references are preserved when target restrictions change.
23. Deleted reference targets leave surviving references in a broken state rather than silently clearing them.
24. Files belong to a workspace and may be referenced by multiple attachment cells.
25. Native workspace restore creates a new workspace.
26. Ordinary persistent changes autosave.
27. History covers persistent data and configuration rather than temporary interface state.
28. Presentation changes do not modify underlying data unless the action is explicitly defined as data-changing.

---

## 37. Deferred Product Decisions

The following areas are intentionally not finalized in this Knowledge Model.

They may be resolved during wire-framing, detailed design, implementation, or later product development without reopening unrelated parts of the model.

- Exact widget catalog
- Exact query language or authoring syntax
- Query-to-query composition
- Arbitrary cross-record validation expressions beyond supported built-in behavior
- Automatic currency exchange-rate conversion
- Collaborative comments, threads, replies, and mentions
- Final user-facing name for intentional history restore points
- Exact interface layout mechanics
- Exact retention defaults where behavior is configurable
- Future expansion of the expression and function catalog

A deferred item is not an accidental omission. It means the current product model does not require that decision to be locked yet.

---

## 38. Index

- **All Data** - [15.3](#153-all-data-view)
- **Archive** - [30.1](#301-archive)
- **Archived content, search** - [28.3](#283-archived-content)
- **Attachment field type** - [11.10](#1110-attachment)
- **Attachment references** - [26.3](#263-attachment-references)
- **Attachments and files** - [26](#26-files-and-attachments)
- **Autosave** - [2.8](#28-persistent-changes-autosave), [33](#33-autosave-and-persistence)
- **Blank values** - [2.3](#23-blank-means-no-value), [20.4](#204-blank-values)
- **Boolean** - [11.7](#117-boolean)
- **Calculated fields** - [10.2](#102-calculated-fields)
- **Canonical data** - [7.1](#71-canonical-data)
- **Canonical record order** - [7.1](#71-canonical-data), [18.5](#185-manual-reordering)
- **Cells** - [9](#9-fields-and-cells)
- **Cell notes** - [25](#25-notes)
- **Cloud participation** - [34.2](#342-cloud-participation)
- **Collections** - [6](#6-collections)
- **Collection-wide actions** - [6.2](#62-collection-wide-actions)
- **Conditional formatting** - [19](#19-formatting-and-conditional-formatting)
- **Currency** - [11.4](#114-currency)
- **Dashboard controls** - [24.5](#245-shared-dashboard-controls)
- **Dashboards** - [23](#23-dashboards)
- **Data types** - [11](#11-data-types)
- **Date, Time, and DateTime** - [11.8](#118-date-time-and-datetime)
- **Defaults, dynamic** - [10.1](#101-normal-fields)
- **Defaults, static** - [10.1](#101-normal-fields)
- **Deleted reference targets** - [14.6](#146-deleted-reference-targets)
- **Deleting records** - [8.3](#83-deleting-records)
- **Demo mode** - [34.6](#346-demo-mode)
- **Dependency boundary** - [4.4](#44-workspace-dependency-boundary)
- **Dependency warnings** - [30.4](#304-dependency-warnings)
- **Duplicating collections** - [29.6](#296-duplicating-collections)
- **Duplicating dashboards** - [29.5](#295-duplicating-dashboards)
- **Duplicating queries** - [29.4](#294-duplicating-queries)
- **Duplicating records** - [8.4](#84-duplicating-records)
- **Duplicating tables** - [29.3](#293-duplicating-tables)
- **Duplicating templates** - [29.8](#298-duplicating-templates)
- **Duplicating views** - [15.4](#154-duplicating-views)
- **Duplicating workspaces** - [29.7](#297-duplicating-workspaces)
- **Errors** - [21](#21-errors-and-partial-evaluation)
- **Error propagation** - [21.2](#212-error-propagation)
- **Expressions** - [20](#20-expressions-and-formulas)
- **Field configuration** - [9.1](#91-field-configuration)
- **Field-level validation** - [13.3](#133-field-level-validation)
- **Field value models** - [10](#10-field-value-models)
- **Fields** - [9](#9-fields-and-cells)
- **File access** - [26.2](#262-file-access)
- **File management** - [26.1](#261-file-management)
- **Files** - [26](#26-files-and-attachments)
- **Filtering** - [18.2](#182-filtering)
- **Filter errors** - [18.3](#183-filter-errors)
- **Formatting** - [19](#19-formatting-and-conditional-formatting)
- **Formula copy and paste** - [20.3](#203-formula-copy-and-paste)
- **Generated fields** - [10.3](#103-generated-fields), [12](#12-generated-fields)
- **Generated metadata** - [12.4](#124-created-and-modified-metadata)
- **History** - [31.2](#312-history)
- **History retention** - [31.3](#313-history-retention)
- **Import and export** - [32](#32-import-export-and-native-packages)
- **Integer** - [11.3](#113-integer)
- **Invariants** - [36](#36-invariants)
- **Live dependencies** - [4.4](#44-workspace-dependency-boundary)
- **Manual sections** - [16.1](#161-manual-sections)
- **Multi-select** - [11.9](#119-single-select-and-multi-select)
- **Multi-value cardinality** - [13.6](#136-multi-value-cardinality)
- **Naming conflicts** - [32.6](#326-naming-conflicts)
- **Naming scopes** - [4.3](#43-naming-scopes)
- **Native Package** - [32.2](#322-native-package)
- **Native import** - [32.4](#324-lower-level-native-import)
- **Navigation** - [35](#35-navigation-and-presentation)
- **Normal fields** - [10.1](#101-normal-fields)
- **Notes** - [25](#25-notes)
- **Number** - [11.2](#112-number)
- **Offline availability** - [34.3](#343-offline-availability)
- **Offline files** - [26.4](#264-offline-availability)
- **Offline use** - [34](#34-offline-use-and-synchronization)
- **Ownership and organization** - [4.2](#42-ownership-and-organization)
- **Percentage** - [11.5](#115-percentage)
- **Query capabilities** - [22.2](#222-query-capabilities)
- **Query errors** - [22.5](#225-query-errors)
- **Query ordering** - [18.6](#186-query-ordering)
- **Query output fields** - [22.3](#223-query-output-fields)
- **Query results** - [22.4](#224-read-only-results)
- **Query search** - [22.7](#227-query-search), [28.2](#282-query-search)
- **Query sources** - [22.1](#221-query-sources)
- **Queries** - [22](#22-queries)
- **Queries as reference sources** - [22.6](#226-queries-as-reference-sources)
- **Random Choice** - [12.3](#123-random-choice)
- **Rating** - [11.6](#116-rating)
- **Record creation** - [8.1](#81-creating-records)
- **Record display** - [8.2](#82-record-display)
- **Record-level validation** - [13.4](#134-record-level-validation)
- **Records** - [8](#8-records)
- **Reference fields** - [11.11](#1111-reference)
- **References** - [14](#14-references)
- **Reference restrictions** - [14.4](#144-restricting-available-targets)
- **Required fields** - [13.2](#132-required-fields)
- **Resequence** - [12.1](#121-sequence)
- **Restore points** - [31.4](#314-restore-points)
- **Search** - [28](#28-search)
- **Sections** - [16](#16-sections)
- **Section summaries** - [17.2](#172-section-summaries)
- **Select fields** - [11.9](#119-single-select-and-multi-select)
- **Sequence** - [12.1](#121-sequence)
- **Snapshots** - [24.4](#244-live-and-snapshot-behavior)
- **Sorting** - [18.1](#181-sorting)
- **Sorting blanks and errors** - [18.4](#184-sorting-blank-and-error-values)
- **Stable identity** - [4.1](#41-stable-identity), [4.5](#45-dependencies-use-stable-identity)
- **Structural references** - [20.2](#202-structural-references)
- **Summaries** - [17](#17-summaries)
- **Synchronization** - [34](#34-offline-use-and-synchronization)
- **Synchronization conflicts** - [34.5](#345-synchronization-conflicts)
- **Tables** - [7](#7-tables)
- **Table configuration** - [7.2](#72-table-level-configuration)
- **Templates** - [27](#27-templates)
- **Template dependencies** - [27.5](#275-template-dependencies)
- **Template Library** - [27.2](#272-template-library)
- **Text** - [11.1](#111-text)
- **Trash** - [30.2](#302-trash)
- **Trash retention** - [30.3](#303-trash-retention)
- **Undo and redo** - [31.1](#311-undo-and-redo)
- **Uniqueness** - [13.5](#135-uniqueness)
- **Unsynced work** - [34.4](#344-unsynced-work)
- **UUID / Random ID** - [12.2](#122-uuid--random-id)
- **Validation** - [13](#13-validation-and-constraints)
- **Validation severity** - [13.1](#131-validation-severity)
- **Views** - [15](#15-views)
- **View summaries** - [17.1](#171-view-summaries)
- **Widgets** - [24](#24-widgets-and-dashboard-controls)
- **Widget sources** - [24.1](#241-widget-sources)
- **Workspace boundaries** - [5.2](#52-workspace-boundaries)
- **Workspace deletion** - [5.3](#53-workspace-deletion)
- **Workspace restore** - [5.4](#54-workspace-restore), [32.3](#323-workspace-restore)
- **Workspaces** - [5](#5-workspaces)