# ng-jwt-auth

[![Build Status](https://travis-ci.org/scottasmith/ng-jwt-auth.png?branch=master)](https://travis-ci.org/scottasmith/ng-jwt-auth)

Authentication library to integrate jwt with Angular2 utilizing 'Authorization' header.
There are several Angular2 guards and an '@angular/common/http' interceptor.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```
$ npm install ng-jwt-auth
```

## Setup

Modify your main app module:
```typescript
import { NgJwtAuthModule, AbstractAuthenticationConfig } from '@scomith/ng-jwt-auth';

export class AuthenticationConfig extends AbstractAuthenticationConfig {
    apiLoginUrl = 'api/authenticate/endpoint';
    loginRedirectUrl = '/user/login';
    heartbeatUrl = '/ping';
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        NgJwtAuthModule.forRoot(AuthenticationConfig),
        ...
    ]
    ...
})
AppModule {}
```

## Usage

The authentication endpoint accepts `ICredentials`:

```typescript
import { Component } from '@angular/core';
import { ICredentials, IToken, AuthenticationService } from '@scomith/ng-jwt-auth';

// Login Component on AbstractAuthenticationConfig.loginRedirectUrl

@Component({...})
export class LoginComponent {
    constructor(
        private _authService: AuthenticationService
    ) {

    public onLogin(): void {
        let credentials: ICredentials = {email: 'some@email.com', password: 'some-password'};

        this._authService.attemptLogin(credentials)
            .then((token: IToken) => {
                // do something with token
            },
            (err: string) => {
                // do something with error
            });
    }

    public onLogout(): void {
        this._authService.logout();
    }

    public isAuthenticated(): boolean {
        return this._authService.isAuthenticated();
    }
}
```

## API endpoint

The API endpoint is configurable via the AbstractAuthenticationConfig in the [Setup](https://github.com/scottasmith/ng-gwt-auth/blob/master/README.md#setup) section.
It should expect the following JSON request:

```json
{
    "username": "some-user",
    "password": "some-password"
}
```

and expects the response to be in the format:

```json
{
    "token": "actual.jwt.token"
}
```

# Heartbeat Guard

The heartbeat guard can be added to routes to send a ping to the API to get a refresh token.
To use the hearbeat guard you must set the ```heartbeatUrl``` on ```AbstractAuthenticationConfig``` in the [Setup](https://github.com/scottasmith/ng-gwt-auth/blob/master/README.md#setup) section.

Then you can add it to the routes:
```typescript
const appRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        canActivate: [HearbeatGuard],
        canActivateChild: [HearbeatGuard],
        children: [
            {
                // ...
            }
        ]
    }
];
```
