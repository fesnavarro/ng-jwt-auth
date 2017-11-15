import { IRawToken } from '../models/raw-token.interface';
import { User } from '../models/user';
import userHaveAccess from './user-have-access';

class RawToken implements IRawToken {
    public iss      = 'Some Issuer';
    public aud      = 'Some Audience';
    public iat      = new Date('2017-10-29 09:10:29');
    public nbf      = new Date('2017-10-30 12:57:09');
    public exp      = new Date('2017-10-31 16:43:49');
    public jti      = 'Some JWT ID';
    public userId   = 123;
    public name     = 'Some Users Name';
    public roles    = ['role1'];
}

describe('Helper: userHaveAccess', () => {
    let rawToken: IRawToken;
    let user: User;

    beforeEach(() => {
        rawToken = new RawToken();
        user = User.createFromParsedToken(rawToken);
    });

    it('should return false when no roles available', () => {
        rawToken = new RawToken();
        rawToken.roles = [];
        user = User.createFromParsedToken(rawToken);

        expect(userHaveAccess(user, ['role1'])).toEqual(false);
    });

    it('should return true with matching role', () => {
        expect(userHaveAccess(user, ['role1'])).toEqual(true);
    });

    it('should return false with no matching role', () => {
        expect(userHaveAccess(user, ['role2'])).toEqual(false);
    });

    it("should return true when user has role 'DEV'", () => {
        rawToken = new RawToken();
        rawToken.roles = ['DEV'];
        user = User.createFromParsedToken(rawToken);

        expect(userHaveAccess(user, ['DEV'])).toEqual(true);
    });

    it("should return true when user has role 'ADMIN'", () => {
        rawToken = new RawToken();
        rawToken.roles = ['ADMIN'];
        user = User.createFromParsedToken(rawToken);

        expect(userHaveAccess(user, ['role2'])).toEqual(true);
    });
});
