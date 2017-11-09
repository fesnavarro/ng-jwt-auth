import * as moment from 'moment';

import { Base64 } from '../helpers/base64';
import { IRawToken } from '../models/raw-token.interface';
import { IToken } from '../models/token.interface';
import { Token } from '../models/token';

export function InvalidTokenError(message) {
    this.message = message;
}
InvalidTokenError.prototype = new Error;
InvalidTokenError.prototype.name = 'InvalidTokenError';

export class Jwt {
    public static decodeToken(rawToken: string): IToken {
        if (!rawToken || 0 == rawToken.length) {
            throw new InvalidTokenError("'decodeToken' failed: no raw token given.");
        }

        let parts = rawToken.split('.');
        if (3 != parts.length) {
            throw new InvalidTokenError("'decodeToken' failed: a JWT token should consist of three parts.");
        }

        let decodedToken: string = Base64.atob(parts[1]);

        return Token.create(this._createRawToken(decodedToken), rawToken);
    }

    private static _createRawToken(decodedToken: string): IRawToken {
        let tokenData: any = JSON.parse(decodedToken);

        tokenData.iat = this._createTokenDate(tokenData.iat);
        tokenData.nbf = this._createTokenDate(tokenData.nbf);
        tokenData.exp = this._createTokenDate(tokenData.exp);

        return tokenData as IRawToken;
    }

    private static _createTokenDate(utcSeconds: number): Date {
        return moment.utc(utcSeconds).toDate();
    }
}
