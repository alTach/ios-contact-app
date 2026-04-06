import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs-shell-page',
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive],
  templateUrl: './tabs-shell.page.html',
  styleUrls: ['./tabs-shell.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsShellPage {}
