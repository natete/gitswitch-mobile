import { NavParams, NavController, AlertController, ToastController } from 'ionic-angular';
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
  private toast;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
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
      this.initToast(`You can not ${this.action} collaborator in any repository`);
    }

  }

  private initToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'pop'
    });

    this.toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    this.toast.present();
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
      for (const repo of this.reposFiltered) {
        if (repo.checked) {
          reposChecked.push(repo);
        }
      }
      if (reposChecked.length != 0) {
        this.proceedActionCollaborator(this.user, reposChecked, this.action);
      } else {
        this.initToast('You must select at least one repository');
      }
    }
  }

  /**
   * Filter the repositories if it has a permissions, for add it must not has the username as collaborator and for
   * delete it must has the username as collaborator.
   */
  getRepositoriesFiltered() {
    for (const repository of this.repositories) {
      //The user has permission
      if (repository.canAdmin) {
        this.checkIsCollaborator(repository);
      }
    }
  }

  /**
   * Check to if the user is a collaborator to add repository in the list of repositories by action: add (the user
   * mustn't be collaborator) or delete(the user must be collaborator)).
   * @param repository the repository to check.
   */
  private checkIsCollaborator(repository: Repository): void {
    let found = false;
    if (repository.collaborators != null) {
      found = repository.collaborators.find(collaborator => collaborator.username == this.user.username) == undefined ? false : true;
    }

    if (!found && this.action === this.ADD_TEXT) {
      this.reposFiltered.push(repository);
    } else if (found && this.action === this.DELETE_TEXT) {
      this.reposFiltered.push(repository);
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
          for (const repository of repositories) {
            if (action === this.ADD_TEXT) {
              this.collaboratorsService.addCollaborator(repository, user);
            } else {
              this.collaboratorsService.deleteCollaborator(repository, user);
            }
          }
          this.initToast(`Collaborator was ${action == 'add' ? 'added' : 'deleted' } successfully`);
          this.navCtrl.push(RepositoriesPage);
        }
        }
      ]
    });

    confirm.present();
  }
}
