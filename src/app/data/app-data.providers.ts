import { Provider } from '@angular/core';

import { AppDataMode } from './app-data.models';
import { APP_DATA_MODE, APP_DATA_SOURCE } from './app-data.tokens';
import { MockAppDataSource } from './mock-app-data.source';
import { RealAppDataSource } from './real-app-data.source';

export function provideAppData(mode: AppDataMode): Provider[] {
  return [
    { provide: APP_DATA_MODE, useValue: mode },
    {
      provide: APP_DATA_SOURCE,
      useFactory: (dataMode: AppDataMode, real: RealAppDataSource, mock: MockAppDataSource) =>
        dataMode === 'mock' ? mock : real,
      deps: [APP_DATA_MODE, RealAppDataSource, MockAppDataSource]
    }
  ];
}
