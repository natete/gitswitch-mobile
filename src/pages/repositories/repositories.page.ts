import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
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

  repositories: Repository[];

  constructor(private navCtrl: NavController,
              private loadingController: LoadingController,
              private repositoriesService: RepositoriesService) {}

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
    this.navCtrl.push(UsersPage, { action: action, repositories: this.repositories });
  }
}
