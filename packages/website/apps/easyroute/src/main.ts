import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs/hammer';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
    if (window) {
        window.console.log = function() {};
    }
}

platformBrowserDynamic()
    .bootstrapModule(AppModule,  { preserveWhitespaces: false })
    .catch(err => console.error(err));
