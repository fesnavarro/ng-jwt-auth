import { Base64 } from '../helpers/base64';
import { Jwt, InvalidTokenError } from './jwt';
import { IToken } from '../models/token.interface';
import { Token } from '../models/token';
import { User } from '../models/user';
import { jwtTokenString } from '../models/mocks';

describe('Helper: Jwt', () => {
    let token: IToken;

    beforeEach(() => {
        token = Jwt.decodeToken(jwtTokenString);
    });

    it("#decodeToken throws 'InvalidTokenError' with invalid raw token", () => {
        expect(() => { Jwt.decodeToken(undefined); })
            .toThrow(new InvalidTokenError("'decodeToken' failed: no raw token given."));

        expect(() => { Jwt.decodeToken(''); })
            .toThrow(new InvalidTokenError("'decodeToken' failed: no raw token given."));

        expect(() => { Jwt.decodeToken('header'); })
            .toThrow(new InvalidTokenError("'decodeToken' failed: a JWT token should consist of three parts."));
    });

    it("#decodeToken should return 'Token'", () => {
        expect(Jwt.decodeToken(jwtTokenString) instanceof Token).toBeTruthy();
    });

    it("#decodeToken should return 'Token' with string[] roles", () => {
        expect(Jwt.decodeToken(jwtTokenString) instanceof Token).toBeTruthy();
        expect(token.user instanceof User).toBeTruthy();
        expect(token.user.roles instanceof Array).toBeTruthy();
        expect(token.user.roles).toEqual(['role1', 'role2']);
    });

    it("#decodeToken should return 'Token' with valid Dates", () => {
        expect(Jwt.decodeToken(jwtTokenString) instanceof Token).toBeTruthy();
        expect(token.issuedAt instanceof Date).toBeTruthy();
        expect(token.notBefore instanceof Date).toBeTruthy();
        expect(token.expiry instanceof Date).toBeTruthy();
    });

    it("#decodeToken should return 'Token' with full rawToken string", () => {
        expect(token.rawToken).toEqual(jwtTokenString);
    });
});
