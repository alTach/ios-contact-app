import { ChangeDetectionStrategy, Component, ElementRef, SimpleChanges, ViewChild, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItemSliding, IonModal, IonicModule } from '@ionic/angular';

import { AddContactDraft } from '../../data/app-data.models';
import { ContactsWorkspaceStore } from '../../state/contacts-workspace.store';
import {
  AddContactDeletableFieldKeyType,
  AddContactDraftVisibilityModel,
  AddContactLabeledFieldKeyType,
  AddContactLabeledFieldRowModel
} from './trash/add-contact-sheet.types';

@Component({
  selector: 'app-add-contact-sheet',
  standalone: true,
  imports: [FormsModule, IonicModule],
  templateUrl: './add-contact-sheet.component.html',
  styleUrls: ['./add-contact-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddContactSheetComponent {
  private readonly store = inject(ContactsWorkspaceStore);
  private readonly customLabelsByField: Record<AddContactLabeledFieldKeyType, string[]> = {
    phone: [],
    email: [],
    url: [],
    customDate: [],
    closePerson: []
  };

  @ViewChild(IonModal) private modal?: IonModal;
  @ViewChild('photoInput') private photoInput?: ElementRef<HTMLInputElement>;
  @ViewChild('customLabelInput') private customLabelInput?: IonInput;

  readonly isOpen = input(false);
  readonly prefillPhone = input('');
  readonly closed = output<void>();
  readonly saved = output<AddContactDraft>();

  protected draft = this.createEmptyDraft();
  protected visibility: AddContactDraftVisibilityModel = this.createDefaultVisibility();
  protected rows: Record<AddContactLabeledFieldKeyType, AddContactLabeledFieldRowModel[]> = {
    phone: [],
    email: [],
    url: [],
    customDate: [],
    closePerson: []
  };
  protected discardSheetOpen = false;
  protected photoPickerOpen = false;
  protected labelModalOpen = false;
  protected labelModalPage: 'root' | 'all' = 'root';
  protected customLabelInputOpen = false;
  protected customLabelDraft = '';
  protected readonly pickerFavoritesTitle = 'Избранное';
  protected activeLabelField: AddContactLabeledFieldKeyType | null = null;
  protected activeLabelIndex = 0;
  protected contactPickerOpen = false;
  protected revealDeleteFor: string | null = null;
  protected readonly discardButtons = [
    {
      text: 'Отменить изменения',
      role: 'destructive',
      handler: () => this.confirmDiscard()
    },
    {
      text: 'Продолжить изменения',
      role: 'cancel',
      handler: () => this.closeDiscardSheet()
    }
  ];
  protected readonly photoButtons = [
    {
      text: 'Камера',
      handler: () => this.pickPhoto('camera')
    },
    {
      text: 'Выбрать фото',
      handler: () => this.pickPhoto('photo')
    },
    {
      text: 'Выбрать файл',
      handler: () => this.pickPhoto('file')
    },
    {
      text: 'Отмена',
      role: 'cancel',
      handler: () => this.closePhotoPicker()
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['isOpen'] || changes['prefillPhone']) && this.isOpen()) {
      this.resetDraft();
    }
  }

  protected readonly canDismiss = async (_data?: unknown, role?: string): Promise<boolean> => {
    if (role === 'save' || role === 'discard' || !this.hasAnyValue()) {
      return true;
    }

    this.discardSheetOpen = true;
    return false;
  };

  requestClose(): void {
    void this.modal?.dismiss(undefined, 'cancel');
  }

  closeDiscardSheet(): void {
    this.discardSheetOpen = false;
  }

  confirmDiscard(): void {
    this.discardSheetOpen = false;
    void this.modal?.dismiss(undefined, 'discard');
  }

  commit(): void {
    this.saved.emit(this.cloneDraft());
    void this.modal?.dismiss(undefined, 'save');
  }

  handleDidDismiss(): void {
    this.discardSheetOpen = false;
    this.photoPickerOpen = false;
    this.labelModalOpen = false;
    this.labelModalPage = 'root';
    this.customLabelInputOpen = false;
    this.customLabelDraft = '';
    this.activeLabelField = null;
    this.activeLabelIndex = 0;
    this.contactPickerOpen = false;
    this.revealDeleteFor = null;
    this.closed.emit();
  }

  addRow(field: AddContactLabeledFieldKeyType): void {
    this.rows = {
      ...this.rows,
      [field]: [
        ...this.rows[field],
        { label: this.nextLabel(field, this.rows[field].length), value: '' }
      ]
    };
    this.revealDeleteFor = null;
  }

  hasRows(field: AddContactLabeledFieldKeyType): boolean {
    return this.rows[field].length > 0;
  }

  fieldRows(field: AddContactLabeledFieldKeyType): AddContactLabeledFieldRowModel[] {
    return this.rows[field];
  }

  rowLabel(field: AddContactLabeledFieldKeyType, index: number): string {
    return this.rows[field][index]?.label ?? this.nextLabel(field, index);
  }

  isActiveLabel(label: string): boolean {
    if (!this.activeLabelField) {
      return false;
    }

    return this.rowLabel(this.activeLabelField, this.activeLabelIndex) === label;
  }

  fieldPlaceholder(field: AddContactLabeledFieldKeyType): string {
    switch (field) {
      case 'phone':
        return 'Телефон';
      case 'email':
        return 'Email';
      case 'url':
        return 'Веб-сайт';
      case 'customDate':
        return 'Дата';
      case 'closePerson':
        return 'Контакт';
    }
  }

  fieldValueAt(field: AddContactLabeledFieldKeyType, index: number): string {
    return this.rows[field][index]?.value ?? '';
  }

  updateFieldValueAt(field: AddContactLabeledFieldKeyType, index: number, value: string): void {
    const nextRows = [...this.rows[field]];
    const current = nextRows[index];
    if (!current) {
      return;
    }

    nextRows[index] = { ...current, value };
    this.rows = {
      ...this.rows,
      [field]: nextRows
    };
  }

  closeDeleteReveal(): void {
    this.revealDeleteFor = null;
  }

  handleDeleteToggle(event: Event, field: AddContactDeletableFieldKeyType, index = 0): void {
    event.stopPropagation();
    this.toggleDeleteRow(field, index);
  }

  toggleDeleteRow(field: AddContactDeletableFieldKeyType, index = 0): void {
    const key = `${field}:${index}`;
    this.revealDeleteFor = this.revealDeleteFor === key ? null : key;
  }

  isDeleteRowOpen(field: AddContactDeletableFieldKeyType, index = 0): boolean {
    return this.revealDeleteFor === `${field}:${index}`;
  }

  removeField(field: AddContactDeletableFieldKeyType, index = 0): void {
    this.revealDeleteFor = null;

    switch (field) {
      case 'phone':
      case 'email':
      case 'url':
      case 'customDate':
      case 'closePerson':
        this.rows = {
          ...this.rows,
          [field]: this.rows[field].filter((_, rowIndex) => rowIndex !== index)
        };
        break;
      case 'notes':
        this.visibility = { ...this.visibility, notes: false };
        this.draft = { ...this.draft, notes: '' };
        break;
    }
  }

  revealNotes(): void {
    this.visibility = { ...this.visibility, notes: true };
    this.revealDeleteFor = null;
  }

  openPhotoPicker(): void {
    this.photoPickerOpen = true;
  }

  closePhotoPicker(): void {
    this.photoPickerOpen = false;
  }

  pickPhoto(mode: 'camera' | 'photo' | 'file'): void {
    const input = this.photoInput?.nativeElement;
    if (!input) {
      return;
    }

    input.value = '';
    input.accept = mode === 'file' ? '*/*' : 'image/*';
    if (mode === 'camera') {
      input.setAttribute('capture', 'environment');
    } else {
      input.removeAttribute('capture');
    }

    this.closePhotoPicker();
    input.click();
  }

  handlePhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    this.draft = {
      ...this.draft,
      photoUrl: URL.createObjectURL(file)
    };
  }

  openLabelModal(field: AddContactLabeledFieldKeyType, index: number): void {
    this.activeLabelField = field;
    this.activeLabelIndex = index;
    this.labelModalPage = 'root';
    this.customLabelInputOpen = false;
    this.customLabelDraft = '';
    this.labelModalOpen = true;
  }

  closeLabelModal(): void {
    this.labelModalOpen = false;
    this.labelModalPage = 'root';
    this.customLabelInputOpen = false;
    this.customLabelDraft = '';
    this.activeLabelField = null;
    this.activeLabelIndex = 0;
  }

  openAllLabels(): void {
    this.labelModalPage = 'all';
  }

  goBackToLabelRoot(): void {
    this.labelModalPage = 'root';
  }

  enableCustomLabel(): void {
    this.customLabelInputOpen = true;
    setTimeout(() => {
      void this.customLabelInput?.setFocus();
    }, 0);
  }

  saveCustomLabel(): void {
    const value = this.customLabelDraft.trim();
    if (!value || !this.activeLabelField) {
      this.customLabelInputOpen = false;
      this.customLabelDraft = '';
      return;
    }

    if (!this.customLabelsByField[this.activeLabelField].includes(value)) {
      this.customLabelsByField[this.activeLabelField] = [...this.customLabelsByField[this.activeLabelField], value];
    }

    this.updateRowLabel(this.activeLabelField, this.activeLabelIndex, value);
    this.customLabelInputOpen = false;
    this.customLabelDraft = '';
  }

  applyLabel(label: string): void {
    if (!this.activeLabelField) {
      return;
    }

    this.updateRowLabel(this.activeLabelField, this.activeLabelIndex, label);
    this.closeLabelModal();
  }

  labelOptions(field: AddContactLabeledFieldKeyType | null): string[] {
    switch (field) {
      case 'phone':
        return ['сотовый', 'домашний', 'рабочий', 'учебный', 'главный', 'другой'];
      case 'email':
      case 'url':
        return ['домашний', 'рабочий', 'учебный', 'другой'];
      case 'customDate':
        return ['юбилей', 'день рождения', 'свадьба'];
      case 'closePerson':
        return ['мать', 'отец', 'брат', 'сестра', 'сын', 'дочь', 'супруг', 'партнер', 'ассистент', 'руководитель'];
      default:
        return [];
    }
  }

  allClosePersonLabels(): string[] {
    return [
      'мать',
      'отец',
      'брат',
      'сестра',
      'сын',
      'дочь',
      'супруг',
      'партнер',
      'ассистент',
      'руководитель',
      'бабушка',
      'двоюродная сестра',
      'двоюродный брат',
      'дедушка',
      'жена',
      'муж',
      'подруга',
      'тетя'
    ];
  }

  openContactPicker(index: number): void {
    this.activeLabelIndex = index;
    this.contactPickerOpen = true;
  }

  closeContactPicker(): void {
    this.contactPickerOpen = false;
  }

  customLabels(field: AddContactLabeledFieldKeyType | null): string[] {
    if (!field) {
      return [];
    }

    return this.customLabelsByField[field];
  }

  handleCustomLabelBlur(): void {
    this.saveCustomLabel();
  }

  removeCustomLabel(field: AddContactLabeledFieldKeyType, label: string, slidingItem: IonItemSliding): void {
    this.customLabelsByField[field] = this.customLabelsByField[field].filter((item) => item !== label);
    void slidingItem.close();
  }

  pickerGroupedContacts() {
    const favoriteContacts = this.store.listContacts('favorites');
    const favoriteIds = new Set(favoriteContacts.map((contact) => contact.id));
    const groupedContacts = this.store.groupedListContacts('contacts')
      .map((section) => ({
        letter: section.letter,
        contacts: section.contacts.filter((contact) => !favoriteIds.has(contact.id))
      }))
      .filter((section) => section.contacts.length > 0);

    if (!favoriteContacts.length) {
      return groupedContacts;
    }

    return [
      { letter: this.pickerFavoritesTitle, contacts: favoriteContacts },
      ...groupedContacts
    ];
  }

  pickerAlphabet(): string[] {
    return this.store.alphabet;
  }

  jumpToPickerLetter(letter: string): void {
    setTimeout(() => {
      document.getElementById(`picker-letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  selectCloseContact(contactId: number): void {
    const contact = this.store.contactById(contactId);
    if (!contact) {
      return;
    }

    this.updateFieldValueAt('closePerson', this.activeLabelIndex, contact.fullName);
    this.contactPickerOpen = false;
  }

  protected hasAnyValue(): boolean {
    return [
      this.draft.photoUrl,
      this.draft.lastName,
      this.draft.firstName,
      this.draft.company,
      ...this.rows.phone.map((row) => row.value),
      ...this.rows.email.map((row) => row.value),
      ...this.rows.url.map((row) => row.value),
      ...this.rows.customDate.map((row) => row.value),
      ...this.rows.closePerson.map((row) => row.value),
      this.draft.notes
    ].some((value) => value.trim().length > 0);
  }

  private nextLabel(field: AddContactLabeledFieldKeyType, index: number): string {
    switch (field) {
      case 'phone':
        return ['сотовый', 'домашний', 'рабочий', 'учебный', 'главный'][index] ?? 'другой';
      case 'email':
        return ['домашний', 'рабочий', 'учебный'][index] ?? 'другой';
      case 'url':
        return ['домашний', 'рабочий', 'учебный'][index] ?? 'другой';
      case 'customDate':
        return ['юбилей', 'день рождения', 'свадьба'][index] ?? 'другой';
      case 'closePerson':
        return ['мать', 'отец', 'брат', 'сестра', 'сын', 'дочь', 'супруг', 'партнер', 'ассистент', 'руководитель'][index] ?? 'другой';
    }
  }

  private resetDraft(): void {
    this.draft = this.createEmptyDraft();
    this.rows = {
      phone: this.prefillPhone().trim() ? [{ label: this.nextLabel('phone', 0), value: this.prefillPhone().trim() }] : [],
      email: [],
      url: [],
      customDate: [],
      closePerson: []
    };
    this.visibility = {
      notes: true
    };
  }

  private createEmptyDraft(): AddContactDraft {
    return {
      photoUrl: '',
      lastName: '',
      firstName: '',
      company: '',
      phones: [],
      emails: [],
      urls: [],
      address: {
        street: '',
        city: '',
        region: '',
        country: '',
        postalCode: ''
      },
      customDate: '',
      closePerson: '',
      notes: ''
    };
  }

  private createDefaultVisibility(): AddContactDraftVisibilityModel {
    return {
      notes: true
    };
  }

  private cloneDraft(): AddContactDraft {
    return {
      ...this.draft,
      phones: this.rows.phone.map((row) => row.value.trim()).filter(Boolean),
      emails: this.rows.email.map((row) => row.value.trim()).filter(Boolean),
      urls: this.rows.url.map((row) => row.value.trim()).filter(Boolean),
      customDate: this.rows.customDate.map((row) => row.value.trim()).filter(Boolean).join(' | '),
      closePerson: this.rows.closePerson.map((row) => row.value.trim()).filter(Boolean).join(' | ')
    };
  }

  private updateRowLabel(field: AddContactLabeledFieldKeyType, index: number, label: string): void {
    const nextRows = [...this.rows[field]];
    const current = nextRows[index];
    if (!current) {
      return;
    }

    nextRows[index] = {
      ...current,
      label
    };
    this.rows = {
      ...this.rows,
      [field]: nextRows
    };
  }
}
