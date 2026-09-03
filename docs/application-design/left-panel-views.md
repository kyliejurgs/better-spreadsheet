# Better Spreadsheet — Left Panel Views

**Status:** Defined
**Purpose:** Defines the content, visual design, navigation behavior, and interaction model of views presented within the Better Spreadsheet Left Panel.

---

## 1. Shared Left Panel View Behavior

### Purpose

The Left Panel provides contextual navigation and discovery interfaces associated with the primary workspace activities available through the Activity Bar.

The initial Left Panel views are:

- Explorer
- Search

Additional Left Panel views may be introduced when they represent major workspace activities appropriate for persistent Activity Bar access.

### Layout

Exactly one Left Panel view is active at a time.

All Left Panel views share the width allocated to the Left Panel by the Application Layout. Individual views do not control Left Panel sizing, resizing, or collapse behavior. Header dimensions, spacing, and typography remain consistent between views.

Each Left Panel view contains a consistent fixed header followed by
view-specific content. Content below the header owns its scrolling behavior and may define its own internal layout.

The header contains:

- View title on the left
- Context-specific actions on the right when applicable

### Behavior

Selecting an inactive Left Panel view from the Activity Bar makes that view active and displays its content.

Selecting the currently active Activity Bar item toggles the Left Panel between expanded and collapsed. Selecting a Left Panel view while the panel is collapsed reopens the panel with that view active.

Collapsing the Left Panel does not clear its active view. Switching views or collapsing the Left Panel does not reset view-specific state. State such as Explorer tree expansion, Search input, and Search results is preserved.

---

## 2. Explorer

### Purpose

Explorer provides hierarchical navigation through the active Workspace and access to Workspace-owned Files. It presents workspace content using a compact tree-based interface while preserving the ownership and organization defined by the application knowledge model.

### Content

Explorer initially contains two vertically stacked sections that may be independently expanded or collapsed:

- Active Workspace
- Files

### Layout

The Workspace section contains the hierarchical Workspace navigation. The Files section provides a separate presentation of Workspace-owned Files.

Workspace and Files are presented as full-width collapsible section rows. Each section row contains a disclosure control, an object-specific icon, and its label. The active Workspace name is used as the Workspace section label.

Workspace content is presented using compact, indented navigation rows beneath the Workspace section header. Explorer owns the layout and interaction behavior of these rows rather than delegating navigation presentation to a generic tree component.

Collapsing an Explorer section does not collapse the Left Panel itself.

---

## 3. Workspace Section

### Purpose

The Workspace section provides primary navigation through the organizational and openable content of the active Workspace.

### Content

The Workspace tree may contain:

- Collections
- Tables
- Views
- Queries
- Dashboards

The hierarchy is:

    Workspace
    ├── Collection
    │   ├── Table
    │   │   └── View
    │   ├── Query
    │   └── Dashboard
    ├── Table
    │   └── View
    ├── Query
    └── Dashboard

Collections do not nest.

Tables, Queries, and Dashboards may appear directly at the Workspace root or inside a Collection.

Views appear directly beneath their owning Table. Explorer does not introduce an additional Views grouping node.

Widgets do not appear as Explorer nodes because they belong to and are managed through Dashboards. Files do not appear inside the Workspace tree.

### Layout

The active Workspace name is displayed in the Workspace section header. The Workspace section header also acts as the control for expanding and collapsing the section.

The Workspace section header contains:

- Expand/collapse disclosure control
- Workspace icon
- Active Workspace name
- Contextual actions when applicable

Workspace actions are displayed on the right side of the section header when the header is hovered or focused. The action area takes priority over the available Workspace-name display width. The Workspace name may therefore truncate when necessary to keep the actions accessible.

Workspace navigation uses compact hierarchical rows. Collections, Tables, Views, Queries, and Dashboards use object-specific icons. Expandable objects display a disclosure control before their object icon. Non-expandable objects preserve alignment with expandable objects.

Child objects are indented according to their hierarchy level. Typography remains consistent throughout Workspace navigation; hierarchy is communicated primarily through indentation, disclosure controls, icons, and object relationships rather than changes in font size.

Workspace section headers use stronger typographic emphasis than individual navigation objects.

### Ordering

Workspace tree content uses automatic case-insensitive alphabetical ordering. At the Workspace root:

1. Collections appear first and are sorted alphabetically.
2. Tables, Queries, and Dashboards follow and are sorted together alphabetically.

Inside a Collection, Tables, Queries, and Dashboards are sorted together alphabetically. Inside a Table, `All Data` always appears first. Remaining Views are sorted alphabetically.

Object type does not otherwise affect ordering. Empty Collections are omitted from Explorer navigation. The Collection remains part of the Workspace data model but is not displayed in Explorer until it contains at least one object that would appear in Workspace navigation.

---

## 4. Workspace Navigation Behavior

### 4.1 Collections

Single-clicking a Collection expands or collapses it. Collections are organizational nodes and do not open content in the Work Area.

### 4.2 Tables

Single-clicking a Table expands or collapses its Views.

Double-clicking a Table opens the Table using its last-used View. If the Table does not have a previously used View, `All Data` is opened. The View opened by this operation becomes the active Explorer object.

### 4.3 Views

Single-clicking a View opens it in a preview tab.

Double-clicking a View opens it in a pinned tab.

### 4.4 Queries

Single-clicking a Query opens it in a preview tab.

Double-clicking a Query opens it in a pinned tab.

### 4.5 Dashboards

Single-clicking a Dashboard opens it in a preview tab.

Double-clicking a Dashboard opens it in a pinned tab.

---

## 5. Active Explorer Object

### Purpose

Explorer reflects the content currently displayed in the Work Area so that the user can always identify its location within the Workspace hierarchy.

### Appearance

The Explorer object currently displayed in the Work Area uses the active row background treatment. Hovering a navigable row uses the same background treatment as the active state. No additional active-state outline, accent bar, or bold typography is required.

### Behavior

Only one Explorer object is active at a time.

Preview and pinned tabs are treated identically for purposes of determining the active Explorer object.

Collections and Tables do not become active merely because they are expanded or collapsed.

When the active Work Area content changes, Explorer automatically reveals the corresponding object. Any collapsed ancestors required to reveal the active object are automatically expanded. For a View, this may include its owning Table and Collection. Explorer expands only the ancestors necessary to reveal the active object and does not collapse unrelated nodes.

This behavior applies regardless of how navigation occurred, including:

- Explorer navigation
- Tab navigation
- Search
- Links or references from other application features
- Other navigation mechanisms introduced later

The content currently displayed in the Work Area is the source of truth for the active Explorer object.

---

## 6. Workspace Tree Actions

### Purpose

Workspace tree hover actions provide direct access to frequent creation and navigation commands without permanently occupying tree space. Less frequent object commands are provided through contextual menus.

### Workspace Actions

Hovering or focusing the Workspace section header displays:

- New Table
- New Collection
- Switch Workspace
- Collapse All

New Table creates a Table at the Workspace root. New Collection creates a Collection at the Workspace root. Switch Workspace opens the Workspace switching interface. Collapse All collapses expanded nodes within the Workspace tree without collapsing the Workspace section itself.

### Collection Actions

Hovering or focusing a Collection displays:

- New Table

The new Table is created inside that Collection.

### Table Actions

Hovering or focusing a Table displays:

- New View

The new View belongs to that Table.

### Other Objects

Views, Queries, and Dashboards do not initially expose hover actions.

Additional hover actions should be introduced only when the corresponding operation is sufficiently frequent to justify persistent discoverability.

### Contextual Actions

Workspace tree objects support right-click context menus.Right-clicking an object makes that object the context target before opening its menu. Context-menu commands are determined by the object type.

#### Workspace

The Workspace context menu provides:

- New Collection
- New Table
- New Query
- New Dashboard
- Switch Workspace
- Duplicate
- Import
- Export
- Rename

#### Collection

The Collection context menu provides:

- New Table
- New Query
- New Dashboard
- Rename
- Duplicate
- Export
- Archive
- Move to Trash

#### Table

The Table context menu provides:

- New View
- Rename
- Duplicate
- Move
- Export
- Archive
- Move to Trash

Move allows the Table to move between the Workspace root and a Collection.

#### View

A normal View context menu provides:

- Rename
- Duplicate
- Archive
- Move to Trash

Views remain owned by their Table and do not expose a Move action.

#### All Data View

`All Data` is the required base View of every Table and uses a restricted context menu containing:

- Duplicate

`All Data` cannot be renamed, archived, or moved to Trash. Duplicating `All Data` creates a normal View belonging to the same Table.

#### Query

The Query context menu provides:

- Rename
- Duplicate
- Move
- Export
- Archive
- Move to Trash

Move allows the Query to move between the Workspace root and a Collection.

#### Dashboard

The Dashboard context menu provides:

- Rename
- Duplicate
- Move
- Export
- Archive
- Move to Trash

Move allows the Dashboard to move between the Workspace root and a Collection.

Context menus should visually group related commands using separators where appropriate. Individual Workspace tree nodes do not require an ellipsis control for access to their context menus.

---

## 7. Files Section

### Purpose

The Files section provides access to Files owned by the active Workspace.

Files remain Workspace-owned regardless of where they are referenced. Collections, Tables, Views, and attachment cells do not own separate copies of Files.

Attachment values reference Workspace Files. The same File may therefore be referenced by multiple attachment cells.

### Content

The Files section contains the Files owned by the active Workspace. Files are sorted alphabetically using case-insensitive ordering. Files are not presented as children of the Workspace navigation tree.

### Layout

Files are presented within their own collapsible Explorer section.

The Files section header follows the same visual structure as the Workspace section header and contains:

- Expand/collapse disclosure control
- Files icon
- Files label
- Contextual actions when applicable

The initial Files section does not introduce folders or another file organization hierarchy. Individual Files may use type-specific icons when File-management functionality is implemented.

The Files section header may expose an Add File action when File-management functionality is available.

### Behavior

File opening, preview, and contextual actions are defined alongside
File-management functionality.

Explorer does not assume that the structural operations available to Workspace tree objects also apply to Files.

---

## 8. Search

### Purpose

Search provides Workspace-wide discovery and navigation through a dedicated Left Panel view. Search operates across the active Workspace rather than requiring the user to choose between structural objects and table data before searching.

The Search view is intended for quickly locating content and navigating to it. A larger Search Results surface may be opened in the Work Area when additional space or context is useful.

### Content

Search contains:

- Search input
- Search options
- Optional search filters
- Search result summary
- Search results

Search may return matches from:

- Collections
- Tables
- Views
- Queries
- Dashboards
- Files
- Fields
- Records
- Cell values

Searchable File content depends on the capabilities provided by File-management functionality.

### Search Input

The Search input searches the active Workspace.

Compact search options may be presented alongside the input for text-search behavior such as:

- Match case
- Whole value or word
- Pattern or regular-expression matching

The exact search capabilities available are determined by the search implementation.

### Filters

Search supports optional filters for narrowing the current search without requiring a separate search mode.

The initial filter model may include:

- Collection
- Table
- Field
- Object or result type
- Archived content

Filters that identify Workspace objects support multiple selections where appropriate. Active filters remain visible through a compact presentation such as removable filter chips. The full filter interface does not need to remain expanded while results are being viewed.

Filters are contextual where appropriate. For example, when one or more Tables are selected, the Field filter presents Fields applicable to those Tables rather than every Field in the Workspace.

Filters reduce the set of displayed matches but do not alter the normal result ordering.

### Search State

The current Search state includes:

- Search text
- Search options
- Active filters
- Search results
- Expanded and collapsed result groups
- Result presentation mode

Switching to another Left Panel view or collapsing the Left Panel does not clear this state. Returning to Search restores the previous Search state.

---

## 9. Search Result Presentation

### Ordering

Search results follow the same structural ordering used by Explorer rather than being reordered by relevance. The Search result hierarchy is therefore a filtered projection of the Explorer hierarchy. Only branches containing matching results are displayed.

Collections retain their normal Explorer ordering. Objects within Collections and at the Workspace root retain their normal Explorer ordering. Views appear beneath their owning Tables. Table-data matches appear beneath the Table containing the matching data. Files appear according to their normal Files-section ordering.

Filters change which results are included but do not change this ordering.

### Result Summary

Search displays a compact result summary above the results. The summary communicates the number of matches and the number of sources containing those matches. The user-facing terminology for source counts may vary according to the result types represented by the search.

### Result Context

Search results display enough context for the user to understand both the match and its location. Structural Workspace objects display:

- Object name
- Object type
- Owning context when useful

For example, a matching View may display its View name together with its owning Table. A Field match displays the Field name and identifies it as a Field. A Record match displays the Record's display value or other user-facing Record identifier.

A Cell-value match displays:

- Record display value
- Field name
- Matching Cell value

Physical row position is not used as the primary identity of a Record because row position may change independently of Record identity.

### Tree View

Tree View presents results using the Workspace hierarchy and ordering used by Explorer. Table-data matches are nested beneath the appropriate Table and may use Fields and Records as contextual result levels where necessary to clearly identify the match. Expandable result groups display their match counts where appropriate.

### List View

List View presents the same matches as a flattened result list. Each result includes enough path information to identify its Workspace location.

For example, a Cell match may display:

    Kylie Reynolds
    Sales / Customers · Email · kylie@example.com

List View does not change the query, filters, result set, ordering rules, or navigation behavior. Switching between Tree View and List View is a presentation-only operation. The user's selected result presentation mode is retained as part of Search state.

---

## 10. Search Actions

### Clear Search Results

Clear Search Results clears:

- Search input
- Search options
- Active filters
- Current results

Search returns to its initial empty state.

### Open in Work Area

Open in Work Area opens the current Search as a Search Results surface in the Work Area. The Work Area Search Results surface represents the same search rather than creating a separate search operation.

The Search Results surface carries forward:

- Search text
- Search options
- Filters
- Current result set

The Left Panel and Work Area presentations remain synchronized while they represent the same active Search state. The Work Area presentation may provide additional result context and controls that are impractical within the narrower Left Panel.

Opening Search Results in the Work Area does not create a saved Query or other persistent Workspace object The Search Results surface follows normal Work Area tab behavior, including preview and pinned tab behavior.

### View as List / View as Tree

The View as List / View as Tree action toggles the Search result presentation between the two supported display modes. The action changes presentation only and does not execute a new search.

### Collapse All

Collapse All collapses all expandable Search result groups. It does not clear or modify the current Search query, filters, or results.

---

## 11. Search Navigation

### Structural Results

Selecting a structural result opens the corresponding Workspace object using the application's normal navigation behavior.

Single-click navigation uses preview behavior where the object supports Work Area navigation. Double-click navigation pins the resulting Work Area tab.

When the opened object becomes active in the Work Area, Explorer automatically reveals and activates that object according to the Explorer behavior defined by this document.

### Data Results

Selecting a Field, Record, or Cell result navigates to the Table containing the match. The application opens the appropriate Table content and reveals the matching Field, Record, or Cell. The exact Table navigation and reveal behavior is defined alongside Table and View functionality. The corresponding View displayed in the Work Area becomes active in Explorer and is automatically revealed in the Workspace tree.

### File Results

File navigation and preview behavior is defined alongside File-management functionality.

---

## 12. Search Results in the Work Area

### Purpose

The Work Area Search Results surface provides an expanded presentation of the current Search when the Left Panel does not provide sufficient space for reviewing or investigating results.

The Left Panel Search is optimized for finding and navigating. The Work Area Search Results surface is optimized for reviewing and investigating a larger result set.

### Content

The Work Area Search Results surface presents the same underlying Search state as the Left Panel.

It may provide additional horizontal and vertical space for:

- Match context
- Workspace paths
- Record context
- Field context
- Surrounding data
- Search controls
- Filters

Additional presentation detail does not change the meaning or ownership of the underlying Search.

### Behavior

Changes to the Search query, options, or filters made through either presentation are reflected by the other presentation while both represent the same Search state.

Selecting a result navigates to the corresponding Workspace object or data location. Navigating away from the Search Results tab does not destroy its Search state. Returning to the tab restores the Search Results presentation.

Search Results remain transient application state unless a separate feature explicitly converts or saves the search as a persistent Workspace object.

---

## 13. Deferred Behavior

The following behavior is intentionally deferred until its corresponding functionality is designed:

- File opening, preview, and contextual actions
- Rename workflows
- Move workflows
- Duplication workflows
- Archive and Trash workflows
- Import and export workflows
- Drag-and-drop behavior
- Advanced File grouping and filtering
- Search execution and indexing strategy
- Exact text-search capabilities
- Exact filter control presentation
- File content search capabilities
- Detailed Table navigation for Field, Record, and Cell matches
- Additional Work Area Search Results functionality
- Feature-specific loading, error, and empty states

The availability of an action may be defined by this document while the detailed workflow for performing that action remains the responsibility of its associated feature design.
