import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from '../storage/local-storage.service';
import { AnonymousGuard } from './anonymous.guard';
import { StorageMock } from '../storage/storage.mock';
import { createToken } from '../models/mocks';

describe('Guard: Anonymous Guard Service', () => {
    let routerMock;

    beforeEach(() => {
        routerMock = {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: LocalStorageService, useClass: StorageMock },
                { provide: AnonymousGuard, useClass: AnonymousGuard }
            ]
        });
    });

    it('#canActivate should return false if there is a valid token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivate(<any>{}, <any>{})).toBe(false);
        })
    );

    it('#canActivate should return false if there is an expired token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivate(<any>{}, <any>{})).toBe(true);
        })
    );

    it('#canActivate should return true if there is no token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            expect(guard.canActivate(<any>{}, <any>{})).toBe(true);
        })
    );

    it('#canActivateChild should return false if there is a valid token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            storage.setToken(createToken(false));

            expect(guard.canActivateChild(<any>{}, <any>{})).toBe(false);
        })
    );

    it('#canActivateChild should return false if there is an expired token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            storage.setToken(createToken(true));

            expect(guard.canActivateChild(<any>{}, <any>{})).toBe(true);
        })
    );

    it('#canActivateChild should return true if there is no token on storage',
        inject([AnonymousGuard, LocalStorageService], (guard: AnonymousGuard, storage: LocalStorageService) => {
            expect(guard.canActivateChild(<any>{}, <any>{})).toBe(true);
        })
    );
});
