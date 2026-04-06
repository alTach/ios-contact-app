import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContactCard } from '../../data/app-data.models';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-contact-list-row',
  standalone: true,
  imports: [NgIf, AvatarComponent],
  templateUrl: './contact-list-row.component.html',
  styleUrls: ['./contact-list-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListRowComponent {
  @Input({ required: true }) contact!: ContactCard;
  @Input() subtitle = '';
  @Input() titleTone: 'default' | 'danger' = 'default';

  get initials(): string {
    return `${this.contact.lastName.slice(0, 1)}${this.contact.firstName.slice(0, 1)}`.toUpperCase();
  }
}
