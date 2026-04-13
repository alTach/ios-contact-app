import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDataRepository } from '../data/app-data.repository';
import { AddContactDraft, ContactCard, DirectoryEntry } from '../data/app-data.models';

export type ContactsTabKey = 'favorites' | 'recent' | 'contacts';
export type FilterKey = 'all' | 'incoming' | 'outgoing' | 'missed' | 'unknown' | 'long';
export type ViewMode = 'simple' | 'extended';
export type PortalActionType = 'review-duplicates' | 'sync-needed' | 'birthday';
export type ContactSourceKey = 'Google' | 'Телефон' | 'iCloud';

export interface ContactSourceList {
  id: string;
  title: string;
  source: ContactSourceKey;
}

export interface PortalAction {
  label: string;
  kind: 'primary' | 'secondary';
  action: 'work' | 'dismiss';
}

export interface PortalCard {
  id: string;
  type: PortalActionType;
  title: string;
  message: string;
  details: string[];
  actions: PortalAction[];
}

@Injectable({ providedIn: 'root' })
export class ContactsWorkspaceStore {
  private readonly repository = inject(AppDataRepository);
  private readonly destroyRef = inject(DestroyRef);

  activeGroup = 'Все';
  activeFilter: FilterKey = 'all';
  activeDataSource: ContactSourceKey = 'Google';
  activeContactListId = 'gmail-1';
  activeLetter = '';
  searchOpen = true;
  searchTerm = '';
  selectionMode = false;
  viewMode: ViewMode = 'simple';
  addContactModalOpen = false;
  addContactPrefillPhone = '';
  directorySearch = '';
  dialNumber = '';
  activeCallSource = 'SIM 1';
  addContactPressed = false;
  keypadMatchesModalOpen = false;
  keypadMatchesSearch = '';
  sheetOpen = false;
  selectedIds = new Set<number>();
  selectionVersion = 0;
  selectedContact: ContactCard | null = null;
  contacts: ContactCard[] = [];
  directoryEntries: DirectoryEntry[] = [];
  groups: string[] = ['Все'];
  alphabet: string[] = [];
  userProfile: ContactCard | null = null;
  portalCards: PortalCard[] = [
    {
      id: 'duplicates',
      type: 'review-duplicates',
      title: 'Найдены возможные дубликаты',
      message: '3 контакта похожи по номеру и имени. Можно объединить их в одну карточку.',
      details: ['Цой Виктор / Цой Виктор Сергеевич', 'Громов Илья / Илья Громов', 'МФЦ Тверской / Мои документы Тверской'],
      actions: [
        { label: 'Посмотреть дубликаты', kind: 'primary', action: 'work' }
      ]
    }
  ];

  readonly filters: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: 'Все' },
    { key: 'incoming', label: 'Входящие' },
    { key: 'outgoing', label: 'Исходящие' },
    { key: 'missed', label: 'Пропущенные' },
    { key: 'unknown', label: 'Неизвестные' },
    { key: 'long', label: 'Дольше 10 мин' }
  ];

  readonly callSources = ['SIM 1', 'SIM 2', 'WhatsApp'];
  readonly dataSources: ContactSourceKey[] = ['Google', 'Телефон', 'iCloud'];
  contactLists: ContactSourceList[] = [
    { id: 'gmail-1', title: 'gmail1', source: 'Google' },
    { id: 'gmail-2', title: 'gmail2', source: 'Google' },
    { id: 'phone-1', title: 'Телефон', source: 'Телефон' },
    { id: 'icloud-1', title: 'iCloud', source: 'iCloud' }
  ];

  constructor() {
    this.repository.getContacts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((contacts) => {
        this.contacts = [...contacts].sort((left, right) => left.lastName.localeCompare(right.lastName, 'ru'));
        this.groups = ['Все', ...new Set(this.contacts.map((contact) => contact.group))];
        this.alphabet = [...new Set(this.contacts.map((contact) => this.getLetter(contact)))];
        this.userProfile = this.contacts[0] ?? null;
      });

    this.repository.getDirectory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries) => {
        this.directoryEntries = entries;
      });
  }

  setGroup(group: string): void {
    this.activeGroup = group;
  }

  setFilter(filter: FilterKey): void {
    this.activeFilter = filter;
  }

  setDataSource(source: ContactSourceKey): void {
    this.activeDataSource = source;
  }

  setActiveContactList(listId: string): void {
    const list = this.contactLists.find((candidate) => candidate.id === listId);
    if (!list) {
      return;
    }

    this.activeContactListId = list.id;
    this.activeDataSource = list.source;
  }

  addContactList(): void {
    const nextIndex = this.contactLists.filter((list) => list.source === this.activeDataSource).length + 1;
    const title = this.newContactListTitle(this.activeDataSource, nextIndex);
    const id = this.newContactListId(this.activeDataSource, nextIndex);
    const nextList: ContactSourceList = {
      id,
      title,
      source: this.activeDataSource
    };

    this.contactLists = [...this.contactLists, nextList];
    this.setActiveContactList(nextList.id);
  }

  // toggleSearch(): void {
  //   this.searchOpen = !this.searchOpen;
  //   if (!this.searchOpen) {
  //     this.searchTerm = '';
  //   }
  // }

  toggleSelectionMode(): void {
    this.selectionMode = !this.selectionMode;
    if (!this.selectionMode) {
      this.selectedIds.clear();
    }
    this.bumpSelectionVersion();
  }

  allVisibleSelected(tab: ContactsTabKey): boolean {
    const visibleIds = this.listContacts(tab).map((contact) => contact.id);
    return visibleIds.length > 0 && visibleIds.every((contactId) => this.selectedIds.has(contactId));
  }

  someVisibleSelected(tab: ContactsTabKey): boolean {
    return this.listContacts(tab).some((contact) => this.selectedIds.has(contact.id));
  }

  toggleSelectAllVisible(tab: ContactsTabKey): void {
    const visibleIds = this.listContacts(tab).map((contact) => contact.id);
    if (!visibleIds.length) {
      return;
    }

    if (this.allVisibleSelected(tab)) {
      this.selectedIds.clear();
      this.bumpSelectionVersion();
      return;
    }

    if (this.someVisibleSelected(tab)) {
      this.selectedIds.clear();
      this.bumpSelectionVersion();
      return;
    }

    visibleIds.forEach((contactId) => this.selectedIds.add(contactId));
    this.bumpSelectionVersion();
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  contactById(contactId: number): ContactCard | null {
    return this.contacts.find((contact) => contact.id === contactId) ?? null;
  }

  addTagToContact(contactId: number, tag = 'Новая метка'): void {
    this.contacts = this.contacts.map((contact) => {
      if (contact.id !== contactId || contact.tags.includes(tag)) {
        return contact;
      }

      return {
        ...contact,
        tags: [...contact.tags, tag]
      };
    });
  }

  openContact(contact: ContactCard): void {
    this.selectedContact = contact;
  }

  closePanels(): void {
    this.selectedContact = null;
    this.sheetOpen = false;
  }

  toggleSelection(contactId: number): void {
    if (this.selectedIds.has(contactId)) {
      this.selectedIds.delete(contactId);
      this.bumpSelectionVersion();
      return;
    }
    this.selectedIds.add(contactId);
    this.bumpSelectionVersion();
  }

  isSelected(contactId: number): boolean {
    return this.selectedIds.has(contactId);
  }

  visibleContacts(tab: ContactsTabKey): ContactCard[] {
    return this.baseContacts(tab).filter((contact) => {
      const matchesGroup = this.activeGroup === 'Все' || contact.group === this.activeGroup;
      const matchesContactList = tab !== 'contacts' || this.contactListIdForContact(contact) === this.activeContactListId;
      const searchHaystack = [
        contact.fullName,
        contact.organization,
        contact.occupation,
        contact.city,
        contact.tags.join(' '),
        contact.note
      ].join(' ').toLowerCase();
      const matchesSearch = searchHaystack.includes(this.searchTerm.trim().toLowerCase());
      const matchesFilter = this.matchFilter(contact, tab);
      return matchesGroup && matchesContactList && matchesSearch && matchesFilter;
    });
  }

  listContacts(tab: ContactsTabKey): ContactCard[] {
    if (!this.userProfile) {
      return this.visibleContacts(tab);
    }

    return this.visibleContacts(tab).filter((contact) => contact.id !== this.userProfile?.id);
  }

  favoriteContacts(): ContactCard[] {
    return this.listContacts('favorites');
  }

  favoritePreviewContacts(limit = 7): ContactCard[] {
    return this.favoriteContacts().slice(0, limit);
  }

  recentSource(contact: ContactCard): string {
    const sources = ['Telegram', 'WhatsApp', 'Skype', 'Звонок на номер 1', 'Звонок на номер 2', 'eSIM'];
    return sources[contact.id % sources.length];
  }

  recentCallIcon(contact: ContactCard): string {
    switch (contact.callType) {
      case 'incoming':
        return 'arrow-down-left-box-outline';
      case 'outgoing':
        return 'arrow-up-right-box-outline';
      case 'missed':
        return 'remove-circle-outline';
    }
  }

  isMissedCall(contact: ContactCard): boolean {
    return contact.callType === 'missed';
  }

  groupedListContacts(tab: ContactsTabKey): Array<{ letter: string; contacts: ContactCard[] }> {
    const grouped = new Map<string, ContactCard[]>();
    for (const contact of this.listContacts(tab)) {
      const letter = this.getLetter(contact);
      const collection = grouped.get(letter) ?? [];
      collection.push(contact);
      grouped.set(letter, collection);
    }
    return [...grouped.entries()].map(([letter, contacts]) => ({ letter, contacts }));
  }

  filteredDirectory(): DirectoryEntry[] {
    const term = this.directorySearch.trim().toLowerCase();
    return this.directoryEntries.filter((entry) => {
      if (!term) {
        return true;
      }
      return [
        entry.category,
        entry.name,
        entry.department,
        entry.phone,
        entry.address,
        entry.city,
        entry.tags.join(' ')
      ].join(' ').toLowerCase().includes(term);
    });
  }

  groupedDirectory(): Array<{ category: string; items: DirectoryEntry[] }> {
    const categories = [...new Set(this.directoryEntries.map((entry) => entry.category))];
    return categories.map((category) => ({
      category,
      items: this.filteredDirectory().filter((entry) => entry.category === category)
    })).filter((group) => group.items.length > 0);
  }

  trackByContact(_: number, contact: ContactCard): number {
    return contact.id;
  }

  trackByLetter(_: number, group: { letter: string }): string {
    return group.letter;
  }

  trackByDirectory(_: number, entry: DirectoryEntry): number {
    return entry.id;
  }

  trackByDirectoryCategory(_: number, group: { category: string }): string {
    return group.category;
  }

  activePortalCard(): PortalCard | null {
    return this.portalCards[0] ?? null;
  }

  currentContactListTitle(): string {
    return this.contactLists.find((list) => list.id === this.activeContactListId)?.title ?? 'Контакты';
  }

  groupedContactSources(): Array<{ source: ContactSourceKey; lists: ContactSourceList[] }> {
    return this.dataSources.map((source) => ({
      source,
      lists: this.contactLists.filter((list) => list.source === source)
    }));
  }

  contactListCount(listId: string): number {
    return this.contacts.filter((contact) => this.contactListIdForContact(contact) === listId).length;
  }

  trackByContactSource(_: number, group: { source: ContactSourceKey }): string {
    return group.source;
  }

  trackByContactSourceList(_: number, list: ContactSourceList): string {
    return list.id;
  }

  jumpToLetter(letter: string): void {
    this.activeLetter = letter;
    setTimeout(() => {
      document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  addDigit(value: string): void {
    this.dialNumber = `${this.dialNumber}${value}`;
  }

  setCallSource(source: string): void {
    this.activeCallSource = source;
  }

  keypadMatches(): ContactCard[] {
    const query = this.normalizedDialNumber();
    if (!query) {
      return [];
    }

    return this.listContacts('contacts').filter((contact) => this.contactPhoneDigits(contact).includes(query)).slice(0, 12);
  }

  topKeypadMatch(): ContactCard | null {
    return this.keypadMatches()[0] ?? null;
  }

  remainingKeypadMatchesCount(): number {
    return Math.max(0, this.keypadMatches().length - 1);
  }

  openKeypadMatchesModal(): void {
    this.keypadMatchesSearch = this.normalizedDialNumber();
    this.keypadMatchesModalOpen = true;
  }

  closeKeypadMatchesModal(): void {
    this.keypadMatchesModalOpen = false;
  }

  keypadMatchesSearchResults(): ContactCard[] {
    const query = this.keypadMatchesSearch.replace(/\D/g, '');
    if (!query) {
      return [];
    }

    return this.listContacts('contacts')
      .filter((contact) => this.contactPhoneDigits(contact).includes(query))
      .slice(0, 12);
  }

  fillDialFromContact(contact: ContactCard): void {
    this.dialNumber = this.formatPhoneNumber(this.contactPhoneDigits(contact));
    this.closeKeypadMatchesModal();
  }

  contactPhone(contact: ContactCard): string {
    return this.formatPhoneNumber(this.contactPhoneDigits(contact));
  }

  contactInitials(contact: ContactCard): string {
    return `${contact.lastName.slice(0, 1)}${contact.firstName.slice(0, 1)}`.toUpperCase();
  }

  openAddContactModal(prefillPhone = ''): void {
    this.addContactPrefillPhone = prefillPhone;
    this.addContactModalOpen = true;
  }

  closeAddContactModal(): void {
    this.addContactModalOpen = false;
    this.addContactPrefillPhone = '';
  }

  saveNewContact(draft: AddContactDraft): ContactCard {
    const trimmedLastName = draft.lastName.trim();
    const trimmedFirstName = draft.firstName.trim();
    const fallbackName = draft.company.trim() || 'Новый контакт';
    const lastName = trimmedLastName || fallbackName;
    const firstName = trimmedFirstName || 'Без имени';
    const fullName = `${lastName} ${firstName}`.trim();
    const id = Math.max(0, ...this.contacts.map((contact) => contact.id)) + 1;
    const noteParts = [
      draft.notes.trim(),
      draft.customDate ? `Дата: ${draft.customDate}` : '',
      draft.closePerson ? `Близкий: ${draft.closePerson}` : '',
      draft.address.street ? `Адрес: ${[draft.address.street, draft.address.city, draft.address.region, draft.address.country, draft.address.postalCode].filter(Boolean).join(', ')}` : ''
    ].filter(Boolean);

    const nextContact: ContactCard = {
      id,
      firstName,
      lastName,
      middleName: '',
      fullName,
      age: 28,
      group: this.activeGroup === 'Все' ? 'Без группы' : this.activeGroup,
      tags: ['Новый'],
      organization: draft.company.trim(),
      occupation: '',
      online: false,
      callType: 'incoming',
      duration: '00:00',
      city: draft.address.city.trim(),
      note: noteParts.join('\n'),
      socials: {
        instagram: '',
        twitter: '',
        vk: '',
        appleMusic: '',
        youtube: '',
        tiktok: ''
      },
      phones: draft.phones.map((item) => item.trim()).filter(Boolean),
      emails: draft.emails.map((item) => item.trim()).filter(Boolean),
      urls: draft.urls.map((item) => item.trim()).filter(Boolean),
      address: { ...draft.address },
      customDate: draft.customDate,
      closePerson: draft.closePerson.trim(),
      photoUrl: draft.photoUrl.trim() || null,
      sourceListId: this.activeContactListId
    };

    this.contacts = [...this.contacts, nextContact].sort((left, right) => left.lastName.localeCompare(right.lastName, 'ru'));
    this.groups = ['Все', ...new Set(this.contacts.map((contact) => contact.group))];
    this.alphabet = [...new Set(this.contacts.map((contact) => this.getLetter(contact)))];
    this.closeAddContactModal();
    return nextContact;
  }

  removeDigit(): void {
    this.dialNumber = this.dialNumber.slice(0, -1);
  }

  clearDial(): void {
    this.dialNumber = '';
  }

  handlePortalAction(action: 'work' | 'dismiss'): void {
    if (action === 'work') {
      this.sheetOpen = true;
      return;
    }
    this.dismissPortalCard();
  }

  dismissPortalCard(): void {
    this.portalCards = this.portalCards.slice(1);
    this.sheetOpen = false;
  }

  closeSheet(): void {
    this.sheetOpen = false;
  }

  private matchFilter(contact: ContactCard, tab: ContactsTabKey): boolean {
    if (tab !== 'recent') {
      return true;
    }

    switch (this.activeFilter) {
      case 'incoming':
        return contact.callType === 'incoming';
      case 'outgoing':
        return contact.callType === 'outgoing';
      case 'missed':
        return contact.callType === 'missed';
      case 'unknown':
        return contact.tags.includes('Неизвестный');
      case 'long':
        return this.toSeconds(contact.duration) > 600;
      default:
        return true;
    }
  }

  private baseContacts(tab: ContactsTabKey): ContactCard[] {
    switch (tab) {
      case 'favorites':
        return this.contacts.filter((contact) => this.isFavorite(contact));
      case 'recent':
        return [...this.contacts].filter((contact) => this.isRecent(contact)).sort((left, right) => right.id - left.id).slice(0, 80);
      case 'contacts':
        return this.contacts;
    }
  }

  private isFavorite(contact: ContactCard): boolean {
    return contact.id <= 18 || contact.tags.some((tag) => ['VIP', 'Легенда', 'Premium', 'Семья'].includes(tag));
  }

  private isRecent(contact: ContactCard): boolean {
    return contact.id % 2 === 0 || contact.callType !== 'missed';
  }

  private getLetter(contact: ContactCard): string {
    return contact.lastName.slice(0, 1).toUpperCase();
  }

  private toSeconds(duration: string): number {
    const [minutes, seconds] = duration.split(':').map(Number);
    return (minutes * 60) + seconds;
  }

  private normalizedDialNumber(): string {
    return this.dialNumber.replace(/\D/g, '');
  }

  private contactPhoneDigits(contact: ContactCard): string {
    const directPhone = contact.phones?.[0]?.replace(/\D/g, '');
    if (directPhone) {
      return directPhone;
    }

    const suffix = `${(1000000000 + contact.id).toString().slice(-9)}`;
    return `79${suffix}`;
  }

  private formatPhoneNumber(digits: string): string {
    const trimmed = digits.replace(/\D/g, '').slice(0, 11);
    if (trimmed.length < 2) {
      return trimmed ? `+${trimmed}` : '';
    }

    const country = trimmed.slice(0, 1);
    const p1 = trimmed.slice(1, 4);
    const p2 = trimmed.slice(4, 7);
    const p3 = trimmed.slice(7, 9);
    const p4 = trimmed.slice(9, 11);

    return `+${country} ${p1}${p2 ? ` ${p2}` : ''}${p3 ? `-${p3}` : ''}${p4 ? `-${p4}` : ''}`.trim();
  }

  private contactListIdForContact(contact: ContactCard): string {
    if (contact.sourceListId) {
      return contact.sourceListId;
    }

    const googleLists = this.contactLists.filter((list) => list.source === 'Google');
    const phoneLists = this.contactLists.filter((list) => list.source === 'Телефон');
    const icloudLists = this.contactLists.filter((list) => list.source === 'iCloud');

    switch (contact.id % 4) {
      case 0:
        return googleLists[0]?.id ?? 'gmail-1';
      case 1:
        return googleLists[1]?.id ?? googleLists[0]?.id ?? 'gmail-1';
      case 2:
        return phoneLists[0]?.id ?? 'phone-1';
      default:
        return icloudLists[0]?.id ?? 'icloud-1';
    }
  }

  private newContactListTitle(source: ContactSourceKey, index: number): string {
    switch (source) {
      case 'Google':
        return `gmail${index}`;
      case 'Телефон':
        return `Телефон ${index}`;
      case 'iCloud':
        return `iCloud ${index}`;
    }
  }

  private newContactListId(source: ContactSourceKey, index: number): string {
    switch (source) {
      case 'Google':
        return `gmail-${index}`;
      case 'Телефон':
        return `phone-${index}`;
      case 'iCloud':
        return `icloud-${index}`;
    }
  }

  private bumpSelectionVersion(): void {
    this.selectionVersion += 1;
  }
}
