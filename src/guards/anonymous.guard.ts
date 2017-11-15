import { Injectable } from '@angular/core';
import {
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate,
    CanActivateChild
} from '@angular/router';

import { LocalStorageService } from '../storage/local-storage.service';
import { IToken } from '../models/token.interface';

/**
 * @name AuthenticatedGuard
 * @throws Error
 * @example
 *
 * const routes: Routes = [{
 *      path: 'anonymous-route',
 *      component: LoginComponent,
 *      canActivate: [AnonymousGuard],
 *      canActivateChild: [AnonymousGuard],
 *      children: [{ ... }]
 *  }];
 */
@Injectable()
export class AnonymousGuard implements CanActivate, CanActivateChild {
    constructor(private _storage: LocalStorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._shouldAllowRoute();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    private _shouldAllowRoute(): boolean {
        let token: IToken | null = this._storage.getToken();
        if (!token || token.isExpired()) {
            return true;
        }

        return false;
    }
}
