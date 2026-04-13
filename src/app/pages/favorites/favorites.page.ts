import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ContactsTabViewComponent } from '../../components/contacts-tab-view/contacts-tab-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [IonicModule, ContactsTabViewComponent, PageInsetComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesPage {}
