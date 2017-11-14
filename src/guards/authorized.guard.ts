import { Injectable } from '@angular/core';
import {
    Router,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad
} from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { IToken } from '../models/token.interface';
import { IUser } from '../models/user.interface';

/**
 * @name AuthorizedGuard
 * @throws Error
 * @example
 *
 * const routes: Routes = [{
 *      path: '',
 *      component: AppComponent,
 *      canActivate: [AuthorizedGuard],
 *      canActivateChild: [AuthorizedGuard],
 *      children: [{ ... }]
 *  }];
 */
@Injectable()
export class AuthorizedGuard implements CanActivate, CanActivateChild, CanLoad {
    private _redirectUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _router: Router,
        config: AbstractAuthenticationConfig,
    ) {
        this._redirectUrl = config.loginRedirectUrl;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!route.data || !route.data['privileges']) {
            return true;
        }

        return this._checkPrivileges(route.data['privileges'] as string[], `/${state.url}`);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        if (!route.data || !route.data['privileges']) {
            return true;
        }

        return this._checkPrivileges(route.data['privileges'] as string[], `/${route.path}`);
    }

    private _checkPrivileges(privileges: string[], url: string): boolean {
        let token: IToken | null = this._storage.getToken();
        if (!token || token.isExpired()) {
            this._storage.setLoginRedirect(url);
            this._router.navigateByUrl(this._redirectUrl);
            return false;
        }

        if (!this._haveRouteAccess(privileges)) {
            this._router.navigateByUrl('/');
            return false;
        }

        return true;
    }

    private _haveRouteAccess(roles: string[]): boolean {
        let token: IToken | null = this._storage.getToken();
        if (!token) {
            return false;
        }

        return token.user.haveAccess(roles);
    }
}
