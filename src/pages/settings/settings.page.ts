import { Component } from '@angular/core';
import {
  LoadingController,
  NavController,
  AlertController,
  ToastController,
  ModalController,
  NavParams
} from 'ionic-angular';
import { Setting } from './setting';
import { SettingsService } from './settings.service';
import { RepositorySettingsPage } from '../repository-settings/repository-settings.page';
import { UsersPage } from '../users/users.page';

/*
 Generated class for the Settings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html'
})
export class SettingsPage {

  settings: Setting[];
  collaborator: string;
  users: any = [];

  constructor(private navCtrl: NavController,
              private loadingController: LoadingController,
              private settingsService: SettingsService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private navParams: NavParams) {}

  ionViewDidLoad() {
    const loader = this.loadingController.create({
      content: 'Getting settings...'
    });

    loader.present();

    this.settingsService
        .getSettings()
        .subscribe(settings => {
          this.settings = settings;
          loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
        });

    if (this.navParams.data.collaborator) {
      this.users.push(this.navParams.data.collaborator);
    }
  }

  goToRepositorySettings(setting){
    this.navCtrl.push(RepositorySettingsPage, setting);
  }

  confirmAddCollaborator(collaborator) {
    if (collaborator) {
      let userModal = this.modalCtrl.create(UsersPage, { collaborator: collaborator });
      userModal.present();
      //this.users.push(collaborator);
    }
  }

  deleteUserfromCollaborator(user) {
    if (user) {
      let users = [];
      for (let i = 0; i < this.users.length; i++) {
        if (user !== this.users[i]) {
          users.push(this.users[i]);
        }
      }
      this.users = users;
    }
  }

  actionsCollaborator(collaborator, action) {
    if (collaborator) {
      let alert = this.alertCtrl.create();
      alert.setTitle(`Which repositories want you ${action} user as a collaborator?`);
      for (let i = 0; i < this.settings.length; i++) {
        alert.addInput({
          type: 'checkbox',
          label: this.settings[i].name,
          value: this.settings[i].name,
          checked: false
        });
      }

      alert.addButton('Cancel');
      alert.addButton({
        text: `${action}`,
        handler: repos => {
          if (repos.length != 0) {
            this.proceedActionCollaborator(collaborator, repos, action);
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
      });
      alert.present();
    } else {
      let toast = this.toastCtrl.create({
        message: 'You must add at least one collaborator',
        duration: 3000,
        position: 'pop'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }
  }

  /**
   * Add or delete the given collaborator.
   * @param collaborator the username to be added to the repositories.
   * @param respos The repositories to add or delete user as a collaborator.
   */
  private proceedActionCollaborator(collaborator: string, repos: string[], action: string): void {
    if (action === 'add') {
      this.settingsService.addCollaborator(collaborator, repos);
    } else {
      this.settingsService.deleteCollaborator(collaborator, repos);
    }
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
