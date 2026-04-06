import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { KeypadViewComponent } from '../../components/keypad-view/keypad-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';

@Component({
  selector: 'app-keypad-page',
  standalone: true,
  imports: [IonicModule, RouterLink, KeypadViewComponent, PageInsetComponent],
  templateUrl: './keypad.page.html',
  styleUrls: ['./keypad.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadPage {}
