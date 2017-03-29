export interface PullRequest {
  description: string,
  username: string,
  date: string,
  commits: number,
  comments: number,
  id: number,
  from: string,
  to: string
}
