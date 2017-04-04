import { Component } from '@angular/core';
import { ViewController, NavParams, Platform, NavController, LoadingController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings.page';
import { User } from './user';
import { UsersService } from './users.service';

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

  collaborator: string = "";
  user: User;

  constructor(private navCtrl: NavController,
              private platform: Platform,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private usersService: UsersService,
              private loadingController: LoadingController) {

  }

  ionViewDidLoad() {
    const loader = this.loadingController.create({
      content: 'Getting settings...'
    });

    loader.present();

    this.usersService
        .getUsers()
        .subscribe(users => {
          this.user = users[0];
          loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
        });

    if (this.navParams.data.collaborator) {
      this.collaborator = this.navParams.data.collaborator;
    }
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage, { collaborator: this.collaborator });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
