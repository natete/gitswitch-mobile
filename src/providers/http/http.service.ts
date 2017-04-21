import { Injectable } from '@angular/core';
import { Http, RequestOptions, XHRBackend, Response, Headers, RequestOptionsArgs, Request } from '@angular/http';
import 'rxjs/add/operator/map';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ToastController } from 'ionic-angular';

@Injectable()
export class HttpService extends Http {

  private toast;

  constructor(backend: XHRBackend,
              options: RequestOptions,
              private tokenService: TokenService,
              private toastCtrl: ToastController) {
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

    const authData = this.tokenService.getToken();

    if (authData && authData.tokenType) {
      if (typeof url === 'string') {
        if (!options) {
          options = { headers: new Headers() };
        }
        options.headers.set('Authorization', `${authData.tokenType} ${authData.accessToken}`);
      } else {
        // we have to add the token to the url object
        url.headers.set('Authorization', `${authData.tokenType} ${authData.accessToken}`);
        url.headers.set('Content-Type', 'application/json');
      }
    }

    return super.request(url, options)
                .map(res => res.text() ? res.json() : {})
                .catch(this.catchAuthError(this));
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

  private catchAuthError(httpService: HttpService) {
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        this.tokenService.revokeToken();
      } else if (res.status === 409) {
        this.initToast(`Account added yet.`);
      }
      return Observable.throw(res);
    }
  }

}


