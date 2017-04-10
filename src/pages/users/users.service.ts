import { Injectable } from '@angular/core';
import { Setting } from './setting';
import 'rxjs/add/operator/map';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { User } from './user';
import { Constants } from '../../shared/constants';

@Injectable()
export class UsersService {

  private readonly USERS_URL = `${Constants.BACKEND_URL}/api/simple_git/user`;
  private readonly FORMAT_URL = '?_format=json';

  private usersStream = new BehaviorSubject<User[]>([]);

  constructor(private http: Http) {}

  /**
   * Get the observable of the user.
   * @returns {Observable<T>} the observable of the user.
   */
  getUser(username: string): Observable<User> {
    return this.http
               .get(`${this.USERS_URL}/all/${username}${this.FORMAT_URL}`)
               .map((response: any) => response as User);
  }
}
