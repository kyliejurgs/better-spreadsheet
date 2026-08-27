# Better Spreadsheet - Application Layout

**Status:** Defined
**Purpose:** Defines the structure, sizing, resizing, collapse behavior, persistence, and viewport behavior of the Better Spreadsheet application shell.

---

## 1. Layout Structure

The application shell consists of the following regions:

- Logo Area
- Application Header
  - Title Bar
  - Menu Bar
- Activity Bar
- Left Panel
- Center Area
  - Work Area
    - Tab Bar
    - Work Surface
  - Bottom Panel
- Right Panel
- Status Bar

The shell is arranged as follows:

    ┌────────┬─────────────────────────────────────────────────────────────────────┐
    │ LOGO   │ TITLE BAR                                                           │
    │ AREA   ├─────────────────────────────────────────────────────────────────────┤
    │        │ MENU BAR                                                            │
    ├────────┼─────────────────┬─────────────────────────────┬─────────────────────┤
    │        │                 │ TAB BAR                     │                     │
    │        │                 ├─────────────────────────────┤                     │
    │ ACT.   │ LEFT PANEL      │                             │ RIGHT PANEL         │
    │ BAR    │                 │        WORK SURFACE         │                     │
    │        │                 │                             │                     │
    │        │                 ├─────────────────────────────┤                     │
    │        │                 │ BOTTOM PANEL                │                     │
    ├────────┴─────────────────┴─────────────────────────────┴─────────────────────┤
    │ STATUS BAR                                                                   │
    └──────────────────────────────────────────────────────────────────────────────┘

The Left Panel and Right Panel span the full body height between the Application Header and Status Bar.

The Bottom Panel belongs to the Center Area and spans only the width of the Center Area. It does not extend beneath the Activity Bar, Left Panel, or Right Panel.

The Tab Bar belongs to the Work Area rather than being a separate top-level application layout region.

---

## 2. Fixed Dimensions

The application shell defines the following independent fixed dimensions:

- Title Bar height
- Menu Bar height
- Activity Bar width
- Status Bar height
- Tab Bar height

The Application Header height is derived from its children:

    applicationHeaderHeight = titleBarHeight + menuBarHeight

The Logo Area dimensions are derived from adjacent shell regions:

    logoWidth  = activityBarWidth
    logoHeight = applicationHeaderHeight

This ensures that the Logo Area aligns exactly with both the Application Header and Activity Bar. The fixed shell regions do not resize in response to panel resizing or viewport constraints.

---

## 3. Resizable Regions

Three application regions are user-resizable:

- Left Panel — width
- Right Panel — width
- Bottom Panel — height

The Work Area does not have a user-controlled width or height. It consumes the remaining available Center Area space after fixed and resizable regions have been allocated.

Each resizable panel defines:

- Default dimension
- Minimum expanded dimension

No configured maximum width or height is defined. The maximum dimension available to a panel is determined dynamically from the current application dimensions and the minimum dimensions required by other regions.

The Work Area defines:

- Minimum width
- Minimum height

---

## 4. Resize Constraints and Priority

### 4.1 Horizontal Resizing

The Work Area minimum width is always protected.

When the user expands the Left Panel:

1. The Left Panel expands.
2. Available Work Area width is consumed.
3. Once the Work Area reaches its minimum width, the Right Panel begins shrinking.
4. If the Right Panel would fall below its minimum expanded width, it collapses.
5. The Left Panel may continue expanding using the space released by the collapsed Right Panel.
6. Resizing stops when no additional space can be allocated without reducing the Work Area below its minimum width.

The Right Panel behaves symmetrically:

1. The Right Panel expands.
2. Available Work Area width is consumed.
3. Once the Work Area reaches its minimum width, the Left Panel begins shrinking.
4. If the Left Panel would fall below its minimum expanded width, it collapses.
5. The Right Panel may continue expanding using the released space.
6. Resizing stops when the Work Area minimum width prevents further expansion.

The panel actively being resized therefore has priority over the opposite side panel. The Work Area must never be reduced below its minimum width by side-panel resizing.

### 4.2 Bottom Panel Resizing

When the user expands the Bottom Panel:

1. The Bottom Panel expands.
2. The Work Area shrinks vertically.
3. The Work Area may shrink to its minimum height.
4. Continuing to expand the Bottom Panel beyond this point collapses the entire Work Area.
5. The Tab Bar collapses with the Work Area.
6. The Bottom Panel may then continue expanding into the released vertical space.

This Work Area collapse behavior applies specifically to intentional Bottom Panel resizing. When the Bottom Panel is subsequently resized downward and sufficient vertical space becomes available, the Work Area and Tab Bar automatically return.

---

## 5. Collapse and Restore Behavior

### 5.1 Valid Panel States

Resizable panels have two valid resting states:

    collapsed
    minimum expanded dimension ... available maximum dimension

A panel does not remain in a stable expanded state below its minimum expanded dimension.

### 5.2 Explicit Collapse

The Left Panel, Right Panel, and Bottom Panel may each be explicitly collapsed. Collapsing a panel removes its allocated width or height from the layout. Reopening a panel attempts to restore the last dimension intentionally selected by the user.

### 5.3 Drag-to-Collapse

Dragging a panel below its minimum expanded dimension may collapse the panel. Dimensions between zero and the minimum expanded dimension may be represented transiently during the resize gesture but are not valid resting layout states.

A collapsed panel may also be reopened through an outward resize gesture. Once the gesture crosses the minimum expanded dimension, the panel becomes expanded and continues resizing normally.

### 5.4 Constraint-Driven Side-Panel Collapse

Expanding one side panel may force the opposite side panel to collapse when:

- Work Area has reached its minimum width
- Opposite panel can no longer maintain its minimum expanded width

Constraint-driven resizing or collapse does not overwrite the opposite panel's preferred width.

### 5.5 Work Area Collapse

The Work Area is not independently user-collapsible. It may collapse only as a consequence of the user intentionally expanding the Bottom Panel beyond the Work Area minimum-height threshold.

The Work Area and Tab Bar restore automatically when the Bottom Panel is resized downward and sufficient space becomes available. The Work Area collapsed state is therefore derived from the Bottom Panel resize state rather than being an independent user preference.

---

## 6. Panel Geometry and Resize Handles

The following primary application surfaces use subtle, lightly contrasting, rounded rectangular outlines:

- Left Panel
- Work Area
- Right Panel
- Bottom Panel

These outlines visually distinguish major application surfaces without creating heavy separation between regions.

The following shell regions are treated as application shell rather than outlined panel surfaces:

- Logo Area
- Application Header
- Activity Bar
- Status Bar

### 6.1 Resize Handle Placement

Resize handles are located on the shared boundaries of resizable panels:

- Left Panel — right edge
- Right Panel — left edge
- Bottom Panel — top edge

Side-panel resize handles span the body height. The Bottom Panel resize handle spans only the Center Area width.

### 6.2 Resize Handle Appearance

Resize handles use a subtle border-integrated treatment inspired by modern desktop development tools.

Each handle consists of:

- Normal thin panel boundary
- Subtle dotted or grip-style drag indicator integrated into the boundary

The handle must not appear as a large dedicated splitter region. The visible handle may remain thin while its pointer hit target extends beyond the visible boundary to make resizing easier.

### 6.3 Resize Handle Interaction

Horizontal handles use the horizontal resize cursor. Vertical handles use the vertical resize cursor.

When a handle is hovered or actively dragged:

- Resize affordance becomes more visually prominent
- Active boundary uses the application's accent treatment
- Active state remains visible throughout the drag interaction

Resize handles do not consume additional structural layout space. When a panel is collapsed, its panel surface and associated boundary disappear rather than leaving an empty outlined strip in the layout.

---

## 7. Visibility and Control Behavior

### 7.1 Left Panel

The Activity Bar controls the active context and visibility of the Left Panel.

Selecting an Activity Bar item while the Left Panel is open changes the panel to that context. Selecting the currently active Activity Bar item may collapse the Left Panel. Selecting an Activity Bar item while the Left Panel is collapsed reopens the panel using that context.

Collapsing the Left Panel does not clear its active context.

### 7.2 Right Panel

The Right Panel is independent of the Activity Bar. It provides contextual application interfaces related to the active content or selection. Collapsing the Right Panel does not clear its current context.

Features may request that the Right Panel open to a particular context without the Application Layout needing to understand that feature's behavior.

### 7.3 Bottom Panel

The Bottom Panel may contain multiple contextual panes. Its active pane is remembered when the panel is collapsed. Selecting a Bottom Panel pane while the panel is collapsed may reopen the panel directly to that pane.

Application features such as status indicators may request that the Bottom Panel open to a specific pane.

### 7.4 Shell Commands

The application provides independent layout commands for toggling the left, right, and bottom panels.

These commands may later be exposed through menus, keyboard shortcuts, command surfaces, or other application controls. The Application Layout does not depend on which interface invokes the command.

### 7.5 Permanently Visible Shell Regions

The following regions are normally always visible:

- Logo Area
- Application Header
- Activity Bar
- Status Bar

The Tab Bar and Work Surface are visible whenever the Work Area is visible. The Work Area may disappear only through the Bottom Panel resize behavior defined by this document.

---

## 8. Layout Persistence

The layout distinguishes between a user's preferred layout and the effective layout that can currently be rendered.

### 8.1 Preferred Dimensions

The preferred dimension represents the last size intentionally selected by the user for that panel.

The Left Panel stores a preferred width. The Right Panel stores a preferred width. The Bottom Panel stores a preferred height.

Only intentional resizing of a panel's own resize handle changes that panel's preferred dimension.

### 8.2 Effective Dimensions

Effective dimensions represent the sizes the current application dimensions and layout constraints allow.

For example:

    Right preferred width = 350px
    Right effective width = 200px

may occur when another panel requires additional space.

Constraint-driven changes to effective dimensions do not modify preferred dimensions. When sufficient space becomes available again, constrained panels may grow back toward their preferred dimensions.

### 8.3 Collapse Persistence

Explicit user collapse state is part of the user's preferred layout.

Constraint-driven effective collapse does not destroy the panel's preferred dimension. A panel that is effectively collapsed because of viewport constraints may return when sufficient space becomes available.

### 8.4 Persisted Layout State

The following user layout preferences should survive application reloads:

    Left Panel
    ├── preferred width
    ├── preferred collapsed/open state
    └── active context

    Right Panel
    ├── preferred width
    ├── preferred collapsed/open state
    └── active context

    Bottom Panel
    ├── preferred height
    ├── preferred collapsed/open state
    └── active pane

Derived layout dimensions are not persisted. The following are calculated at runtime:

- Effective Left Panel width
- Effective Right Panel width
- Effective Bottom Panel height
- Work Area width
- Work Area height
- Constraint-driven panel collapse
- Work Area collapse caused by Bottom Panel resizing

The governing persistence principle is:

> Persist user intent; derive the effective layout.

---

## 9. Viewport Constraints

### 9.1 Horizontal Viewport Resizing

The Work Area minimum width is always protected when the application viewport changes width. As horizontal space becomes constrained:

- Work Area may shrink to its minimum width
- Side panels may be reduced from their preferred widths
- Side panels may collapse when they can no longer maintain their minimum expanded widths
- Work Area must never be reduced below its minimum width

Viewport-driven side-panel constraints do not overwrite the panels' preferred dimensions. As horizontal space returns, constrained panels may return toward their preferred widths.

A panel explicitly collapsed by the user remains collapsed.

### 9.2 Vertical Viewport Resizing

Vertical viewport resizing does not automatically collapse the Work Area or Bottom Panel. As application height decreases:

1. The Work Area may shrink toward its minimum height.
2. Once the Work Area reaches its minimum height, the expanded Bottom Panel may shrink toward its minimum height.
3. Once both regions have reached their minimum heights, the layout stops reducing their dimensions.

The application therefore has a minimum supported vertical layout determined by its fixed shell dimensions and the minimum heights of the currently expanded regions.

This differs intentionally from direct Bottom Panel resizing. Direct Bottom Panel resizing may collapse the Work Area when the user intentionally expands the Bottom Panel beyond the Work Area minimum-height threshold. Viewport resizing never triggers that collapse behavior.

### 9.3 Fixed Regions Under Viewport Constraints

Fixed shell dimensions remain fixed under viewport constraints.

The application does not respond to insufficient space by arbitrarily shrinking:

- Application Header
- Logo Area
- Activity Bar
- Tab Bar
- Status Bar

---

## 10. Structural Responsibilities and State Ownership

### 10.1 Application Layout

The Application Layout owns shell geometry and coordination. Its responsibilities include:

- Arranging top-level shell regions
- Calculating available layout space
- Coordinating Left and Right Panel sizing
- Coordinating Bottom Panel and Work Area sizing
- Enforcing minimum dimensions
- Applying resize priority rules
- Calculating effective panel dimensions
- Calculating constraint-driven collapse states
- Responding to viewport changes

The Application Layout does not own feature-specific behavior or content.

### 10.2 Resizable Panels

The Left Panel, Right Panel, and Bottom Panel own their presentation and content. They expose their resize boundaries but do not independently determine cross-panel resize behavior.

Cross-panel resize behavior is coordinated by the Application Layout because resizing one region may affect other regions.

### 10.3 Work Area

The Work Area owns:

- Fixed-height Tab Bar
- Flexible Work Surface

The Work Area does not calculate its own shell dimensions. The Application Layout determines the space available to the Work Area.

### 10.4 Fixed Shell Regions

The following fixed shell regions render within dimensions established by the application layout configuration:

- Logo Area
- Application Header
  - Title Bar
  - Menu Bar
- Activity Bar
- Status Bar

These regions do not participate directly in resizing.

### 10.5 Layout Configuration

Application layout configuration defines fixed dimensions, default resizable dimensions, and minimum dimensions.

Conceptually:

    Fixed
    ├── titleBarHeight
    ├── menuBarHeight
    ├── activityBarWidth
    ├── statusBarHeight
    └── tabBarHeight

    Left Panel
    ├── defaultWidth
    └── minWidth

    Right Panel
    ├── defaultWidth
    └── minWidth

    Bottom Panel
    ├── defaultHeight
    └── minHeight

    Work Area
    ├── minWidth
    └── minHeight

The Logo Area dimensions are derived rather than independently configured:

    logoWidth  = activityBarWidth
    logoHeight = titleBarHeight + menuBarHeight

Maximum panel dimensions are not configured. They are calculated dynamically from the current available application space.

### 10.6 Preferred and Effective Layout State

User preference state and effective runtime layout state remain conceptually separate.

Preferred state represents what the user selected:

    Left Panel
    ├── preferredWidth
    ├── preferredCollapsed
    └── activeContext

    Right Panel
    ├── preferredWidth
    ├── preferredCollapsed
    └── activeContext

    Bottom Panel
    ├── preferredHeight
    ├── preferredCollapsed
    └── activePane

Effective state represents what the current application dimensions can support:

    Left Panel
    ├── effectiveWidth
    └── effectiveCollapsed

    Right Panel
    ├── effectiveWidth
    └── effectiveCollapsed

    Bottom Panel
    └── effectiveHeight

    Work Area
    ├── effectiveWidth
    ├── effectiveHeight
    └── collapsedByBottomResize

Constraint-driven resizing of one panel must not overwrite another panel's preferred dimension.

The effective layout is derived from:

- Application layout configuration
- User layout preferences
- Current viewport dimensions
- Current resize interaction
- Resize priority and collapse rules defined by this document
