import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonPopover, IonicModule } from '@ionic/angular';

import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

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

  constructor(public readonly store: ContactsWorkspaceStore) {}

  closeMenu(): void {
    void this.popover?.dismiss();
  }
}
