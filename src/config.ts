import { InjectionToken } from '@angular/core';

export abstract class AbstractAuthenticationConfig {
    public apiLoginUrl: string;
    public loginRedirectUrl: string;
}

export const WINDOW = new InjectionToken<Window>('NgJwtAuthWindowToken');

export function _window(): Window {
    return window;
}

export const windowProvider = [
    { provide: WINDOW, useFactory: _window },
];
