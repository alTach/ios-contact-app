import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tabs-shell-page',
  standalone: true,
  imports: [IonicModule, RouterLink],
  templateUrl: './tabs-shell.page.html',
  styleUrls: ['./tabs-shell.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsShellPage {
  private readonly router = inject(Router);

  isTabActive(prefix: string): boolean {
    return this.router.url === prefix || this.router.url.startsWith(`${prefix}/`);
  }
}
