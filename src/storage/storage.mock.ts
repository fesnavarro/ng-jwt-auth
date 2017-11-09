import { IStorage } from './storage.interface';
import { IRawToken } from '../models/raw-token.interface';
import { IToken } from '../models/token.interface';
import { Jwt } from '../helpers/jwt';

export class StorageMock implements IStorage {
    public rawToken: string = null;
    public loginRedirect: string = null;

    public setToken(token: IToken) {
        this.rawToken = token.rawToken;
    }

    public getToken(): IToken {
        let value = this.rawToken;
        if (!value) {
            return null;
        }

        return Jwt.decodeToken(value);
    }

    public clearToken(): void {
        this.rawToken = null;
    }

    public setLoginRedirect(url: string): void {
        this.loginRedirect = url;
    }

    public getLoginRedirect(): string {
        return this.loginRedirect;
    }

    public clearLoginRedirect(): void {
        this.loginRedirect = null;
    }
}
