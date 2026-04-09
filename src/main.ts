import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  addCircle,
  addCircleOutline,
  arrowDownLeftBoxOutline,
  arrowUpRightBoxOutline,
  backspaceOutline,
  bookmarkOutline,
  bookOutline,
  callOutline,
  cameraOutline,
  checkmark,
  checkmarkOutline,
  checkmarkCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  downloadOutline,
  ellipsisHorizontal,
  ellipsisVertical,
  gitMergeOutline,
  informationCircleOutline,
  keypadOutline,
  mailOutline,
  peopleOutline,
  personAddOutline,
  personCircleOutline,
  personOutline,
  radioButtonOffOutline,
  radioButtonOnOutline,
  removeOutline,
  removeCircle,
  removeCircleOutline,
  searchOutline,
  settingsOutline,
  starOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideAppData } from './app/data/app-data.providers';
import { MockAppDataSource } from './app/data/mock-app-data.source';
import { RealAppDataSource } from './app/data/real-app-data.source';

addIcons({
  'add-outline': addOutline,
  'add-circle': addCircle,
  'add-circle-outline': addCircleOutline,
  'arrow-down-left-box-outline': arrowDownLeftBoxOutline,
  'arrow-up-right-box-outline': arrowUpRightBoxOutline,
  'backspace-outline': backspaceOutline,
  'bookmark-outline': bookmarkOutline,
  'book-outline': bookOutline,
  'call-outline': callOutline,
  'camera-outline': cameraOutline,
  'checkmark': checkmark,
  'checkmark-outline': checkmarkOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'close-outline': closeOutline,
  'download-outline': downloadOutline,
  'ellipsis-horizontal': ellipsisHorizontal,
  'ellipsis-vertical': ellipsisVertical,
  'git-merge-outline': gitMergeOutline,
  'information-circle-outline': informationCircleOutline,
  'keypad-outline': keypadOutline,
  'mail-outline': mailOutline,
  'people-outline': peopleOutline,
  'person-add-outline': personAddOutline,
  'person-circle-outline': personCircleOutline,
  'person-outline': personOutline,
  'radio-button-off-outline': radioButtonOffOutline,
  'radio-button-on-outline': radioButtonOnOutline,
  'remove-outline': removeOutline,
  'remove-circle': removeCircle,
  'remove-circle-outline': removeCircleOutline,
  'search-outline': searchOutline,
  'settings-outline': settingsOutline,
  'star-outline': starOutline,
  'time-outline': timeOutline,
  'trash-outline': trashOutline
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
