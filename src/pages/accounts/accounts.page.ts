import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { AccountsService } from './accounts.service';
import { Account } from './account';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.page.html'
})
export class AccountsPage {
  accounts: Account[] = [];
  private loader;

  constructor(private alertCtrl: AlertController,
              private loadingingCtrl: LoadingController,
              private accountsService: AccountsService) {}

  ionViewDidLoad() {
    this.initLoader('Getting accounts...');

    this.accountsService
        .getAccounts()
        .subscribe(accounts => {
          this.accounts = accounts;
          this.loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
        });
  }

  private initLoader(msg) {
    this.loader = this.loadingingCtrl.create({
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
        { text: 'Cancel' },
        { text: 'Yes', handler: () => this.proceedRemoveAccount(accountId) }
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

  /**
   * Deletes the given account.
   * @param accountId the id of the account to be deleted.
   */
  private proceedRemoveAccount(accountId: number): void {
    this.accountsService.deleteAccount(accountId);
  }
}
