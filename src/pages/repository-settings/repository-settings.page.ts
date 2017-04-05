import { Component } from '@angular/core';
import { NavParams, LoadingController, NavController } from 'ionic-angular';
import { Repository } from '../repositories/repository';
import { RepositorySetting } from './repository-setting';
import { RepositorySettingsService } from './repository-settings.service';
import { RepositoriesPage } from '../repositories/repositories.page';

/*
  Generated class for the RepositorySettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-repository-settings',
  templateUrl: 'repository-settings.page.html'
})
export class RepositorySettingsPage {

  repository: Repository;
  repositorySetting: RepositorySetting;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingController: LoadingController,
              private repositorySettingsService: RepositorySettingsService) {

  }

  ionViewDidLoad() {
    this.repository = this.navParams.data;

    const loader = this.loadingController.create({
      content: 'Getting repository setting...'
    });

    loader.present();

    this.repositorySettingsService
        .getRepositorySettings(this.repository.id)
        .filter(repoSettings => !!repoSettings)
        .subscribe(repositorySetting => {
          this.repositorySetting = repositorySetting;
          loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
        });
  }

  updateRepositorySetting(): void{
    this.repositorySettingsService.updateRepositorySettings(this.repositorySetting).then(() => this.goToSettings());
  }

  private goToSettings(){
    this.navCtrl.push(RepositoriesPage);
  }

}
