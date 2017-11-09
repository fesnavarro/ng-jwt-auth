import { Inject, Injectable } from '@angular/core';
import { global } from 'core-js';

import { IStorage } from './storage.interface';
import { IRawToken } from '../models/raw-token.interface';
import { IToken } from '../models/token.interface';
import { Jwt } from '../helpers/jwt';
import { WINDOW } from '../config';

const JWT_TOKEN = 'jwt';
const LOGIN_REDIRECT = 'loginRedirect';

@Injectable()
export class LocalStorageService implements IStorage {
    constructor(@Inject(WINDOW) private _window: Window) {}

    public setToken(token: IToken) {
        this._window.localStorage.setItem(JWT_TOKEN, token.rawToken);
    }

    public getToken(): IToken {
        let value = this._window.localStorage.getItem(JWT_TOKEN);
        if (!value) {
            return null;
        }

        return Jwt.decodeToken(value);
    }

    public clearToken(): void {
        this._window.localStorage.removeItem(JWT_TOKEN);
    }

    public setLoginRedirect(url: string): void {
        this._window.localStorage.setItem(LOGIN_REDIRECT, url);
    }

    public getLoginRedirect(): string {
        return this._window.localStorage.getItem(LOGIN_REDIRECT);
    }

    public clearLoginRedirect(): void {
        this._window.localStorage.removeItem(LOGIN_REDIRECT);
    }
}
