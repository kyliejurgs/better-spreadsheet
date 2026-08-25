# Better Spreadsheet TODO

Deferred work and follow-up items that have been intentionally left out of the current development scope.

## UI / UX

### Shared Tooltip System

Implement a reusable tooltip system for application controls.

Requirements:

- Support Activity Bar, Status Bar, and other application controls.
- Show the tooltip after a short initial hover delay.
- Once a tooltip is visible, moving directly between tooltip-enabled controls should immediately update the tooltip without another delay.
- Hide the tooltip after leaving tooltip-enabled controls.
- Reset the initial hover delay after the tooltip interaction ends.
- Support keyboard focus as well as pointer hover.
- Use shared application appearance/theme variables.
