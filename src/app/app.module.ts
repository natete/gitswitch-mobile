import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule, ToastController } from 'ionic-angular';
import { MyApp } from './app.component';
import { PullRequestsPage } from '../pages/pull-requests/pull-requests.page';
import { TabsPage } from '../pages/tabs/tabs';
import { RepositoriesPage } from '../pages/repositories/repositories.page';
import { UsersPage } from '../pages/users/users.page';
import { AccountsPage } from '../pages/accounts/accounts.page';
import { LoginPage } from '../pages/login/login.page';
import { AuthService } from '../providers/auth/auth.service';
import { TokenService } from '../providers/auth/token.service';
import { HttpFactory } from '../providers/http/http.factory';
import { AccountsService } from '../pages/accounts/accounts.service';
import { PullRequestsService } from '../pages/pull-requests/pull-requests.service';
import { RepositoriesService } from '../pages/repositories/repositories.service';
import { RepositorySettingsPage } from '../pages/repository-settings/repository-settings.page';
import { RepositorySettingsService } from '../pages/repository-settings/repository-settings.service';
import { UsersService } from '../pages/users/users.service';
import { CollaboratorsPage } from '../pages/collaborators/collaborators.page';
import { CollaboratorsService } from '../pages/collaborators/collaborators.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserModule } from '@angular/platform-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AccountsPage,
    PullRequestsPage,
    LoginPage,
    RepositoriesPage,
    TabsPage,
    RepositorySettingsPage,
    UsersPage,
    CollaboratorsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountsPage,
    PullRequestsPage,
    LoginPage,
    RepositoriesPage,
    TabsPage,
    RepositorySettingsPage,
    UsersPage,
    CollaboratorsPage
  ],
  providers: [
    InAppBrowser,
    NativeStorage,
    StatusBar,
    SplashScreen,
    AccountsService,
    PullRequestsService,
    RepositoriesService,
    RepositorySettingsService,
    AuthService,
    TokenService,
    UsersService,
    CollaboratorsService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Http, useFactory: HttpFactory, deps: [XHRBackend, RequestOptions, TokenService, ToastController] }
  ]
})
export class AppModule {
}
