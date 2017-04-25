import { Injectable } from '@angular/core';
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
   * Get the observable of the users.
   * @returns {Observable<User[]>} the observable of the users.
   */
  getUsers(username: string): Observable<User[]> {
      this.http
          .get(`${this.USERS_URL}/all/${username}${this.FORMAT_URL}`)
          .subscribe((user: any) => {
              this.usersStream.next(user as User[])
            },
            err => this.usersStream.error(err));

    return this.usersStream.asObservable();
  }
}
