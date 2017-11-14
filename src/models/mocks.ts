import * as moment from 'moment';

import { Base64 } from '../helpers/base64';
import { IRawToken } from './raw-token.interface';
import { Token } from './token';

export function createJwtRawToken(_rawToken: IRawToken): any {
    let token: any = Object.assign({}, _rawToken);

    token.iat = _rawToken.iat.getTime();
    token.nbf = _rawToken.nbf.getTime();
    token.exp = _rawToken.exp.getTime();

    return token;
}

export function createAuthHeaderWithPayload(_jwtRawToken: any): string {
    const payload = JSON.stringify(_jwtRawToken);
    return `header.${ Base64.btoa(payload) }.signature`;
}

export const rawToken: IRawToken = {
    iss: 'Some Issuer',
    aud: 'Some Audience',
    iat: new Date('2017-10-01T09:10:29+00:00'),
    nbf: new Date('2017-10-02T12:57:09+00:00'),
    exp: new Date('2017-10-03T16:43:49+00:00'),
    jti: 'Some JWT ID',
    userId: 123,
    name: 'Some Users Name',
    roles: ['role1', 'role2']
};

export const jwtRawToken = createJwtRawToken(rawToken);
export const jwtTokenString = createAuthHeaderWithPayload(jwtRawToken);
export const testToken = Token.create(rawToken, createAuthHeaderWithPayload(jwtRawToken));

export function createToken(isExpired = false, roles: string[] = null): Token {
    let token: any = Object.assign({}, rawToken);

    let thisYear: number = (new Date()).getFullYear();

    if (true == isExpired) {
        token.exp = new Date(`${thisYear - 1}-10-03T16:43:49+00:00`);
    } else {
        token.exp = new Date(`${thisYear + 1}-10-03T16:43:49+00:00`);
    }

    if (roles) {
        token.roles = roles;
    }

    return Token.create(token, createAuthHeaderWithPayload(createJwtRawToken(token)));
}
