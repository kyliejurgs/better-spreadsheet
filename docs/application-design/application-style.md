# Better Spreadsheet — Application Style

**Status:** Defined
**Purpose:** Defines the general visual language and styling principles of the Better Spreadsheet application.

---

## 1. Design Direction

Better Spreadsheet is a desktop-style productivity application designed for dense, efficient, long-running workflows.

The interface should feel

- clean
- compact
- structured
- modern
- professional
- responsive to interaction
- visually consistent across application surfaces

The application may draw inspiration from established desktop productivity and development tools without attempting to reproduce the visual identity of any particular product. Visual design should prioritize the application's usability and information hierarchy over decorative styling.

---

## 2. Interface Density

Better Spreadsheet is primarily designed as a desktop application interface rather than a mobile-first or content-oriented website.

The interface should favor efficient use of available space. Controls, navigation surfaces, menus, panels, toolbars, and other application shell areas should generally use compact spacing appropriate for frequent interaction.

Avoid unnecessarily large:

- padding
- margins
- controls
- headers
- empty areas

Compactness must not compromise readability, accessibility, or reliable pointer interaction. Content-oriented surfaces such as welcome pages, documentation, help content, and empty states may use more generous spacing when appropriate.

---

## 3. Application Surfaces

The interface distinguishes between application shell areas and primary application surfaces.

### 3.1 Application Shell

Application shell areas include structural interface regions such as:

- Logo Area
- Application Header
- Activity Bar
- Status Bar
- menus
- toolbars
- other persistent navigation or command surfaces

Application shell areas should visually support the primary content rather than compete with it.

### 3.2 Primary Surfaces

Primary surfaces contain substantial application content or contextual tools. Examples include:

- Left Panel
- Work Area
- Right Panel
- Bottom Panel
- dialogs
- other substantial content containers

Primary surfaces should have clear visual boundaries while remaining visually integrated with the application shell. Major shell surfaces use subtle, lightly contrasting outlines and small rounded corners. Borders should provide enough separation to make application regions understandable without making the interface appear heavily boxed or fragmented.

---

## 4. Visual Hierarchy

Visual hierarchy should primarily be created through:

- surface relationships
- typography
- spacing
- borders
- interaction states
- restrained use of color

Avoid relying on large differences in size or excessive decorative styling to establish hierarchy.

Primary work content should remain visually dominant over surrounding application shell areas. Supporting interfaces should become visually prominent when relevant and recede when they are not active.

---

## 5. Light and Dark Appearance

Better Spreadsheet supports both light and dark application appearances.

Both appearances are first-class application experiences. Neither appearance should be treated as a simple inversion or secondary variation of the other.

Each appearance should provide appropriate:

- application backgrounds
- surface backgrounds
- borders
- text contrast
- control states
- selection states
- focus states
- disabled states
- semantic states

Application structure and visual hierarchy should remain consistent between appearances. Individual components should not contain independent light-versus-dark styling logic when the same behavior can be expressed through shared theme primitives.

---

## 6. Accent Color

Better Spreadsheet supports an application accent color. The accent color should communicate interaction and emphasis rather than act as a dominant background color throughout the interface.

Appropriate uses include:

- active navigation
- selected items
- focus indicators
- active resize handles
- active controls
- important interactive highlights
- other states requiring clear emphasis

Avoid applying the accent color to large application surfaces without a specific design reason. Accent usage should remain visually effective across both light and dark appearances. Changing the accent color must not change the meaning of semantic states such as error, warning, or success.

---

## 7. Color and Semantic Meaning

Color should be used intentionally.

Semantic colors may represent states such as:

- error
- warning
- success
- informational status

Semantic meaning must remain consistent throughout the application. Color must not be the only mechanism used to communicate important state or meaning. Where appropriate, combine color with:

- icons
- text
- shape
- position
- other visual indicators

Application surfaces should generally use restrained neutral colors so content and interactive states remain visually prominent.

---

## 8. Borders and Corners

Borders should generally be subtle and lower contrast than primary text or active controls.

Use borders to communicate:

- surface boundaries
- separation
- focus
- active resizing
- selection where appropriate

Major application panels use small, consistent corner radii. Corner radii should remain restrained. Better Spreadsheet should not adopt heavily rounded, card-oriented styling for general application structure.

Controls may use the established component and theme treatment appropriate to their function. Active or hovered resize boundaries may use stronger contrast or the application accent treatment.

---

## 9. Spacing

Spacing should follow a consistent application rhythm. Prefer a small reusable set of spacing values rather than arbitrary component-specific measurements. Application shell areas should generally use compact spacing.

Spacing should communicate relationships:

- tightly related controls remain visually grouped
- unrelated groups receive additional separation
- nested content should communicate hierarchy without excessive indentation
- repeated structures should use consistent spacing

Avoid using empty space solely as decoration. Exact spacing values should be established as the application design system develops rather than defined independently by individual components.

---

## 10. Typography

Typography should prioritize readability at desktop application densities. Use a consistent application UI typeface unless a particular content surface has a specific requirement.

Typography should establish a restrained hierarchy for:

- application titles
- panel titles
- section headings
- controls
- labels
- primary content
- supporting or secondary information

Avoid excessive variation in:

- font families
- font sizes
- font weights
- letter spacing

Font weight and size should communicate hierarchy without making application shell areas visually overpowering. Data-oriented surfaces may use specialized typography where it materially improves readability or alignment.

---

## 11. Icons

Icons should use a consistent visual language within a given interface context.

Icon selection should prioritize:

1. clarity
2. consistency
3. compactness
4. familiarity

Use icons where they reduce visual noise or make frequently used actions easier to identify. Do not use an icon-only control when the meaning would be unclear without additional context. Icon-only controls with non-obvious meaning should provide an accessible label and appropriate tooltip.

Icons used together should maintain consistent:

- apparent size
- alignment
- stroke or visual weight
- interaction treatment

Avoid mixing visually incompatible icon styles within the same control group unless a required icon is unavailable and the alternative remains visually appropriate.

---

## 12. Controls

Use the project's selected general-purpose UI component library for commodity controls when its components satisfy application requirements.

Examples include:

- buttons
- inputs
- selectors
- menus
- tooltips
- dialogs
- overlays
- common form controls

Library components should be adapted through supported styling and composition mechanisms to fit the Better Spreadsheet visual language. The component library's default visual appearance does not define the application's visual identity.

Application-specific interfaces should remain free to use custom presentation when general-purpose components do not adequately support the required interaction or design. Avoid creating application-owned replacements for mature commodity controls without a meaningful application requirement.

---

## 13. Interaction States

Interactive elements should provide clear visual feedback.

Where applicable, controls and interactive surfaces should distinguish:

- default
- hover
- active or pressed
- selected
- focused
- disabled
- error or invalid states

State changes should be noticeable without being visually distracting. Hover behavior should not be required to understand the current state of the application. Selected and focused states represent different concepts and should remain distinguishable when both apply simultaneously.

---

## 14. Focus

Keyboard focus must remain clearly visible.

Focus indicators should:

- provide sufficient contrast
- remain visible in both light and dark appearances
- work with configurable accent colors
- follow the shape of the interactive target where practical

Do not remove visible focus indicators without providing an accessible replacement. Focus styling should remain consistent across application-owned and library-provided controls.

---

## 15. Selection

Selection should be visually clear without overwhelming surrounding content. Selection treatment should be consistent for similar concepts while allowing specialized surfaces, such as the spreadsheet grid, to provide interaction-specific selection behavior.

Selected state must remain distinguishable from:

- hover
- focus
- disabled state
- semantic status

Where the accent color participates in selection styling, sufficient contrast must be maintained for both content and surrounding interface elements.

---

## 16. Resize Interactions

Resizable application regions use subtle border-integrated resize affordances.

Resize handles should:

- visually integrate with the panel boundary
- use a thin boundary treatment
- include a subtle dotted or grip-style drag indicator where appropriate
- provide a larger interaction target than their visible width or height
- become more prominent on hover
- use the application accent treatment while actively resizing

Resize handles should not appear as large structural splitter bars. Detailed application shell resize behavior is defined by the Application Layout specification.

---

## 17. Motion and Transitions

Motion should communicate state changes rather than decorate the interface.

Transitions may be used when they improve understanding of:

- opening or closing
- expanding or collapsing
- selection changes
- overlays
- contextual surfaces
- other meaningful state transitions

Animations should be short and unobtrusive. Frequent interactions should not be slowed by unnecessary animation. Respect user preferences for reduced motion.

Resize interactions should remain directly responsive to pointer movement rather than relying on decorative animation.

---

## 18. Accessibility

Visual design must support the accessibility requirements established by the system design and coding standards.

The interface should maintain:

- sufficient contrast
- visible keyboard focus
- readable text
- distinguishable interaction states
- non-color indicators for important meaning
- usable pointer targets
- predictable visual hierarchy

Accessibility provided by a UI component library should be reused where appropriate but does not replace application-level accessibility validation. Visual customization must not remove or weaken accessible behavior supplied by underlying controls.

---

## 19. Consistency

Consistency should be preferred over unnecessary novelty. Similar concepts should look and behave similarly throughout the application. Before introducing a new visual treatment, determine whether an established application pattern can satisfy the requirement.

At the same time, consistency should not require forcing substantially different interactions into the same presentation. Application-specific behavior takes precedence when a generic pattern would make the interface less clear or less efficient.

---

## 20. Design Evolution

This document defines the general visual direction of Better Spreadsheet rather than a complete component design system. Specific values and patterns should be established as real application interfaces are designed and implemented.

Reusable design decisions should gradually become shared application primitives or design tokens when their repeated use demonstrates that they are stable.

Avoid creating large speculative token sets or component abstractions before their requirements are understood. The visual system should evolve from implemented application needs while remaining consistent with the principles defined in this document.
