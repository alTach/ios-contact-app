import { InjectionToken } from '@angular/core';

import { AppDataMode, AppDataSource } from './app-data.models';

export const APP_DATA_MODE = new InjectionToken<AppDataMode>('APP_DATA_MODE');
export const APP_DATA_SOURCE = new InjectionToken<AppDataSource>('APP_DATA_SOURCE');
