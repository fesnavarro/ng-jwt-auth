import { IToken } from './token.interface';
import { IRawToken } from './raw-token.interface';
import { IUser } from './user.interface';
import { User } from './user';

export class Token implements IToken {
    private _iss: string;    // Issuer
    private _aud: string;    // Audience
    private _iat: Date;      // Issued At Date
    private _nbf: Date;      // Not Before Date
    private _exp: Date;      // Expiry Date
    private _jti: string;    // ID
    private _user: IUser;
    private _rawToken: string;

    private constructor() {}

    public static create(rawToken: IRawToken, rawTokenString: string): Token {
        let token = new Token();

        let userId = +rawToken.userId;

        token._iss      = rawToken.iss;
        token._aud      = rawToken.aud;
        token._iat      = rawToken.iat;
        token._nbf      = rawToken.nbf;
        token._exp      = rawToken.exp;
        token._jti      = rawToken.jti;
        token._rawToken = rawTokenString;

        token._user = User.createFromParsedToken(rawToken);

        return token;
    }

    public get issuer(): string {
        return this._iss;
    }
    public get audience(): string {
        return this._aud;
    }
    public get issuedAt(): Date {
        return this._iat;
    }
    public get notBefore(): Date {
        return this._nbf;
    }
    public get expiry(): Date {
        return this._exp;
    }
    public get id(): string {
        return this._jti;
    }
    public get rawToken(): string {
        return this._rawToken;
    }
    public get user(): IUser {
        return this._user;
    }

    public isExpired(): boolean {
        return !(this._exp.valueOf() > (new Date().valueOf()));
    }
}
