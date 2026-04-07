import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowDownLeftBoxOutline,
  arrowUpRightBoxOutline,
  backspaceOutline,
  bookOutline,
  callOutline,
  checkmarkCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  ellipsisHorizontal,
  ellipsisVertical,
  informationCircleOutline,
  keypadOutline,
  peopleOutline,
  personAddOutline,
  personCircleOutline,
  personOutline,
  removeCircleOutline,
  searchOutline,
  settingsOutline,
  starOutline,
  timeOutline
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideAppData } from './app/data/app-data.providers';
import { MockAppDataSource } from './app/data/mock-app-data.source';
import { RealAppDataSource } from './app/data/real-app-data.source';

addIcons({
  'add-outline': addOutline,
  'arrow-down-left-box-outline': arrowDownLeftBoxOutline,
  'arrow-up-right-box-outline': arrowUpRightBoxOutline,
  'backspace-outline': backspaceOutline,
  'book-outline': bookOutline,
  'call-outline': callOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'close-outline': closeOutline,
  'ellipsis-horizontal': ellipsisHorizontal,
  'ellipsis-vertical': ellipsisVertical,
  'information-circle-outline': informationCircleOutline,
  'keypad-outline': keypadOutline,
  'people-outline': peopleOutline,
  'person-add-outline': personAddOutline,
  'person-circle-outline': personCircleOutline,
  'person-outline': personOutline,
  'remove-circle-outline': removeCircleOutline,
  'search-outline': searchOutline,
  'settings-outline': settingsOutline,
  'star-outline': starOutline,
  'time-outline': timeOutline
});

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
