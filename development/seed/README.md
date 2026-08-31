# Development Seed Data

This directory contains deterministic development-only seed data for Better Spreadsheet.

Seed data represents application-domain data independently of the frontend, backend, database, and synchronization implementations. Application code must not depend solely on these files. Development tooling may load seed data through the same domain and persistence boundaries used by normal application data.

The Knowledge Model is authoritative for the meaning and relationships of seeded application objects. Seed data must not introduce product behavior that conflicts with or extends the KM.

## Goals

- Provide realistic, deterministic data for development and testing.
- Provide enough variety to develop data-driven UI without repeatedly inventing temporary data
- Provide stable identities and relationships that make development behavior reproducible
- Exercise Better Spreadsheet domain model
- Exercise normal, empty, boundary, lifecycle, and dependency states
- Support frontend, backend, persistence, synchronization, and integration development
- Remain replaceable by persisted or synchronized application data without changing UI behavior
- Remain development infrastructure, not production application data

## Principles

### Deterministic

The same seed dataset must produce the same application state every time it is loaded. Seed files use stable, explicit identities and values. Runtime randomness, current timestamps, or environment-dependent values must not be required to construct the seeded state.

### Domain Valid

Seed data should represent states that Better Spreadsheet can legitimately persist. Incomplete records, validation failures, broken dependencies, archived objects, and other states supported by the KM may be represented.

Structurally impossible states should not be introduced merely to test failure handing. Those belong in targeted automated test fixtures.

### Realistic

Seed data should resemble plausible user data rather than generic values such as `Test 1`, `Table A`, or `Example Record`. Realistic data makes layout, navigation, formatting, filtering, summaries, references, and other application behavior easier to evaluate during development.

### Comprehensive

The complete seed set should exercise meaningful variations of supported domain behavior rather than only the simplest successful case.

Not every dataset needs to exercise every feature. Coverage should be distributed naturally across the complete seeded application state.

### Interconnected

Relationships should be represented where the KM supports them. References, queries, dashboards, attachments, and other dependencies should use stable object identities and remain within their applicable workspace boundaries.

### Technology Neutral

Files in `development/seed/data` describe application-domain state. They must not contain Angular, Spring, or IndexedDB, PostgreSQL, or other aspect-specific implementation details unless those details are themselves part of the application domain.

## Dataset Structure

Seed datasets live under `development/seed/data `.

Datasets are separated by domain object so they can evolve with their corresponding application models and loading boundaries.

### Current Datasets

The currently implemented seed model includes:

```text
workspaces.json
collections.json
tables.json
fields.json
records.json
```

These datasets establish the core hierarchy and canonical table data.

### Planned Datasets

Additional datasets will be introduced as their domain models and loading boundaries are implemented:

```text
views.json
sections.json
queries.json
dashboards.json
widgets.json
files.json
notes.json
templates.json
```

The existence of a planned dataset in this document defines intended seed coverage, not its serialized schema. The JSON structure for a planned dataset should be established when the corresponding domain model and loading boundary are implemented.

## Dataset Responsibilities

### Workspaces

`workspaces.json` represents top-level application workspaces.

The seed set should include:

- more than one workspace;
- local-only and cloud-participating behavior where applicable;
- enough independent data to verify workspace switching; and
- strict separation of live dependencies between workspaces.

### Collections

`collections.json` represents optional workspace organization and should include:

- collections containing multiple objects;
- an empty collection;
- active and archived collections; and
- collections in more than one workspace.

Collections must never nest.

### Tables

`tables.json` represents workspace-owned tables and should include:

- tables inside collections;
- tables at the workspace root;
- populated tables;
- an empty table;
- an archived table;
- tables with different structural complexity; and
- at least one table large enough to exercise scrolling and large-data presentation.

Every table must remain owned by exactly one workspace.

### Fields

`fields.json` represents table-owned field definitions and should include:

- every supported core data type;
- normal fields;
- calculated fields;
- generated fields;
- required and optional fields;
- static defaults;
- dynamic defaults;
- supported generated-field behaviors;
- type-specific configuration;
- select options;
- references;
- validation and constraints; and
- representative formatting or other field-owned configuration when implemented.

Field names must remain unique within their table. Select-option labels must remain unique within their field.

### Records

`records.json` represents canonical table records and their cell values and should include:

- complete records;
- incomplete but validly persisted records;
- blank values;
- zero values;
- false boolean values;
- empty text where supported;
- short and long text;
- positive and negative numbers;
- representative dates and times;
- single-select and multi-select values;
- references;
- attachments when file seeding is available;
- calculated results;
- generated values; and
- localized validation or error states where the domain model explicitly supports persistence of those states.

Blank, `0`, `false`, empty text, and errors must remain distinguishable.

At least one table should contain enough records to exercise scrolling, selection, filtering, sorting, summaries, and future virtualization behavior without requiring generated runtime data.

### Views

`views.json` will represent table-owned saved views and should eventually include:

- the required `All Data` view for every table;
- multiple views of the same table;
- visible and hidden fields;
- field ordering;
- filtering;
- sorting;
- view-specific formatting;
- active and archived views; and
- views with and without sections.

Views must never own or duplicate table records.

### Sections

`sections.json` will represent view-owned record grouping and should eventually include:

- manual sections;
- generated sections;
- nested sections where supported;
- empty sections where valid; and
- section-level summaries.

Sections organize records for presentation without changing table ownership of those records.
ons organize records for presentation without changing table ownership of those records.

### Queries

`queries.json` will represent workspace-owned read-only derived datasets and should eventually include queries that:

- live at the workspace root;
- live inside a collection;
- filter data;
- sort data;
- calculate derived output;
- group or aggregate data;
- combine applicable source data;
- return many rows;
- return one row;
- return no rows; and
- expose localized errors without unnecessarily invalidating usable output.

All live query dependencies must remain within one workspace.

### Dashboards

`dashboards.json` will represent workspace-owned dashboards and should eventually include:

- dashboards at the workspace root;
- dashboards inside collections;
- multiple widgets;
- shared dashboard controls;
- different layouts;
- active and archived dashboards; and
- dashboards using more than one compatible source.

Dashboards must not own or duplicate their source table data.

### Widgets

`widgets.json` will represent dashboard-owned widget and should eventually include:

- data-backed widgets;
- non-data widgets;
- table-backed data where supported;
- query-backed data where supported;
- control bindings;
- repeated or non-unique widget titles;
- live widgets; and
- snapshot behavior where supported.

The exact widget catalog remains deferred by the KM and must not be invented by the seed format.

### Files

`files.json` will represent workspace-owned file metadata used by attachment fields and should eventually include:

- multiple files in a workspace;
- files referenced by one attachment cell;
- files referenced by multiple attachment cells; and
- file metadata independent from binary-content availability.

Attachment relationships must never cross workspace boundaries. Development seed metadata must not require production file storage to load successfully.

### Notes

`notes.json` will represent notes attached to cells and should eventually include:

- cells without notes;
- cells with short notes;
- cells with long notes; and
- notes attached to cells containing different underlying data types.

A note remains separate from the cell's typed value.

### Templates

`templates.json` will represent application-level reusable templates and should eventually include:

- built-in read-only templates;
- user-created templates;
- active user templates;
- archived user templates; and
- multiple supported template purposes.

Templates must not create live dependencies back to the objects from which they were created.

## Lifecycle Coverage

Where applicable, the complete seed set should represent:

- active objects;
- archived objects; and
- trashed objects when trash persistence is implemented.

Records do not receive a general archive lifecycle. Archived structural content retains its identity, hierarchy, data, and valid dependencies.

Lifecycle examples should be deliberate and limited enough that the default seeded workspace still feels usable rather than primarily containing recovery-state data.

## Boundary and Presentation Coverage

The seed set should contain deliberate presentation boundaries, including:

- short names;
- long names;
- similar names under different parents;
- empty containers;
- sparse records;
- dense records;
- long cell content;
- tables with few fields;
- tables with many fields; and
- enough records in one table to require meaningful scrolling.

These cases exist to expose layout and interaction problems during normal development. They should still represent valid application-domain state.

## Identity and Relationships

Seed identities are stable development identities. Changing display names or presentation order must not be necessary to resolve relationships.

All relationships must reference identities rather than display names. Live dependencies must remain within workspace boundaries.

When a seeded object depends on another seeded object, both sides of that relationship should be present unless the dataset intentionally represents a broken dependency state supported by the KM.

## Loading

Seed files are not application repositories.

Frontend and backend development tooling should translate seed data through the same application and persistence boundaries used by ordinary application data.

Production application code must not require `development/seed/` to exist. Loading seed data should be explicit and limited to development or test workflows.

## Evolution

Seed data should evolve when:

- the Knowledge Model introduces or changes domain behavior;
- a domain model or persistence boundary is implemented;
- a newly implemented component requires an unrepresented valid state; or
- development reveals an important boundary case missing from the existing dataset.

New seed data should extend the coherent application state rather than accumulating unrelated one-off test records. When a planned dataset receives an implemented domain model, define its serialized seed format at that time and update this document from planned to current.
