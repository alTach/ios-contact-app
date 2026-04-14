import { ContactCard } from '../../data/app-data.models';

export interface ContactSearchSnippet {
  prefix: string;
  match: string;
  suffix: string;
  leadingEllipsis: boolean;
  trailingEllipsis: boolean;
}

export interface ContactSearchResult {
  contact: ContactCard;
  fieldLabel: string;
  snippet: ContactSearchSnippet;
  priority: 'best' | 'other';
}

export interface ContactSearchSection {
  title: string;
  results: ContactSearchResult[];
}
