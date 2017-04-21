import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from './http.service';
import { TokenService } from '../auth/token.service';
import { ToastController } from 'ionic-angular';

export function HttpFactory(backend: XHRBackend, options: RequestOptions, tokenService: TokenService, toastCtrl: ToastController) {
  return new HttpService(backend, options, tokenService, toastCtrl);
}