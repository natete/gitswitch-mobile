import { Component } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { PullRequest } from './pull-request';
import { PullRequestsService } from './pull-requests.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-pull-requests',
  templateUrl: 'pull-requests.page.html'
})
export class PullRequestsPage {

  pullRequests: PullRequest[];
  private loader: Loading;

  constructor(private loadingCtrl: LoadingController,
              private pullRequestsService: PullRequestsService) {}

  ionViewDidLoad() {
    this.initLoader('Getting pull request...');

    this.pullRequestsService.init();

    this.getPullRequests();
  }

  ionViewDidEnter() {
    if (this.pullRequestsService.isLoading) {
      this.initLoader('Getting pull request...');
    }
  }

  getPullRequests() {
    this.pullRequestsService
        .getPullRequests()
        .subscribe(pullRequests => {
            this.pullRequests = pullRequests || [];
            if (pullRequests) {
              this.loader.dismissAll();
            }
          },
          err => {return Observable.throw(err)});
  }

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({ content: msg });
    this.loader.present();
  }

}
