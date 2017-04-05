import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Collaborator } from './collaborator';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CollaboratorsService {

  private collaboratorsStream = new BehaviorSubject<Collaborator[]>([]);

  constructor(private http: Http) {}

  /**
   * Get the observable of the collaborators the repository has.
   * @returns {Observable<T>} the observable of collaborators the repository has.
   */
  getCollaborators(repo: string, owner: string): Observable<Collaborator[]> {
    if (this.collaboratorsStream.getValue()) {
      this.http
          .get(`api/collaborators/${owner}/${repo}`)
          .map(response => response.json().data as Collaborator[])
          .subscribe(collaborator => this.collaboratorsStream.next(collaborator));
    }

    return this.collaboratorsStream.asObservable();
  }

  addCollaborator(username: string, repos: string[]): void {
    const url = `api/collaborators/${username}/${repos}`;
    //this.http.
  }

  deleteCollaborator(username: string, repos: string[]): void {
    const url = `api/collaborators/${username}/${repos}`;
    //this.http.
  }

}