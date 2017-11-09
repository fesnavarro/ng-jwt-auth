export interface IRawToken {
    iss: string;
    aud: string;
    iat: Date;
    nbf: Date;
    exp: Date;
    jti: string;
    userId: number;
    name: string;
    roles: string[];
}
