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

  getCollaborators(repository: Repository): Collaborator[] {
    let result: Collaborator[];
    this.collaboratorsService
        .getCollaborators(repository)
        .subscribe(collaborators => {
          result = collaborators;
        });

    return result;
  }

  checkRepository(repository) {
    repository.checked = !repository.checked;
  }

  actionsCollaborator() {
    if (this.user) {
      let reposChecked: Repository[] = [];
      for (let repo of this.reposFiltered) {
        if (repo.checked) {
          reposChecked.push(repo);
        }
      }
      if (reposChecked.length != 0) {
        this.proceedActionCollaborator(this.user, reposChecked, this.action);
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
    for (let repo of this.repositories) {
      isCollaborator = this.collaboratorsService.checkIsCollaborator(repo.accounts[0].id, repo, this.user.username);
      if (isCollaborator && this.action === this.DELETE_TEXT) {
        this.checkPermissions(repo);
      } else if (!isCollaborator && this.action === this.ADD_TEXT) {
        this.checkPermissions(repo);
      }
    }
  }

  /**
   * Check to if least an account has permission to add or delete collaborator in the repository.
   * @param repository the repository to check.
   */
  private checkPermissions(repository: Repository): void {
    let permissions = repository.accounts;
    let found = false;
    for (let permission of permissions) {
      if (permission.hasPermission) {
        found = true;
        repository.accounts = [{ id: permission.id, hasPermission: permission.hasPermission }];
        this.reposFiltered.push(repository);
      }
    }
  }

  /**
   * Add or delete the given collaborator.
   * @param user the user to be added to the repositories.
   * @param respositories The repositories to add or delete user as a collaborator.
   * @param action the action, add or delete the user as a collaborator.
   */
  private proceedActionCollaborator(user: User, repositories: Repository[], action: string): void {
    const confirm = this.alertCtrl.create({
      title: `${action} collaborator`,
      message: `Are you sure you want to ${action} the user as a collaborator in the selected repositories?`,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Yes', handler: () => {
          for (let repository of repositories) {
            if (action === 'add') {
              this.collaboratorsService.addCollaborator(repository.accounts[0].id, repository, user.username);
            } else {
              this.collaboratorsService.deleteCollaborator(repository.accounts[0].id, repository, user.username);
            }
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
