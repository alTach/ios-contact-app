import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ContactCard } from '../../data/app-data.models';
import { AvatarComponent } from '../avatar/avatar.component';
import { ContactInitialsPipe } from './trash/contact-initials.pipe';

@Component({
  selector: 'app-contact-list-row',
  standalone: true,
  imports: [IonicModule, AvatarComponent, ContactInitialsPipe],
  templateUrl: './contact-list-row.component.html',
  styleUrls: ['./contact-list-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListRowComponent {
  readonly contact = input.required<ContactCard>();
  readonly subtitle = input('');
  readonly titleTone = input<'default' | 'danger'>('default');
  readonly selectionMode = input(false);
  readonly selected = input(false);
  readonly selectionToggle = output<void>();
}
