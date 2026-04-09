import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AddContactDraft } from '../../data/app-data.models';
import { AddContactSheetComponent } from '../../components/add-contact-sheet/add-contact-sheet.component';
import { KeypadViewComponent } from '../../components/keypad-view/keypad-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-keypad-page',
  standalone: true,
  imports: [IonicModule, AddContactSheetComponent, KeypadViewComponent, PageInsetComponent],
  templateUrl: './keypad.page.html',
  styleUrls: ['./keypad.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadPage {
  constructor(public readonly store: ContactsWorkspaceStore) {}

  saveContactDraft(draft: AddContactDraft): void {
    this.store.saveNewContact(draft);
  }
}
