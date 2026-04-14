import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectCustomEvent } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { AvatarComponent } from '../avatar/avatar.component';
import { ContactListRowComponent } from '../contact-list-row/contact-list-row.component';
import { SearchToolbarComponent } from '../search-toolbar/search-toolbar.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-keypad-view',
  standalone: true,
  imports: [FormsModule, IonicModule, AvatarComponent, ContactListRowComponent, SearchToolbarComponent],
  templateUrl: './keypad-view.component.html',
  styleUrls: ['./keypad-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadViewComponent {
  private readonly router = inject(Router);

  constructor(public readonly store: ContactsWorkspaceStore) {}

  handleAddContactSelect(event: SelectCustomEvent<string>): void {
    if (!event.detail.value) {
      return;
    }

    if (event.detail.value === 'existing') {
      this.store.openKeypadExistingContactModal();
    } else {
      this.store.openAddContactModal(this.store.dialNumber);
    }

    event.target.value = undefined;
  }

  openDirectorySearch(): void {
    this.store.queueDirectorySearch(this.store.dialNumber);
    void this.router.navigate(['/tabs/directory']);
  }

  openContactLists(): void {
    this.store.closeKeypadExistingContactModal();
    void this.router.navigate(['/tabs/contact']);
  }

  jumpToExistingLetter(letter: string): void {
    setTimeout(() => {
      document.getElementById(`keypad-existing-letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  attachDialNumberToContact(contactId: number): void {
    this.store.attachDialNumberToContact(contactId);
  }
}
