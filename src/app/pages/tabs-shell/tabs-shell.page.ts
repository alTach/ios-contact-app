import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs-shell-page',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tabs-shell.page.html',
  styleUrls: ['./tabs-shell.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsShellPage {}
