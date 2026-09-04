# Better Spreadsheet TODO

Deferred work and follow-up items that have been intentionally left out of the current development scope.

## UI / UX

### Shared Tooltip System

Implement a reusable tooltip system for application controls.

Requirements:

- Support Activity Bar, Status Bar, and other application controls.
- Organize tooltip-enabled controls into independent tooltip groups.
- Show the tooltip after a short initial hover delay.
- Once a tooltip is visible, moving directly between tooltip-enabled controls should immediately update the tooltip without another delay.
- Moving between separate tooltip groups should use the initial hover delay.
- Hide the tooltip after leaving tooltip-enabled controls.
- Reset the initial hover delay after the tooltip interaction ends.
- Support keyboard focus as well as pointer hover.
- Use Taiga UI for tooltip rendering and positioning.
- Use shared application appearance/theme variables.

### Persist Application UI State

Implement a shared application UI-state/preferences service for presentation state that should survive browser refreshes and includes:

- User-controlled panel collapsed/expanded state
- Preferred left/right panel widths
- Preferred bottom panel height
- Active Left Panel view
- Explorer expanded sections
- Explorer section resize weights
- Explorer expanded Collections per Workspace
- Explorer expanded Tables per Workspace

Do not persist transient constraint state such as constraint-driven panel collapse or actual dimensions temporarily imposed by viewport limitations.

Components should continue to consume reactive signal-based state while persistence is handled centrally rather than directly by individual components.
