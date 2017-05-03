import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { User } from './user';
import { Constants } from '../../shared/constants';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UsersService {

  private readonly USERS_URL = `${Constants.BACKEND_URL}/api/simple_git/user`;
  private readonly FORMAT_URL = '?_format=json';

  private usersStream = new BehaviorSubject<User[]>([]);
  private toast;

  constructor(private http: Http,
              private toastCtrl: ToastController) {}

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
            err => {
              if (err.status === 404 || err.status === 400) {
                this.initToast(`User does not exist`);
                this.usersStream.next([]);
              }
              console.error(err);
            });

    return this.usersStream.asObservable();
  }

  private initToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'pop'
    });

    this.toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    this.toast.present();
  }
}
