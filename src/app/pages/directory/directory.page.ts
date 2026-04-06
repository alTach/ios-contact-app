import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DirectoryViewComponent } from '../../components/directory-view/directory-view.component';

@Component({
  selector: 'app-directory-page',
  standalone: true,
  imports: [DirectoryViewComponent],
  template: '<app-directory-view></app-directory-view>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryPage {}
