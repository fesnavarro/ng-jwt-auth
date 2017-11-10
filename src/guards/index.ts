import { AuthenticatedGuard } from './authenticated.guard';
import { AuthorizedGuard } from './authorized.guard';
import { HearbeatGuard } from './heartbeat.guard';
import { AnonymousGuard } from './anonymous.guard';

export const guardServices = [
    AnonymousGuard,
    AuthenticatedGuard,
    AuthorizedGuard,
    HearbeatGuard
];

