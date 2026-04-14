import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DirectoryViewComponent } from '../../components/directory-view/directory-view.component';
import { PageInsetComponent } from '../../components/page-inset/page-inset.component';
import { SearchToolbarComponent } from '../../components/search-toolbar/search-toolbar.component';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';

@Component({
  selector: 'app-directory-page',
  standalone: true,
  imports: [IonicModule, FormsModule, DirectoryViewComponent, PageInsetComponent, SearchToolbarComponent],
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryPage implements AfterViewInit {
  @ViewChild(SearchToolbarComponent) private searchToolbar?: SearchToolbarComponent;
  searchFocused = false;

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(public readonly store: ContactsWorkspaceStore) {}

  ngAfterViewInit(): void {
    const queuedSearch = this.store.consumePendingDirectorySearch();
    if (!queuedSearch) {
      return;
    }

    this.store.setDirectorySearch(queuedSearch);
    this.searchToolbar?.focusSearch();
  }

  setSearchFocused(value: boolean): void {
    this.searchFocused = value;
    this.cdr.markForCheck();
  }

  get directorySearchMode(): boolean {
    return this.searchFocused || this.store.directorySearch.trim().length > 0;
  }
}
