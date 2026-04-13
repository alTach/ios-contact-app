import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactListRowComponent } from '../contact-list-row/contact-list-row.component';
import { ContactsTabKey, ContactsWorkspaceStore, ViewMode } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contacts-tab-view',
  standalone: true,
  imports: [FormsModule, IonicModule, RouterLink, ContactListRowComponent],
  templateUrl: './contacts-tab-view.component.html',
  styleUrls: ['./contacts-tab-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsTabViewComponent implements AfterViewInit {
  readonly tab = input.required<ContactsTabKey>();
  readonly viewMode = input<ViewMode>('simple');
  readonly selectionMode = input(false);
  readonly selectionVersion = input(0);
  readonly showToolbar = input(true);
  @ViewChild('searchInput') searchInput?: ElementRef<{ setFocus: () => Promise<void> }>;

  readonly store = inject(ContactsWorkspaceStore);

  private readonly router = inject(Router);

  ngAfterViewInit(): void {
    if (this.store.searchOpen) {
      setTimeout(() => this.searchInput?.nativeElement.setFocus(), 120);
    }
  }

  get title(): string {
    switch (this.tab()) {
      case 'favorites':
        return 'Избранное';
      case 'recent':
        return 'Недавние';
      default:
        return 'Контакты';
    }
  }

  get subtitle(): string {
    return `${this.store.visibleContacts(this.tab()).length} из ${this.store.contacts.length} контактов`;
  }

  get bottomCountLabel(): string {
    const count = this.store.listContacts(this.tab()).length;
    return `${count} контактов`;
  }

  get isContactsTab(): boolean {
    return this.tab() === 'contacts';
  }

  get favoritePreviewContacts() {
    return this.store.favoritePreviewContacts();
  }

  handleContactPress(contactId: number): void {
    if (this.selectionMode()) {
      this.store.toggleSelection(contactId);
      return;
    }

    void this.router.navigate(['/contact', contactId]);
  }
}
