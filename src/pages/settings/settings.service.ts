import { Injectable } from '@angular/core';
import { Setting } from './setting';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class SettingsService {
  private readonly SETTINGS_URL = 'api/simple_git/settings';

  private settingsStream = new BehaviorSubject<Setting[]>([]);

  constructor(private http: Http){}

  /**
   * Get the observable of the settings the user has.
   * @returns {Observable<T>} the observable of settings the user has.
   */
  getSettings(): Observable<Setting[]> {
    if(this.settingsStream.getValue()){
      this.http
          //.get(`${Constants.BACKEND_URL}/${this.SETTINGS_URL}`)
          //.subscribe((setting: any) => this.settingsStream.next(setting as Setting[]));
          .get('api/settings')
          .map(response => response.json().data as Setting[])
          .subscribe(setting => this.settingsStream.next(setting));
      //user para que me devuelva
    }

    return this.settingsStream.asObservable();
  }

  addCollaborator(collaborator: string, repos: string[]): void {
    const url = `api/settings/${collaborator}/${repos}`;
    //this.http.
  }

  deleteCollaborator(collaborator: string, repos: string[]): void {
    const url = `api/settings/${collaborator}/${repos}`;
    //this.http.
  }
}