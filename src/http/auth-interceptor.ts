import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { Jwt} from '../helpers/jwt';
import { IToken } from '../models/token.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private _redirectUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _router: Router,
        config: AbstractAuthenticationConfig,
    ) {
        this._redirectUrl = config.loginRedirectUrl;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: IToken = this._storage.getToken();
        let rawToken: string;
        let tmpReq: HttpRequest<any> = req;

        if (token && (rawToken = token.rawToken)) {
            let headers = req.headers;
            headers = headers.set('Authorization', `Bearer ${rawToken}`);

            tmpReq = req.clone({headers: headers});
        }

        return next.handle(tmpReq).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (event.headers.has('Authorization')) {
                    let rawToken = event.headers.get('Authorization');
                    let token: IToken;

                    try {
                        token = Jwt.decodeToken(rawToken);
                        this._storage.setToken(token);
                    } catch (exc) {
                    }
                }
            }
        }, (err) => {
            if (err instanceof HttpErrorResponse) {
                if (401 == err.status && '' != this._redirectUrl) {
                    this._router.navigateByUrl(this._redirectUrl);
                }
            }
        });
    }
}
