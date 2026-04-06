import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DirectoryViewComponent } from '../../components/directory-view/directory-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-directory-page',
  standalone: true,
  imports: [IonicModule, FormsModule, DirectoryViewComponent, PageInsetComponent],
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryPage {
  constructor(public readonly store: ContactsWorkspaceStore) {}
}
