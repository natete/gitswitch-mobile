import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Constants } from '../../shared/constants';
import { CollaboratorsService } from '../collaborators/collaborators.service';

@Injectable()
export class RepositoriesService {
  private readonly REPOSITORIES_URL = `${Constants.BACKEND_URL}/api/simple_git/repository`;
  private readonly FORMAT_URL = '?_format=json';

  private repositoriesStream = new BehaviorSubject<Repository[]>([]);

  constructor(private http: Http,
              private collaboratorService: CollaboratorsService) {}

  /**
   * Get the observable of the repositories the user has.
   * @returns {Observable<T>} the observable of repositories the user has.
   */
  getRepositories(): Observable<Repository[]> {
    return this.http
               .get(`${this.REPOSITORIES_URL}/all/all${this.FORMAT_URL}`)
               .map((res: any) => res as Repository[])
               .flatMap(repositories => this.collaboratorService.fetchReposCollaborators(repositories))
               .catch((error: any) => Observable.throw(error));
  }

}
