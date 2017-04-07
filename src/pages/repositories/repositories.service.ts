import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Constants } from '../../shared/constants';

@Injectable()
export class RepositoriesService {
  private readonly REPOSITORIES_URL = `${Constants.BACKEND_URL}/api/simple_git/repository`;
  private readonly FORMAT_URL = '?_format=json';

  private repositoriesStream = new BehaviorSubject<Repository[]>([]);

  constructor(private http: Http){}

  /**
   * Get the observable of the repositories the user has.
   * @returns {Observable<T>} the observable of repositories the user has.
   */
  getRepositories(): Observable<Repository[]> {
    if (this.repositoriesStream.getValue()) {
      this.http
          .get(`${this.REPOSITORIES_URL}/all${this.FORMAT_URL}`)
          .subscribe((repository: any) => this.repositoriesStream.next(repository as Repository[]));
    }

    return this.repositoriesStream.asObservable();
  }
}