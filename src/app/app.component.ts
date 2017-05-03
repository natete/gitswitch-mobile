import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../providers/auth/auth.service';
import { LoginPage } from '../pages/login/login.page';
import 'rxjs/operator/do';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(private platform: Platform,
              private authService: AuthService,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen) {

    this.initApp();
  }

  private initApp() {
    this.platform.ready()
        .then(() => {
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.initLoginSubscription();
        });
  }

  private initLoginSubscription() {
    this.authService
        .getAuthStream()
        .do(isLoggedIn => console.log(isLoggedIn))
        .subscribe(isLoggedIn => isLoggedIn ? this.nav.setRoot(TabsPage) : this.nav.setRoot(LoginPage));
  }
}
