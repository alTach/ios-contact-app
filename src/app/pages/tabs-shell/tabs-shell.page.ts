import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs-shell-page',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './tabs-shell.page.html',
  styleUrls: ['./tabs-shell.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsShellPage {}
