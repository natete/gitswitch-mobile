import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ToastController } from 'ionic-angular';
import { Repository } from './repository';
import { RepositoriesService } from './repositories.service';
import { RepositorySettingsPage } from '../repository-settings/repository-settings.page';
import { UsersPage } from '../users/users.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-repositories',
  templateUrl: 'repositories.page.html'
})
export class RepositoriesPage {

  repositories: Repository[] = [];
  private loader: Loading;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private repositoriesService: RepositoriesService,
              private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    this.initLoader('Getting repositories...');

    this.repositoriesService.init();

    this.getRepositories();
  }

  ionViewDidEnter() {
    if (this.repositoriesService.isLoading) {
      this.initLoader('Getting repositories...');
    }
  }

  getRepositories() {
    this.repositoriesService
        .getRepositories()
        .subscribe(repositories => {
            this.repositories = repositories || [];
            if (repositories) {
              console.log(this.repositories);
              this.loader.dismissAll();
            }
          },
          err => {return Observable.throw(err)});
  }

  goToRepositorySettings(repository) {
    this.navCtrl.push(RepositorySettingsPage, { repository });
  }

  goToUsers(action: string) {
    if (this.repositories.length != 0) {
      this.navCtrl.push(UsersPage, { action: action, repositories: this.repositories });
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'You must have at least one repository',
        duration: 3000,
        position: 'pop'
      });

      toast.present();
    }
  }

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({ content: msg });
    this.loader.present();
  }
}
