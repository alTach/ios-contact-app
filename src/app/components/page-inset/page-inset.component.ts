import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-inset',
  standalone: true,
  template: '<div class="page-inset"><ng-content></ng-content></div>',
  styleUrls: ['./page-inset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageInsetComponent {}
