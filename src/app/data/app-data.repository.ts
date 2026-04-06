import { Inject, Injectable } from '@angular/core';

import { EMPTY, Observable, catchError, concat, distinctUntilChanged, of, tap } from 'rxjs';

import { AppDataSource, ContactCard, DirectoryEntry } from './app-data.models';
import { APP_DATA_SOURCE } from './app-data.tokens';
import { LocalCacheService } from './local-cache.service';

@Injectable({ providedIn: 'root' })
export class AppDataRepository {
  private readonly contactsCacheKey = 'contact-super-app.contacts';
  private readonly directoryCacheKey = 'contact-super-app.directory';

  constructor(
    @Inject(APP_DATA_SOURCE) private readonly dataSource: AppDataSource,
    private readonly cache: LocalCacheService
  ) {}

  getContacts(): Observable<ContactCard[]> {
    const cached = this.cache.read<ContactCard[]>(this.contactsCacheKey);
    const network$ = this.dataSource.fetchContacts().pipe(
      tap((contacts) => this.cache.write(this.contactsCacheKey, contacts)),
      catchError(() => EMPTY)
    );

    return concat(cached ? of(cached) : EMPTY, network$).pipe(
      distinctUntilChanged((left, right) => JSON.stringify(left) === JSON.stringify(right))
    );
  }

  getDirectory(): Observable<DirectoryEntry[]> {
    const cached = this.cache.read<DirectoryEntry[]>(this.directoryCacheKey);
    const network$ = this.dataSource.fetchDirectory().pipe(
      tap((items) => this.cache.write(this.directoryCacheKey, items)),
      catchError(() => EMPTY)
    );

    return concat(cached ? of(cached) : EMPTY, network$).pipe(
      distinctUntilChanged((left, right) => JSON.stringify(left) === JSON.stringify(right))
    );
  }
}
