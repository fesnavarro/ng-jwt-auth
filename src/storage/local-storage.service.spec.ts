import { TestBed, inject } from '@angular/core/testing';
import { Token } from '../models/token';
import { LocalStorageService } from './local-storage.service';
import { testToken } from '../models/mocks';
import { mockWindow } from '../mock-window';
import { WINDOW } from '../config';

describe('Storage: LocalStorage', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: WINDOW, useFactory: mockWindow },
                { provide: LocalStorageService, useClass: LocalStorageService },
            ]
        });
    });

    it("#setToken should set 'jwt' on storage",
        inject([LocalStorageService, WINDOW], (storage: LocalStorageService, _window: Window) => {
            storage.setToken(testToken);
            expect(_window.localStorage.getItem('jwt')).toEqual(testToken.rawToken);
        })
    );

    it("#getToken should return null when 'jwt' not in storage",
        inject([LocalStorageService], (storage: LocalStorageService) => {
            expect(storage.getToken()).toBe(null);
        })
    );

    it("#getToken should get 'jwt' from localStorage and create 'Token'",
        inject([LocalStorageService], (storage: LocalStorageService) => {
            storage.setToken(testToken);
            expect(storage.getToken() instanceof Token).toBeTruthy();
        })
    );

    it("#clearToken should clear 'jwt' on localStorage",
        inject([LocalStorageService, WINDOW], (storage: LocalStorageService, _window: Window) => {
            storage.setToken(testToken);
            storage.clearToken();
            expect(_window.localStorage.getItem('jwt')).toBe(null);
        })
    );

    it("#setLoginRedirect should clear 'loginRedirect' on storage",
        inject([LocalStorageService, WINDOW], (storage: LocalStorageService, _window: Window) => {
            storage.setLoginRedirect('some-url');
            expect(_window.localStorage.getItem('loginRedirect')).toEqual('some-url');
        })
    );

    it("#getLoginRedirect should clear 'loginRedirect' on storage",
        inject([LocalStorageService], (storage: LocalStorageService) => {
            storage.setLoginRedirect('some-url');
            expect(storage.getLoginRedirect()).toEqual('some-url');
        })
    );

    it("#clearLoginRedirect should clear 'loginRedirect' on storage",
        inject([LocalStorageService], (storage: LocalStorageService) => {
            storage.setLoginRedirect('some-url');
            storage.clearLoginRedirect();
            expect(storage.getLoginRedirect()).toBe(null);
        })
    );
});
