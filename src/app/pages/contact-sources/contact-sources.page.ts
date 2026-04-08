import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contact-sources-page',
  standalone: true,
  imports: [IonicModule, RouterLink, PageInsetComponent],
  templateUrl: './contact-sources.page.html',
  styleUrls: ['./contact-sources.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactSourcesPage {
  constructor(public readonly store: ContactsWorkspaceStore) {}
}
