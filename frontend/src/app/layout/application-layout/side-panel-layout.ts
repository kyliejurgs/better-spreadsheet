export type SidePanel = 'left' | 'right';

export interface SidePanelLayoutInput {
  workspaceWidth: number;
  workAreaMinWidth: number;
  gap: number;
  collapseBuffer: number;
  activePanel: SidePanel | null;
  leftPreferredWidth: number;
  leftMinWidth: number;
  leftCollapsed: boolean;
  rightPreferredWidth: number;
  rightMinWidth: number;
  rightCollapsed: boolean;
}

export interface SidePanelLayout {
  leftWidth: number;
  rightWidth: number;
  leftConstraintCollapsed: boolean;
  rightConstraintCollapsed: boolean;
}

interface PanelValues {
  preferredWidth: number;
  minWidth: number;
  collapsed: boolean;
}

export function calculateSidePanelLayout(input: SidePanelLayoutInput): SidePanelLayout {
  const left: PanelValues = {
    preferredWidth: input.leftPreferredWidth,
    minWidth: input.leftMinWidth,
    collapsed: input.leftCollapsed,
  };

  const right: PanelValues = {
    preferredWidth: input.rightPreferredWidth,
    minWidth: input.rightMinWidth,
    collapsed: input.rightCollapsed,
  };

  if (input.activePanel === 'left') {
    return calculateLayout(input, left, right, 'left');
  }

  if (input.activePanel === 'right') {
    return calculateLayout(input, right, left, 'right');
  }

  return calculateLayout(input, left, right, 'left');
}

function calculateLayout(
  input: SidePanelLayoutInput,
  primary: PanelValues,
  secondary: PanelValues,
  primarySide: SidePanel,
): SidePanelLayout {
  const primaryGap = primary.collapsed ? 0 : input.gap;
  const secondaryGap = secondary.collapsed ? 0 : input.gap;

  const availableWidth = input.workspaceWidth - input.workAreaMinWidth - primaryGap - secondaryGap;

  let primaryWidth = primary.collapsed ? 0 : primary.preferredWidth;

  let secondaryWidth = secondary.collapsed ? 0 : secondary.preferredWidth;

  let primaryConstraintCollapsed = false;
  let secondaryConstraintCollapsed = false;

  if (!primary.collapsed && !secondary.collapsed) {
    const availableSecondaryWidth = availableWidth - primaryWidth;

    const collapseThreshold = secondary.minWidth - input.collapseBuffer;

    if (availableSecondaryWidth < collapseThreshold) {
      secondaryWidth = 0;
      secondaryConstraintCollapsed = true;

      primaryWidth = Math.min(
        primaryWidth,
        input.workspaceWidth - input.workAreaMinWidth - primaryGap,
      );
    } else if (availableSecondaryWidth < secondary.preferredWidth) {
      secondaryWidth = Math.max(secondary.minWidth, availableSecondaryWidth);

      if (availableSecondaryWidth < secondary.minWidth) {
        primaryWidth = availableWidth - secondary.minWidth;
      }
    }
  } else if (!primary.collapsed) {
    primaryWidth = Math.min(
      primaryWidth,
      input.workspaceWidth - input.workAreaMinWidth - primaryGap,
    );
  }

  if (!primary.collapsed && primaryWidth < primary.minWidth) {
    primaryWidth = 0;
    primaryConstraintCollapsed = true;
  }

  if (primarySide === 'left') {
    return {
      leftWidth: Math.max(0, primaryWidth),
      rightWidth: Math.max(0, secondaryWidth),
      leftConstraintCollapsed: primaryConstraintCollapsed,
      rightConstraintCollapsed: secondaryConstraintCollapsed,
    };
  }

  return {
    leftWidth: Math.max(0, secondaryWidth),
    rightWidth: Math.max(0, primaryWidth),
    leftConstraintCollapsed: secondaryConstraintCollapsed,
    rightConstraintCollapsed: primaryConstraintCollapsed,
  };
}
