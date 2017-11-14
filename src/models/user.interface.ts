export interface IUser {
    userId: number;
    name: string;
    roles: string[];

    hasRole(roleName: string): boolean;
    haveAccess(roles: string[]): boolean;
}
