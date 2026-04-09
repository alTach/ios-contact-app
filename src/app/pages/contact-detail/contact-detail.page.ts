import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactCard } from '../../data/app-data.models';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contact-detail-page',
  standalone: true,
  imports: [IonicModule, PageInsetComponent],
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(ContactsWorkspaceStore);

  private readonly contactId = Number(this.route.snapshot.paramMap.get('id'));

  get contact(): ContactCard | null {
    return this.store.contactById(this.contactId);
  }

  addTag(): void {
    this.store.addTagToContact(this.contactId);
  }
}
