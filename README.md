# Contact Super App

Макет приложения контактов на Ionic + Angular с большим JSON-набором данных.

## Что уже есть

- `846` контактов в [contacts.json](/Users/turachaliev/Documents/contact/src/assets/data/contacts.json);
- отдельный справочник организаций в [directory.json](/Users/turachaliev/Documents/contact/src/assets/data/directory.json);
- группы: `Семья`, `Альбанк`, `Европлан Банк`, `Русский Стандарт`, `Школа 74`, `Школа 213`, `Школа 599`, `Универ`;
- известные музыканты, киноактёры и блогеры в общем наборе;
- соцсети у каждого контакта: `Instagram`, `Twitter`, `VK`, `Apple Music`, `YouTube`, `TikTok`;
- вкладки `Избранное`, `Недавние`, `Контакты`, `Справочник`, `Клавиши`;
- проваливание в профиль контакта с детальной карточкой;
- отдельная страница настроек с синхронизацией и экспортом `CSV` / `vCard`;
- два режима списка: простой и расширенный;
- правая буквенная полоса для быстрой навигации по фамилии;
- компактный поиск по иконке лупы с автофокусом;
- режим множественного выбора контактов;
- расширенные фильтры по типу звонка и длительности.
- сетевой слой с двумя источниками данных:
  - `real`: загрузка через `HttpClient` из JSON как из серверных endpoint'ов;
  - `mock`: тот же контракт, но с искусственной задержкой для эмуляции запросов;
- локальный кеш через `localStorage`, чтобы данные можно было хранить на устройстве.

## Запуск

1. Установить зависимости: `npm install`
2. При необходимости пересобрать JSON: `npm run generate:contacts`
3. Запустить проект: `npm start`

## Переключение real/mock

- По умолчанию используется `real`-режим в [main.ts](/Users/turachaliev/Documents/contact/src/main.ts).
- Чтобы включить mock-режим с задержкой, замени `provideAppData('real')` на `provideAppData('mock')`.

## Структура data layer

- [app-data.models.ts](/Users/turachaliev/Documents/contact/src/app/data/app-data.models.ts): типы данных
- [real-app-data.source.ts](/Users/turachaliev/Documents/contact/src/app/data/real-app-data.source.ts): загрузка через `HttpClient`
- [mock-app-data.source.ts](/Users/turachaliev/Documents/contact/src/app/data/mock-app-data.source.ts): эмуляция сети с `delay(...)`
- [app-data.repository.ts](/Users/turachaliev/Documents/contact/src/app/data/app-data.repository.ts): единая точка доступа + кеш
- [local-cache.service.ts](/Users/turachaliev/Documents/contact/src/app/data/local-cache.service.ts): запись/чтение локального кеша

## Дальше можно добавить

- реальные свайп-жесты через `GestureController`;
- импорт фото контактов и настоящие номера телефонов;
- полноценную маршрутизацию по страницам вместо одного демо-компонента;
- синхронизацию с реальными API Google / Apple / Samsung;
- экспорт и импорт контактов через настоящие `CSV` и `vCard`.
