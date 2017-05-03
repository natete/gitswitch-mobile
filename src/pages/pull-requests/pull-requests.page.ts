import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { PullRequest } from './pull-request';
import { PullRequestsService } from './pull-requests.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-pull-requests',
  templateUrl: 'pull-requests.page.html'
})
export class PullRequestsPage {

  pullRequests: PullRequest[];
  private loader;

  constructor(private loadingCtrl: LoadingController,
              private pullRequestsService: PullRequestsService) {}

  ionViewDidLoad() {
    this.initLoader('Getting pull request...');

    this.getPullRequests();
  }

  getPullRequests() {
    this.pullRequestsService
        .getPullRequests()
        .subscribe(pullRequests => {
          this.pullRequests = pullRequests;
          this.loader
            .dismiss()
            .catch(() => console.log('Already dismissed'));
          },
          err => {return Observable.throw(err)});
  }

  private initLoader(msg) {
    this.loader = this.loadingCtrl.create({ content: msg });
    this.loader.present();
  }

}
