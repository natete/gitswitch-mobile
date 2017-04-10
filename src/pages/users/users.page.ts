import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { User } from './user';
import { UsersService } from './users.service';
import { CollaboratorsPage } from '../collaborators/collaborators.page';

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
  users: User[];
  username: string;
  addedUser: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private usersService: UsersService,
              private loadingController: LoadingController) {}

  confirmUser(username) {
    if (username) {
      const loader = this.loadingController.create({
        content: 'Getting users...'
      });

      loader.present();

      this.usersService
          .getUsers(username)
          .subscribe(users => {
            this.users = users;
            this.addedUser = username;
            loader
              .dismiss()
              .catch(() => console.log('Already dismissed'));
          });
    }
  }

  deleteUser() {
    this.addedUser = '';
    this.username = '';
    this.users.pop();
  }

  userSelected(user: User) {
    this.navCtrl.push(CollaboratorsPage, {
      collaborator: user,
      action: this.navParams.data.action,
      repositories: this.navParams.data.repositories
    });
  }

}
