import { IUser } from './user.interface';

export interface IToken {
    issuer: string;
    audience: string;
    issuedAt: Date;
    notBefore: Date;
    expiry: Date;
    id: string;
    user: IUser;
    rawToken: string;

    isExpired(): boolean;
}
