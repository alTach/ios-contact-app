import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AppDataSource, ContactCard, DirectoryEntry } from './app-data.models';

@Injectable()
export class RealAppDataSource implements AppDataSource {
  constructor(private readonly http: HttpClient) {}

  fetchContacts(): Observable<ContactCard[]> {
    return this.http.get<ContactCard[]>('/assets/data/contacts.json');
  }

  fetchDirectory(): Observable<DirectoryEntry[]> {
    return this.http.get<DirectoryEntry[]>('/assets/data/directory.json');
  }
}
