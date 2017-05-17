import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { AccountsService } from './accounts.service';
import { Account } from './account';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.page.html'
})
export class AccountsPage {
  accounts: Account[] = [];
  loader;

  constructor(private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private accountsService: AccountsService) {}

  ionViewDidLoad() {
    this.initLoader('Getting accounts...');

    this.getAccounts();
  }

  getAccounts() {
    this.accountsService
        .getAccounts()
        .subscribe(accounts => {
            this.accounts = accounts;
            this.loader.dismissAll();
          },
          err => {
            this.loader.dismissAll();
            return Observable.throw(err);
          });
  }

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });

    this.loader.present();
  }

  /**
   * Starts the process to add a new account.
   */
  addAccount(): void {
    this.initLoader('Adding account...');
    this.accountsService.addAccount();
  }

  /**
   * Starts the process to delete the given account.
   * @param accountId the id of the account to be deleted.
   */
  deleteAccount(accountId: number): void {
    this.initLoader('Deleting account...');

    const confirm = this.alertCtrl.create({
      title: 'Remove account',
      message: 'Are you sure you want to remove the account?',
      buttons: [
        { text: 'Cancel', handler: () => this.loader.dismissAll() },
        { text: 'Yes', handler: () => this.accountsService.deleteAccount(accountId) }
      ]
    });

    confirm.present();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  // /**
  //  * Deletes the given account.
  //  * @param accountId the id of the account to be deleted.
  //  */
  // private proceedRemoveAccount(accountId: number): void {
  //   this.accountsService.deleteAccount(accountId);
  // }
}
