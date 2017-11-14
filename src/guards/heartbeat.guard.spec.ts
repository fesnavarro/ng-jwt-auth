import { TestBed, inject, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { HearbeatGuard } from './heartbeat.guard';
import { StorageMock } from '../storage/storage.mock';
import { createToken, rawToken, createJwtRawToken, createAuthHeaderWithPayload } from '../models/mocks';
import { IRawToken } from '../models/raw-token.interface';
import { IToken } from '../models/token.interface';

class AuthenticationConfig extends AbstractAuthenticationConfig {
    loginRedirectUrl = '/user/login';
    heartbeatUrl = '/ping';
}

describe('Guard: Hearbeat Guard Service', () => {
    let routerMock;

    beforeEach(() => {
        routerMock = {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        };

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: AbstractAuthenticationConfig, useClass: AuthenticationConfig },
                { provide: LocalStorageService, useClass: StorageMock },
                { provide: HearbeatGuard, useClass: HearbeatGuard },
                { provide: Router, useValue: routerMock }
            ]
        });
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    it('#canActivate throws exception when hearbeatUrl not set',
        async(inject([LocalStorageService, HttpClient, Router],
            (storage: LocalStorageService, http: HttpClient, router: Router) => {
                let invalidConfig = new (class AuthenticationConfig1 extends AbstractAuthenticationConfig {
                    loginRedirectUrl = '/user/login';
                });

                let guard = new HearbeatGuard(storage, http, router, invalidConfig);
                expect(() => guard.canActivate(<any>{}, <any>{})).toThrow(
                    new Error("Trying to use the 'HeartbeatGuard' with no heartbeatUrl set")
                );
            }
        )
    ));

    it('#canActivate does not send request when no token on storage',
        async(inject([
            HearbeatGuard, HttpTestingController
        ], (guard: HearbeatGuard, backend: HttpTestingController) => {
            expect(guard.canActivate(<any>{}, <any>{})).toEqual(true);

            backend.expectNone('/ping');
        }))
    );

    it('#canActivate does not send request when token is expired',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                storage.setToken(createToken(true));
                expect(guard.canActivate(<any>{}, <any>{})).toEqual(true);

                backend.expectNone('/ping');
            }
        ))
    );

    it('#canActivate does not overrite token on storage when response header is invalid',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpToken = createToken(false);
                storage.setToken(tmpToken);
                expect(guard.canActivate(<any>{}, <any>{})).toBe(true);

                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', 'some.invalid.payload')
                });

                expect(storage.getToken()).toEqual(tmpToken);
            }
        ))
    );

    it('#canActivate sets new token when refresh token received in HttpResponse header',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpRawToken: IRawToken = Object.assign({}, rawToken);
                let tokenPayload: string;

                storage.setToken(createToken(false));
                expect(guard.canActivate(<any>{}, <any>{})).toEqual(true);

                tmpRawToken.iat = new Date('2010-10-01T09:10:29+00:00');
                tokenPayload = createAuthHeaderWithPayload(createJwtRawToken(tmpRawToken));

                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', tokenPayload)
                });

                let newToken: IToken = storage.getToken();
                expect(newToken.issuedAt.valueOf()).toEqual(new Date('2010-10-01T09:10:29+00:00').valueOf());
            }
        ))
    );

    it('#canActivateChild throws exception when hearbeatUrl not set',
        async(inject([LocalStorageService, HttpClient, Router],
            (storage: LocalStorageService, http: HttpClient, router: Router) => {
                let invalidConfig = new (class AuthenticationConfig2 extends AbstractAuthenticationConfig {
                    loginRedirectUrl = '/user/login';
                });

                let guard = new HearbeatGuard(storage, http, router, invalidConfig);
                expect(() => guard.canActivateChild(<any>{}, <any>{})).toThrow(
                    new Error("Trying to use the 'HeartbeatGuard' with no heartbeatUrl set")
                );
            }
        )
    ));

    it('#canActivateChild does not send request when no token on storage',
        async(inject([
            HearbeatGuard, HttpTestingController
        ], (guard: HearbeatGuard, backend: HttpTestingController) => {
            expect(guard.canActivateChild(<any>{}, <any>{})).toEqual(true);

            backend.expectNone('/ping');
        }))
    );

    it('#canActivateChild does not send request when token is expired',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                storage.setToken(createToken(true));
                expect(guard.canActivateChild(<any>{}, <any>{})).toEqual(true);

                backend.expectNone('/ping');
            }
        ))
    );

    it('#canActivateChild does not overrite token on storage when response header is invalid',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpToken = createToken(false);
                storage.setToken(tmpToken);
                expect(guard.canActivateChild(<any>{}, <any>{})).toBe(true);

                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', 'some.invalid.payload')
                });

                expect(storage.getToken()).toEqual(tmpToken);
            }
        ))
    );

    it('#canActivateChild sets new token when refresh token received in HttpResponse header',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpRawToken: IRawToken = Object.assign({}, rawToken);
                let tokenPayload: string;

                storage.setToken(createToken(false));
                expect(guard.canActivateChild(<any>{}, <any>{})).toEqual(true);

                tmpRawToken.iat = new Date('2010-10-01T09:10:29+00:00');
                tokenPayload = createAuthHeaderWithPayload(createJwtRawToken(tmpRawToken));

                try {
                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', tokenPayload)
                });
            } catch (err) {
                console.log('backend made a boo boo', err);
            }

                let newToken: IToken = storage.getToken();
                expect(newToken.issuedAt.valueOf()).toEqual(new Date('2010-10-01T09:10:29+00:00').valueOf());
            }
        ))
    );

    it('#canLoad throws exception when hearbeatUrl not set',
        async(inject([LocalStorageService, HttpClient, Router],
            (storage: LocalStorageService, http: HttpClient, router: Router) => {
                let invalidConfig = new (class AuthenticationConfig3 extends AbstractAuthenticationConfig {
                    loginRedirectUrl = '/user/login';
                });

                let guard = new HearbeatGuard(storage, http, router, invalidConfig);
                expect(() => guard.canLoad(<any>{})).toThrow(
                    new Error("Trying to use the 'HeartbeatGuard' with no heartbeatUrl set")
                );
            }
        )
    ));

    it('#canLoad does not send request when no token on storage',
        async(inject([
            HearbeatGuard, HttpTestingController
        ], (guard: HearbeatGuard, backend: HttpTestingController) => {
            expect(guard.canLoad(<any>{})).toEqual(true);

            backend.expectNone('/ping');
        }))
    );

    it('#canLoad does not send request when token is expired',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                storage.setToken(createToken(true));
                expect(guard.canLoad(<any>{})).toEqual(true);

                backend.expectNone('/ping');
            }
        ))
    );

    it('#canLoad does not overrite token on storage when response header is invalid',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpToken = createToken(false);
                storage.setToken(tmpToken);
                expect(guard.canLoad(<any>{})).toBe(true);

                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', 'some.invalid.payload')
                });

                expect(storage.getToken()).toEqual(tmpToken);
            }
        ))
    );

    it('#canLoad sets new token when refresh token received in HttpResponse header',
        async(inject([HearbeatGuard, LocalStorageService, HttpTestingController],
            (guard: HearbeatGuard, storage: LocalStorageService, backend: HttpTestingController) => {
                let tmpRawToken: IRawToken = Object.assign({}, rawToken);
                let tokenPayload: string;

                storage.setToken(createToken(false));
                expect(guard.canLoad(<any>{})).toEqual(true);

                tmpRawToken.iat = new Date('2010-10-01T09:10:29+00:00');
                tokenPayload = createAuthHeaderWithPayload(createJwtRawToken(tmpRawToken));

                backend.expectOne('/ping').flush({
                    some: 'body'
                }, {
                    headers: new HttpHeaders().set('Authorization', tokenPayload)
                });

                let newToken: IToken = storage.getToken();
                expect(newToken.issuedAt.valueOf()).toEqual(new Date('2010-10-01T09:10:29+00:00').valueOf());
            }
        ))
    );
});
