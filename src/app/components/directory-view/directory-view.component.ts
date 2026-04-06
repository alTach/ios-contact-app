import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-directory-view',
  standalone: true,
  imports: [NgFor, FormsModule, IonicModule, RouterLink],
  templateUrl: './directory-view.component.html',
  styleUrls: ['./directory-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryViewComponent {
  constructor(public readonly store: ContactsWorkspaceStore) {}
}
