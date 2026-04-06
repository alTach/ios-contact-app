import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-keypad-view',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './keypad-view.component.html',
  styleUrls: ['./keypad-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeypadViewComponent {
  constructor(public readonly store: ContactsWorkspaceStore) {}
}
