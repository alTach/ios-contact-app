import { NgIf } from '@angular/common';
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
  imports: [NgIf, IonicModule, FormsModule, RouterLink, ContactsTabViewComponent, PageInsetComponent],
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsPage {
  @ViewChild(IonPopover) private popover?: IonPopover;

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
    void this.popover?.dismiss();
  }

  goBackToSources(): void {
    void this.navController.navigateBack('/tabs/contact');
  }
}
