import { NavParams, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { User } from '../users/user';
import { Repository } from '../repositories/repository';
import { CollaboratorsService } from './collaborators.service';
import { RepositoriesPage } from '../repositories/repositories.page';
import { Collaborator } from './collaborator';

@Component({
  selector: 'page-collaborators',
  templateUrl: 'collaborators.page.html'
})
export class CollaboratorsPage {

  user: User;
  repositories: Repository[];
  reposChecked: string[] = [];
  action: string;
  reposFiltered: Repository[];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private collaboratorsService: CollaboratorsService) {

  }

  ionViewDidLoad() {
    this.user = this.navParams.data.collaborator;
    this.repositories = this.navParams.data.repositories;
    this.action = this.navParams.data.action;

    //this.reposFiltered = getRepositoriesFiltered();

  }

  goToRepositories() {
    this.navCtrl.push(RepositoriesPage);
  }

  getCollaborators(repo: Repository): Collaborator[] {
    let result: Collaborator[];
    this.collaboratorsService
        .getCollaborators(repo.name, repo.username)
        .subscribe(collaborators => {
          result = collaborators;
        });

    return result;
  }

  actionsCollaborator() {
    if (this.user) {
      if (this.reposChecked.length != 0) {
        this.proceedActionCollaborator(this.user, this.reposChecked, this.action);
      } else {
        let toast = this.toastCtrl.create({
          message: 'You must select at least one repository',
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

  getRepositoriesFiltered() {

  }

  /**
   * Add or delete the given collaborator.
   * @param collaborator the username to be added to the repositories.
   * @param respos The repositories to add or delete user as a collaborator.
   */
  private proceedActionCollaborator(user: User, repos: string[], action: string): void {
    const confirm = this.alertCtrl.create({
      title: `${action} account`,
      message: `Are you sure you want to ${action} the user as a colaborator in the selected repositories?`,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Yes', handler: () => {
          if (action === 'add') {
            this.collaboratorsService.addCollaborator(user.username, repos);
          } else {
            this.collaboratorsService.deleteCollaborator(user.username, repos);
          }
        }
        }
      ]
    });

    confirm.present();

    //TODO then
    let toast = this.toastCtrl.create({
      message: `Collaborator was ${action}ed successfully`,
      duration: 3000,
      position: 'pop'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
