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

#### Purpose

The menu bar provides persistent access to the application's primary command categories. It works together with the command bar to provide access to application commands.

#### Content

The menu bar contains:

- Primary command categories
- Flexible space
- Command bar display control

The specific command categories are defined by the application command design rather than the static application shell.

#### Layout

The menu bar is displayed as a single horizontal row directly below the title bar. Primary command categories are positioned from left to right.

Flexible space separates the command categories from the command bar display control, which is positioned at the right side of the menu bar.

#### Behavior

Selecting a menu category makes that category active.

When the command bar is configured as always visible, selecting a menu category changes the commands presented by the persistent command bar. When the command bar is configured as menu bar only, selecting a menu category temporarily displays the corresponding command bar over the application body.

The menu bar remains visible regardless of the command bar display mode. The command bar display control allows the user to change the command bar display mode.

## 3. Activity Bar

### Purpose

The activity bar provides persistent navigation between major workspace activities presented through the left panel and provides access to global application utilities.

### Content

Activity bar items are divided into two groups.

Primary workspace activities are positioned from the top of the activity bar and initially include:

- Explorer
- Search

Application utilities are positioned from the bottom of the activity bar and initially include:

- Help
- Settings

Additional activities should be introduced only when they represent a major, frequently accessed application capability.

### Layout

The activity bar is displayed as a single vertical column. Primary workspace activities are aligned from the top of the activity bar. Application utilities are aligned from the bottom.

Activity bar actions use compact icon-based controls with accessible labels and tooltips. The active workspace activity is visually distinguished using the application's standard selection and accent treatments.

### Behavior

Selecting a workspace activity makes that activity active and presents its corresponding content in the left panel. Selecting the currently active workspace activity may collapse the left panel. Selecting a workspace activity while the left panel is collapsed reopens the left panel with that activity active.

Help and Settings provide access to their respective application-level functionality. Their final presentation surface is defined by the corresponding feature design rather than by the activity bar.

The activity bar remains permanently visible regardless of left panel visibility.

## 4. Status Bar

### Purpose

The status bar provides persistent application status, problem indicators, and
contextual summary information for the active work surface.

### Content

Status bar content is divided between application status on the left and contextual information on the right.

Application status may include:

- Online and offline status
- Application problems, warnings, and errors

Contextual summary information may include values such as:

- Count
- Sum
- Average

The exact summary information presented depends on the active work surface, current selection, and available data.

### Layout

The status bar is displayed as a single horizontal row across the bottom of the application shell. Application status and problem indicators are aligned to the left. Contextual summary information is aligned to the right.

Status bar items use compact controls and indicators appropriate for the limited vertical space available.

### Behavior

The connectivity indicator reflects the application's current online or offline state.

The problems indicator reflects currently known application problems, warnings, or errors. Selecting the problems indicator opens the bottom panel and activates the appropriate problems or errors content. If the bottom panel is collapsed, it is expanded as part of this action.

Contextual summary information reflects the current selection or context of the active work surface. Available summaries depend on the selected data and may include values such as count, sum, and average.

The status bar remains permanently visible.
