import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { Repository } from './repository';
import { RepositoriesService } from './repositories.service';
import { RepositorySettingsPage } from '../repository-settings/repository-settings.page';
import { UsersPage } from '../users/users.page';

/*
 Generated class for the Settings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-repositories',
  templateUrl: 'repositories.page.html'
})
export class RepositoriesPage {

  repositories: Repository[] = [];

  constructor(private navCtrl: NavController,
              private loadingController: LoadingController,
              private repositoriesService: RepositoriesService,
              private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    const loader = this.loadingController.create({
      content: 'Getting repositories...'
    });

    loader.present();

    this.repositoriesService
        .getRepositories()
        .subscribe(repositories => {
          this.repositories = repositories;
          loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
        });
  }

  goToRepositorySettings(setting){
    this.navCtrl.push(RepositorySettingsPage, setting);
  }

  goToUsers(action: string) {
    if (this.repositories.length != 0) {
      this.navCtrl.push(UsersPage, { action: action, repositories: this.repositories });
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'You must have at least one repository',
        duration: 3000,
        position: 'pop'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }
  }
}
