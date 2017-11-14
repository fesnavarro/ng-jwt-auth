import { IToken } from '../models/token.interface';

export interface IStorage {
    setToken(token: IToken): void;
    getToken(): IToken | null;
    clearToken(): void;

    setLoginRedirect(url: string): void;
    getLoginRedirect(): string | null;
    clearLoginRedirect(): void;
}
