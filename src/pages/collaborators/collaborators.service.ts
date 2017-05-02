import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../../shared/constants';
import { User } from '../users/user';
import { Repository } from '../repositories/repository';

@Injectable()
export class CollaboratorsService {
  private readonly COLLABORATORS_URL = `${Constants.BACKEND_URL}/api/simple_git/collaborator`;
  private readonly FORMAT_URL = '?_format=json';

  private collaboratorsStream = new BehaviorSubject<Collaborator[]>([]);

  constructor(private http: Http) {}

  /**
   * Get the observable of the collaborators the repository has.
   * @params repository the data of repository
   * @returns {Observable<T>} the observable of collaborators the repository has.
   */
  getCollaborators(repository: Repository): Observable<Collaborator[]> {
    if (this.collaboratorsStream.getValue()) {
      this.http
          .get(`${this.COLLABORATORS_URL}/${repository.accountId}/${repository.username}/${repository.name}/all${this.FORMAT_URL}`)
          .subscribe((collaborator: any) => this.collaboratorsStream.next(collaborator as Collaborator[]),
            err => {return Observable.throw(err)});
    }

    return this.collaboratorsStream.asObservable();
  }

  fetchReposCollaborators(repositories: Repository[]): Observable<Repository[]> {
    return Observable.forkJoin(repositories.map(repository => repository.canAdmin ? this.fetchRepoCollaborators(repository) : Observable.of(repository)));
  }

  fetchRepoCollaborators(repository: Repository) {
    return this.http
               .get(`${this.COLLABORATORS_URL}/${repository.accountId}/${repository.username}/${repository.name}/all${this.FORMAT_URL}`)
               .map((res: any) => res as Collaborator[])
               .do(collaborators => {
                 repository.collaborators = collaborators;
               })
               .map(collaborators => repository);
  }

  /**
   * Add it from the list of collaborators the repository has.
   * @param repository data of repository where the user isn't collaborator.
   * @param user data of user to add user as a collaborator.
   */
  addCollaborator(repository: Repository, user: User): void {
    this.http
        .put(`${this.COLLABORATORS_URL}/${repository.accountId}/${repository.username}/${repository.name}/${user.username}${this.FORMAT_URL}`, JSON.stringify({}))
        .subscribe(() => {
            const collaborator = new Collaborator();
            collaborator.id = user.id;
            collaborator.username = user.username;
            collaborator.photoUrl = user.photoUrl
          const collaborators: Collaborator[] = this.collaboratorsStream.getValue();
            collaborators.push(collaborator);
          this.collaboratorsStream.next(collaborators);
          },
          err => {return Observable.throw(err)});
  }

  /**
   * Removes it from the list of collaborators the repository has.
   * @param repository data of repository where the user has.
   * @param user data of user to remove user as a collaborator.
   */
  deleteCollaborator(repository: Repository, user: User): void {
    this.http
        .delete(`${this.COLLABORATORS_URL}/${repository.accountId}/${repository.username}/${repository.name}/${user.username}${this.FORMAT_URL}`)
        .subscribe(() => this.collaboratorsStream.next(
          this.collaboratorsStream.getValue()
              .filter((co: Collaborator) => co.username !== user.username))
        ),
      err => {return Observable.throw(err)};

  }

  /**
   * Check if a user is a collaborator in this repository.
   * @param repository array with the data of repository where checked if a user is a collaborator.
   * @param username username to check if a user is a collaborator.
   */
  checkIsCollaborator(repository: Repository, user: User): Observable<boolean> {
    return this.http.get(`${this.COLLABORATORS_URL}/${repository.accountId}/${repository.name}/${user.username}${this.FORMAT_URL}`)
               .map((response: any) => response);
  }

}