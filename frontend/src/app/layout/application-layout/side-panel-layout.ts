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
    return calculateActiveLayout(input, left, right, 'left');
  }

  if (input.activePanel === 'right') {
    return calculateActiveLayout(input, right, left, 'right');
  }

  return calculateViewportLayout(input, left, right);
}

function calculateActiveLayout(
  input: SidePanelLayoutInput,
  active: PanelValues,
  opposite: PanelValues,
  activeSide: SidePanel,
): SidePanelLayout {
  const activeGap = active.collapsed ? 0 : input.gap;
  const oppositeGap = opposite.collapsed ? 0 : input.gap;

  const availableWidth = input.workspaceWidth - input.workAreaMinWidth - activeGap - oppositeGap;
  let activeWidth = active.collapsed ? 0 : active.preferredWidth;
  let oppositeWidth = opposite.collapsed ? 0 : opposite.preferredWidth;

  let oppositeConstraintCollapsed = false;

  if (!opposite.collapsed) {
    const availableOppositeWidth = availableWidth - activeWidth;
    if (availableOppositeWidth < opposite.preferredWidth) {
      oppositeWidth = Math.max(opposite.minWidth, availableOppositeWidth);
    }

    const collapseThreshold = availableWidth - opposite.minWidth + input.collapseBuffer;
    if (activeWidth >= collapseThreshold) {
      oppositeWidth = 0;
      oppositeConstraintCollapsed = true;
      activeWidth = Math.min(
        activeWidth,
        input.workspaceWidth - input.workAreaMinWidth - activeGap,
      );
    } else if (availableOppositeWidth < opposite.minWidth) {
      activeWidth = availableWidth - opposite.minWidth;
    }
  } else {
    activeWidth = Math.min(activeWidth, input.workspaceWidth - input.workAreaMinWidth - activeGap);
  }

  if (activeSide === 'left') {
    return {
      leftWidth: Math.max(0, activeWidth),
      rightWidth: Math.max(0, oppositeWidth),
      leftConstraintCollapsed: false,
      rightConstraintCollapsed: oppositeConstraintCollapsed,
    };
  }

  return {
    leftWidth: Math.max(0, oppositeWidth),
    rightWidth: Math.max(0, activeWidth),
    leftConstraintCollapsed: oppositeConstraintCollapsed,
    rightConstraintCollapsed: false,
  };
}

function calculateViewportLayout(
  input: SidePanelLayoutInput,
  left: PanelValues,
  right: PanelValues,
): SidePanelLayout {
  let leftWidth = left.collapsed ? 0 : left.preferredWidth;
  let rightWidth = right.collapsed ? 0 : right.preferredWidth;

  let leftConstraintCollapsed = false;
  let rightConstraintCollapsed = false;

  const gapWidth = Number(!left.collapsed) * input.gap + Number(!right.collapsed) * input.gap;

  let overflow = Math.max(
    0,
    leftWidth + rightWidth + gapWidth - (input.workspaceWidth - input.workAreaMinWidth),
  );

  if (!right.collapsed) {
    const reduction = Math.min(Math.max(0, rightWidth - right.minWidth), overflow);
    rightWidth -= reduction;
    overflow -= reduction;
  }

  if (!left.collapsed) {
    const reduction = Math.min(Math.max(0, leftWidth - left.minWidth), overflow);
    leftWidth -= reduction;
    overflow -= reduction;
  }

  if (overflow > 0 && !right.collapsed) {
    overflow = Math.max(0, overflow - rightWidth);
    rightWidth = 0;
    rightConstraintCollapsed = true;
  }

  if (overflow > 0 && !left.collapsed) {
    leftWidth = 0;
    leftConstraintCollapsed = true;
  }

  return {
    leftWidth,
    rightWidth,
    leftConstraintCollapsed,
    rightConstraintCollapsed,
  };
}
