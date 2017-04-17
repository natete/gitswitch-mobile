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
    if (this.repositoriesStream.getValue()) {
      this.http
          .get(`${this.REPOSITORIES_URL}/all/all${this.FORMAT_URL}`)
          .subscribe((repositories: any) => {
            for (let repository of repositories) {
              if (repository.canAdmin) {
                this.collaboratorService.getCollaborators(repository.accountId, repository.name)
                    .subscribe(collaborators => {
                      repository.collaborators = collaborators;
                    });
              }
            }
            this.repositoriesStream.next(repositories as Repository[])
          });
    }

    return this.repositoriesStream.asObservable();
  }
}