import { Pipe, PipeTransform } from '@angular/core';

import { ContactCard } from '../../../data/app-data.models';

@Pipe({
  name: 'contactInitials',
  standalone: true
})
export class ContactInitialsPipe implements PipeTransform {
  transform(contact: ContactCard): string {
    return `${contact.lastName.slice(0, 1)}${contact.firstName.slice(0, 1)}`.toUpperCase();
  }
}
