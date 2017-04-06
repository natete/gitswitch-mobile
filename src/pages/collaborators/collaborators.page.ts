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

  private readonly ADD_TEXT = 'add';
  private readonly DELETE_TEXT = 'delete';


  user: User;
  repositories: Repository[];
  reposChecked: Repository[] = [];
  action: string;
  reposFiltered: Repository[] = [];

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

    this.getRepositoriesFiltered();

    if (this.reposFiltered.length == 0) {
      let toast = this.toastCtrl.create({
        message: `You can not ${this.action} collaborator in any repository`,
        duration: 3000,
        position: 'pop'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }

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

  /**
   * Filter the repositories if it has a permissions, for add it must not has the username as collaborator and for
   * delete it must has the username as collaborator.
   */
  getRepositoriesFiltered() {
    let isCollaborator = false;
    for (let i = 0; i < this.repositories.length; i++) {
      let repository = this.repositories[i];
      isCollaborator = this.collaboratorsService.checkIsCollaborator(repository.username, repository.name, this.user.username);

      if (isCollaborator && this.action === this.DELETE_TEXT) {
        if (this.checkPermissions(repository)) {
          this.reposFiltered.push(repository);
        }
      } else if (!isCollaborator && this.action === this.ADD_TEXT) {
        if (this.checkPermissions(repository)) {
          this.reposFiltered.push(repository);
        }
      }
    }
  }

  /**
   * Check to if least an account has permission to add or delete collaborator in the repository.
   * @param repository the repository to check.
   */
  private checkPermissions(repository: Repository): boolean {
    let permissions = repository.accounts;
    let found = false;
    for (let i = 0; i < permissions.length && !found; i++) {
      if (permissions[i].hasPermission) {
        found = true;
      }
    }

    return found;
  }

  /**
   * Add or delete the given collaborator.
   * @param collaborator the username to be added to the repositories.
   * @param respos The repositories to add or delete user as a collaborator.
   */
  private proceedActionCollaborator(user: User, repos: Repository[], action: string): void {
    const confirm = this.alertCtrl.create({
      title: `${action} collaborator`,
      message: `Are you sure you want to ${action} the user as a collaborator in the selected repositories?`,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Yes', handler: () => {
          if (action === 'add') {
            this.collaboratorsService.addCollaborator(repos, user.username);
          } else {
            this.collaboratorsService.deleteCollaborator(repos, user.username);
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
