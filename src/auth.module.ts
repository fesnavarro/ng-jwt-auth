import { NgModule, ModuleWithProviders, Type } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication/authentication.service';
import { LocalStorageService } from './storage/local-storage.service';
import { AbstractAuthenticationConfig, windowProvider } from './config';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    providers: [
        windowProvider
    ]
})
export class NgJwtAuthModule {
    static forRoot(authConfig: Type<AbstractAuthenticationConfig>): ModuleWithProviders {
        return {
            ngModule: NgJwtAuthModule,
            providers: [
                AuthenticationService,
                LocalStorageService,
                {
                    provide: AbstractAuthenticationConfig,
                    useClass: authConfig
                }
            ]
        };
    }
}
