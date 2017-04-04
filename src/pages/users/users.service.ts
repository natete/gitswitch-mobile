import { Injectable } from '@angular/core';
import { Setting } from './setting';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { User } from './user';

@Injectable()
export class UsersService {
  private readonly USERS_URL = 'api/simple_git/users';

  private settingsStream = new BehaviorSubject<User[]>([]);

  constructor(private http: Http) {}

  /**
   * Get the observable of the user.
   * @returns {Observable<T>} the observable of the user.
   */
  getUsers(): Observable<User[]> {
    if (this.settingsStream.getValue()) {
      this.http
          .get('api/users')
          .map(response => response.json().data as User[])
          .subscribe(user => this.settingsStream.next(user));
    }

    return this.settingsStream.asObservable();
  }
}
