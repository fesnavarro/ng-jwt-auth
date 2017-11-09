import { TestBed, inject, async } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { AuthenticatedGuardService } from './authenticated.guard';
import { StorageMock } from '../storage/storage.mock';
import { createToken } from '../models/mocks';

export class AuthenticationConfig extends AbstractAuthenticationConfig {
    loginRedirectUrl = '/user/login';
}

describe('Guard: Authenticated Guard Service', () => {
    let routerMock;

    beforeEach(() => {
        routerMock = {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: AbstractAuthenticationConfig, useClass: AuthenticationConfig },
                { provide: LocalStorageService, useClass: StorageMock },
                { provide: AuthenticatedGuardService, useClass: AuthenticatedGuardService },
                { provide: Router, useValue: routerMock }
            ]
        })
    });

    it('#canActivate should return false and navigate to login when no token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            expect(guard.canActivate(<any>{}, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canActivate should return false and navigate to login when token is in storage but expired',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivate(<any>{}, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canActivate should return true when valid token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivate(<any>{}, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).not.toEqual('/some-url')
        })
    ));

    it('#canActivateChild should return false and navigate to login when no token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            expect(guard.canActivateChild(<any>{}, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canActivateChild should return false and navigate to login when token is in storage but expired',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivateChild(<any>{}, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canActivateChild should return true when valid token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivateChild(<any>{}, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).not.toEqual('/some-url')
        })
    ));

    it('#canLoad should return false and navigate to login when no token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            expect(guard.canLoad(<any>{ path: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canLoad should return false and navigate to login when token is in storage but expired',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canLoad(<any>{ path: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url')
        })
    ));

    it('#canLoad should return true when valid token in storage',
        async(inject([AuthenticatedGuardService, LocalStorageService], (guard: AuthenticatedGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canLoad(<any>{ path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).not.toEqual('/some-url')
        })
    ));
});
