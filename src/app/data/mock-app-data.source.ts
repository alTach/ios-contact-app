import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

import contactsJson from '../../assets/data/contacts.json';
import directoryJson from '../../assets/data/directory.json';
import { AppDataSource, ContactCard, DirectoryEntry } from './app-data.models';

@Injectable()
export class MockAppDataSource implements AppDataSource {
  fetchContacts(): Observable<ContactCard[]> {
    return of(contactsJson as ContactCard[]).pipe(delay(550));
  }

  fetchDirectory(): Observable<DirectoryEntry[]> {
    return of(directoryJson as DirectoryEntry[]).pipe(delay(700));
  }
}
