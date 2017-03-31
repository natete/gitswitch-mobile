export interface PullRequest {
  title: string;
  description: string,
  username: string,
  date: string,
  commits: number,
  comments: number,
  id: number,
  from: string,
  to: string,
  from_repo_id: number,
  from_repo_name: string,
  to_repo_id: number,
  to_repo_name: string,
  type: string,
  updated: string
}
