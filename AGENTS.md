# AGENTS.md — системный промт проекта

## О проекте

Мобильное приложение «Контакты» на базе Ionic + Angular. Имитирует корпоративную телефонную книгу с вкладками: Избранное, Недавние, Контакты, Справочник, Клавиатура.

## Стек
- **Angular 17** (standalone components, `ChangeDetectionStrategy.OnPush`)
- **Ionic 8** (Angular-интеграция, веб-компоненты)
- **TypeScript** (строгий режим)
- **SCSS** (компонентные стили + общий `_workspace-styles.scss`)

## Правила написания кода

### Импорты Angular

**Не использовать `CommonModule`**. Вместо этого импортировать только нужные директивы напрямую:

```typescript
// ✅ Правильно
import { NgFor, NgIf, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// ❌ Неправильно
import { CommonModule } from '@angular/common';
```

### Компоненты

- Все компоненты **standalone**
- Стратегия обнаружения изменений — всегда `ChangeDetectionStrategy.OnPush`
- Селектор компонента страницы: `app-<name>-page`, компонента: `app-<name>`
- Шаблон и стили — всегда в отдельных файлах (`templateUrl`, `styleUrls`)

### Структура страниц Ionic

- **Не оборачивать шаблон в `<div class="ion-page">`** — `ion-router-outlet` добавляет этот класс на хост-элемент автоматически
- Структура страницы: `ion-header` + `ion-content` как прямые дочерние элементы хоста
- Оверлеи (`position: fixed`) размещать **вне `ion-content`**, как siblings рядом с ним

### Компоненты внутри `ion-content`

- Не использовать `display: contents` на `:host` компонентов, вложенных в `ion-content` — это ломает hit-testing в Chromium
- Использовать `display: block` (или другое подходящее значение)

### Ionic-компоненты

- Для списков использовать `ion-item-group` + `ion-item-divider` + `ion-item`
- Padding внутри `ion-content` задавать через CSS-переменные (`--padding-top` и т.д.), не через `padding` на хосте
- `ion-checkbox` в списках размещать в `slot="start"`

### SCSS

- Общие стили — в `src/app/shared/_workspace-styles.scss`
- Импортировать в компонент через `@import '../../shared/workspace-styles'`
- Компонентные стили — только то, что не покрывается общими
