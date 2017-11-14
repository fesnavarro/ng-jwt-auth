import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {
    Router,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { IToken } from '../models/token.interface';
import { Jwt } from '../helpers/jwt';

/**
 * @name HearbeatGuard
 * @throws Error
 * @example
 *
 * const routes: Routes = [{
 *      path: '',
 *      component: AppComponent,
 *      canActivate: [HearbeatGuard],
 *      canActivateChild: [HearbeatGuard],
 *      children: [{ ... }]
 *  }];
  */
@Injectable()
export class HearbeatGuard implements CanActivate, CanActivateChild, CanLoad {
    private _heartbeatUrl: string;
    private _redirectUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _http: HttpClient,
        private _router: Router,
        config: AbstractAuthenticationConfig,
    ) {
        this._heartbeatUrl = config.heartbeatUrl;
        this._redirectUrl = config.loginRedirectUrl;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this._beat(`/${state.url}`);
        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.canActivate(route, state);
        return true;
    }

    canLoad(route: Route): boolean {
        this._beat(`/${route.path}`);
        return true;
    }

    private _beat(url: string): void {
        if (!this._heartbeatUrl) {
            throw new Error("Trying to use the 'HeartbeatGuard' with no heartbeatUrl set");
        }

        let token: IToken | null = this._storage.getToken();
        if (!token || token.isExpired() || !this._heartbeatUrl) {
            return;
        }

        this._http.get(this._heartbeatUrl, { observe: 'response' })
            .subscribe((response: HttpResponse<Object>) => {
                let tokenString: string | null = response.headers.get('Authorization');
                if (tokenString) {
                    this._trySetToken(tokenString);
                }
            });
    }

    private _trySetToken(tokenString: string) {
        let token: IToken;

        try {
            token = Jwt.decodeToken(tokenString);
            this._storage.setToken(token);
        } catch (err) {
            // API made an error
        }
    }
}
