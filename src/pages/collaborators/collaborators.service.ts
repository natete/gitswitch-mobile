import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../../shared/constants';

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
  getCollaborators(accountId: number, repositoryName: string): Observable<Collaborator[]> {
    if (this.collaboratorsStream.getValue()) {
      this.http
          .get(`${this.COLLABORATORS_URL}/${accountId}/${repositoryName}/all${this.FORMAT_URL}`)
          .subscribe((collaborator: any) => this.collaboratorsStream.next(collaborator as Collaborator[]));
    }

    return this.collaboratorsStream.asObservable();
  }

  /**
   * Add it from the list of collaborators the repository has.
   * @params accountId the id of account has permissions.
   * @param repositoryName the name of repository where the user isn't collaborator.
   * @param username username to add user as a collaborator.
   */
  addCollaborator(accountId: number, repositoryName: string, username: string): void {
    this.http
        .put(`${this.COLLABORATORS_URL}/${accountId}/${repositoryName}/${username}${this.FORMAT_URL}`, JSON.stringify({}))
        .subscribe((collaborator: any) => {
          const collaborators: Collaborator[] = this.collaboratorsStream.getValue();
          collaborators.push(collaborator as Collaborator);
          this.collaboratorsStream.next(collaborators);
        });
  }

  /**
   * Removes it from the list of collaborators the repository has.
   * @params accountId the id of account has permissions.
   * @param repositoryName the name of repository where the user has.
   * @param username username to remove user as a collaborator.
   */
  deleteCollaborator(accountId: number, repositoryName: string, username: string): void {
    this.http
        .delete(`${this.COLLABORATORS_URL}/${accountId}/${repositoryName}/${username}${this.FORMAT_URL}`)
        .subscribe(() => this.collaboratorsStream.next(
          this.collaboratorsStream.getValue()
              .filter((co: Collaborator) => co.username !== username))
        );

  }

  /**
   * Check if a user is a collaborator in this repository.
   * @params accountId the id of account has permissions..
   * @param repository array with the data of repository where checked if a user is a collaborator.
   * @param username username to check if a user is a collaborator.
   */
  checkIsCollaborator(accountId: number, repositoryName: string, username: string): Observable<boolean> {
    return this.http.get(`${this.COLLABORATORS_URL}/${accountId}/${repositoryName}/${username}${this.FORMAT_URL}`)
               .map((response: any) => response);
  }

}