import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class RepositoriesService {
  private readonly SETTINGS_URL = 'api/simple_git/repositories';

  private repositoriesStream = new BehaviorSubject<Repository[]>([]);

  constructor(private http: Http){}

  /**
   * Get the observable of the repositories the user has.
   * @returns {Observable<T>} the observable of repositories the user has.
   */
  getRepositories(): Observable<Repository[]> {
    if (this.repositoriesStream.getValue()) {
      this.http
          //.get(`${Constants.BACKEND_URL}/${this.SETTINGS_URL}`)
          //.subscribe((setting: any) => this.settingsStream.next(setting as Repository[]));
          .get('api/repositories')
          .map(response => response.json().data as Repository[])
          .subscribe(repository => this.repositoriesStream.next(repository));
    }

    return this.repositoriesStream.asObservable();
  }
}