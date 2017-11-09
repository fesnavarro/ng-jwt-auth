import { Token } from '../models/token';
import { StorageMock } from './storage.mock';
import { testToken } from '../models/mocks';

describe('Storage: Storage Mock', () => {
    let storage: StorageMock;

    beforeEach(() => {
        storage = new StorageMock();
    });

    it("#setToken should set 'jwt' on localStorage", () => {
        storage.setToken(testToken);
        expect(storage.rawToken).toEqual(testToken.rawToken);
    });

    it("#getToken should return null when 'jwt' not in storage", () => {
        expect(storage.getToken()).toBe(null);
    });

    it("#getToken should get 'jwt' from localStorage and create 'Token'", () => {
        storage.rawToken = testToken.rawToken;
        expect(storage.getToken() instanceof Token).toBeTruthy();
    });

    it("#clearToken should clear 'jwt' on storage", () => {
        storage.rawToken = testToken.rawToken;
        storage.clearToken();
        expect(storage.rawToken).toBe(null);
    });

    it("#setLoginRedirect should set 'loginRedirect' on storage", () => {
        storage.setLoginRedirect('some-url');
        expect(storage.loginRedirect).toEqual('some-url');
    });

    it("#getLoginRedirect should clear 'loginRedirect' on storage", () => {
        storage.loginRedirect = 'some-url';
        expect(storage.getLoginRedirect()).toEqual('some-url');
    });

    it("#clearLoginRedirect should clear 'loginRedirect' on storage", () => {
        storage.loginRedirect = 'some-url';
        storage.clearLoginRedirect();
        expect(storage.getLoginRedirect()).toBe(null);
    });
});
