import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactListRowComponent } from '../../components/contact-list-row/contact-list-row.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-recent-page',
  standalone: true,
  imports: [NgFor, IonicModule, RouterLink, ContactListRowComponent, PageInsetComponent],
  templateUrl: './recent.page.html',
  styleUrls: ['./recent.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentPage {
  constructor(public readonly store: ContactsWorkspaceStore) {}
}
