export type CloudParticipation = 'local-only' | 'cloud-sync';

export interface Workspace {
  id: string;
  name: string;
  cloudParticipation: CloudParticipation;
}
