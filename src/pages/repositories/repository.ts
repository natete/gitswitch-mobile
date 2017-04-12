export interface Repository {
  id: number;
  name: string;
  username: string;
  issues: number;
  fork: boolean;
  age: string;
  accounts: [{ account_id: number, canAdmin: boolean }];
  checked: boolean;
  language: string;
  updated: string;
}