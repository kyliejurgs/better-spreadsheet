export const APPLICATION_LAYOUT = {
  topBar: {
    height: 40,
  },

  menuBar: {
    height: 28,
  },

  activityBar: {
    width: 48,
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
    minHeight: 200,
  },

  statusBar: {
    height: 24,
  },

  resize: {
    collapseThreshold: 20,
  },
} as const;
