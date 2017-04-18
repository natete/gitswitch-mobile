import { Injectable } from '@angular/core';
import { Http, RequestOptions, XHRBackend, Response, Headers, RequestOptionsArgs, Request } from '@angular/http';
import 'rxjs/add/operator/map';
import { TokenService } from '../auth/token.service';
import { Observable, Subject } from 'rxjs';
import { Auth } from '../auth/auth';

@Injectable()
export class HttpService extends Http {

  constructor(backend: XHRBackend,
              options: RequestOptions,
              private tokenService: TokenService) {
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

    // const s = new Subject<Response>();

    const responseSubject = new Subject<Response>();

    this.tokenService
        .getToken()
        .then(token => this.performRequest(url, options, new Auth(token), responseSubject));

    return responseSubject.asObservable();

    // return this.performRequest(url, options);

    // return s.asObservable();
  }

  private performRequest(url: string|Request, options: RequestOptionsArgs, authData: Auth, response: Subject<Response>) {
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

    super.request(url, options)
         .map(res => res.text() ? res.json() : {})
         .subscribe(res => response.next(res));
  }

}
