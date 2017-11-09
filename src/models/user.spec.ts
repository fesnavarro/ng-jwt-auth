import { IRawToken } from './raw-token.interface';
import { User } from './user';

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

describe('Model: User', () => {
    let rawToken: IRawToken;
    let user: User;

    beforeEach(() => {
        rawToken = new RawToken();
        user = User.createFromParsedToken(rawToken);
    });

    it("userId should return '123'", () => {
        expect(user.userId).toEqual(123);
    });

    it("name should return 'Some Users Name'", () => {
        expect(user.name).toEqual('Some Users Name');
    });

    it("roles should return ['role1']", () => {
        expect(user.roles instanceof Array).toBeTruthy();
        expect(user.roles.length).toEqual(1);
        expect(user.roles[0]).toEqual('role1');
    });

    it('roles should return empty array when no roles', () => {
        rawToken.roles = [];
        user = User.createFromParsedToken(rawToken);

        expect(user.roles instanceof Array).toBeTruthy();
        expect(user.roles.length).toEqual(0);
    });

    it('#hasRole should return false when no roles available', () => {
        rawToken = new RawToken();
        rawToken.roles = undefined;
        user = User.createFromParsedToken(rawToken);

        expect(user.hasRole('role1')).toEqual(false);
    });

    it('#hasRole should return true with matching role', () => {
        expect(user.hasRole('role1')).toEqual(true);
    });

    it('#hasRole should return false with no matching role', () => {
        expect(user.hasRole('role2')).toEqual(false);
    });
});
