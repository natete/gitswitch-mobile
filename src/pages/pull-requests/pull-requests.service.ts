import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PullRequest } from './pull-request';
import { Constants } from '../../shared/constants';

@Injectable()
export class PullRequestsService {
  private readonly PULLREQUEST_URL = 'api/simple_git/pull_request?_format=json';

  private pullRequestsStream = new BehaviorSubject<PullRequest[]>(null);

  isInit = false;
  isLoading = false;

  constructor(private http: Http) { }

  init() {
    this.refreshPullRequestList();
    this.isInit = true;
  }

  refreshPullRequestList(): void {
    this.isLoading = true;

    this.http.get(`${Constants.BACKEND_URL}/${this.PULLREQUEST_URL}`)
        .subscribe((pullrequest: any) => {
          this.pullRequestsStream.next(pullrequest as PullRequest[]);
          this.isLoading = false;
        });
  }

  /**
   * Get the observable of the pull requests the user has.
   * @returns {Observable<T>} the observable of pull requests the user has.
   */
  getPullRequests(): Observable<PullRequest[]> {
    return this.pullRequestsStream.asObservable();
  }
}
