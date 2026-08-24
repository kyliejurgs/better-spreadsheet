export type CloudParticipation = 'local-only' | 'cloud-synchronized';

export interface Workspace {
  id: string;
  name: string;
  cloudParticipation: CloudParticipation;
  createdAt: string;
  updatedAt: string;
}
