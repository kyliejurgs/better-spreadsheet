# Better Spreadsheet — Work Area

**Status:** Defined
**Purpose:** Defines the content hosting, tab management, navigation state, persistence, and interaction model of the Better Spreadsheet Work Area.

---

## 1. Purpose

The Work Area is the primary content region of Better Spreadsheet.

It hosts the active workspace content and provides tab-based navigation between open resources. The Work Area coordinates which resource is active but does not own the feature-specific implementation of the content being displayed.

The Work Area consists of:

- Tab Bar
- Work Surface

The Tab Bar manages navigation between open resources while the Work Surface hosts the feature surface associated with the active tab.

Examples of feature surfaces include:

- Grid
- Query
- Dashboard
- File viewer or editor

The Work Area does not implement these feature surfaces directly.

---

## 2. Structure

The Work Area is arranged as:

```
Work Area
├── Tab Bar
└── Work Surface
    └── Active Feature Surface
```

Only one tab is active at a time. The active tab determines the content presented within the Work Surface. When no tab is active, the Work Surface presents the Work Area empty state.

Work Area sizing, minimum dimensions, and interaction with the Bottom Panel are defined by the Application Layout. The Work Area does not independently control its application-shell dimensions or collapse behavior.

---

## 3. Openable Resources

The following Workspace resources may be opened as Work Area tabs:

- Views
- Queries
- Dashboards
- Supported Files

Collections do not open in the Work Area. Workspaces do not open as tabs. Each Workspace instead owns an independent set of Work Area tabs.

Tables participate in Work Area navigation but do not directly create Table tabs. Opening a Table resolves the View that should represent that Table. Unsupported File types do not create Work Area tabs.

---

## 4. Table and View Navigation

### 4.1 Views as Table Content

A View is the Work Area presentation of Table data. For Table-based content, Work Area tabs therefore represent Views rather than Tables. A Table may own multiple Views, including a default View representing the Table's standard or complete data presentation.

### 4.2 Opening a View

Opening a View opens that specific View. If the View already has an open tab in the active Workspace, the existing tab is activated instead of creating another tab. Opening the View also makes it the last-used View for its owning Table.

### 4.3 Opening a Table

Opening a Table resolves a View using the following priority:

1. The Table's persisted last-used View, when one exists and remains valid.
2. The Table's default View.

The resolved View is then opened using the normal View-opening behavior. Therefore, opening a Table whose resolved View is already open activates the existing View tab rather than creating another tab.

### 4.4 Last-Used View

Last-used View is user navigation state rather than Table domain configuration. The last-used View for each Table persists across application reloads.

If the remembered View no longer exists, no longer belongs to the Table, or is otherwise unavailable, it is considered invalid and the Table's default View is used instead.

Changing a Table's last-used View does not change its configured default View.

---

## 5. Tab Identity

A resource may have at most one open tab within a Workspace. Opening a resource that already has an open tab activates the existing tab.

Tab identity is based on the underlying openable resource and its owning Workspace rather than its current display label or its position within the Tab Bar. This prevents duplicate tabs from being created when the same resource is opened repeatedly through Explorer or another navigation surface.

---

## 6. Tab Ordering

### 6.1 Opening New Tabs

When a new tab is opened while another tab is active, the new tab is inserted immediately to the right of the active tab.

For example:

```
[ A ] [ B* ] [ C ]
```

Opening D produces:

```
[ A ] [ B ] [ D* ] [ C ]
```

When no existing tab provides an insertion position, the new tab is added to the available tab sequence. Opening an already-open resource activates its existing tab without changing its position.

### 6.2 Manual Reordering

Tabs may be reordered through drag-and-drop. Reordering changes the persisted tab order for the active Workspace. Activating a tab does not otherwise change its position.

---

## 7. Active Tab

Exactly one open tab may be active within the current Workspace. Selecting a tab makes it active and displays its feature surface within the Work Surface. Opening a new resource makes its tab active. Opening an already-open resource makes its existing tab active.

The Work Area tracks tab activation history so that recently used tabs can be restored when the active tab is closed.

---

## 8. Closing Tabs

### 8.1 Close Controls

Every tab provides a visible close control. Tabs may also be closed using a middle mouse button click.

A tab context menu provides:

- Close
- Close Others
- Close All

Additional tab-management commands may be introduced later when needed.

### 8.2 Closing the Active Tab

When the active tab is closed, the Work Area first attempts to activate the most recently used remaining tab. If no valid recently used tab is available, the Work Area activates:

1. The tab immediately to the right of the closed tab, when one exists.
2. Otherwise, the tab immediately to the left.

If no tabs remain, there is no active tab and the Work Surface presents the empty state.

### 8.3 Closing an Inactive Tab

Closing an inactive tab does not change the active tab.

### 8.4 Close Others

Close Others closes every tab in the active Workspace except the selected tab. The selected tab becomes or remains active.

### 8.5 Close All

Close All closes every tab in the active Workspace. The Work Area then has no active tab and presents its empty state.

Closing tabs affects Work Area navigation state only. Because feature content uses automatic persistence, closing a tab does not represent discarding unsaved document changes.

---

## 9. Tab Labels

Tab labels identify the open resource while remaining compact enough for navigation.

### 9.1 Table Default View

When a tab represents the Table's default full-data View, the tab displays the Table name rather than the View name.

For example:

```
Table: Inventory
Default View: All Data
```

is displayed as:

```
Inventory
```

This behavior is based on the View's semantic role as the Table's default full-data presentation rather than on the literal View name. Renaming the View does not change this behavior.

### 9.2 Other Views

A non-default View normally displays its View name.

For example:

```
Low Stock
```

### 9.3 Ambiguous View Names

When multiple open View tabs would otherwise display the same View name, the labels are disambiguated using the owning Table name.

For example:

```
Low Stock (Inventory)
Low Stock (Ingredients)
```

Disambiguation is applied when necessary rather than permanently adding Table names to all View tabs.

### 9.4 Other Resource Types

Queries, Dashboards, and supported Files use their resource names as their primary tab labels. Additional disambiguation rules may be defined for these resource types if naming collisions require them.

---

## 10. Tab Overflow

The Tab Bar uses the available Work Area width. As additional tabs are opened, tabs may shrink until they reach the defined minimum tab width. Once the available width can no longer display all tabs at or above their minimum width, the Tab Bar becomes horizontally scrollable.

Tabs do not shrink below their minimum usable width solely to keep all tabs simultaneously visible. The active tab should remain reachable and visible through normal Tab Bar navigation. Additional tab-navigation interfaces, such as an open-tabs list, may be introduced later without changing the underlying tab model.

---

## 11. Workspace Tab Sets

Each Workspace owns an independent Work Area tab set.

Workspace Work Area state includes:

- Open tabs
- Active tab
- Tab order
- Tab activation history needed for active-tab restoration

Switching Workspaces replaces the visible tab set with the tab set belonging to the newly active Workspace.

For example:

```
Restaurant Operations
├── Inventory
├── Open Orders
└── Suppliers

Personal Budget
├── Transactions
└── Monthly Budget
```

Switching from Restaurant Operations to Personal Budget displays the Personal Budget tab set without closing or modifying the Restaurant Operations tabs. Returning to Restaurant Operations restores its existing Work Area state.

---

## 12. Persistence

Work Area navigation state represents persistent user intent.

The following state persists across application reloads:

```
Workspace
└── Work Area
    ├── open tabs
    ├── active tab
    └── tab order
```

Table navigation state additionally persists:

```
Table
└── last-used View
```

Tab activation history may be persisted when necessary to preserve most-recently-used close behavior across reloads. The implementation may alternatively reconstruct sufficient activation state during restoration when equivalent behavior can be maintained.

Feature content displayed within the Work Surface owns persistence of its own data and configuration. The Work Area does not duplicate feature or domain data solely for tab restoration. Persisted tabs retain sufficient resource identity to resolve the current resource from the Workspace data model when restored.

If a persisted tab references a resource that no longer exists or is no longer available, that tab is omitted during restoration.

---

## 13. Automatic Content Persistence

Work Area feature content uses automatic persistence. Tabs do not use a document-style dirty or unsaved indicator as part of the standard Work Area interaction model. Closing a tab therefore does not normally require a save or discard confirmation.

Individual feature surfaces remain responsible for ensuring their changes are durably persisted according to their own data-management rules. If a future feature introduces an operation that cannot safely use automatic persistence, that feature must explicitly define its exceptional close behavior rather than changing the default Work Area model.

---

## 14. Empty State

When the current Workspace has no active tab, the Work Surface displays an intentional empty state. The initial empty state provides lightweight guidance directing the user toward openable Workspace content. It may indicate that Views, Tables, Queries, Dashboards, or supported Files can be opened through application navigation.

The empty state is not itself a tab. The initial implementation does not require a dashboard, recent-items interface, or application home experience. These may be introduced later without changing the Work Area tab model.

---

## 15. Explorer Integration

Explorer is a navigation source for Work Area content. Explorer defines its own row interaction and opening behavior. The Work Area does not redefine Explorer click, double-click, disclosure, or selection semantics.

When Explorer requests that an openable resource be opened, the Work Area applies the resource-opening rules defined by this document. This separation allows Explorer to own navigation presentation while Work Area owns tab lifecycle and active-content navigation. Other application features may later request that resources be opened without depending on Explorer.

---

## 16. Work Surface

### 16.1 Purpose

The Work Surface is the content-hosting portion of the Work Area. It displays the feature surface associated with the active tab.

### 16.2 Feature Ownership

The Work Surface acts as a container rather than implementing every supported content type itself.

Conceptually:

```
Work Surface
├── Grid Surface
├── Query Surface
├── Dashboard Surface
└── File Surface
```

Only the feature surface associated with the active tab is presented.

The individual feature owns its internal:

- Rendering
- Editing behavior
- Commands
- Selection
- Data interaction
- Feature-specific state
- Persistence

The Work Area owns:

- Open-resource navigation
- Tab lifecycle
- Tab ordering
- Active tab
- Workspace tab sets
- Work Surface content selection

This prevents Work Area navigation concerns from becoming coupled to Grid, Query, Dashboard, or File implementation details.

---

## 17. Tab Bar Responsibility

The Tab Bar is the visual navigation interface for the current Workspace's open resources. It is responsible for presenting:

- Open tabs
- Active-tab state
- Tab labels
- Close controls
- Tab reordering
- Tab context menus
- Horizontal tab overflow and scrolling

The Tab Bar does not own the underlying Workspace resources. Tab actions operate through Work Area navigation state rather than directly modifying Table, View, Query, Dashboard, or File domain objects.

---

## 18. State Ownership

### 18.1 Work Area State

The Work Area owns navigation state required to manage open resources.

This includes:

- Open resource identities
- Active resource identity
- Tab order
- Tab activation history
- Workspace-specific tab sets

### 18.2 Table Navigation State

The persisted last-used View for a Table is user navigation state. It does not modify the Table's configured default View.

### 18.3 Domain State

Tables, Views, Queries, Dashboards, Files, records, fields, and other Workspace resources remain owned by the application domain and persistence layers. The Work Area references these resources by identity and resolves their current data when required. Domain objects are not copied into Work Area tab state.

### 18.4 Feature State

Feature-specific presentation and interaction state belongs to the corresponding feature unless explicitly promoted to shared Work Area navigation state. For example, Grid selection behavior belongs to the Grid rather than the Work Area.

---

## 19. Design Principles

The Work Area follows these governing principles:

> Tabs represent open resources, not copies of domain objects.

> Opening an already-open resource navigates to it rather than duplicating it.

> Table navigation resolves the user's last-used View before falling back to the Table's default View.

> Each Workspace preserves its own working context.

> User navigation intent survives reloads.

> Feature content persists automatically rather than relying on document-style save state.

> The Work Area coordinates active content but does not implement the content itself.

> Explorer owns Explorer interaction; Work Area owns what happens once a resource is opened.

> Persist resource identity and navigation state; resolve current domain data from the Workspace model.
