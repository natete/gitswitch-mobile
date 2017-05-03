import { Collaborator } from '../collaborators/collaborator';
export interface Repository {
  id: number;
  name: string;
  username: string;
  issues: number;
  fork: boolean;
  age: string;
  accountId: number;
  canAdmin: boolean;
  checked: boolean;
  language: string;
  updated: string;
  collaborators: Collaborator[];
  type: string;
}