import { IRawToken } from './raw-token.interface';
import { IUser } from './user.interface';
import userHaveAccess from '../helpers/user-have-access';

export class User implements IUser {
    private _userId: number;
    private _name: string;
    private _roles: string[];
    private _hasRole: boolean;

    private constructor() {}

    public static createFromParsedToken(rawToken: IRawToken): User {
        let user = new User();

        const userId = +rawToken.userId;

        user._userId   = rawToken.userId;
        user._name     = rawToken.name;
        user._roles    = rawToken.roles;

        return user;
    }

    public get userId(): number {
        return this._userId;
    }

    public get name(): string {
        return this._name;
    }

    public get roles(): string[] {
        return this._roles;
    }

    public hasRole(roleName: string): boolean {
        if (undefined === this._roles || 0 == this._roles.length) {
            return false;
        }

        let haveRole = false;

        this._roles.forEach((role: string) => {
            if (role == roleName) {
                haveRole = true;
            }
        });

        return haveRole;
    }

    public haveAccess(roles: string[]): boolean {
        return userHaveAccess(this, roles);
    }
}
