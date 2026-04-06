import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [ContactsTabViewComponent],
  template: '<app-contacts-tab-view tab="contacts"></app-contacts-tab-view>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPage {}
