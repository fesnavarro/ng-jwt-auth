import { TestBed, inject, async } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { PrivilegeGuardService } from './authorized.guard';
import { StorageMock } from '../storage/storage.mock';
import { createToken } from '../models/mocks';

export class AuthenticationConfig extends AbstractAuthenticationConfig {
    loginRedirectUrl = '/user/login';
}

describe('Guard: Authorized Guard Service', () => {
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
                { provide: PrivilegeGuardService, useClass: PrivilegeGuardService },
                { provide: Router, useValue: routerMock }
            ]
        })
    });

    it('#canActivate should return true if there is no data on route',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivate(<any>{}, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canActivate should return true if there are no privileges on the route data',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivate(<any>{ data: 'some-data' }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canActivate should return false, set redirect url and redirect to login route if no token on storage',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivate(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canActivate should return false, set redirect url and redirect to login route if token on storage is expired',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivate(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canActivate should return false, and redirect to login route if not have access',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivate(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivate should return false if route requires 'DEV' role but user does not have it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['SOME_ROLE']));

            expect(guard.canActivate(<any>{ data: { privileges: ['DEV'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivate should return true if route requires 'DEV' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['DEV']));

            expect(guard.canActivate(<any>{ data: { privileges: ['DEV'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivate should return true if route requires 'OTHER_ROLE' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['OTHER_ROLE']));

            expect(guard.canActivate(<any>{ data: { privileges: ['OTHER_ROLE'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivate should return true if user has 'ADMIN' role",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['ADMIN']));

            expect(guard.canActivate(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it('#canActivateChild should return true if there is no data on route',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivateChild(<any>{}, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canActivateChild should return true if there are no privileges on the route data',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivateChild(<any>{ data: 'some-data' }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canActivateChild should return false, set redirect url and redirect to login route if no token on storage',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canActivateChild(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canActivateChild should return false, set redirect url and redirect to login route if token on storage is expired',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canActivateChild should return false, and redirect to login route if not have access',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivateChild should return false if route requires 'DEV' role but user does not have it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['SOME_ROLE']));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['DEV'] } }, <any>{ url: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivateChild should return true if route requires 'DEV' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['DEV']));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['DEV'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivateChild should return true if route requires 'OTHER_ROLE' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['OTHER_ROLE']));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['OTHER_ROLE'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canActivateChild should return true if user has 'ADMIN' role",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['ADMIN']));

            expect(guard.canActivateChild(<any>{ data: { privileges: ['SOME_ROLE'] } }, <any>{ url: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it('#canLoad should return true if there is no data on route',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canLoad(<any>{ path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canLoad should return true if there are no privileges on the route data',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canLoad(<any>{ data: 'some-data', path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).not.toEqual('/some-url');
        })
    ));

    it('#canLoad should return false, set redirect url and redirect to login route if no token on storage',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            expect(guard.canLoad(<any>{ data: { privileges: ['SOME_ROLE'] }, path: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canLoad should return false, set redirect url and redirect to login route if token on storage is expired',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canLoad(<any>{ data: { privileges: ['SOME_ROLE'] }, path: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/user/login');
            expect(storage.getLoginRedirect()).toEqual('/some-url');
        })
    ));

    it('#canLoad should return false, and redirect to login route if not have access',
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canLoad(<any>{ data: { privileges: ['SOME_ROLE'], path: 'some-url' }})).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canLoad should return false if route requires 'DEV' role but user does not have it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['SOME_ROLE']));

            expect(guard.canLoad(<any>{ data: { privileges: ['DEV'] }, path: 'some-url' })).toBe(false);
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canLoad should return true if route requires 'DEV' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['DEV']));

            expect(guard.canLoad(<any>{ data: { privileges: ['DEV'] }, path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canLoad should return true if route requires 'OTHER_ROLE' role and user has it",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['OTHER_ROLE']));

            expect(guard.canLoad(<any>{ data: { privileges: ['OTHER_ROLE'] }, path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));

    it("#canLoad should return true if user has 'ADMIN' role",
        async(inject([PrivilegeGuardService, LocalStorageService], (guard: PrivilegeGuardService, storage: LocalStorageService) => {
            storage.setToken(createToken(false, ['ADMIN']));

            expect(guard.canLoad(<any>{ data: { privileges: ['SOME_ROLE'] }, path: 'some-url' })).toBe(true);
            expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    ));
});
