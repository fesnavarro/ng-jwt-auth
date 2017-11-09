import { Injectable } from '@angular/core';
import { Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild, CanLoad } from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { IToken } from '../models/token.interface';

@Injectable()
export class AuthenticatedGuardService implements CanActivate, CanActivateChild, CanLoad {
    private _redirectUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _router: Router,
        config: AbstractAuthenticationConfig,
    ) {
        this._redirectUrl = config.loginRedirectUrl;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin(`/${state.url}`);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        return this.checkLogin(`/${route.path}`);
    }

    checkLogin(url: string): boolean {
        let token: IToken = this._storage.getToken();
        if (token && !token.isExpired()) {
            return true;
        }

        this._storage.setLoginRedirect(url);
        this._router.navigateByUrl(this._redirectUrl);

        return false;
    }
}