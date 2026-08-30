export const APPLICATION_LAYOUT = {
  gap: 4,

  fixed: {
    titleBarHeight: 32,
    menuBarHeight: 28,
    activityBarWidth: 48,
    statusBarHeight: 24,
    tabBarHeight: 36,
  },

  leftPanel: {
    defaultWidth: 240,
    minWidth: 140,
  },

  rightPanel: {
    defaultWidth: 280,
    minWidth: 140,
  },

  bottomPanel: {
    defaultHeight: 180,
    minHeight: 100,
  },

  workArea: {
    minWidth: 320,
    minHeight: 100,
  },
} as const;
