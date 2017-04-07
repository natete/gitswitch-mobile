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
   * @param repos array with the data of repositories where the user isn't collaborator.
   * @param username to add user as a collaborator.
   */
  addCollaborator(repos: Repository[], username: string): void {
    const url = `api/collaborators/${repos}/${username}`;
    //this.http.
  }

  /**
   * Removes it from the list of collaborators the repository has.
   * @param repos array with the data of repositories where the user has.
   * @param username to remove user as a collaborator.
   */
  deleteCollaborator(repos: Repository[], username: string): void {
    const url = `api/collaborators/${repos}/${username}`;
    //this.http.
  }

  /**
   * Check if a user is a collaborator in this repository.
   * @param owner the owner of repository.
   * @param repo is the name of repository where checked if a user is a collaborator.
   * @param username to check if a user is a collaborator.
   */
  checkIsCollaborator(repos: Repository, username: string): boolean {
    const url = `api/collaborators/${repos}/${username}`;
    //this.http.
    return true;
  }

}