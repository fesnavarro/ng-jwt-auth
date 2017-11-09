import * as moment from 'moment';

import { Base64 } from '../helpers/base64';
import { IRawToken } from './raw-token.interface';
import { Token } from './token';

function createJwtRawToken(rawToken: IRawToken): any {
    let token: any = Object.assign({}, rawToken);

    token.iat = rawToken.iat.getTime();
    token.nbf = rawToken.nbf.getTime();
    token.exp = rawToken.exp.getTime();

    return token;
}

function createAuthHeaderWithPayload(jwtRawToken: any): string {
    const payload = JSON.stringify(jwtRawToken);
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

export function createToken(isExpired: boolean = false, roles: string[] = null): Token {
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

    const jwtRawToken = createJwtRawToken(token);
    return Token.create(token, createAuthHeaderWithPayload(jwtRawToken));
};
