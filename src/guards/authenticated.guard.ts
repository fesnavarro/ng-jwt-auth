import { Injectable } from '@angular/core';
import {
    Router,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    CanActivateChild
} from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { IToken } from '../models/token.interface';

/**
 * @name AuthenticatedGuard
 * @throws Error
 * @example
 *
 * const routes: Routes = [{
 *      path: '',
 *      component: AppComponent,
 *      canActivate: [AuthenticatedGuard],
 *      canActivateChild: [AuthenticatedGuard],
 *      children: [{ ... }]
 *  }];
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate, CanActivateChild {
    private _redirectUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _router: Router,
        config: AbstractAuthenticationConfig,
    ) {
        this._redirectUrl = config.loginRedirectUrl;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._checkLogin(state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    private _checkLogin(url: string): boolean {
        let token: IToken | null = this._storage.getToken();
        if (token && !token.isExpired()) {
            return true;
        }

        this._storage.setLoginRedirect(url);
        this._router.navigateByUrl(this._redirectUrl);

        return false;
    }
}
