import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from '../storage/local-storage.service';
import { Jwt } from '../helpers/jwt';
import { ICredentials, IAuthResponse } from '../models/authentication.interfaces';
import { IToken } from '../models/token.interface';
import { IUser } from '../models/user.interface';
import { AbstractAuthenticationConfig } from '../config';

@Injectable()
export class AuthenticationService {
    private _apiLoginUrl: string;

    constructor(
        private _storage: LocalStorageService,
        private _http: HttpClient,
        authConfig: AbstractAuthenticationConfig
    ) {
        this._apiLoginUrl = authConfig.apiLoginUrl;
    }

    public attemptLogin(credentials: ICredentials): Observable<IToken> {
        return this._http.post<IAuthResponse>(this._apiLoginUrl, credentials, { observe: 'response' })
            .map((response: HttpResponse<IAuthResponse>) => {
                let token: IToken;

                if (!response.body || !response.body.token) {
                    throw new Error("'attemptLogin' failed: expected token in response");
                }

                try {
                    token = Jwt.decodeToken(response.body.token);
                } catch (err) {
                    throw new Error("'attemptLogin' failed: could not decode token");
                }

                this._storage.setToken(token);
                return token;
            })
            .catch((err: HttpErrorResponse|Error) => {
                if (err instanceof Error) {
                    return Observable.throw(err);
                }

                if (err.error instanceof ErrorEvent) {
                    return Observable.throw(`'attemptLogin' failed: '${err.error.message}'`);
                }

                return Observable.throw(
                    `'attemptLogin' failed: API returned code ${err.status}, body was: '${err.error}'`
                );
            });
    }

    public logout(): void {
        this._storage.clearToken();
    }

    public isAuthenticated(): boolean {
        let token: IToken | null = this._storage.getToken();
        if (token && !token.isExpired()) {
            return true;
        }
        return false;
    }

    public getUser(): IUser | null {
        let token: IToken | null = this._storage.getToken();
        if (!token || token.isExpired()) {
            return null;
        }
        return token.user;
    }

    public setRedirectUrl(url: string): void {
        this._storage.setLoginRedirect(url);
    }

    public getRedirectUrl(): string | null {
        return this._storage.getLoginRedirect();
    }

    public clearRedirectUrl(): void {
        this._storage.clearLoginRedirect();
    }
}
