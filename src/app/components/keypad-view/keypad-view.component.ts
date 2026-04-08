import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SelectCustomEvent } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { AvatarComponent } from '../avatar/avatar.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-keypad-view',
  standalone: true,
  imports: [FormsModule, IonicModule, RouterLink, AvatarComponent],
  templateUrl: './keypad-view.component.html',
  styleUrls: ['./keypad-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadViewComponent {
  constructor(public readonly store: ContactsWorkspaceStore) {}

  handleAddContactSelect(event: SelectCustomEvent<string>): void {
    if (!event.detail.value) {
      return;
    }

    this.store.addContact();
    event.target.value = undefined;
  }
}
