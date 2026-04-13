import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tabs/contact/list'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs-shell/tabs-shell.page').then((module) => module.TabsShellPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'contact/list'
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact-sources/contact-sources.page').then((module) => module.ContactSourcesPage)
      },
      {
        path: 'contact/list',
        loadComponent: () => import('./pages/contacts/contacts.page').then((module) => module.ContactsPage)
      },
      {
        path: 'recent',
        loadComponent: () => import('./pages/recent/recent.page').then((module) => module.RecentPage)
      },
      {
        path: 'directory',
        loadComponent: () => import('./pages/directory/directory.page').then((module) => module.DirectoryPage)
      },
      {
        path: 'keypad',
        loadComponent: () => import('./pages/keypad/keypad.page').then((module) => module.KeypadPage)
      }
    ]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then((module) => module.FavoritesPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((module) => module.SettingsPage)
  },
  {
    path: 'contact/:id',
    loadComponent: () => import('./pages/contact-detail/contact-detail.page').then((module) => module.ContactDetailPage)
  },
  {
    path: '**',
    redirectTo: 'tabs/contact/list'
  }
];
