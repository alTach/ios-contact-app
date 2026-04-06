import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactListRowComponent } from '../contact-list-row/contact-list-row.component';
import { ContactsTabKey, ContactsWorkspaceStore, ViewMode } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contacts-tab-view',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, IonicModule, RouterLink, ContactListRowComponent],
  templateUrl: './contacts-tab-view.component.html',
  styleUrls: ['./contacts-tab-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsTabViewComponent implements AfterViewInit {
  @Input({ required: true }) tab!: ContactsTabKey;
  @Input() viewMode: ViewMode = 'simple';
  @ViewChild('searchInput') searchInput?: ElementRef<{ setFocus: () => Promise<void> }>;

  constructor(public readonly store: ContactsWorkspaceStore) {}

  ngAfterViewInit(): void {
    if (this.store.searchOpen) {
      setTimeout(() => this.searchInput?.nativeElement.setFocus(), 120);
    }
  }

  get title(): string {
    switch (this.tab) {
      case 'favorites':
        return 'Избранное';
      case 'recent':
        return 'Недавние';
      default:
        return 'Контакты';
    }
  }

  get subtitle(): string {
    return `${this.store.visibleContacts(this.tab).length} из ${this.store.contacts.length} контактов`;
  }

  get bottomCountLabel(): string {
    const count = this.store.listContacts(this.tab).length;
    return `${count} контактов`;
  }

  get isContactsTab(): boolean {
    return this.tab === 'contacts';
  }
}
