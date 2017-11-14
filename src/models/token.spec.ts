import { IRawToken } from './raw-token.interface';
import { Token } from './token';
import { User } from './user';
import { rawToken, jwtRawToken, jwtTokenString } from './mocks';

describe('Model: Token', () => {
    let token: Token;

    beforeEach(() => {
        token = Token.create(rawToken, jwtTokenString);
    });

    it("issuer should return 'Some Issuer'", () => {
        expect(token.issuer).toEqual('Some Issuer');
    });

    it("audience should return 'Some Audience'", () => {
        expect(token.audience).toEqual('Some Audience');
    });

    it('issued should return ISO with correct date', () => {
        expect(token.issuedAt.valueOf()).toEqual(jwtRawToken.iat);
    });

    it('notBeforeDate should return with correct date', () => {
        expect(token.notBefore.valueOf()).toEqual(jwtRawToken.nbf);
    });

    it('expiry should return ISO with correct date', () => {
        expect(token.expiry.valueOf()).toEqual(jwtRawToken.exp);
    });

    it("id should return 'Some JWT ID'", () => {
        expect(token.id).toEqual('Some JWT ID');
    });

    it("rawToken should return raw token'", () => {
        expect(token.rawToken).toEqual(jwtTokenString);
    });

    it("user should return typeof 'User'", () => {
        expect(token.user instanceof User).toBeTruthy();
    });

    it("isExpired should be 'true' with expired date", () => {
        expect(token.isExpired()).toEqual(true);
    });

    it("isExpired should be 'false' with current date", () => {
        let nonExpiredDate = new Date();
        nonExpiredDate.setDate(nonExpiredDate.getDate() + 1);

        rawToken.exp = nonExpiredDate;
        token = Token.create(rawToken, jwtTokenString);

        expect(token.isExpired()).toEqual(false);
    });
});
