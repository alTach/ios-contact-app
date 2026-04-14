import { ChangeDetectionStrategy, Component, ViewChild, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-toolbar',
  standalone: true,
  imports: [FormsModule, IonicModule],
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchToolbarComponent {
  @ViewChild(IonSearchbar) private searchbar?: IonSearchbar;

  readonly value = input('');
  readonly placeholder = input('Поиск');
  readonly type = input('search');
  readonly inputmode = input('search');
  readonly valueChange = output<string>();
  readonly focusChange = output<boolean>();
  readonly canceled = output<void>();

  protected cancelVisible = false;

  handleValueInput(value: string | null | undefined): void {
    this.valueChange.emit(value ?? '');
  }

  handleFocus(): void {
    this.cancelVisible = true;
    this.focusChange.emit(true);
  }

  handleBlur(): void {
    setTimeout(() => {
      this.cancelVisible = false;
      this.focusChange.emit(false);
    }, 120);
  }

  handleCancel(): void {
    this.cancelVisible = false;
    this.focusChange.emit(false);
    this.canceled.emit();
    void this.searchbar?.getInputElement().then((inputElement) => inputElement.blur());
  }

  focusSearch(): void {
    setTimeout(() => {
      void this.searchbar?.setFocus();
    }, 0);
  }
}
