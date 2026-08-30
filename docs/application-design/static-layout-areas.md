# Better Spreadsheet — Static Layout Areas

**Status:** In Progress
**Purpose:** Defines the content, visual design, and behavior of the permanently visible areas of the Better Spreadsheet application shell.

---

## 1. Logo Area

### Purpose

The logo area provides persistent Better Spreadsheet branding within the application shell.

### Content

The Logo Area contains an instance of the reusable Better Spreadsheet logo component. The logo component supports resizing and recoloring, allowing its presentation to adapt to the application surface in which it is used.

### Layout

The logo area aligns with the application header vertically and the activity bar horizontally. Its dimensions are derived from those adjacent shell regions as defined by the application layout configurations.

The logo is centered horizontally and vertically within the logo area. The displayed logo size should be determined relative to the available size of the logo area rather than treated as an independent fixed application dimension. The logo should maintain its aspect ration and appropriate spacing from the boundaries of the logo area.

### Behavior

The Logo Area is permanently visible and does not resize or collapse and does not currently provide an interactive application command.

## 2. Application Header

### 2.1 Title Bar

#### Purpose

The title bar provides persistent application and workspace identity alone with frequently used global actions. It follows the compact document-header pattern common to desktop productivity and spreadsheet applications.

#### Content

The title bar contains, from left to right:

- Application name
- Undo action
- Redo action
- Current workspace name
- Workspace persistence/save status
- Flexible space
- Share action
- User profile

Additional global actions may be introduced when justified by application requirements.

#### Layout

All title bar content is presented on a single horizontal line. The application name appears first, followed by undo and redo actions. The current workspace name follows the editing actions and is visually more prominent than its persistence status, which appears immediately after the workspace name and may display information such as last update time or an active saving state.

Flexible space separates workspace information from collaboration and account actions. Share and user profile controls are positioned at the right side of the title bar.

#### Behavior

Undo and redo operate on the application's current undo and redo state and reflect whether those actions are currently available.

The workspace persistence status reflects the current persistence and may change as workspace changes are saved.

The share action provides access to workspace sharing, exporting, and collaboration functionality.

The user profile control provides access to account-related functionality.

### 2.2 Menu Bar

## 3. Activity Bar

## 4. Status Bar
