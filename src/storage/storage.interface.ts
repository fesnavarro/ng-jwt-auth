import { IToken } from '../models/token.interface';

export interface IStorage {
    setToken(token: IToken);
    getToken(): IToken;
    clearToken(): void;

    setLoginRedirect(url: string): void;
    getLoginRedirect(): string;
    clearLoginRedirect(): void;
}
