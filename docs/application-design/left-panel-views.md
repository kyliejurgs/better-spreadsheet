# Better Spreadsheet — Left Panel Views

**Status:** In Progress
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

The Explorer header displays the Explorer title and any Explorer-level contextual actions. Below the header, Explorer sections occupy the available vertical space.

The Workspace section contains the workspace navigation tree. The tree is implemented using Taiga UI Tree. The Files section provides a separate presentation of Workspace-owned Files.

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

The Workspace name is displayed in the Workspace section header. The Workspace section header also acts as the control for expanding and collapsing the section.

Workspace actions are displayed on the right side of the section header when the header is hovered or focused. The action area takes priority over the available workspace-name display width. The workspace name may therefore truncate when necessary to keep the actions accessible.

The tree uses object-specific icons to distinguish Collections, Tables, Views, Queries, and Dashboards.

### Ordering

Workspace tree content uses automatic case-insensitive alphabetical ordering. At the Workspace root:

1. Collections appear first and are sorted alphabetically.
2. Tables, Queries, and Dashboards follow and are sorted together alphabetically.

Inside a Collection, Tables, Queries, and Dashboards are sorted together alphabetically. Inside a Table, `All Data` always appears first. Remaining Views are sorted alphabetically.

Object type does not otherwise affect ordering.

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

The initial Files section does not introduce folders or another file organization hierarchy. The Files section header may expose an Add File action when File-management functionality is available.

### Behavior

File opening, preview, and contextual actions are defined alongside
File-management functionality.

Explorer does not assume that the structural operations available to Workspace tree objects also apply to Files.

---

## 8. Search

### Purpose

Search provides workspace search functionality through a dedicated Left Panel view.

### Behavior

Search follows the shared Left Panel behavior defined by this document.

Search retains its query and result state when another Left Panel view becomes active or when the Left Panel is collapsed.

Detailed Search layout, filtering, result presentation, and navigation behavior are defined when Search functionality is implemented.

---

## 9. Deferred Behavior

The following behavior is intentionally deferred until its corresponding functionality is designed:

- File opening, preview, and contextual actions
- Rename workflows
- Move workflows
- Duplication workflows
- Archive and Trash workflows
- Import and export workflows
- Drag-and-drop behavior
- Advanced File grouping and filtering
- Detailed Search behavior
- Feature-specific loading, error, and empty states

The availability of an action may be defined by this document while the detailed workflow for performing that action remains the responsibility of its associated feature design.
