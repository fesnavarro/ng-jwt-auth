import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { IToken } from '../models/token.interface';
import { User } from '../models/user';
import { Token } from '../models/token';
import { AbstractAuthenticationConfig } from '../config';
import { ICredentials } from '../models/authentication.interfaces';
import { createToken, jwtTokenString } from '../models/mocks';
import { StorageMock } from '../storage/storage.mock';

export class AuthenticationConfig extends AbstractAuthenticationConfig {
    apiLoginUrl = 'auth/login';
}

describe('Authentication: Authentication Service', () => {
    let authConfig: AbstractAuthenticationConfig;
    let storageService: LocalStorageService;
    let authenticationService: AuthenticationService;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule
        ],
        providers: [
            AuthenticationService,
            { provide: LocalStorageService, useClass: StorageMock },
            {
                provide: AbstractAuthenticationConfig,
                useClass: AuthenticationConfig
            }
        ]
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    it('#attemptLogin throws error when there is an API error',
        async(inject([
            AuthenticationService, HttpTestingController
        ], (authService: AuthenticationService, backend: HttpTestingController) => {
            let credentials: ICredentials = {username: 'joe.bloggs@gwm-intl.com', password: 'pass'};

            authService.attemptLogin(credentials).subscribe((token: IToken) => {}, (err) => {
                expect(err).toEqual(`'attemptLogin' failed: API returned code 401, body was: 'Unauthorized'`);
            });

            backend
                .expectOne((req: HttpRequest<any>) => {
                    return 'auth/login' == req.url
                        && 'POST' == req.method
                        && credentials == req.body;
                }, `POST to 'auth/login' with json credentials {username, password}`)
                .flush('Unauthorized', { status: 401, statusText: 'Unathorized' });
        }))
    );

    it('#attemptLogin throws error when there is a client/network error',
        async(inject([
            AuthenticationService, HttpTestingController
        ], (authService: AuthenticationService, backend: HttpTestingController) => {
            let credentials: ICredentials = {username: 'joe.bloggs@gwm-intl.com', password: 'pass'};

            authService.attemptLogin(credentials).subscribe((token: IToken) => {}, (err) => {
                expect(err).toEqual(`'attemptLogin' failed: 'some failure'`);
            });

            backend
                .expectOne((req: HttpRequest<any>) => { return 'auth/login' == req.url; })
                .error(new ErrorEvent('Error', {message: 'some failure'}));
        }))
    );

    it('#attemptLogin throws error when no token returned',
        async(inject([
            AuthenticationService, HttpTestingController
        ], (authService: AuthenticationService, backend: HttpTestingController) => {
            let credentials: ICredentials = {username: 'joe.bloggs@gwm-intl.com', password: 'pass'};

            authService.attemptLogin(credentials).subscribe((token: IToken) => {}, (err) => {
                expect(err).toEqual(new Error(`'attemptLogin' failed: expected token in response`));
            });

            backend
                .expectOne((req: HttpRequest<any>) => { return 'auth/login' == req.url; })
                .flush({some: 'body'}, { status: 200, statusText: 'Ok' });
        }))
    );

    it('#attemptLogin throws error when could not decode token',
        async(inject([
            AuthenticationService, HttpTestingController
        ], (authService: AuthenticationService, backend: HttpTestingController) => {
            let credentials: ICredentials = {username: 'joe.bloggs@gwm-intl.com', password: 'pass'};

            authService.attemptLogin(credentials).subscribe((token: IToken) => {}, (err) => {
                expect(err).toEqual(new Error(`'attemptLogin' failed: could not decode token`));
            });

            backend
                .expectOne((req: HttpRequest<any>) => { return 'auth/login' == req.url; })
                .flush({token: 'invalid.token'}, { status: 200, statusText: 'Ok' });
        }))
    );

    it('#attemptLogin sets to LocalStorage and returns Token',
        async(inject([
            AuthenticationService, LocalStorageService, HttpTestingController
        ], (authService: AuthenticationService, storage: LocalStorageService, backend: HttpTestingController) => {
            let credentials: ICredentials = {username: 'joe.bloggs@gwm-intl.com', password: 'pass'};

            authService.attemptLogin(credentials).subscribe((token: IToken) => {
                expect(token instanceof Token).toBeTruthy();
                expect(storage.getToken()).toEqual(token);
            });

            backend
                .expectOne((req: HttpRequest<any>) => { return 'auth/login' == req.url; })
                .flush({token: jwtTokenString}, { status: 200, statusText: 'Ok' });
        }))
    );

    it('#logout should call clearToken on storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));
            authService.logout();
            expect(storage.getToken()).toBe(null);
        })
    );

    it('#isAuthenticated to return true when authenticated',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));
            expect(authService.isAuthenticated()).toBe(true);
        })
    );

    it('#isAuthenticated to return false when not authenticated',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.clearToken();
            expect(authService.isAuthenticated()).toBe(false);
        })
    );

    it('#isExpired to return true when have token and is expired',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));
            expect(authService.isExpired()).toBe(true);
        })
    );

    it('#isExpired to return false when have no token',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.clearToken();
            expect(authService.isExpired()).toBe(false);
        })
    );

    it('#isExpired to return false when token is not expired',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));
            expect(authService.isExpired()).toBe(false);
        })
    );

    it('#getUser returns null when no token on storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            expect(authService.getUser()).toBe(null);
        })
    );

    it('#getUser returns null when token on storage is expired',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(true));
            expect(authService.getUser()).toBe(null);
        })
    );

    it('#getUser returns instance of IUser when token avaiable on storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setToken(createToken(false));
            let user = authService.getUser();
            expect(user instanceof User).toBe(true);
            if (user) {
                expect(user.name).toEqual('Some Users Name');
            }
        })
    );

    it('#setRedirectUrl set redirectUrl on storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            authService.setRedirectUrl('some-url');
            expect(storage.getLoginRedirect()).toBe('some-url');
        })
    );

    it('#getRedirectUrl gets redirectUrl from storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setLoginRedirect('some-url');
            expect(authService.getRedirectUrl()).toBe('some-url');
        })
    );

    it('#clearRedirectUrl clears redirectUrl on storage',
        inject([
            AuthenticationService, LocalStorageService
        ], (authService: AuthenticationService, storage: LocalStorageService) => {
            storage.setLoginRedirect('some-url');
            authService.clearRedirectUrl();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    );
});
