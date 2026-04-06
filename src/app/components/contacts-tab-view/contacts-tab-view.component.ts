import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactsTabKey, ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contacts-tab-view',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
  templateUrl: './contacts-tab-view.component.html',
  styleUrls: ['./contacts-tab-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsTabViewComponent implements AfterViewInit {
  @Input({ required: true }) tab!: ContactsTabKey;
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
}
