import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ContactCard } from '../../data/app-data.models';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-contact-list-row',
  standalone: true,
  imports: [IonicModule, AvatarComponent],
  templateUrl: './contact-list-row.component.html',
  styleUrls: ['./contact-list-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListRowComponent {
  @Input({ required: true }) contact!: ContactCard;
  @Input() subtitle = '';
  @Input() titleTone: 'default' | 'danger' = 'default';
  @Input() selectionMode = false;
  @Input() selected = false;
  @Output() selectionToggle = new EventEmitter<void>();

  get initials(): string {
    return `${this.contact.lastName.slice(0, 1)}${this.contact.firstName.slice(0, 1)}`.toUpperCase();
  }
}
