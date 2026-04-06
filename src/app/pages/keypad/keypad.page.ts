import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KeypadViewComponent } from '../../components/keypad-view/keypad-view.component';

@Component({
  selector: 'app-keypad-page',
  standalone: true,
  imports: [KeypadViewComponent],
  template: '<app-keypad-view></app-keypad-view>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadPage {}
