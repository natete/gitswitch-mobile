import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Repository } from '../repositories/repository';
import { RepositorySetting } from './repository-setting';
import { RepositorySettingsService } from './repository-settings.service';
import { RepositoriesPage } from '../repositories/repositories.page';
import { Observable } from 'rxjs';

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
  private loader;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private repositorySettingsService: RepositorySettingsService) {

  }

  ionViewDidLoad() {
    this.initLoader('Getting repository setting...');

    this.repository = this.navParams.get('repository');

    this.getRepositorySettings();
  }

  updateRepositorySetting(): void{
    this.repositorySettingsService.updateRepositorySettings(this.repositorySetting).then(() => this.goToSettings());
  }

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({ content: msg });

    this.loader.present();
  }

  getRepositorySettings() {
    this.repositorySettingsService.getRepositorySettings(this.repository.id)
        .filter(repoSettings => !!repoSettings)
        .subscribe(repositorySetting => {
            this.repositorySetting = repositorySetting;
            this.loader.dismissAll();
          },
          err => {return Observable.throw(err)});
  }

  private goToSettings(){
    this.navCtrl.push(RepositoriesPage);
  }

}
