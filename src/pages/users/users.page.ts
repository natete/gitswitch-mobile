import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { User } from './user';
import { UsersService } from './users.service';
import { CollaboratorsPage } from '../collaborators/collaborators.page';
import { Observable } from 'rxjs';

/*
 Generated class for the Users page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-users',
  templateUrl: 'users.page.html'
})
export class UsersPage {

  action: string;
  users: User[] = [];
  username: string;
  addedUser: string;
  private loader;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private usersService: UsersService,
              private loadingCtrl: LoadingController) {}

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });

    this.loader.present();
  }

  confirmUser(username) {
    if (username) {
      this.initLoader('Getting users...');

      this.usersService
          .getUsers(username)
          .subscribe(users => {
            this.users = users;
            this.addedUser = username;
              this.loader
              .dismiss()
              .catch(() => console.log('Already dismissed'));
            },
            err => {
              this.loader
                  .dismiss()
                  .catch(() => console.log('Already dismissed'));
              return Observable.throw(err);
            });
    }
  }

  deleteUser() {
    this.addedUser = '';
    this.username = '';
    this.users = [];
  }

  userSelected(user: User) {
    this.navCtrl.push(CollaboratorsPage, {
      collaborator: user,
      action: this.navParams.data.action,
      repositories: this.navParams.data.repositories
    });
  }

}
