import { InjectionToken } from '@angular/core';

export abstract class AbstractAuthenticationConfig {
    public apiLoginUrl: string;
    public loginRedirectUrl: string;
    public heartbeatUrl: string;
}

export const WINDOW = new InjectionToken<Window>('NgJwtAuthWindowToken');

export class WindowWrapper extends Window {}

export function _window(): WindowWrapper {
    return window;
}

export const windowProvider = [
    { provide: WINDOW, useFactory: _window },
];
