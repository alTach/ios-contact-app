import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppDataRepository } from '../data/app-data.repository';
import { ContactCard, DirectoryEntry } from '../data/app-data.models';

export type ContactsTabKey = 'favorites' | 'recent' | 'contacts';
export type FilterKey = 'all' | 'incoming' | 'outgoing' | 'missed' | 'unknown' | 'long';
export type ViewMode = 'simple' | 'extended';
export type PortalActionType = 'review-duplicates' | 'sync-needed' | 'birthday';

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
  activeLetter = '';
  searchOpen = false;
  searchTerm = '';
  selectionMode = false;
  viewMode: ViewMode = 'simple';
  directorySearch = '';
  dialNumber = '';
  activeCallSource = 'SIM 1';
  addContactPressed = false;
  keypadMatchesModalOpen = false;
  keypadMatchesSearch = '';
  sheetOpen = false;
  selectedIds = new Set<number>();
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

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (!this.searchOpen) {
      this.searchTerm = '';
    }
  }

  toggleSelectionMode(): void {
    this.selectionMode = !this.selectionMode;
    if (!this.selectionMode) {
      this.selectedIds.clear();
    }
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  contactById(contactId: number): ContactCard | null {
    return this.contacts.find((contact) => contact.id === contactId) ?? null;
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
      return;
    }
    this.selectedIds.add(contactId);
  }

  isSelected(contactId: number): boolean {
    return this.selectedIds.has(contactId);
  }

  visibleContacts(tab: ContactsTabKey): ContactCard[] {
    return this.baseContacts(tab).filter((contact) => {
      const matchesGroup = this.activeGroup === 'Все' || contact.group === this.activeGroup;
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
      return matchesGroup && matchesSearch && matchesFilter;
    });
  }

  listContacts(tab: ContactsTabKey): ContactCard[] {
    if (!this.userProfile) {
      return this.visibleContacts(tab);
    }

    return this.visibleContacts(tab).filter((contact) => contact.id !== this.userProfile?.id);
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

  addContact(): void {
    this.addContactPressed = true;
    setTimeout(() => {
      this.addContactPressed = false;
    }, 1400);
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
}
