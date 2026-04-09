import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonPopover, IonicModule, NavController } from '@ionic/angular';

import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore, ViewMode } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink, ContactsTabViewComponent, PageInsetComponent],
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPage {
  @ViewChild('contactsMenuPopover') private contactsMenuPopover?: IonPopover;
  @ViewChild('selectionMenuPopover') private selectionMenuPopover?: IonPopover;

  constructor(
    public readonly store: ContactsWorkspaceStore,
    private readonly cdr: ChangeDetectorRef,
    private readonly navController: NavController
  ) {}

  setViewMode(mode: ViewMode): void {
    this.store.setViewMode(mode);
    this.cdr.markForCheck();
  }

  closeMenu(): void {
    void this.contactsMenuPopover?.dismiss();
    this.cdr.markForCheck();
  }

  async enterSelectionMode(): Promise<void> {
    if (!this.store.selectionMode) {
      this.store.toggleSelectionMode();
      this.cdr.markForCheck();
    }
    this.closeMenu();
  }

  closeSelectionMenu(): void {
    void this.selectionMenuPopover?.dismiss();
  }

  async exitSelectionMode(): Promise<void> {
    await this.selectionMenuPopover?.dismiss();
    if (this.store.selectionMode) {
      this.store.toggleSelectionMode();
      this.cdr.markForCheck();
    }
    (document.activeElement as HTMLElement | null)?.blur();
  }

  goBackToSources(): void {
    void this.navController.navigateBack('/tabs/contact');
  }

  get showBackLabel(): boolean {
    return this.store.currentContactListTitle().length <= 7;
  }
}
