import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [NgFor, IonicModule, PageInsetComponent],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage {
  readonly syncProviders = [
    { title: 'Google Contacts', description: 'Синхронизация аккаунта Google Workspace', enabled: true },
    { title: 'Apple iCloud', description: 'Контакты и карточки Apple', enabled: true },
    { title: 'Samsung Cloud', description: 'Синхронизация устройств Galaxy', enabled: false },
    { title: 'Microsoft', description: 'Outlook и Exchange', enabled: false },
    { title: 'Telegram', description: 'Импорт совпадающих телефонов', enabled: false }
  ];

  readonly syncScopes = ['Личные', 'Рабочие', 'Семья', 'Избранное'];
  readonly exportOptions = ['CSV', 'vCard', 'JSON backup'];
}
