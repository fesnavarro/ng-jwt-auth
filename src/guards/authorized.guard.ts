import { Injectable } from '@angular/core';
import { Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild, CanLoad } from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { IToken } from '../models/token.interface';
import { IUser } from '../models/user.interface';

@Injectable()
export class PrivilegeGuardService implements CanActivate, CanActivateChild, CanLoad {
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

        return this.checkPrivileges(route.data['privileges'] as string[], `/${state.url}`);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        if (!route.data || !route.data['privileges']) {
            return true;
        }

        return this.checkPrivileges(route.data['privileges'] as string[], `/${route.path}`);
    }

    checkPrivileges(privileges: string[], url: string): boolean {
        let token: IToken = this._storage.getToken();
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

    private _haveRouteAccess(privileges: string[]): Boolean {
        if (!privileges || !(privileges instanceof Array)) {
            return false;
        }

        let user: IUser = this._storage.getToken().user;
        let devFeature: boolean = false;
        let foundPrivilege: string = null;

        privileges.forEach((privilege: string) => {
            if ('DEV' == privilege) {
                devFeature = true;
            }

            if (user.hasRole(privilege)) {
                foundPrivilege = privilege;
            }
        });

        if (!foundPrivilege && !devFeature && user.hasRole('ADMIN')) {
            return true;
        } else if (foundPrivilege) {
            return true;
        }

        return false;
    }

}