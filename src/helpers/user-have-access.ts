import { IUser } from '../models/user.interface';

export default function userHaveAccess(user: IUser, roles: string[]): boolean {
    let devFeature = false;
    let foundRole = '';

    if (!roles) {
        return true;
    }

    roles.forEach((role: string) => {
        if ('DEV' == role) {
            devFeature = true;
        }

        if (user.hasRole(role)) {
            foundRole = role;
        }
    });

    if (!foundRole && !devFeature && user.hasRole('ADMIN')) {
        return true;
    } else if (foundRole) {
        return true;
    }

    return false;
}

