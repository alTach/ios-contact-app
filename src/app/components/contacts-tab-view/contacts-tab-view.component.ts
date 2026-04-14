import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactListRowComponent } from '../contact-list-row/contact-list-row.component';
import { SearchToolbarComponent } from '../search-toolbar/search-toolbar.component';
import { ContactsTabKey, ContactsWorkspaceStore, ViewMode } from '../../state/contacts-workspace.store';
import { ContactSearchSection } from '../../state/trash/contact-search.models';

@Component({
  selector: 'app-contacts-tab-view',
  standalone: true,
  imports: [IonicModule, RouterLink, ContactListRowComponent, SearchToolbarComponent],
  templateUrl: './contacts-tab-view.component.html',
  styleUrls: ['./contacts-tab-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsTabViewComponent {
  readonly tab = input.required<ContactsTabKey>();
  readonly viewMode = input<ViewMode>('simple');
  readonly selectionMode = input(false);
  readonly selectionVersion = input(0);
  readonly showToolbar = input(true);
  readonly hideAuxiliary = input(false);

  readonly store = inject(ContactsWorkspaceStore);

  private readonly router = inject(Router);

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

  get isContactsTab(): boolean {
    return this.tab() === 'contacts';
  }

  get favoritePreviewContacts() {
    return this.store.favoritePreviewContacts();
  }

  get searchSections(): ContactSearchSection[] {
    return this.store.contactSearchSections();
  }

  get isContactSearchActive(): boolean {
    return this.isContactsTab && this.store.searchTerm.trim().length > 0;
  }

  get searchResultCount(): number {
    return this.store.contactSearchResultCount();
  }

  get bottomCountLabel(): string {
    if (this.isContactSearchActive) {
      return `${this.searchResultCount} контактов`;
    }

    const count = this.store.listContacts(this.tab()).length;
    return `${count} контактов`;
  }

  handleContactPress(contactId: number): void {
    if (this.selectionMode()) {
      this.store.toggleSelection(contactId);
      return;
    }

    void this.router.navigate(['/contact', contactId]);
  }
}
