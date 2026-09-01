/**
 * Durable state that belongs to the application rather than an individual workspace. State survives
 * browser refreshes and application restarts.
 */
export interface ApplicationMetadata {
  id: 'application';
  starterDataInitialized: boolean;
  selectedWorkspaceId: string | null;
}

export const APPLICATION_METADATA_ID = 'application';
