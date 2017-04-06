export interface Repository {
  id: number;
  name: string;
  username: string;
  fork: boolean;
  alert: number;
  date: string;
  accounts: [{ id: number, hasPermission: boolean }];
}