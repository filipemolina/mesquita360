import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';

// Habilitar o modo de Produção
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
