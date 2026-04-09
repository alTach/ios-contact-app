export type AddContactLabeledFieldKeyType = 'phone' | 'email' | 'url' | 'customDate' | 'closePerson';

export type AddContactDeletableFieldKeyType = AddContactLabeledFieldKeyType | 'notes';

export interface AddContactLabeledFieldRowModel {
  label: string;
  value: string;
}

export interface AddContactDraftVisibilityModel {
  notes: boolean;
}
