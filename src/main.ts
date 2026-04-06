import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideAppData } from './app/data/app-data.providers';
import { MockAppDataSource } from './app/data/mock-app-data.source';
import { RealAppDataSource } from './app/data/real-app-data.source';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideHttpClient(),
    provideRouter(appRoutes),
    RealAppDataSource,
    MockAppDataSource,
    ...provideAppData('real')
  ]
}).catch((error) => console.error(error));
