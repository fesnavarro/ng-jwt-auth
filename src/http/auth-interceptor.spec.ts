import { TestBed, inject, async } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalStorageService } from '../storage/local-storage.service';
import { AbstractAuthenticationConfig } from '../config';
import { AuthInterceptor } from './auth-interceptor';
import { StorageMock } from '../storage/storage.mock';
import { jwtTokenString, testToken } from '../models/mocks';

let mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
}

export class AuthenticationConfig extends AbstractAuthenticationConfig {
    apiLoginUrl = 'api/authenticate/endpoint';
    loginRedirectUrl = '/user/login';
}

describe('Http: Auth Interceptor Service', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule ],
        providers: [
            { provide: AbstractAuthenticationConfig, useClass: AuthenticationConfig },
            { provide: Router, useValue: mockRouter },
            { provide: LocalStorageService, useClass: StorageMock },
            { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
        ]
    }));

    afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
        mock.verify();
    }));

    it('should not add authorization header to request if no token in storage',
        async(inject([HttpClient, LocalStorageService, HttpTestingController], (http: HttpClient, storage: LocalStorageService, backend: HttpTestingController) => {
            http.get('/api').subscribe(response => expect(response).toBeTruthy());

            backend
                .expectOne((req: HttpRequest<any>) => !req.headers.has('Authorization'))
                .flush({ data: 'test' });
        })
    ));

    it('should add authorization header to request if token in storage',
        async(inject([HttpClient, LocalStorageService, HttpTestingController], (http: HttpClient, storage: LocalStorageService, backend: HttpTestingController) => {
            storage.setToken(testToken);

            http.get('/api').subscribe(response => expect(response).toBeTruthy());

            backend
                .expectOne((req: HttpRequest<any>) => {
                    return req.headers.has('Authorization')
                        && `Bearer ${testToken.rawToken}` == req.headers.get('Authorization');
                })
                .flush({ data: 'test' });
        })
    ));

    it('should set token on storage if response headers contain authorization',
        async(inject([HttpClient, LocalStorageService, HttpTestingController], (http: HttpClient, storage: LocalStorageService, backend: HttpTestingController) => {

            http.get('/api', { observe: 'response' }).subscribe(response => {
                expect(response.headers.has('authorization')).toBeTruthy();
                expect(response.headers.get('authorization')).toBe(jwtTokenString);
                expect(storage.getToken()).toEqual(testToken);
            });

            backend.expectOne('/api')
                .flush({ data: 'test' }, { headers: { 'Authorization': jwtTokenString}});
        })
    ));

    it('should redirect to login url when 401 statusCode is returned',
        async(inject([HttpClient, LocalStorageService, HttpTestingController], (http: HttpClient, storage: LocalStorageService, backend: HttpTestingController) => {

            http.get('/api', { observe: 'response' }).subscribe(response => {}, (err) => {
                expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/user/login');
            });

            backend.expectOne('/api')
                .flush({ data: 'test' }, { status: 401, statusText: 'Unauthorized' });
        })
    ));
});
