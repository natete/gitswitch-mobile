import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from '../repositories/repository';

@Injectable()
export class CollaboratorsService {

  private collaboratorsStream = new BehaviorSubject<Collaborator[]>([]);

  constructor(private http: Http) {}

  /**
   * Get the observable of the collaborators the repository has.
   * @returns {Observable<T>} the observable of collaborators the repository has.
   */
  getCollaborators(repos: Repository): Observable<Collaborator[]> {
    if (this.collaboratorsStream.getValue()) {
      this.http
          .get(`api/collaborators/${repos}`)
          .map(response => response.json().data as Collaborator[])
          .subscribe(collaborator => this.collaboratorsStream.next(collaborator));
    }

    return this.collaboratorsStream.asObservable();
  }

  /**
   * Add it from the list of collaborators the repository has.
   * @params accountId the id of account has permissions.
   * @param repos array with the data of repositories where the user isn't collaborator.
   * @param username username to add user as a collaborator.
   */
  addCollaborator(accountId: number, repository: Repository, username: string): void {
    const url = `api/collaborators/${repository}/${username}`;
    //this.http
    //.post(url);
  }

  /**
   * Removes it from the list of collaborators the repository has.
   * @params accountId the id of account has permissions.
   * @param repository array with the data of repositories where the user has.
   * @param username username to remove user as a collaborator.
   */
  deleteCollaborator(accountId: number, repository: Repository, username: string): void {
    const url = `api/collaborators/${repository}/${username}`;
    //this.http
    //   .delete(url);
  }

  /**
   * Check if a user is a collaborator in this repository.
   * @params accountId the id of account has permissions..
   * @param repository array with the data of repository where checked if a user is a collaborator.
   * @param username username to check if a user is a collaborator.
   */
  checkIsCollaborator(accountId: number, repository: Repository, username: string): boolean {
    const url = `api/collaborators/${repository}/${username}`;
    //return this.http

    return true;
  }

}