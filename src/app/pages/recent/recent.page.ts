import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';

@Component({
  selector: 'app-recent-page',
  standalone: true,
  imports: [ContactsTabViewComponent],
  template: '<app-contacts-tab-view tab="recent"></app-contacts-tab-view>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentPage {}
