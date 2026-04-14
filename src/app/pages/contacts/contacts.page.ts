import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonPopover, IonicModule, NavController } from '@ionic/angular';

import { AddContactSheetComponent } from '../../components/add-contact-sheet/add-contact-sheet.component';
import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';
import { SearchToolbarComponent } from '../../components/search-toolbar/search-toolbar.component';
import { AddContactDraft } from '../../data/app-data.models';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore, ViewMode } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink, AddContactSheetComponent, ContactsTabViewComponent, PageInsetComponent, SearchToolbarComponent],
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPage {
  @ViewChild('contactsMenuPopover') private contactsMenuPopover?: IonPopover;
  @ViewChild('selectionMenuPopover') private selectionMenuPopover?: IonPopover;

  readonly store = inject(ContactsWorkspaceStore);
  searchFocused = false;

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly navController = inject(NavController);

  setViewMode(mode: ViewMode): void {
    this.store.setViewMode(mode);
    this.cdr.markForCheck();
  }

  closeMenu(): void {
    void this.contactsMenuPopover?.dismiss();
    this.cdr.markForCheck();
  }

  enterSelectionMode(): void {
    if (!this.store.selectionMode) {
      this.store.toggleSelectionMode();
      this.cdr.markForCheck();
    }
    this.closeMenu();
  }

  closeSelectionMenu(): void {
    void this.selectionMenuPopover?.dismiss();
  }

  exitSelectionMode(): void {
    void this.selectionMenuPopover?.dismiss().then(() => {
      if (this.store.selectionMode) {
        this.store.toggleSelectionMode();
        this.cdr.markForCheck();
      }
      (document.activeElement as HTMLElement | null)?.blur();
    });
  }

  goBackToSources(): void {
    void this.navController.navigateBack('/tabs/contact');
  }

  saveContactDraft = (draft: AddContactDraft): void => {
    this.store.saveNewContact(draft);
    this.cdr.markForCheck();
  };

  setSearchFocused(value: boolean): void {
    this.searchFocused = value;
    this.cdr.markForCheck();
  }

  openDirectorySearch(): void {
    this.store.queueDirectorySearch(this.store.searchTerm);
    void this.navController.navigateForward('/tabs/directory');
  }

  get showBackLabel(): boolean {
    return this.store.currentContactListTitle().length <= 7;
  }

  get contactsSearchMode(): boolean {
    return this.searchFocused || this.store.searchTerm.trim().length > 0;
  }
}
