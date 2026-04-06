export interface ContactSocials {
  instagram: string;
  twitter: string;
  vk: string;
  appleMusic: string;
  youtube: string;
  tiktok: string;
}

export interface ContactCard {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  age: number;
  group: string;
  tags: string[];
  organization: string;
  occupation: string;
  online: boolean;
  callType: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  city: string;
  note: string;
  socials: ContactSocials;
}

export interface DirectoryEntry {
  id: number;
  category: string;
  name: string;
  department: string;
  phone: string;
  address: string;
  city: string;
  hours: string;
  website: string;
  tags: string[];
}

export interface AppDataSource {
  fetchContacts(): import('rxjs').Observable<ContactCard[]>;
  fetchDirectory(): import('rxjs').Observable<DirectoryEntry[]>;
}

export type AppDataMode = 'real' | 'mock';
